# Importing the dependencies
# This is needed to create a lxml object that uses the css selector
from lxml.etree import fromstring
from sqlalchemy import false, null, true
from fuzzywuzzy import fuzz
# from fuzzywuzzy import process
  
# The requests library
import requests
import csv

import difflib
import re

class CodeEntries:

    # console.log("get code");
    # $.get('http://localhost:3000/getCodeText', { offset: offset, order : "ASC", limit : 150 }, 
  
    API_url = 'http://localhost:3000/getCodeText'
    code_entries = []

    inCluster = False
    clusterStartTime = 0

    lineHistory = {}

    def get_code_entries(self, option=None):
        
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

        # if this is a git history, process the json to also include change snippet for each commit
        if option == "git":
            self.process_git_history()
            self.get_match_affinity("git")
        else:
            self.get_match_affinity()
            # self.process_code()

    def get_code_lines(self, code_text):
        # print(f"\ncode text: \n" + code_text)
        lines = code_text.split("\n")
        for i in range(0, len(lines)):
            lines[i] = lines[i].strip()

        return lines

    def get_match_affinity(self, option=None):
        print(f"codeentries length {len(self.code_entries)}")
        with open("web/data/test_social_app_codeAffinity_t2.csv", "w", encoding="utf-8", newline='') as csvfile:
            writer = csv.writer(csvfile)
            pastEvent = None
            writer.writerow(["begin", "end", "matches", "target code", "comp code"])
            for codeEvent in self.code_entries:
                # print(f"codeevent is {codeEvent}")
                if (pastEvent):
                    self.match_lines(pastEvent, codeEvent, writer, option)
                pastEvent = codeEvent
            

    def match_lines(self, targetEvt, compEvt, writer, option=None):
        if option == "git":
            targetLines = self.get_code_lines(targetEvt['change_snippet_vs_prev'])
            compLines = self.get_code_lines(compEvt['change_snippet_vs_prev'])
            # print(f"target: {targetEvt['change_snippet_vs_prev']}")
            # print(f"comp: {compEvt['change_snippet_vs_prev']}")
        else:
            targetLines = self.get_code_lines(targetEvt['code_text'])
            compLines = self.get_code_lines(compEvt['code_text'])

        numMatches = 0
        for targetLine in targetLines:
            if len(targetLine) > 0:
                bestMatch = self.best_match(targetLine, compLines)
                if (int(bestMatch['ratio']) >= 90):
                    numMatches += 1
                    # print(f"match found: {bestMatch}")

        if option == "git":
            writer.writerow([targetEvt['time'], compEvt['time'], numMatches, targetEvt['change_snippet_vs_prev'], compEvt['change_snippet_vs_prev']])
        else:
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

    def process_git_history(self):
        # for git history, there can be multiple code entries for the same time
        # for codeEvent in self.code_entries:
            # each code event is a commit for a certain file
            # need to get the diff comparison of that file commit and previous file commit
        
        # right now we are just considering the entries of one specific file by targeting a fixed note
        history_single_file = [obj for obj in self.code_entries if(obj['notes'] == "commit: social_music/core/views.py;" )]
        # print(f"history_single_file: {history_single_file}")

        for i in range(0, len(history_single_file)):
            if i > 0:
                # get the diff of the two commits
                prev_commit = history_single_file[i-1]
                curr_commit = history_single_file[i]

                fileA = prev_commit['code_text'].split("\n")
                fileB = curr_commit['code_text'].split("\n")

                # print(len(fileA))
                # print(len(fileB))

                # nub = 1
                # for line in fileA:
                #     print ("%d: %s" % (nub, line))
                #     nub += 1

                # numb = 1
                # for line in fileB:
                #     print ("%d: %s" % (numb, line))
                #     numb += 1

                diff = difflib.unified_diff(prev_commit['code_text'].splitlines(), curr_commit['code_text'].splitlines(), fromfile=prev_commit['notes'], tofile=curr_commit['notes'])
                diff_text = "\n".join(diff)
                edited_lines_prev_commit = self.edited_lines(diff_text)

                d = difflib.Differ()
                diffs = d.compare(prev_commit['code_text'].splitlines(), curr_commit['code_text'].splitlines())
                added_lines_curr_commit = self.added_lines(diffs)

                # print(f"edited lines (based of prev commit): {edited_lines_prev_commit}")
                # print(f"added lines (based of curr commit): {added_lines_curr_commit}")

                combined_lines = list(set(added_lines_curr_commit).union(edited_lines_prev_commit))
                combined_lines.sort()

                # print(f"combined lines: {combined_lines}")

                group_lines_changes = dict(enumerate(grouper(combined_lines), 1))

                if len(group_lines_changes) > 0:

                    print(f"Grouping lines changes: {group_lines_changes}")

                    largest_group_key = max(group_lines_changes, key=lambda k: len(group_lines_changes[k]))
                    largest_group = group_lines_changes[largest_group_key]
                    print(f"Largest group: {largest_group}")
                    
                    # grab the code text for the largest group
                    code_text = ""
                    start_line = 1
                    end_line = len(fileB)

                    lower_bound = largest_group[0] - 4
                    upper_bound = largest_group[-1] + 5

                    if lower_bound < start_line:
                        lower_bound = start_line

                    if upper_bound > end_line:
                        upper_bound = end_line

                    for line in range(lower_bound, upper_bound):
                        code_text += fileB[line-1] + "\n"
                        # print(f"{line}: {fileB[line-1]}")

                    # code_text = repr(code_text)
                    # print(code_text)
                    curr_commit['change_snippet_vs_prev'] = code_text
                
                else:
                    curr_commit['change_snippet_vs_prev'] = ""
            else:
                # add the diff to the code event
                curr_commit = history_single_file[0]
                curr_commit['change_snippet_vs_prev'] = curr_commit['code_text']

        # update self.code_entries to only focus on the subsequent changes of a specific file
        self.code_entries = history_single_file     

    # this function finds the added lines w.r.t. file B (the current commit's file content)
    # https://stackoverflow.com/questions/9505822/getting-line-numbers-that-were-changed
    def added_lines(self, diffs):
        added_lines = []
        lineNum = 0

        for line in diffs:
            # split off the code
            code = line[:2]
            # if the  line is in both files or just b, increment the line number.
            if code in ("  ", "+ "):
                lineNum += 1
            # if this line is only in b, print the line number and the text on the line
            if code == "+ ":
                # print ("%d: %s" % (lineNum, line[2:].strip()))
                added_lines.append(lineNum)
        return added_lines

    # this function finds the line numbers for modified / removed lines of file A (the previous commit's file content)
    # https://stackoverflow.com/questions/8259851/using-git-diff-how-can-i-get-added-and-modified-lines-numbers
    def edited_lines(self, git_diff):
        ans = []
        diff_lines = git_diff.split("\n")
        found_first = False
        # adjust for added lines
        adjust = 0
        # how many lines since the start
        count = 0
        for line in diff_lines:
            if found_first:
                count += 1
                if line.startswith('-'):
                    ans.append(start + count - adjust - 2)
                    continue

                if line.startswith('+'):
                    adjust += 1
                    continue

            # get the start line
            match = re.fullmatch(r'@@ \-(\d+),\d+ \+\d+,\d+ @@', line)
            if match:
                start = int(match.group(1))
                count = 0
                adjust = 0
                found_first = True
        return ans

# https://stackoverflow.com/questions/15800895/finding-clusters-of-numbers-in-a-list
def grouper(iterable):
    prev = None
    group = []
    for item in iterable:
        if prev is None or item - prev <= 10:
            group.append(item)
        else:
            yield group
            group = [item]
        prev = item
    if group:
        yield group

print("starting up....")
entries = CodeEntries()
print("Made code entries")
entries.get_code_entries("git")
# print(f"{cArray}")
