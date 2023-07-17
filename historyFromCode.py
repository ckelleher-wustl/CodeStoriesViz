import historyQuery

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

filename = 'web/storystudy/wordleCode/script.js'
groups = separate_lines(filename)


historyFromCode = historyQuery.HistoryFromCode()
historyFromCode.initializeHistory('web/data/wordleStoryOverview.csv',"script.js")

html = ""

for group in groups:
    html += "<div class='horizContainer'>\n"

    html += "\t<div class='leftContainer'>\n"
    html += "\t\t<pre class='code'>\n"
    for line in group:
        html += line
    html += "\t\t</pre>\n"
    html += "\t</div>\n"


    html += "\t<div class='rightContainer'>\n"
    activities = historyFromCode.getActivitiesForCode(group)
    subGoalDict = historyFromCode.getSubgoalActivityGroups(activities)

    # print(f"subgoalGroups {subGoalDict}")
    # print(f"subgoal categories {subGoalDict.keys()}") # I want these to be in order, are they?

    for subgoal in subGoalDict.keys():
        html += "\t<div class='subgoal-group'>" + subgoal + "\n"
        activityList = subGoalDict[subgoal]
        prevLines = []
        for activity in activityList:
            html += "\t\t<div class='tooltip-container'>\n"
            html += "\t\t\t<button type='button' class='history active tooltip-trigger'>" + activity + "</button>\n"

            periodLines = historyFromCode.getSharedLines(group, activity)
            periodString = ""
            for line in periodLines:
                if (line in prevLines): # if this the same as prev activity, just show in black
                    periodString += line + "\n"
                else: # if it's different than last activity, then highlight
                    periodString += "<span style='background-color:yellow'>" + line + "</span>\n"

            html += "\t\t\t<div class='tooltip'>\n"
            html += "\t\t\t\t<div class='history-header'>" + activity + "</div>\n"
            html += "\t\t\t\t<pre class='code'>" + periodString + "</pre></div>\n" # tooltip end div
            html += "\t\t</div>\n" # end tooltip-container div

            # save these lines for next time
            prevLines = periodLines
        html += "</div>"


# <div class='subgoal-group'>
#             Adding an initial key listener to detect letters the user enters.
#             <div class='tooltip-container'>
#                 <button type='button' class='history active tooltip-trigger'>Adding a key listener (CHECK)</button>
#                 <div class='tooltip'>
#                     <div class='history-header'>Adding a key listener (CHECK)</div>
#                     <pre class='code'><span style='background-color:yellow'>console.log('keypress');</span></pre>
#                 </div>
#             </div>
#             <div>The list of files changed should go here.</div>
#         </div>


    for subgoal in subGoalDict.keys():
        print(f"subgoal: {subgoal}")
        activityList = subGoalDict[subgoal]
        for activity in activityList:
            print(f"\tactivity: {activity}")

    print("\n")



    # prevLines = []
    # for activity in activities:
    #     html += "\t\t<div class='tooltip-container'>\n"
    #     html += "\t\t\t<button type='button' class='history active tooltip-trigger'>" + activity + "</button>\n"

    #     periodLines = historyFromCode.getSharedLines(group, activity)
    #     periodString = ""
    #     for line in periodLines:
    #         if (line in prevLines): # if this the same as prev activity, just show in black
    #             periodString += line + "\n"
    #         else: # if it's different than last activity, then highlight
    #             periodString += "<span style='background-color:yellow'>" + line + "</span>\n"

    #     html += "\t\t\t<div class='tooltip'>\n"
    #     html += "\t\t\t\t<div class='history-header'>" + activity + "</div>\n"
    #     html += "\t\t\t\t<pre class='code'>" + periodString + "</pre></div>\n" # tooltip end div
    #     html += "\t\t</div>\n" # end tooltip-container div

    #     # save these lines for next time
    #     prevLines = periodLines


    html += "\t</div>\n" # end right container
    html += "</div>\n" # end horiz container

    html += "\n\n"

# print(html)

text_file = open("web/code_WordleNew.html", "w")
n = text_file.write(html)
text_file.close()

    