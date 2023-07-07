import pandas as pd
import requests
from sqlalchemy import false, true
import difflib

projectName = "user5"
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
        url = responseEntries[i]['timed_url']

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
            html += "<div class='title'><span><a href='" + url + "' target='_blank' rel='noreferrer noopener'>" + searchString + "</a></span></div><hr>\n"
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
                html += "\t<div class='sideBySideImage'> <table><tbody><tr><td><img src='" + imageDir + responseEntries[i]["img_file"] + "' width='180' height='112'> </td></tr><tr><td bgColor='lightblue'> <a href='" + url + "' target='_blank' rel='noreferrer noopener'>" + pageName + "</a></td></tr></tbody></table></div>\n"
            else: 
                html += "\t<div class='sideBySideImage'> <table><tbody><tr><td><img src='" + imageDir + responseEntries[i]["img_file"] + "' width='180' height='112'> </td></tr><tr><td><a href='" + url + "' target='_blank' rel='noreferrer noopener'>" + pageName + "</a></td></tr></tbody></table></div>\n"

    html += "</div>\n" # close open webImageLongRow

    html += "</div>\n" # close the content section so that nothing nests inside it.
    
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
def get_search_entries(startTime, endTime):
        
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
        elif ((len(summaryLine) <=3) and line.startswith("-")):
            summaryLine = line

    if (len(summaryLine) > 25):
        summaryLine = summaryLine[:25]

    summaryLine = summaryLine.replace("<", "").replace(">", "")

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
        # 'file_extension': '.py',
        }
        # Making the get request
        # print("making get request...")
        response = requests.get(code_url, params=data)
        # print(f"summary: {response.json()}")
        # print("...get response")

        summaryLine = ["not available", "", ""]
        if len(response.json()) > 0:
            summaryLine  = get_code_summary(response.json())
        else:
            print(f"response is blank {data} {code_url}")

        return summaryLine



# import the search and code clusters

clusterDF = pd.read_csv('web/data/wordleStoryOverview.csv')
clusterDF.set_axis(['goalType','clusterType','startTime','endTime','summary'], axis=1, inplace=True)
print(clusterDF)
html = ""

for clusterIdx in clusterDF.index:
    print(f"{clusterDF['clusterType'][clusterIdx]}: {clusterDF['summary'][clusterIdx]}")
    if "code" in clusterDF['clusterType'][clusterIdx]:
        print("\twrite code cluster")

        startTime = clusterDF.iloc[clusterIdx]['startTime']
        endTime = clusterDF.iloc[clusterIdx]['endTime']        
        [codeSummary, startingCode, endingCode] = get_code_entries(startTime, endTime)

        startingCode = startingCode.replace('\'', '"')
        endingCode = endingCode.replace('\'', '"')

        html += "<button type='button' class='collapsible active'>" + clusterDF['summary'][clusterIdx] + "</button>\n"
        html += "<div class='content' --start-code='" + startingCode + "' --end-code='" + endingCode + "'>\n"
        html += "<p> code content will go here</p>\n"
        html += "</div>" # this is the end of the nested div.
    
    
    elif "search" in clusterDF['clusterType'][clusterIdx]:
        startTime = clusterDF.iloc[clusterIdx]['startTime']
        endTime = clusterDF.iloc[clusterIdx]['endTime']
        [searchSummary, newHtml] = get_search_entries(startTime, endTime)

        html += "<button type='button' class='collapsible active'>" +  clusterDF['summary'][clusterIdx] + "</button>\n"
        html += newHtml + "\n"


    # extend this to handle goal starts and goal ends.
    elif "goal_start" in clusterDF['clusterType'][clusterIdx]:
        sectionTitle =  clusterDF['summary'][clusterIdx]
        html += '<div style="margin-top: 15px; border-top: 1px;" ></div>\n'
        html += '\t<fieldset class="goal" style="width: 100%;">\n'
        html += '\t\t<legend>Sub-goal</legend>\n'
        html += '\t\t<div>' + sectionTitle + '</div>\n'
        html += '\t</fieldset>\n'

    # this is an example of what I need this to output
    # <div style="margin-top: 15px; border-top: 1px;" ></div>
    #     <fieldset class="goal" style="width: 100%;">
    #         <legend>Sub-goal</legend>
    #         <div>Set up user interface components for the Wordle game board. </div>
    #     </fieldset>

    elif "goal_end" in clusterDF['clusterType'][clusterIdx]:
         html += "</div>" # this closes the section opened by a goal start


