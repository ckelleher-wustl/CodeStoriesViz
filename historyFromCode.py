import historyQuery
import csv

def separate_lines(filename):
    groups = []
    current_group = []

    with open(filename, 'r') as file:
        for line in file:
            strippedLine = line.strip()  # Remove leading/trailing whitespace

            if strippedLine:
                current_group.append(line)
            elif current_group:
                groups.append(current_group)
                current_group = []

        if current_group:
            groups.append(current_group)

    return groups

filename = "notes.md"
filepath = 'web/storystudy/wordleCode/' + filename
groups = separate_lines(filepath)


historyFromCode = historyQuery.HistoryFromCode()
historyFromCode.initializeHistory('web/data/wordleStoryOverview.csv',filename)

html = ""
groupActivities = {}
regionIdx = 0

for group in groups:


    activities = historyFromCode.getActivitiesForCode(group)
    subGoalDict = historyFromCode.getSubgoalActivityGroups(activities)

    # trying to build a library of groupActivities to groups identified by unique groupLines.
    idLine = ""
    for groupLine in group:
        groupLine = groupLine.replace("'", "").replace('"', "")
        if (len(groupLine) > 5) and (groupLine not in groupActivities.keys()):
            idLine = groupLine
            break

    if (idLine == ""):
        print(f"could not find an idLine for group {group[0]}")
    else:
        groupActivities[idLine] = activities

    # end of groupActivities -> groupLines experiment


    html += "<div class='horizContainer'>\n"

    html += "\t<div class='leftContainer' id='region" + str(regionIdx) + "' line='" + idLine[0:len(idLine)-1] + "'>\n"
    html += "\t\t<pre class='code'>\n"
    for line in group:
        if (filename.endswith(".html")):
            html += line.replace("<", "&lt").replace(">", "&gt")
        else:
            html += line
    html += "\t\t</pre>\n"
    html += "\t</div>\n"


    html += "\t<div class='rightContainer'>\n"
    

    for subgoal in subGoalDict.keys():
        subGoalFiles = historyFromCode.getFileNamesForSubGoal(subgoal)
        html += "<div class='files-container'>"
        for file in subGoalFiles:
            html += file + " " 
        html += "</div>\n"
        # <li onclick="openCodeFile('code_Wordle_notes.html', 'region0')"># Functional Requirements</li>z
        # \t<div class='subgoal-group' onclick="openSubgoal('subgoal text')>subgoal text\n
        html += "\t<div class='subgoal-group' onmouseover=\"hoverEnterSubgoal(this)\" onmouseout=\"hoverLeaveSubgoal(this)\"  onclick=\"openSubgoal('" + subgoal + "')\">" + subgoal + "\n"


        activityList = subGoalDict[subgoal]
        prevLines = []
        for activity in activityList:
            html += "\t\t<div class='tooltip-container'>\n"
            html += "\t\t\t<button type='button' class='history active tooltip-trigger'>" + activity + "</button>\n"

            periodLines = historyFromCode.getSharedLines(group, activity)
            periodString = ""
            for line in periodLines:

                if (line in prevLines): # if this the same as prev activity, just show in black
                    # if this is an html file, then format the code so it will render as code and not get interpreted.
                    if (filename.endswith(".html")):
                        line = line.replace("<", "&lt").replace(">", "&gt")
                    periodString += line + "\n"

                else: # if it's different than last activity, then highlight
                    # if this is an html file, then format the code so it will render as code and not get interpreted.
                    if (filename.endswith(".html")):
                        line = line.replace("<", "&lt").replace(">", "&gt")
                    periodString += "<span style='background-color:yellow'>" + line + "</span>\n"

            html += "\t\t\t<div class='tooltip'>\n"
            html += "\t\t\t\t<div class='history-header'>" + activity + "</div>\n"
            html += "\t\t\t\t<pre class='code'>" + periodString + "</pre></div>\n" # tooltip end div
            html += "\t\t</div>\n" # end tooltip-container div

            # save these lines for next time
            prevLines = periodLines
        html += "</div>"
    
    regionIdx += 1


    html += "\t</div>\n" # end right container
    html += "</div>\n" # end horiz container

    html += "\n\n"

# recording CSV of activity info for use in the history view.

header = ["activity", "lineID", "regionID"]
with open('web/data/storyStudy/' + filename + '.csv', 'w+', encoding='UTF8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(header)

    regionIdx = 0
    for groupId in groupActivities.keys():
        regionID = "region" + str(regionIdx) 
        lineID = groupId[0:len(groupId)-1]
        
        for activity in groupActivities[groupId]:
            data = [activity, lineID, regionID]
            print(f"\t{data}")
            writer.writerow(data)

        regionIdx += 1
        
f.close()

text_file = open("web/code_Wordle_" + filename + ".html", "w")
n = text_file.write(html)
text_file.close()

    