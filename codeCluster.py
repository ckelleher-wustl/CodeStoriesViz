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
        # print(f"\ncode text: \n" + code_text)
        lines = code_text.split("\n")
        for i in range(0, len(lines)):
            lines[i] = lines[i].strip()

        return lines

    def get_match_affinity(self):
        print(f"codeentries length {len(self.code_entries)}")
        with open("web/data/codeAffinity.csv", "w", encoding="utf-8", newline='') as csvfile:
            writer = csv.writer(csvfile)
            pastEvent = None
            writer.writerow(["begin", "end", "matches", "target code", "comp code"])
            for codeEvent in self.code_entries:
                # print(f"codeevent is {codeEvent}")
                if (pastEvent):
                    self.match_lines(pastEvent, codeEvent, writer)
                pastEvent = codeEvent
            

    def match_lines(self, targetEvt, compEvt, writer):
        targetLines = self.get_code_lines(targetEvt['code_text'])
        compLines = self.get_code_lines(compEvt['code_text'])

        numMatches = 0
        for targetLine in targetLines:
            if len(targetLine) > 0:
                bestMatch = self.best_match(targetLine, compLines)
                if (int(bestMatch['ratio']) >= 90):
                    numMatches += 1
                    # print(f"match found: {bestMatch}")

        # print(f"target: \n{[targetEvt['code_text']]}")
        # print(f"comp: \n{[compEvt['code_text']]}")
        # print(f"num matches: {numMatches}\n") 
        writer.writerow([targetEvt['time'], compEvt['time'], numMatches, [targetEvt['code_text']], [compEvt['code_text']]])

        if numMatches > 0:
            # we've just found the beginning of a cluster
            if not self.inCluster:
                # print(f"starting a new cluster {targetEvt['time']}")
                self.inCluster = True
                self.clusterStartTime = targetEvt['time']
        else:
            # we've just come out of a cluster, so print it out
            if self.inCluster:
                print(f"{self.clusterStartTime},{targetEvt['time']},'code'")
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