print(f"HTML:\n{len(html)}")

text_file = open("web/clusters_WordleNew.html", "w")
n = text_file.write(html)
text_file.close()



# # organize these into parent/child clusters
# while ((searchIdx < len(searchDF)) and (codeIdx < len(codeDF))):

    

#     if (searchDF.iloc[searchIdx]["startTime"] < codeDF.iloc[codeIdx]["startTime"]) :
#         startTime = searchDF.iloc[searchIdx]['startTime']
#         endTime = searchDF.iloc[searchIdx]['endTime']

#         # print(f"starting search cluster {startTime} - {endTime}")
#         [searchSummary, newHtml] = get_search_entries(startTime, endTime, html)

#         # print(f"newHTML {newHtml}")
#         end = 0
#         try:
#             end = searchSummary.index(";")
#         except:
#             end = len(searchSummary)
        
#         html += "<button type='button' class='collapsible active'>" + searchSummary[0:end] + "</button>\n"
#         html += newHtml + "\n"

#         print(f"'parent','search',{searchDF.iloc[searchIdx]['startTime']},{searchDF.iloc[searchIdx]['endTime']},{searchSummary}")       
#         # print(f"'parent','search',{searchDF.iloc[searchIdx]['startTime']},{searchDF.iloc[searchIdx]['endTime']}") 
#         # print(f"\nparent details: {searchDF.iloc[searchIdx]}\n")

#         # addedCode = false
#         try:
            
#             while (codeDF.iloc[codeIdx]["startTime"] < searchDF.iloc[searchIdx]["endTime"] ):

#                 # print(f"code cluster starts {codeDF.iloc[codeIdx]['startTime']} and search ends at {searchDF.iloc[searchIdx]['endTime']}")
                
#                 startTime = codeDF.iloc[codeIdx]['startTime']
#                 endTime = codeDF.iloc[codeIdx]['endTime']
                
#                 # print(f"adding code sub-cluster {startTime} - {endTime}")
                
#                 [codeSummary, startingCode, endingCode] = get_code_entries(startTime, endTime)

#                 startingCode = startingCode.replace('\'', '"')
#                 endingCode = endingCode.replace('\'', '"')

#                 # startingCode = "this is the starting code"
#                 # endingCode = "this is the ending code"

#                 if len(codeSummary) == 0:
#                     codeSummary = "not available"
#                 html += "<button type='button' class='collapsible active'>" + codeSummary + "</button>\n"
#                 html += "<div class='content' --start-code='" + startingCode + "' --end-code='" + endingCode + "'>\n"
#                 html += "<p> code content will go here</p>\n"
#                 html += "</div>" # this is the end of the nested div.

#                 # addedCode = true
#                 print(f"'child','code',{codeDF.iloc[codeIdx]['startTime']},{codeDF.iloc[codeIdx]['endTime']},{codeSummary}")
#                 # print(f"'child','code',{codeDF.iloc[codeIdx]['startTime']},{codeDF.iloc[codeIdx]['endTime']}")
#                 codeIdx += 1
#         except:
#             print("outside of range somehow")

#         searchIdx += 1
#         clusterCnt += 1

#         # if (addedCode == true):
#         html += "</div>\n" # closing the internal search content pane
#     else:
#         startTime = codeDF.iloc[codeIdx]['startTime']
#         endTime = codeDF.iloc[codeIdx]['endTime']

#         # print(f"starting code cluster {startTime} - {endTime}")

