# Importing the dependencies
# This is needed to create a lxml object that uses the css selector
from lxml.etree import fromstring
from sqlalchemy import false, null, true
from fuzzywuzzy import fuzz
# from fuzzywuzzy import process
  
# The requests library
import requests
import csv

  
class CodeEntries:

    # console.log("get code");
    # $.get('http://localhost:3000/getCodeText', { offset: offset, order : "ASC", limit : 150 }, 
  
    API_url = 'http://localhost:3000/getCodeText'
    code_entries = []

    inCluster = False
    clusterStartTime = 0

    lineHistory = {}

    entriesByFilename = {}

    def get_code_entries(self):
        
        # This is the only data required by the api 
        data = {
        'offset': 0,
        'order': "ASC",
        'limit': 500
        }
        # Making the get request
        response = requests.get(self.API_url, params=data)
        
        self.code_entries = response.json()

        self.splitByFilename()
        self.get_match_affinity()



    def splitByFilename(self):
        for codeEvent in self.code_entries:
            filename = codeEvent["notes"]
            filename = filename[6:]
            if (";" in filename):
                filename = filename[0:filename.index(';')]

            if (filename not in self.entriesByFilename):
                self.entriesByFilename[filename] = [codeEvent]
            else:
                self.entriesByFilename[filename].append(codeEvent)      
        # for fName in self.entriesByFilename:
        #     print(f"{fName} contains {len(self.entriesByFilename[fName])}")

    def getFilename(notes):
        filename = notes[6:]
        if (";" in filename):
            filename = filename[0:filename.index(';')]

        return filename



    # split the code text into individual lines for analysis
    def get_code_lines(self, code_text):
        
        lines = code_text.split("\n")
        for i in range(0, len(lines)):
            lines[i] = lines[i].strip()

        return lines

    
    def get_match_affinity(self):
        # # if we want to split the clusters by files.
        # for filename in self.entriesByFilename:

        #     if len(self.entriesByFilename[filename]) > 1:

        #         pastEvent = None
        #         self.clusterStartTime = 0

        #         for codeEvent in self.entriesByFilename[filename]:

        #             # let's only pay attention when there's actually some code
        #             if len(codeEvent["code_text"].strip()) > 0:
        #                 if (pastEvent):
        #                     self.match_lines(filename, pastEvent, codeEvent)
                        
        #                 pastEvent = codeEvent
        #         # if (self.clusterStartTime != -1):
        #         #     print(f"{self.clusterStartTime},{pastEvent['time']},'code', {filename}")

        
        # if we want to just consider the stream of edits.
        pastEvent = None
        self.clusterStartTime = 0
        for codeEntry in self.code_entries:

            # let's only pay attention when there's actually some code
            if len(codeEntry["code_text"].strip()) > 0:
                if (pastEvent):
                    filename = self.getFilename(codeEntry["notes"])
                    # webData should not be considered a code filename
                    if (filename != "webData"):
                        self.match_lines(self.getFilename(codeEntry["notes"]), pastEvent, codeEntry)
                
                pastEvent = codeEntry

    def match_lines(self, filename, pastEvt, currEvt):

        # break current and past code into lines
        pastLines = self.get_code_lines(pastEvt['code_text'])
        currentLines = self.get_code_lines(currEvt['code_text'])

        idx = 0

        partialMatches = 0
        partialMatchLines = []
        newLines = []
        perfectMatches = []
        

        # iterate through the current lines
        for currentLine in currentLines:
            if len(currentLine) > 1:
                bestMatch = self.best_match(currentLine, pastLines)
                if ( int(bestMatch['ratio']) >= 90 and int(bestMatch['ratio']) < 100 ):
                    partialMatches += 1
                    partialMatchLines.append(idx)
                elif (int(bestMatch['ratio']) == 100):
                    perfectMatches.append(idx)
                else:
                    newLines.append(idx)

                idx += 1 # trying to ignore blank lines in trying to look at where insertions happen

        #  considering broadening the cluster criteria, but not sure it makes sense.
        # print(f"\n {pastEvt['time']}  - {currEvt['time']}")
        # if len(partialMatchLines):
        #         print(f"partialMatchLines {partialMatches} {partialMatchLines}")
        # if len(newLines):
        #     print(f"newLines {newLines}")
        # if len(perfectMatches):
        #     print(f"perfectMatches {perfectMatches}")

        if partialMatches > 0:
            # we've just found the beginning of a cluster
            if not self.inCluster:
                # print(f"starting a new cluster {pastEvt['time']}")
                self.inCluster = True
                self.clusterStartTime = pastEvt['time']
        else:
            # we've just come out of a cluster, so print it out
            if self.inCluster:
                print(f"{self.clusterStartTime},{pastEvt['time']},'code', {filename}")
            # else:
            #     print(f"No cluster for: {pastEvt['time']},'code'")
            self.inCluster = False
                


    def best_match(self, target, lines):
        if len(target)> 0:
            match = None
            maxRatio = 0.0
            for line in lines:
                if len(line) > 0:
                    ratio = fuzz.ratio(target, line)
                    pratio = fuzz.partial_ratio(target, line)

                    if (ratio > maxRatio):
                        maxRatio = ratio
                        match = line

                    # print(f"\ttarget: {target}\n\tline: {line}\n\t{ratio} - {pratio}\n")
            return {'target': target, 'match': match, 'ratio': maxRatio}
        else:
            return {'target': target, 'match': None, 'ratio': 0.0}


# the methods below are added to do more a tree-like change analysis

    def process_code(self):
        for codeEvent in self.code_entries:

            print(f"TIME: {codeEvent['time']}")
            
            codeLines = self.get_code_lines(codeEvent['code_text']) 

            for line in codeLines:
                if (len(line) > 0):
                    matchInfo = self.best_match(line, self.lineHistory.keys())
                    # print(self.lineHistory.keys())
                    if matchInfo["ratio"] == 100:
                        # print(f"found {line}")
                        pass
                    elif matchInfo["ratio"] > 90:
                        
                        pastVersions = self.lineHistory.pop(matchInfo["match"])
                        # print(f"\nbest Match is {matchInfo} previous {pastVersions}")
                        self.lineHistory[line] = []
                        if len(pastVersions) > 0:
                            for pastLine in pastVersions:
                                self.lineHistory[line].append(pastLine)
                            # print(f"append prev: {self.lineHistory[line]}")
                        self.lineHistory[line].append(matchInfo["match"])
                        # print(f"append match: {matchInfo['match']}")

                        # if len(pastVersions) > 0:
                        #     print(f"after merge: {self.lineHistory[line]}")

                    
                    if line in self.lineHistory.keys():
                        # print(f"found {line}")
                        pass
                        
                    else:
                        # print(f"adding {line}")
                        self.lineHistory[line] = []


        for line in self.lineHistory.keys():
            if len(self.lineHistory[line]) > 1:
                print(f"\n{line}: ")
                prevLines = self.lineHistory[line]
                for prevLine in prevLines:
                    print(f"\t{prevLine}")


print("starting up....")
entries = CodeEntries()
print("Made code entries")
entries.get_code_entries()
# print(f"{cArray}")
