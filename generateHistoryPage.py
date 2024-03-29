import pandas as pd
import requests
from sqlalchemy import false, true
import difflib

# projectName = "mosaic"
# imageDir = "/images/" + projectName + "/"
# regionPrefix = "code_Mosaic_"

projectName = "wordle"
imageDir = "/images/" + projectName + "/"
regionPrefix = "code_Wordle_"

# projectName = "mapRestaurants"
# imageDir = "/images/" + projectName + "/"
# regionPrefix = "code_mapRestaurants_"


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
            html += "<div class='title'><span><a href='" + str(url) + "' target='_blank' rel='noreferrer noopener' onclick='logUserAction(\"history\", \"open search: " + str(url) + "\")'>" + searchString + "</a></span></div><hr>\n"
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
                html += "\t<div class='sideBySideImage'> <table><tbody><tr><td><img src='" + imageDir + responseEntries[i]["img_file"] + "' width='180' height='112'> </td></tr><tr><td bgColor='lightblue'> <a href='" + str(url) + "' target='_blank' rel='noreferrer noopener' onclick='logUserAction(\"history\", \"open revisit: " + str(url) + "\")'>" + pageName + "</a></td></tr></tbody></table></div>\n"
            else: 
                html += "\t<div class='sideBySideImage'> <table><tbody><tr><td><img src='" + imageDir + responseEntries[i]["img_file"] + "' width='180' height='112'> </td></tr><tr><td><a href='" + str(url) + "' target='_blank' rel='noreferrer noopener' onclick='logUserAction(\"history\", \"open visit: " + str(url) + "\")'>" + pageName + "</a></td></tr></tbody></table></div>\n"

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
def get_code_entries(startTime, endTime, fileName):
        
        # This is the only data required by the api 
        data = {
        'begin': startTime,
        'end': endTime,
        'filename' : fileName,
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


activityData = {}
# lineRegionMap = {}
def loadActivityDataFrames():
    filenames = ['script.js.csv', 'animations.scss.csv', 'index.html.csv', 'guess.scss.csv', 'notes.md.csv', 'boilerplate.scss.csv', 'fonts.scss.csv']
    # filenames = ['main.py.csv']
    # filenames = ['example.py.csv', 'visualizeData.py.csv', 'main.py.csv', 'notes.md.csv']

    for file in filenames:
        print(file)

        df = pd.read_csv(r'web/data/storyStudy/' + file)
        print(f"{file} {df.shape}")
        
        activityData[file] = df


def getRegionsForActivities(filename, activity):
    df = activityData[filename]
    
    results = df.loc[df["activity"] == activity]
    # print(f"Regions + {results}")
    return results





# import the search and code clusters

print(f"opening web/data/{projectName}StoryOverview.csv")
clusterDF = pd.read_csv('web/data/' + projectName + 'StoryOverview.csv')
clusterDF.set_axis(['goalType','clusterType','startTime','endTime','fileName','summary'], axis=1, inplace=True)
print(clusterDF)
html = ""
json= ""

# start json file
json += '{\n'
json += '\t"type": "goal",\n'
json += '\t"title": "create a map of restaurants",\n'
json += '\t"subgoals": [\n'

# when setting up the initial file, it's helpful to turn this off.
includeRegionLinks = True

loadActivityDataFrames()

for clusterIdx in clusterDF.index:
    # print(f"{clusterDF['clusterType'][clusterIdx]}: {clusterDF['summary'][clusterIdx]}")
    if "code" in clusterDF['clusterType'][clusterIdx]:
        # print(f"\twrite code cluster {clusterDF.iloc[clusterIdx]['startTime']} - {clusterDF.iloc[clusterIdx]['endTime']}" )

        startTime = clusterDF.iloc[clusterIdx]['startTime']
        endTime = clusterDF.iloc[clusterIdx]['endTime'] 
        fileName = clusterDF.iloc[clusterIdx]['fileName']       
        [codeSummary, startingCode, endingCode] = get_code_entries(startTime, endTime, fileName)

        # get the initial version of things to show up in some reasonable way.
        if (int(startTime) == 0):
            startingCode = ""

        startingCode = startingCode.replace('\'', '"')
        endingCode = endingCode.replace('\'', '"')

    # output HTML for goal
        html += "<button type='button' class='collapsible'>" + clusterDF['fileName'][clusterIdx] + ": " + clusterDF['summary'][clusterIdx] + "</button>\n"
        html += "<div class='content' --start-code='" + startingCode + "' --end-code='" + endingCode + "' --filename='" + clusterDF['fileName'][clusterIdx] + "'>\n"

        # I want something like this here.
        # <ul>
        #   <li onclick="openCodeFile('code_Wordle_boilerplate.html', 'region1')">html {</li>
        #   <li onclick="openCodeFile('code_Wordle_boilerplate.html', 'region2')">*::before,</li>
        #   <li onclick="openCodeFile('code_Wordle_boilerplate.html', 'region3')">body {</li>
        # </ul>
        # activityTarget = "Change background color of game board to match Wordle"
        # results = getRegionsForActivities("boilerplate.scss.csv", activityTarget)

        html += "<p> code content will go here</p>\n"

        # output json for code activities

        if (includeRegionLinks):
            print(f"adding region links {includeRegionLinks}")
            results = getRegionsForActivities(clusterDF['fileName'][clusterIdx] + ".csv", clusterDF['summary'][clusterIdx])

            # print(f"results {results}")

            html+= "See related sections in final code:"
            html += "<ul>\n"
            for index, row in results.iterrows():
                lineID = row['lineID']

                if (clusterDF['fileName'][clusterIdx].endswith("html")):
                    lineID = lineID.replace("<", "&lt").replace(">", "&gt")
                regionID = row['regionID']
                print(f"Line ID: {lineID}, Region ID: {regionID}")
                file = clusterDF['fileName'][clusterIdx].split(".")[0]
                print(f"file is {regionPrefix}{file}.html")
                html +=  "<li class='jumpToCode' onclick=\"openCodeFile('" + regionPrefix + file + ".html', '" + regionID + "')\">" + lineID + "</li>\n"
            html += "</ul>\n"

        # html += "<p> code content will go here</p>\n"
        html += "</div>" # this is the end of the nested div.
    
    
    elif "search" in clusterDF['clusterType'][clusterIdx]:
        startTime = clusterDF.iloc[clusterIdx]['startTime']
        endTime = clusterDF.iloc[clusterIdx]['endTime']
        [searchSummary, newHtml] = get_search_entries(startTime, endTime)

        html += "<button type='button' class='collapsible'>" +  clusterDF['summary'][clusterIdx] + "</button>\n"
        html += newHtml + "\n"

         # output json for search activities


    # extend this to handle goal starts and goal ends.
    elif "goal_start" in clusterDF['clusterType'][clusterIdx]:
        sectionTitle =  clusterDF['summary'][clusterIdx]
        html += '<div style="margin-top: 15px; border-top: 1px;" ></div>\n'
        html += '\t<fieldset class="goal" style="width: 100%;" id="subgoal' + str(clusterIdx) + '">\n'
        html += '\t\t<legend>Sub-goal</legend>\n'
        html += '\t\t<div>' + sectionTitle + '</div>\n'
        html += '\t</fieldset>\n'

        # output json for subgoal start
        json += '\t\t{\n'
        json += '\t\t\t"type": "subgoal",\n'
        json += '\t\t\t"id": "' + str(clusterIdx) + '",\n' # todo: I suspect clusterIdx is wrong and we need to be counting goals.
        json += '\t\t\t"title": "' + clusterDF['summary'][clusterIdx] + '"\n'
        json += '\t\t\t"actions": [ \n'
        

    # this is an example of what I need this to output
    # <div style="margin-top: 15px; border-top: 1px;" ></div>
    #     <fieldset class="goal" style="width: 100%;">
    #         <legend>Sub-goal</legend>
    #         <div>Set up user interface components for the Wordle game board. </div>
    #     </fieldset>

    elif "goal_end" in clusterDF['clusterType'][clusterIdx]:
        html += "</div>" # this closes the section opened by a goal start

        # output json for subgoal end
        # todo: add handling to detect the last one and not add the comma.
        json += '\t\t\t] \n' # closing the actions list
        json += '\t\t},\n'


# end json file
json += '\t]\n'
json += '}\n'

# print(f"HTML:\n{len(html)}")

text_file = open("web/clusters_Wordle.html", "w")
n = text_file.write(html)
text_file.close()


json_file = open("web/clusters_Wordle.json", "w")
n = json_file.write(json)
json_file.close()


# HERE
# this should be abstracted into a method that takes a filename and an activity name and returns the results.
# to do that, I first need to generate the csvs for the other code files.


# activityTarget = "Change background color of game board to match Wordle"
# results = getRegionsForActivities("boilerplate.scss.csv", activityTarget)

# for index, row in results.iterrows():
#     lineID = row['lineID']
#     regionID = row['regionID']
#     print(f"Line ID: {lineID}, Region ID: {regionID}")



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