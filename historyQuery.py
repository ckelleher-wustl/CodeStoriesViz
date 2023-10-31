import difflib
import requests
import pandas as pd

class HistoryFromCode:

    def __init__(self):
        self.API_url = 'http://localhost:3000/getCodeText'

        self.seedLineDict = {} # dictionary mapping from a candidateLine to it's original code line
        self.lineHistoryDict = {} # dictionary from an original code line to its list of subsequent versions
        self.versionIndexHistory = {} # dictionary mapping orig code line to an array of its states by time period
                         # -1 means not present, otherwise the value is an index into the lineHistory

        self.codeStates = [] # the array of code states we need to consider for this history

        self.clusterTimeToSummaryDict = {} # dictionary mapping cluster times to the summary description of the activity during that period
        self.clusterSummaryToTimeDict = {}
        self.clusterTimeToPeriodDict = {} # dictionary mapping the cluster summary to the time

        self.clusterSummaryToSubgoalDict = {} # dictionary mapping the activity/cluster summary to the subgoal name
        self.subGoalToFileNamesDict = {} # dictionary mapping subgoals to the files edited during those subgoals

    def get_code_entries(self):
        
        # This is the only data required by the api 
        data = {
        'offset': 0,
        'order': "ASC",
        'limit': 500
        }
        # Making the get request
        response = requests.get(self.API_url, params=data)
        
        code_entries = response.json()
        entriesByFilename = self.splitByFilename(code_entries)

        return entriesByFilename


    def splitByFilename(self, code_entries):
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



    def getClosestMatches(self, targetString, matchDict):
        matches = difflib.get_close_matches(targetString, matchDict.keys(), cutoff=0.8)
        # print(f"potential matches {targetString} -> {matches}")

        return matches

    # figure out what the starting seed for this line of code should be
    def getOrigLine(self, targetString, seedLineDict):
        parentLine = targetString

        if (parentLine not in seedLineDict.keys()):
            print(f"Key not found: {parentLine}")
            # for key in seedLineDict.keys():
            #     print(f"\t{key}: {seedLineDict[key]}")

    

        # print(f"Looking for {targetString} -> (parent) {parentLine}")
        while (seedLineDict[parentLine] != "base"):
            parentLine = seedLineDict[parentLine]
            
        if seedLineDict[parentLine] == "base":
            return parentLine
        else:
            return "NOT FOUND"

    # iterate through code lines to create the seedLineDict and the lineHistoryDict
    def processLines(self):
        print(f"codeStates length {len(self.codeStates)}")
        for codeState in self.codeStates:
            # print("\n\n")
            # print(f"codestate {codeState}")
            # break up a codeString into candidate lines
            rawLines = codeState['code'].splitlines()
            lines =[]
            for rawline in rawLines:
                #  strip whitespace
                rawline = rawline.replace('“','"').replace('”','"')
                lines.append(rawline.strip())

            print(f"lines is {lines}")

            for candidateLine in lines:
                
                #  if not in the seedLineDict, search for a parent seed
                if (not candidateLine in self.seedLineDict.keys()):
                    matches = self.getClosestMatches(candidateLine, self.seedLineDict)
                    if (len(matches) > 0) and (matches[0] not in lines):
                        # print(f"closestMatch {candidateLine} -> {matches[0]} present in current code? {matches[0] in lines}")
                        self.seedLineDict[candidateLine] = matches[0]

                        baseCodeLine = self.getOrigLine(candidateLine, self.seedLineDict)
                        self.lineHistoryDict[baseCodeLine].append(candidateLine)

                    else:
                        print(f"no match found {candidateLine} ")
                        # add entry to all known lines and mark as a starting point
                        self.seedLineDict[candidateLine] = "base"

                        # add entry to line history with a list containing itself; descendents should be appended.
                        self.lineHistoryDict[candidateLine] = [candidateLine]

            # print(f"seedLineDict {seedLineDict}")
            # print(f"lineHistoryDict {lineHistoryDict}")


    def createLineHistory(self):
        # loop through lineHistory keys as they represent the original lines of code.
        for origLine in self.lineHistoryDict.keys():
            lineVersions = self.lineHistoryDict[origLine]
            
            periodIdx = 0
            for codeState in self.codeStates:
            
                sourceLines = self.getLines(codeState['code'])

                #  if there isn't an entry for origLine yet, make one.
                if origLine not in self.versionIndexHistory.keys():
                    self.versionIndexHistory[origLine] = []

                # try to figure out which version of the history is present
                versionIdx = 0
                for lineVersion in lineVersions:
                    # print(f"target: {lineVersion} in {sourceLines}")
                    if lineVersion in sourceLines:
                        self.versionIndexHistory[origLine].append(versionIdx)
                        break
                    else:
                        versionIdx += 1

                # if we got through the full version history and didn't find it, then we need to insert a -1 for this period
                if len(self.versionIndexHistory[origLine]) < periodIdx + 1:
                    self.versionIndexHistory[origLine].append(-1)

                # increment the period index before moving on to the next codeState
                periodIdx += 1

    # This just takes a selected code string, splits it into lines and strips whitespace. 
    # Accepts: a string represented one or more lines of code 
    # Returns: An array of lines with no white space
    def getLines(self, code):
        codeLines = []
        rawLines = code.splitlines()
        for rawLine in rawLines:
            codeLines.append(rawLine.strip())

        return codeLines


    # This determines which periods contain changes associated with a set of original lines
    def getChangePeriodsForLines(self, origLines):
        keyChanges = []
        for key in self.versionIndexHistory.keys():
            if (key in origLines):
                # print(f"history: {key} \t\t\t==>> {self.versionIndexHistory[key]}")
                keyHistory = self.versionIndexHistory[key]
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


    def getCodeLinesForPeriod(self, origLines, period):
        # print(f"PERIOD IS {period}")
        codeLinesForPeriod = []
        for origLine in origLines:
            lineHistoryIdx = self.versionIndexHistory[origLine][period]

            # if lineHistoryIdx >= 0: 
            #     if ("import" in origLine) :
            #         print(f"getting {origLine} version {period} index {lineHistoryIdx} ")

            if lineHistoryIdx >= 0:
                line = self.lineHistoryDict[origLine][lineHistoryIdx]
                codeLinesForPeriod.append(line)

        return codeLinesForPeriod

    def getCodeLinesForPeriodDict(self, origLines, periodArray):
        codeLinesForPeriodArray = {}
        # print(f"PERIODARRAY IS {periodArray}")
        for period in periodArray:
            linesForPeriod = self.getCodeLinesForPeriod(origLines, period)
            codeLinesForPeriodArray[period] = linesForPeriod
    
        return codeLinesForPeriodArray


    def initializeClusters(self, clusterFile):
        # read in the cluster info goalType,clusterType,startTime,endTime,fileName,summary
        clusterDF = pd.read_csv(clusterFile)
        clusterDF.set_axis(['goalType','clusterType','startTime','endTime','fileName','summary'], axis=1, inplace=True)

        clusterTimes = []
        self.clusterTimeToSummaryDict = {}  
        # self.clusterSummaryToTimeDict = {} 
        
        subGoal = ""
        for clusterIdx in clusterDF.index:
            startTime = clusterDF['startTime'][clusterIdx]
            endTime = clusterDF['endTime'][clusterIdx]
            summary = clusterDF['summary'][clusterIdx]
            goalType = clusterDF['goalType'][clusterIdx] 
            clusterType = clusterDF['clusterType'][clusterIdx]
            fileName = clusterDF['fileName'][clusterIdx]

            if (goalType == "parent'"):

                # if (startTime not in clusterTimes):
                #     clusterTimes.append(startTime)
                
                if (endTime not in clusterTimes):
                    clusterTimes.append(endTime)

                # self.clusterTimeToSummaryDict[startTime] = summary
                self.clusterTimeToSummaryDict[endTime] = summary

                self.clusterSummaryToSubgoalDict[summary] = subGoal

                # print ('subgoal is ' + subGoal)
                if (len(fileName) > 0) and ('code' in clusterType) and (fileName not in self.subGoalToFileNamesDict[subGoal]):
                    self.subGoalToFileNamesDict[subGoal].append(fileName)

            elif (goalType == "goal_start"):
                subGoal = summary
                self.subGoalToFileNamesDict[subGoal] = []
                # print(f"cluster type: {goalType} - {summary}")

        # print(f"clusterTimeToSummaryDict -> ")
        # for time in self.clusterTimeToSummaryDict:
        #     print(f"\t{time} -> {self.clusterTimeToSummaryDict[time]}")
        # print(f"subGoalToFileNamesDict -> {self.subGoalToFileNamesDict}")

        return self.clusterTimeToSummaryDict, clusterTimes

    def getCodeByCluster(self, fileName, clusterTimes):
        entriesByFilename = self.get_code_entries() 

        fName = fileName
        # print(f"{fName} contains {len(entriesByFilename[fName])}")

        # build an array of the code
        self.codeStates = []

        print(entriesByFilename.keys())

        for entry in entriesByFilename[fName]:
            entryTime = entry['time']
            if entryTime in clusterTimes:
                # print(f"codestate {entryTime} {entry['code_text'][0:20]}")
                self.codeStates.append({'time': entryTime, 'code': entry["code_text"]})
                # print(f"\tcodeStates: {entryTime} -> {entry['code_text'][0:20]}")

        #  add the final state of the file
        l = len(entriesByFilename[fName])
        self.codeStates.append({'time': entriesByFilename[fName][l-1]["time"], 'code': entriesByFilename[fName][l-1]["code_text"]})
        # print(f"\tcodeStates: {entriesByFilename[fName][l-1]['time']} -> {entriesByFilename[fName][l-1]['code_text'][0:20]}")
        return self.codeStates

    def getOrigLinesForSelected(self, selectedCode):
        # selectedLines = self.getLines(selectedCode)
        selectedLines = selectedCode

        origLines = []
        for line in selectedLines:
            line = line.strip()
            if (len(line)>8):
                origLine = self.getOrigLine(line, self.seedLineDict)
                if origLine == "NOT FOUND":
                    matches = self.getClosestMatches(line, self.seedLineDict)
                    # if (len(matches) > 0):
                        # print(f"closestMatch {line} -> {matches[0]} ")
                        # seedLineDict[candidateLine] = matches[0]
                else:    
                    origLines.append(self.getOrigLine(line, self.seedLineDict))

        return origLines
    
    def initializeHistory(self, clusterCSV, codeFilename):
        #####
        # Initialize all the data structures we need
        #####

        # this maps cluster times to titles and provides a list of clustertimes used in filtering
        self.clusterTimeToSummaryDict, clusterTimes = self.initializeClusters(clusterCSV)
        self.codeStates = self.getCodeByCluster(codeFilename, clusterTimes)

        self.processLines()
        self.createLineHistory()

    def getActivitiesForCode(self, selectedCode):
        activities = []

        origLines = self.getOrigLinesForSelected(selectedCode) # get the original lines for the code of interest
        # print(f"\norigLines {origLines}")
        keyChanges = self.getChangePeriodsForLines(origLines) # figure out which periods are relevant for this selection
        # print(f"\nkeychanges {keyChanges}")

        # reconstruct the code from relevant periods
        codeLinesForPeriodDict = self.getCodeLinesForPeriodDict(origLines, keyChanges)
        # print(f"\ncodeLinesForPeriodDict {codeLinesForPeriodDict}")
        for period in codeLinesForPeriodDict:

            if (self.codeStates[period]['time'] in self.clusterTimeToSummaryDict.keys()):
                activity = self.clusterTimeToSummaryDict[self.codeStates[period]['time']]
                if (activity not in activities):
                    activities.append(activity)

        return activities
    
    def getSubgoalActivityGroups(self, activities):
        subgoalGroups = {}

        for activity in activities:
            subgoal = self.clusterSummaryToSubgoalDict[activity]

            if (subgoal in subgoalGroups.keys()):
                subgoalGroups[subgoal].append(activity)
            else:
                subgoalGroups[subgoal] = [activity]

        return subgoalGroups


    def getSharedLines(self, selectedLines, activityTitle):
        # get the lines for the selected code we want to match
        cleanedLines = []
        for line in selectedLines:
            cleanedLines.append(line.strip())

        idx = 0
        periodForActivity = -1
        # timeForActivity = -1
        for state in self.codeStates:
            time = state["time"]
            if (time in self.clusterTimeToSummaryDict.keys()):
                title = self.clusterTimeToSummaryDict[time]
                if (title == activityTitle):
                    periodForActivity = idx
            idx += 1

        # print(f"FOUND {periodForActivity} {timeForActivity}")


        # get the state of the lines in the selected
        origLines = self.getOrigLinesForSelected(selectedLines)
        # print(f"shared orig lines {origLines}")
        periodLines = self.getCodeLinesForPeriod(origLines, periodForActivity)

        # print(f"PERIOD Lines: {periodLines}" )

        # experimental here
        sharedLines = []
        for line in periodLines:
            if (line in cleanedLines):
                sharedLines.append(line)
        

        # return periodLines
        return sharedLines
        # print(self.clusterTimeToSummaryDict)

    def getFileNamesForSubGoal(self, subgoal):
        return self.subGoalToFileNamesDict[subgoal]
