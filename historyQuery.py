import difflib
import requests
import pandas as pd


API_url = 'http://localhost:3000/getCodeText'

def get_code_entries():
    
    # This is the only data required by the api 
    data = {
    'offset': 0,
    'order': "ASC",
    'limit': 500
    }
    # Making the get request
    response = requests.get(API_url, params=data)
    
    code_entries = response.json()
    entriesByFilename = splitByFilename(code_entries)

    return entriesByFilename


def splitByFilename(code_entries):
    entriesByFilename = {}
    for codeEvent in code_entries:
        filename = codeEvent["notes"]
        filename = filename[6:]
        if (";" in filename):
            filename = filename[0:filename.index(';')]

        if (filename not in entriesByFilename):
            entriesByFilename[filename] = [codeEvent]
        else:
            entriesByFilename[filename].append(codeEvent)      

    return entriesByFilename



def getClosestMatches(targetString, matchDict):
    matches = difflib.get_close_matches(targetString, matchDict.keys(), cutoff=0.8)
    # print(f"potential matches {targetString} -> {matches}")

    return matches

# figure out what the starting seed for this line of code should be
def getOrigLine(targetString, seedLineDict):
    parentLine = targetString

    print(f"Looking for {targetString} -> (parent) {parentLine}")
    while (seedLineDict[parentLine] != "base"):
        parentLine = seedLineDict[parentLine]
        
    if seedLineDict[parentLine] == "base":
        return parentLine
    else:
        return "NOT FOUND"

# iterate through code lines to create the seedLineDict and the lineHistoryDict
def processLines():
    for codeState in codeStates:
        # print("\n\n")
        # break up a codeString into candidate lines
        rawLines = codeState['code'].splitlines()
        lines =[]
        for rawline in rawLines:
            #  strip whitespace
            lines.append(rawline.strip())

        for candidateLine in lines:
            
            #  if not in the seedLineDict, search for a parent seed
            if (not candidateLine in seedLineDict.keys()):
                matches = getClosestMatches(candidateLine, seedLineDict)
                if (len(matches) > 0) and (matches[0] not in lines):
                    # print(f"closestMatch {candidateLine} -> {matches[0]} present in current code? {matches[0] in lines}")
                    seedLineDict[candidateLine] = matches[0]

                    baseCodeLine = getOrigLine(candidateLine, seedLineDict)
                    lineHistoryDict[baseCodeLine].append(candidateLine)

                else:
                    # print(f"no match found {candidateLine} ")
                    # add entry to all known lines and mark as a starting point
                    seedLineDict[candidateLine] = "base"

                    # add entry to line history with a list containing itselt; descendents should be appended.
                    lineHistoryDict[candidateLine] = [candidateLine]


# ok so what's happening here is that sometimes multiple lines are being mapped to the same version history which creates a problem.

def createLineHistory():
    # loop through lineHistory keys as they represent the original lines of code.
    for origLine in lineHistoryDict.keys():
        lineVersions = lineHistoryDict[origLine]
        
        periodIdx = 0
        for codeState in codeStates:
        
            sourceLines = getLines(codeState['code'])

            #  if there isn't an entry for origLine yet, make one.
            if origLine not in versionIndexHistory.keys():
                versionIndexHistory[origLine] = []

            # try to figure out which version of the history is present
            versionIdx = 0
            for lineVersion in lineVersions:
                # print(f"target: {lineVersion} in {sourceLines}")
                if lineVersion in sourceLines:
                    versionIndexHistory[origLine].append(versionIdx)
                    break
                else:
                    versionIdx += 1

            # if we got through the full version history and didn't find it, then we need to insert a -1 for this period
            if len(versionIndexHistory[origLine]) < periodIdx + 1:
                versionIndexHistory[origLine].append(-1)

            # increment the period index before moving on to the next codeState
            periodIdx += 1

# This just takes a selected code string, splits it into lines and strips whitespace. 
# Accepts: a string represented one or more lines of code 
# Returns: An array of lines with no white space
def getLines(code):
    codeLines = []
    rawLines = code.splitlines()
    for rawLine in rawLines:
        codeLines.append(rawLine.strip())

    return codeLines


# This determines which periods contain changes associated with a set of original lines
def getChangePeriodsForLines(origLines, versionIndexHistory):
    keyChanges = []
    for key in versionIndexHistory.keys():
        if (key in origLines):
            print(f"history: {key} \t\t\t==>> {versionIndexHistory[key]}")
            keyHistory = versionIndexHistory[key]
            lastChange = -1
            period = 0
            #  go through the keyHistory for each key, anytime it changes that's a period that we need to reconstruct the history
            for keyIndex in keyHistory:
                if (keyIndex != lastChange):
                    lastChange = keyIndex
                    if (period not in keyChanges):
                        keyChanges.append(period)
                period += 1

    keyChanges.sort()
    return keyChanges


