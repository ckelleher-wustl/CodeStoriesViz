import difflib
import requests

codeString1 = """// Update \"letters\"
        const updateLetters = (letter) => {
          console.log(
            \"updateLetters = \" + letters,
            \"\\ncurrentGuess = \" + currentGuess,
            \"\\ncurrentLetters = \" + currentLetters
          );
          currentLetters = currentLetters + letter;
          console.log(\"updated currentLetters = \" + currentLetters);
        }"""

codeString2 = """// Update \"letters\"
        const updateLetters1 = (letter) => {
          let oldLetters = currentGuess.dataset.letters
          let newLetters = oldLetters + letter;
          let currentTile = newLetters.length;
          currentGuess.dataset.letters = newLetters;
          console.log(\"currentTile = \" + currentTile);
          updateTiles(currentTile, letter);
        };"""

codeString3 = """// Update \"letters\"
        const updateLetters2 = (letter) => {
          let oldLetters = currentGuess.dataset.letters
          let newLetters = oldLetters + letter;
          let currentTile = newLetters.length;
          currentGuess.dataset.letters = newLetters;
          //console.log("currentTile = " + currentTile);
          updateTiles(currentTile, letter);
        };"""

# alternative of fetching the code from the database.

API_url = 'http://localhost:3000/getCodeText'


# inCluster = False
# clusterStartTime = 0

# lineHistory = {}


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
    while (seedLineDict[parentLine] != "base"):
        parentLine = seedLineDict[parentLine]

    return parentLine

# iterate through code lines to create the seedLineDict and the lineHistoryDict
def processLines():
    for codeState in codeStates:
        # print("\n\n")
        # break up a codeString into candidate lines
        lines = codeState.splitlines()
        for line in lines:
            #  strip whitespace
            candidateLine = line.strip()

            #  if not in the seedLineDict, search for a parent seed
            if (not candidateLine in seedLineDict.keys()):
                matches = getClosestMatches(candidateLine, seedLineDict)
                if len(matches) > 0:
                    # print(f"closestMatch {candidateLine} -> {matches[0]}")
                    seedLineDict[candidateLine] = matches[0]

                    baseCodeLine = getOrigLine(candidateLine, seedLineDict)
                    lineHistoryDict[baseCodeLine].append(candidateLine)
                else:
                    # add entry to all known lines and mark as a starting point
                    seedLineDict[candidateLine] = "base"

                    # add entry to line history with a list containing itselt; descendents should be appended.
                    lineHistoryDict[candidateLine] = [candidateLine]




def createLineHistory():
    # loop through lineHistory keys as they represent the original lines of code.
    for origLine in lineHistoryDict.keys():
        lineVersions = lineHistoryDict[origLine]
        
        periodIdx = 0
        for codeState in codeStates:
        
            sourceLines = getLines(codeState) 

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
            # print(f"history: {key} \t\t\t==>> {versionIndexHistory[key]}")
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

#####
# I think the next goal here is to bring in the clusters, but that requires re-doing them first. And then importing and 

#####
# trying to get the actual data and fold it into the mix.
entriesByFilename = get_code_entries() 

fName = "index.html"
print(f"{fName} contains {len(entriesByFilename[fName])}")

# build an array of the code
codeStates = []
for entry in entriesByFilename[fName]:
    print(f"\t{entry['time']}")
    codeStates.append(entry["code_text"])

selectedCode= """<div id="guess1" class="guess" data-letters="">
        <div class="guess__tile" id="guessTile1"></div>
        <div class="guess__tile" id="guessTile2"></div>
        <div class="guess__tile" id="guessTile3"></div>
        <div class="guess__tile" id="guessTile4"></div>
        <div class="guess__tile" id="guessTile5"></div>
      </div>"""

# for fName in entriesByFilename:
#     print(f"{fName} contains {len(entriesByFilename[fName])}")

######
seedLineDict = {} # dictionary mapping from a candidateLine to it's original code line
lineHistoryDict = {} # dictionary from an original code line to its list of subsequent versions
versionIndexHistory = {} # dictionary mapping orig code line to an array of its states by time period
# -1 means not present, otherwise the value is an index into the lineHistory

# this is the set of code states we're working with right now.
# codeStates = [codeString1, codeString2, codeString3]

processLines()
createLineHistory()


# # find the original lines that correspond to a set of "ending lines"
# selectedCode = """let currentTile = newLetters.length;
#           currentGuess.dataset.letters = newLetters;
#           //console.log("currentTile = " + currentTile);
#           updateTiles(currentTile, letter);
#         };"""
selectedLines = getLines(selectedCode)

origLines = []
for line in selectedLines:
    origLines.append(getOrigLine(line, seedLineDict))

print("\t\t")
for line in origLines:
    print(f"origLine: {line}")



# figure out which periods are relevant for this selection
keyChanges = getChangePeriodsForLines(origLines, versionIndexHistory)

print("\t\t")
for changeIdx in keyChanges:
    print(f"changes in period: {changeIdx}")

# reconstruct the code from relevant periods
codeLinesForPeriodDict = getCodeLinesForPeriodDict(origLines, keyChanges,versionIndexHistory, lineHistoryDict)
for period in codeLinesForPeriodDict:
    codeLines = codeLinesForPeriodDict[period]
    print("\n")
    for line in codeLines:
        print(f"period {period}: {line}")


print(f"\t\tKEYS: {codeLinesForPeriodDict.keys()}")
print(f"\t\tKEYCHANGES: {keyChanges}")



