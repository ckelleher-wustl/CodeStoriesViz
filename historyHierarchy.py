import pandas as pd
import requests
from sqlalchemy import false, true
import difflib

projectName = "gitClassification"
imageDir = "/images/" + projectName + "/"

def get_search_overview_html(responseEntries):
# <div class="content">
#     <div class="title"><span><a href="javascript:" onclick="seek(1365)"> "imagenet data downloader"</a></span></div>
#   <hr>
#   <div class="webImageLongRow">
#     <div class="sideBySideImage" style="border:1px solid black"> <table><tbody><tr><td><img src="/images/foodNotFood/screencapture-localhost-8000-2022-01-20-11_30_58.png" width="180" height="112"> </td></tr><tr><td> imagenet downloader</td></tr></tbody></table></div>
#   </div>
# </div>
    html = "<div class='content'>\n"
    firstSearch = true

    for i in range (0, len(responseEntries)):
        notes = responseEntries[i]['notes']

        if (notes.startswith("search:")):

            start = notes.index("search:") + 8
            try:
                end = notes.index(";")
            except:
                end = len(notes)
            
            # print(f"string bounds {start} - {end} {len(notes)}")
            searchString = notes[start: end]
            if (firstSearch == false):
                html += "</div>\n"
            html += "<div class='title'><span><a href='javascript:' onclick='seek(" + str(responseEntries[i]['time']) + ")'>" + searchString + "</a></span></div><hr>\n"
            html += "<div class='webImageLongRow'>\n"

            firstSearch = false

            # print(f"searchInfo: {searchString} {responseEntries[i]}")
        elif (notes.startswith("revisit:") or notes.startswith("visit:")):
            start = notes.index("visit:") + 7
            try:
                end = notes.index(";")
            except:
                end = len(notes)
            pageName = notes[start: end]

            # print(f"visit/revisit info {responseEntries[i]}['notes']")
            if (responseEntries[i]['notes'].startswith('revisit:')):
                html += "\t<div class='sideBySideImage'> <table><tbody><tr><td><img src='" + imageDir + responseEntries[i]["img_file"] + "' width='180' height='112'> </td></tr><tr><td bgColor='lightblue'>" + pageName + "</td></tr></tbody></table></div>\n"
            else: 
                html += "\t<div class='sideBySideImage'> <table><tbody><tr><td><img src='" + imageDir + responseEntries[i]["img_file"] + "' width='180' height='112'> </td></tr><tr><td>" + pageName + "</td></tr></tbody></table></div>\n"

    html += "</div>\n" # close open webImageLongRow
    
    # by default, we don't close the search b/c we may be appending embedded code clusters
    return html


def get_search_summary(responseEntries) :
    lastSearch = ""
    for i in range (0, len(responseEntries)):
        notes = responseEntries[i]['notes']
        if (notes.startswith("search:")):
            lastSearch = responseEntries[i]['notes']
            # print(f"{responseEntries[i]['notes']}")
        elif (notes.startswith("revisit:")) and ((lastSearch == "") or (lastSearch.startswith("revisit:"))):
            lastSearch = responseEntries[i]['notes']

    if len(lastSearch) == 0:
        return "not available"
    else:
        return lastSearch


search_url = 'http://localhost:3000/intervalSearches'
def get_search_entries(startTime, endTime, html):
        
        # This is the only data required by the api 
        data = {
        'begin': startTime,
        'end': endTime,
        }
        # Making the get request
        response = requests.get(search_url, params=data)

        return [get_search_summary(response.json()), get_search_overview_html(response.json())]


def get_code_summary(responseEntries):
    code_lines = []
    startingCode = responseEntries[0]['code_text']
    endingCode = responseEntries[len(responseEntries)-1]['code_text']

    summaryLine = ""

    diff = difflib.Differ().compare(startingCode.split("\n"), endingCode.split("\n"))

    for line in diff:
        # print(f"DIFF: {line}")

        if ((len(summaryLine) <= 4) and (line.startswith("+"))):
            summaryLine = line

    if (len(summaryLine) <= 4):
        for i in range (0, len(responseEntries)):
            code = responseEntries[i]['code_text']
            lines = code.split("\n")
            if len(lines) > len(code_lines):
                code_lines = lines
            
        # todo is to figure out a reasonable summary; was thinking about assignments, method defs
    
        for i in range (0, len(code_lines)):
            if summaryLine == "":
                if "def" in code_lines[i]:
                    summaryLine = code_lines[i]
                elif "=" in code_lines[i]:
                    summaryLine = code_lines[i]
            # print(code_lines[i])

    return [summaryLine, startingCode, endingCode]