def getCodeLinesForPeriod(origLines, period, versionIndexHistory, lineHistoryDict):
    codeLinesForPeriod = []
    for origLine in origLines:
        lineHistoryIdx = versionIndexHistory[origLine][period]
        line = lineHistoryDict[origLine][lineHistoryIdx]
        codeLinesForPeriod.append(line)

    return codeLinesForPeriod

def getCodeLinesForPeriodDict(origLines, periodArray, versionIndexHistory, lineHistoryDict):
    codeLinesForPeriodArray = {}
    for period in periodArray:
        linesForPeriod = getCodeLinesForPeriod(origLines, period, versionIndexHistory, lineHistoryDict)
        codeLinesForPeriodArray[period] = linesForPeriod
 
    return codeLinesForPeriodArray


def initializeClusters(clusterFile):
    # read in the cluster info
    clusterDF = pd.read_csv(clusterFile)
    clusterDF.set_axis(['goalType','clusterType','startTime','endTime','summary'], axis=1, inplace=True)

    clusterTimes = []
    clusterTimeToSummaryDict = {} # this holds the clusters when 
    for clusterIdx in clusterDF.index:
        startTime = clusterDF['startTime'][clusterIdx]
        endTime = clusterDF['endTime'][clusterIdx]
        summary = clusterDF['summary'][clusterIdx]

        if (startTime not in clusterTimes):
            clusterTimes.append(startTime)
        
        if (endTime not in clusterTimes):
            clusterTimes.append(endTime)

        clusterTimeToSummaryDict[startTime] = summary
        clusterTimeToSummaryDict[endTime] = summary

    return clusterTimeToSummaryDict, clusterTimes

def getCodeByCluster(fileName, clusterTimes):
    entriesByFilename = get_code_entries() 

    fName = fileName
    print(f"{fName} contains {len(entriesByFilename[fName])}")

    # build an array of the code
    codeStates = []
    for entry in entriesByFilename[fName]:
        entryTime = entry['time']
        if entryTime in clusterTimes:
            print(f"codestate {entryTime} {entry['code_text'][0:20]}")
            codeStates.append({'time': entryTime, 'code': entry["code_text"]})

    #  add the final state of the file
    l = len(entriesByFilename[fName])
    codeStates.append({'time': entriesByFilename[fName][l-1]["time"], 'code': entriesByFilename[fName][l-1]["code_text"]})
    return codeStates

def getOrigLinesForSelected(selectedCode):
    selectedLines = getLines(selectedCode)

    origLines = []
    for line in selectedLines:
        if (len(line)>5):
            origLine = getOrigLine(line, seedLineDict)
            if origLine == "NOT FOUND":
                matches = getClosestMatches(line, seedLineDict)
                if (len(matches) > 0):
                    print(f"closestMatch {line} -> {matches[0]} ")
                    # seedLineDict[candidateLine] = matches[0]
            else:    
                origLines.append(getOrigLine(line, seedLineDict))

    return origLines


# NOTE: a lot of these don't seem to match the final state of the code.
# this is the code that we want to find the history for
selectedCode = """
    console.log('keypress');
    const LettersPattern = /[a-z]/ // /^[A-Za-z][A-Za-z0-9]*$/;
    let currentGuessCount = 1;
    let currentGuess = document.querySelector('#guess' + currentGuess);
    const words = ['apple', 'baker', 'store', 'horse', 'speak', 'clone', 'bread'];
    let solutionWord = '';"""



seedLineDict = {} # dictionary mapping from a candidateLine to it's original code line
lineHistoryDict = {} # dictionary from an original code line to its list of subsequent versions
versionIndexHistory = {} # dictionary mapping orig code line to an array of its states by time period
                         # -1 means not present, otherwise the value is an index into the lineHistory

#####
# Initialize all the data structures we need
#####

# this maps cluster times to titles and provides a list of clustertimes used in filtering
clusterTimeToSummaryDict, clusterTimes = initializeClusters('web/data/wordleStoryOverview.csv')
codeStates = getCodeByCluster("script.js", clusterTimes)

processLines()
createLineHistory()

### 
# This is where the processing of an actual instance of code starts
#

origLines = getOrigLinesForSelected(selectedCode) # get the original lines for the code of interest
keyChanges = getChangePeriodsForLines(origLines, versionIndexHistory) # figure out which periods are relevant for this selection

# print("\t\t")
# for changeIdx in keyChanges:
#     print(f"changes in period: {changeIdx}")

# reconstruct the code from relevant periods
codeLinesForPeriodDict = getCodeLinesForPeriodDict(origLines, keyChanges,versionIndexHistory, lineHistoryDict)
for period in codeLinesForPeriodDict:
    codeLines = codeLinesForPeriodDict[period]
    print("\n")
    for line in codeLines:
        print(f"period {period}: @{codeStates[period]['time']} {clusterTimeToSummaryDict[codeStates[period]['time']]}:   {line}")


# print(f"\t\tKEYS: {codeLinesForPeriodDict.keys()}")
# print(f"\t\tKEYCHANGES: {keyChanges}")


# todo: make a list of the activity periods relevant for a selected code segment.
# todo: maybe turn this into a class structure so that the initialization can happen somewhere that makes sense.


