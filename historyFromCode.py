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

    # identify lines that are repeated and therefore shouldn't be used to identify region
    seenLines = []
    repeatedLines = []
    for group in groups:
        for line in group:
            line = line.strip()
            if (line in seenLines) and (line not in repeatedLines):
                repeatedLines.append(line)
            else:
                seenLines.append(line)

    print(f"\nrepeated lines {repeatedLines}\n\n")

    # now remove the lines from groups that shouldn't be used to identify region
    for group in groups:
        for line in repeatedLines:
            if (line in group):
                group.remove(line)

    return groups


# filename = "main.py"
# filepath = 'web/storystudy/mosaicCode/' + filename
# groups = separate_lines(filepath)
# prefix = "code_Mosaic_"

# filename = "notes.md"
# filepath = 'web/storystudy/wordleCode/' + filename
# groups = separate_lines(filepath)
# prefix = "code_Wordle_"

filename = "visualizeData.py"
filepath = 'web/storystudy/mapRestaurants/' + filename
groups = separate_lines(filepath)
prefix = "code_mapRestaurants_"


historyFromCode = historyQuery.HistoryFromCode()
historyFromCode.initializeHistory('web/data/mapRestaurantsStoryOverview.csv',filename)
# historyFromCode.initializeHistory('web/data/mosaicStoryOverview.csv',filename)

html = ""
groupActivities = {}



def buildLineRegionHistory():

    regionIdx = 0
    regionLines = []

    header = ["line", "lineID", "regionID"]
    with open('web/data/storyStudy/' + filename + 'LineMap.csv', 'w+', encoding='UTF8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(header)

        for group in groups:
            # print(f"{group}")
            idLine = ""
            for groupLine in group:
                groupLine = groupLine.strip()
                groupLine = groupLine.replace("'", "").replace('"', "")
                if (len(groupLine) > 8) and (groupLine not in regionLines):
                    idLine = groupLine
                    break


            for line in group:
                line = line.strip()
                origLine = historyFromCode.getOrigLine(line, historyFromCode.seedLineDict)
                
                lineVersions = historyFromCode.lineHistoryDict[origLine]
                for vsn in lineVersions:
                    if (len(vsn) > 8):
                        # print(f"\t{vsn}: {idLine} {'region' + str(regionIdx)}")
                        data = [vsn, idLine, 'region' + str(regionIdx)]
                        # print(f"\t{data}")
                        writer.writerow(data)

            regionIdx += 1
    
    f.close()

regionIdx = 0
for group in groups:

    print(f"Group: {group}")
    activities = historyFromCode.getActivitiesForCode(group)
    subGoalDict = historyFromCode.getSubgoalActivityGroups(activities)

    # trying to build a library of groupActivities to groups identified by unique groupLines.
    idLine = ""
    for groupLine in group:
        groupLine = groupLine.replace("'", "").replace('"', "")
        if (len(groupLine) > 8) and (groupLine not in groupActivities.keys()):
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
    html += "\t</div>\n" # closing left container


    html += "\t<div class='rightContainer'>\n"
    
    prevLines = []
    for subgoal in subGoalDict.keys():

        subGoalFiles = historyFromCode.getFileNamesForSubGoal(subgoal)
        html += "<div class='files-container'>"
        for file in subGoalFiles:
            html += file + " " 
        html += "</div>\n"
        # subgoal-group open 
        html += "\t<div class='subgoal-group' onmouseover=\"hoverEnterSubgoal(this)\" onmouseout=\"hoverLeaveSubgoal(this)\"  onclick=\"openSubgoal('" + subgoal.replace('"', "'").replace("'", "\\'") + "')\">" + subgoal + "\n"

        activityList = subGoalDict[subgoal]
        for activity in activityList:

            periodLines = historyFromCode.getSharedLines(group, activity)

            if (len(periodLines) > 0):

                # tooltip-container open
                html += "\t\t<div class='tooltip-container'>\n"
                html += "\t\t\t<button type='button' class='history active tooltip-trigger' onmouseover=\"logUserAction('code', 'hover activity: " + activity.replace('"', "'").replace("'", "\\'") + "')\">" + activity + "</button>\n"


                # print(f"\nFinal Lines {group}")
                

                periodLines = historyFromCode.getSharedLines(group, activity)
                # print("End")

                periodString = ""
                for line in periodLines:

                    if (line in prevLines): # if this the same as prev activity, just show in black
                        # if this is an html file, then format the code so it will render as code and not get interpreted.
                        if (filename.endswith(".html")):
                            line = line.replace("<", "&lt").replace(">", "&gt")
                        periodString += "<span style='background-color:white'>" + line + "</span>\n"

                    else: # if it's different than last activity, then highlight
                        # if this is an html file, then format the code so it will render as code and not get interpreted.

                        if (filename.endswith(".html")):
                            line = line.replace("<", "&lt").replace(">", "&gt")
                        periodString += "<span style='background-color:yellow'>" + line + "</span>\n"
                        prevLines.append(line)

                # tooltip open
                html += "\t\t\t<div class='tooltip'>\n"
                html += "\t\t\t\t<div class='history-header'>" + activity + "</div>\n"
                html += "\t\t\t\t<pre class='code'>" + periodString + "</pre>\n"
                # tooltip close
                html += "</div>\n" 
                # tooltip-container close
                html += "\t\t</div>\n" # end tooltip-container div

                # # save these lines for next time
                # prevLines = periodLines
        
        # subgoal-group close
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
            # print(f"\t{data}")
            writer.writerow(data)

        regionIdx += 1
        
f.close()

text_file = open("web/" + prefix + filename + ".html", "w")
n = text_file.write(html)
text_file.close()


buildLineRegionHistory()
    