code_url = 'http://localhost:3000/intervalCode'
def get_code_entries(startTime, endTime):
        
        # This is the only data required by the api 
        data = {
        'begin': startTime,
        'end': endTime,
        }
        # Making the get request
        response = requests.get(code_url, params=data)
        # print(f"summary: {response.json()}")

        summaryLine = ["not available", "", ""]
        if len(response.json()) > 0:
            summaryLine  = get_code_summary(response.json())

        return summaryLine


def generate_num_changes(startTime, endTime):
    
    entry_init = get_code_entries(startTime,endTime)[2] # getting last code_text entry out of all script.js file entries
    
    num_changes = [0 for i in range(len(entry_init.split("\n")))] 

    all_lines = [0 for i in range(1)] 
    changes_made = [0 for i in range(1)] 
    all_last_entry = [0 for i in range(len(entry_init.split("\n")))] # array where each array value is each line of code from the last entry

    for line in range(len(entry_init.split("\n"))):
        line_init = entry_init.split("\n")[line]
        all_last_entry[line] = entry_init.split("\n")[line]
        for i in range(1):
            entry_following = get_code_entries(startTime,endTime)[1]
            all_seq = [0 for k in range(len(entry_following.splitlines()))] # initializing array of all sequence ratios 
            for j in range(len(entry_following.splitlines())):
                line_following = entry_following.split("\n")[j]
                seq=difflib.SequenceMatcher(a = line_init.lower(), b = line_following.lower()) # comparing the particular line from the first entry of script.js to every line in a different entry of script.js using Sequence Matcher
                curr_seq = seq.ratio() # getting the ratio of the . This is a value between 0.0 (no match at all) and 1.0 (identical match)
                all_seq[j] = curr_seq   # putting the ratio into an array
            matched_seqval = max(all_seq) # getting the maximum 
            matched_line = all_seq.index(max(all_seq)) 
            if matched_seqval < 0.70:
                matched_line = -1
            else:
                if matched_seqval < 1.0:
                    changes_made[i] = 1
                else:
                    changes_made[i] = 0
            all_lines[i] = matched_line

        for ele in range(0, len(changes_made)):
            num_changes[line] = num_changes[line] + changes_made[ele] # adding up all the changes made 

    df_scriptjs_lastentry = pd.DataFrame(list(zip(num_changes, all_last_entry)), columns=['Changes', 'Text'])
    df_scriptjs_lastentry.index += 1
    df_scriptjs_lastentry.index.name = 'Line'

    # converting dataframe to csv file 
    df_scriptjs_lastentry.to_csv('before_after_test1.csv')


# import the search and code clusters

# searchDF = pd.read_csv('web/data/searchClusters_IFStudio.csv')
searchDF = pd.read_csv('web/data/searchClusters_wordle.csv')
searchDF.set_axis(['seed', 'startTime', 'endTime'], axis=1, inplace=True)
print(searchDF)


# codeDF = pd.read_csv('web/data/codeCluster_IFStudio.csv')
codeDF = pd.read_csv('web/data/codeCluster_wordle.csv')
codeDF.set_axis(['startTime', 'endTime', 'type'], axis=1, inplace=True)
print(codeDF)

searchIdx = 0
codeIdx = 0
clusterCnt = 1

html = ""


