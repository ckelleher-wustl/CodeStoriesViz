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

    def get_code_entries(self):
        
        # This is the only data required by the api 
        data = {
        'offset': 0,
        'order': "ASC",
        'limit': 500
        }
        # Making the get request
        response = requests.get(self.API_url, params=data)
        print("got response")
        
        # print(f"best match: {bestMatch}")
        self.code_entries = response.json()

        self.get_match_affinity()

        # self.process_code()

    def get_code_lines(self, code_text):
        
        lines = code_text.split("\n")
        # print(f"\n#code lines: " + str(len(lines)))
        for i in range(0, len(lines)):
            lines[i] = lines[i].strip()

        return lines

    def get_match_affinity(self):
        # print(f"codeentries length {len(self.code_entries)}")
        with open("web/data/codeAffinity.csv", "w", encoding="utf-8", newline='') as csvfile:
            writer = csv.writer(csvfile)
            pastEvent = None
            writer.writerow(["begin", "end", "matches", "target code", "comp code"])
            idx = 0
            for codeEvent in self.code_entries:
                
                # if (idx > 20):
                #     break

                # idx += 1

                # print(f"\nidx is {idx}")

                # let's only pay attention when there's actually some code
                if len(codeEvent["code_text"].strip()) > 0:
                    # print(f"codeevent is {codeEvent}")
                    # print(f"pastevent is {pastEvent}")
                    if (pastEvent):
                        self.match_lines(pastEvent, codeEvent, writer)
                    pastEvent = codeEvent
            

    def match_lines(self, pastEvt, currEvt, writer):
        pastLines = self.get_code_lines(pastEvt['code_text'])
        currentLines = self.get_code_lines(currEvt['code_text'])

        # print(f"pastLines is {len(pastLines)} {pastLines}")
        # print(f"currentLines is {len(currentLines)} {currentLines}")
        # print(targetLines)

        numMatches = 0
        for currentLine in currentLines:
            if len(currentLine) > 1:
                bestMatch = self.best_match(currentLine, pastLines)
                if (int(bestMatch['ratio']) >= 90):
                    numMatches += 1
                    # print(f"\tmatch found: {bestMatch}")
                # else:
                    # print(f"NO MATCH FOUND: _{currentLine}_")

        # print(f"target: {len(targetEvt['code_text'])} \n{[targetEvt['code_text']]}")
        # print(f"comp: {len(compEvt['code_text'])} \n{[compEvt['code_text']]}")
        # print(f"num matches: {numMatches}\n") 
        # writer.writerow([targetEvt['time'], compEvt['time'], numMatches, [targetEvt['code_text']], [compEvt['code_text']]])

        if numMatches > 0:
            # we've just found the beginning of a cluster
            if not self.inCluster:
                # print(f"starting a new cluster {pastEvt['time']}")
                self.inCluster = True
                self.clusterStartTime = pastEvt['time']
            # else:
            #     print("added to cluster")
        else:
            # we've just come out of a cluster, so print it out
            if self.inCluster:
                print(f"{self.clusterStartTime},{pastEvt['time']},'code'")
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