#         # print("requesting code entries...")
#         [codeSummary, startingCode, endingCode] = get_code_entries(startTime, endTime)
#         # print("...got code entries")

#         startingCode = startingCode.replace('\'', '"')
#         endingCode = endingCode.replace('\'', '"')

#         # startingCode = "this is the starting code"
#         # endingCode = "this is the ending code"

#         if len(codeSummary) == 0:
#             print(f"interval {startingCode} - {endingCode} no summary")
#             print(f"Start:{startingCode}\n\n")
#             print(f"End: {endingCode}\n\n")
#             codeSummary = "not available"
     
#         # print("\ncodecluster html: " + "<button type='button' class='collapsible active'>" + codeSummary)
#         codeClusterHtml = "<button type='button' class='collapsible active'>" 
#         codeClusterHtml +=  codeSummary + "\n"
#         codeClusterHtml +=  "</button>" + "\n"
#         codeClusterHtml += "<div class='content' --start-code='" + startingCode + "' --end-code='" + endingCode + "'>\n"
#         codeClusterHtml += "<p> code content will go here</p>\n"

#         html += codeClusterHtml
        
#         print(f"'parent','code',{codeDF.iloc[codeIdx]['startTime']},{codeDF.iloc[codeIdx]['endTime']} {codeSummary}")
#         # print(codeClusterHtml)

#         addedSearch = false
#         # print(f"Search Start: {searchDF.iloc[searchIdx]['startTime']}")
#         # print(f"CODE End: {codeDF.iloc[codeIdx]['endTime']}")
#         while searchIdx < len(searchDF) and codeIdx < len(codeDF) and (searchDF.iloc[searchIdx]["startTime"] < codeDF.iloc[codeIdx]["endTime"] ):
#             # html += "<p> adding a subcluster</p>\n"
#             startTime = searchDF.iloc[searchIdx]['startTime']
#             endTime = searchDF.iloc[searchIdx]['endTime']

#             # print(f"adding search subcluster {startTime} {endTime}")

#             [searchSummary, newHtml] = get_search_entries(startTime, endTime, html)
#             end = 0
#             try:
#                 end = searchSummary.index(";")
#             except:
#                 end = len(searchSummary)

#             html += "<button type='button' class='collapsible active'>" + searchSummary[0:end] + "</button>\n"
#             html += newHtml + "</div>\n" # internal div needs to be closed.
#             addedSearch = true
#             print(f"'child','search',{searchDF.iloc[searchIdx]['startTime']},{searchDF.iloc[searchIdx]['endTime']},{searchSummary}")
#             searchIdx += 1

#         if (addedSearch == true):
#             html += "</div>\n</div>\n" # closing the image row and the internal search content pane


#         html += "</div>\n" # closing the outer content pane
#         codeIdx += 1
#         clusterCnt += 1


# # print(f"out of while loop")
# if (searchIdx < len(searchDF)):
#     for i in range (searchIdx, len(searchDF)):
#         startTime = searchDF.iloc[searchIdx]['startTime']
#         endTime = searchDF.iloc[searchIdx]['endTime']
#         [searchSummary, newHtml] = get_search_entries(startTime, endTime, html)
#         html += newHtml + "\n"
#         print(f"'parent','search',{searchDF.iloc[searchIdx]['startTime']},{searchDF.iloc[searchIdx]['endTime']},{searchSummary}")   
#         clusterCnt += 1
# else:
#     for i in range (codeIdx, len(codeDF)):
#         startTime = codeDF.iloc[codeIdx]['startTime']
#         endTime = codeDF.iloc[codeIdx]['endTime']
#         codeSummary = get_code_entries(startTime, endTime)


#         print(f"'parent','code',{codeDF.iloc[codeIdx]['startTime']},{codeDF.iloc[codeIdx]['endTime']},{codeSummary}")
#         clusterCnt += 1

# print(f"HTML: \n{html}")

# # type = df.iloc[i]["type"]

# # text_file = open("gitMosaic.html", "w")
# # n = text_file.write(html)
# # text_file.close()