# organize these into parent/child clusters
while ((searchIdx < len(searchDF)) and (codeIdx < len(codeDF))):

    if (searchDF.iloc[searchIdx]["startTime"] < codeDF.iloc[codeIdx]["startTime"]) :
        startTime = searchDF.iloc[searchIdx]['startTime']
        endTime = searchDF.iloc[searchIdx]['endTime']
        [searchSummary, newHtml] = get_search_entries(startTime, endTime, html)

        # print(f"newHTML {newHtml}")
        end = 0
        try:
            end = searchSummary.index(";")
        except:
            end = len(searchSummary)
        
        html += "<button type='button' class='collapsible active'>" + searchSummary[0:end] + "</button>\n"
        html += newHtml + "\n"

        print(f"'parent','search',{searchDF.iloc[searchIdx]['startTime']},{searchDF.iloc[searchIdx]['endTime']},{searchSummary}")       
        # print(f"'parent','search',{searchDF.iloc[searchIdx]['startTime']},{searchDF.iloc[searchIdx]['endTime']}") 
        # print(f"\nparent details: {searchDF.iloc[searchIdx]}\n")

        # addedCode = false
        try:
            
            while (codeDF.iloc[codeIdx]["startTime"] < searchDF.iloc[searchIdx]["endTime"] ):
                startTime = codeDF.iloc[codeIdx]['startTime']
                endTime = codeDF.iloc[codeIdx]['endTime']
                [codeSummary, startingCode, endingCode] = get_code_entries(startTime, endTime)

                startingCode = startingCode.replace('\'', '"')
                endingCode = endingCode.replace('\'', '"')

                # startingCode = "this is the starting code"
                # endingCode = "this is the ending code"

                if len(codeSummary) == 0:
                    codeSummary = "not available"
                html += "<button type='button' class='collapsible active'>" + codeSummary + "</button>\n"
                html += "<div class='content' --start-code='" + startingCode + "' --end-code='" + endingCode + "'>\n"
                html += "<p> code content will go here</p>\n"
                html += "</div>" # this is the end of the nested div.

                # addedCode = true
                print(f"'child','code',{codeDF.iloc[codeIdx]['startTime']},{codeDF.iloc[codeIdx]['endTime']},{codeSummary}")
                # print(f"'child','code',{codeDF.iloc[codeIdx]['startTime']},{codeDF.iloc[codeIdx]['endTime']}")
                codeIdx += 1
        except:
            print("outside of range somehow")

        searchIdx += 1
        clusterCnt += 1

        # if (addedCode == true):
        html += "</div>\n" # closing the internal search content pane
    else:
        startTime = codeDF.iloc[codeIdx]['startTime']
        endTime = codeDF.iloc[codeIdx]['endTime']
        [codeSummary, startingCode, endingCode] = get_code_entries(startTime, endTime)

        startingCode = startingCode.replace('\'', '"')
        endingCode = endingCode.replace('\'', '"')

        # startingCode = "this is the starting code"
        # endingCode = "this is the ending code"

        if len(codeSummary) == 0:
            codeSummary = "not available"
     
        # print("\ncodecluster html: " + "<button type='button' class='collapsible active'>" + codeSummary)
        codeClusterHtml = "<button type='button' class='collapsible active'>" 
        codeClusterHtml +=  codeSummary + "\n"
        codeClusterHtml +=  "</button>" + "\n"
        codeClusterHtml += "<div class='content' --start-code='" + startingCode + "' --end-code='" + endingCode + "'>\n"
        codeClusterHtml += "<p> code content will go here</p>\n"
        
        codeClusterHtml += "<div id='my_dataviz'></div>" + "\n"


        html += codeClusterHtml
      
        print(f"'parent','code',{codeDF.iloc[codeIdx]['startTime']},{codeDF.iloc[codeIdx]['endTime']} {codeSummary}")
        # print(codeClusterHtml)

        addedSearch = false
        print(f"Search Start: {searchDF.iloc[searchIdx]['startTime']}")
        print(f"CODE End: {codeDF.iloc[codeIdx]['endTime']}")
        while searchIdx < len(searchDF) and codeIdx < len(codeDF) and (searchDF.iloc[searchIdx]["startTime"] < codeDF.iloc[codeIdx]["endTime"] ):
            # html += "<p> adding a subcluster</p>\n"
            startTime = searchDF.iloc[searchIdx]['startTime']
            endTime = searchDF.iloc[searchIdx]['endTime']

            [searchSummary, newHtml] = get_search_entries(startTime, endTime, html)
            end = 0
            try:
                end = searchSummary.index(";")
            except:
                end = len(searchSummary)

            html += "<button type='button' class='collapsible active'>" + searchSummary[0:end] + "</button>\n"
            html += newHtml + "</div>\n" # internal div needs to be closed.
            addedSearch = true
            print(f"'child','search',{searchDF.iloc[searchIdx]['startTime']},{searchDF.iloc[searchIdx]['endTime']},{searchSummary}")
            searchIdx += 1

        if (addedSearch == true):
            html += "</div>\n</div>\n" # closing the image row and the internal search content pane


        html += "</div>\n" # closing the outer content pane
        codeIdx += 1
        clusterCnt += 1


if (searchIdx < len(searchDF)):
    for i in range (searchIdx, len(searchDF)):
        startTime = searchDF.iloc[searchIdx]['startTime']
        endTime = searchDF.iloc[searchIdx]['endTime']
        [searchSummary, newHtml] = get_search_entries(startTime, endTime, html)
        html += newHtml + "\n"
        print(f"'parent','search',{searchDF.iloc[searchIdx]['startTime']},{searchDF.iloc[searchIdx]['endTime']},{searchSummary}")   
        clusterCnt += 1
else:
    for i in range (codeIdx, len(codeDF)):
        startTime = codeDF.iloc[codeIdx]['startTime']
        endTime = codeDF.iloc[codeIdx]['endTime']
        codeSummary = get_code_entries(startTime, endTime)
        print(f"'parent','code',{codeDF.iloc[codeIdx]['startTime']},{codeDF.iloc[codeIdx]['endTime']},{codeSummary}")
        clusterCnt += 1

print(f"HTML: \n{html}")

# type = df.iloc[i]["type"]
