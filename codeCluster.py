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

    def getFilename(self, notes):
        filename = notes[6:]
        if (";" in filename):
            filename = filename[0:filename.index(';')]

        return filename



    # split the code text into individual lines for analysis
    def get_code_lines(self, code_text):
        
        lines = code_text.split("\n")
        newLines = []
        for i in range(0, len(lines)):
            lines[i] = lines[i].strip()
            if (len(lines[i]) > 0):
                newLines.append(lines[i])        

        return newLines

    
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

                    # print(f"codeEntry['notes']_{codeEntry['notes']}")
        
                    filename = self.getFilename(codeEntry["notes"])
                    # pastFilename = self.getFilename(pastEvent["notes"])
                    # print( f"filenames past: {pastFilename} curr: {filename}")

                    # webData should not be considered a code filename
                    # and (filename == pastFilename)?
                    if ((filename != "webData") ):
                        # print(f"sending {pastEvent['time']}-{codeEntry['time']}")
                        self.match_lines(self.getFilename(codeEntry["notes"]), pastEvent, codeEntry)
                
                pastEvent = codeEntry
            
        # if there's an in-progress cluster at the end, print it out.
        if (self.inCluster):
            print(f"{self.clusterStartTime},{pastEvent['time']},'code',{self.getFilename(pastEvent['notes'])}")

    def match_lines(self, filename, pastEvt, currEvt):

        debug = False

        # break current and past code into lines
        pastLines = self.get_code_lines(pastEvt['code_text'])
        currentLines = self.get_code_lines(currEvt['code_text'])

        pastFilename = self.getFilename(pastEvt["notes"])
        currFilename = self.getFilename(currEvt["notes"])
        currTime = currEvt["time"]

        # if (debug):
        #     print(f"\t{pastEvt['time']}-{currTime}")

        # if ((pastFilename != currFilename) ):
        #     if (self.inCluster):
        #         # print(f"{self.clusterStartTime},{pastEvt['time']},'code',{pastFilename}")
        #         if debug:
        #             print(f"{currTime}: filenames don't match {pastFilename} != {currFilename}")
        #         self.inCluster = False
        #         # return
        

        idx = 0

        partialMatches = 0
        partialMatchLines = []
        newLines = []
        perfectMatches = []

        

        # iterate through the current lines
        for currentLine in currentLines:
            currentLine = currentLine.strip() # remove whitespace before looking at line contents
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


        # echo decision making info
        if (debug):
            if (pastFilename == currFilename):
                print(f"\tDEBUG {pastEvt['time']}-{currEvt['time']}: partialMatches={partialMatches} perfectMatches={len(perfectMatches)} newLines={len(newLines)} currLineLength={len(currentLines)} pastLineLength={len(pastLines)}")
            else:
                print(f"\tDEBUG {pastEvt['time']}-{currEvt['time']}: Filename mismatch {pastFilename} != {currFilename}")

            if (pastEvt['time'] ==  currEvt['time']):
                print(f"\tPAST {pastEvt}\n")
                print(f"\tCURR {currEvt}\n")



        if ((pastFilename != currFilename) ):
            if (self.inCluster):
                print(f"{self.clusterStartTime},{pastEvt['time']},'code',{pastFilename}")
                self.inCluster = False
                return
            else:
                if (debug):
                    print(f"\tDEBUG {pastEvt['time']}-{currEvt['time']}: not in cluster {pastFilename} != {currFilename}")


        # if (pastFilename == currFilename):
            # continue existing clusters only....
            # no changes made, don't start a cluster, but continue if there's an existing one.
        if ( (partialMatches == 0) and (len(perfectMatches) > 0) and (len(newLines) == 0) and (len(currentLines) == len(pastLines) ) ):
            if self.inCluster:
                self.inCluster = True


        # start or continue clusters.
        # at least one line has been edited
        elif partialMatches > 0:
            if not self.inCluster:
                self.inCluster = True
                self.clusterStartTime = pastEvt['time']

        # at least one line has been added or deleted, but fewer than 4 new lines.
        elif ( (len(perfectMatches) > 0) and ( len(currentLines) != len(pastLines) ) and (len(currentLines)- len(pastLines) <= 4) ):
            if not self.inCluster:
                self.inCluster = True
                self.clusterStartTime = pastEvt['time']

        # at least one line has been replaced, but code is the same length
        elif ( (partialMatches == 0) and (len(perfectMatches) > 0) and (len(newLines)> 0 and (len(currentLines) == len(pastLines)) ) ):
            if not self.inCluster:
                self.inCluster = True
                self.clusterStartTime = pastEvt['time']

        # only white space changes, no edits or additions/deletions
        elif ( (partialMatches == 0) and (len(perfectMatches) > 0) and (len(newLines) == 0) and(len(currentLines) != len(pastLines)) ):
            if not self.inCluster:
                self.inCluster = True
                self.clusterStartTime = pastEvt['time']

        else:
            # we've just come out of a cluster, so print it out
            if self.inCluster:
                print(f"{self.clusterStartTime},{pastEvt['time']},'code',{pastFilename}")
                if debug:
                    print(f"{currTime}: partialMatches={partialMatches} perfectMatches={len(perfectMatches)} newLines={len(newLines)} currLineLength={len(currentLines)} pastLineLength={len(pastLines)}")
                    print("\n")

            # if there's a big clump that's come in, then we should start another cluster immediately.
            if (  (pastFilename == currFilename) and (len(perfectMatches) > 0) and (len(currentLines)- len(pastLines) >= 4) ):
                # print(f"\t starting new cluster {pastEvt['time']}")
                self.clusterStartTime = pastEvt['time']
                self.inCluster = True
            else:
                 self.inCluster = False

        if (debug):
            print(f"\tDEBUG {pastEvt['time']}-{currEvt['time']}: inCluster: {self.inCluster} {(partialMatches == 0) and (len(perfectMatches) > 0) and (len(newLines)> 0 and (len(currentLines) == len(pastLines)) )}")
        
                


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
