import pandas as pd
import requests
from sqlalchemy import false, true
import difflib

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

        startingCode = startingCode.replace("'", '"')
        endingCode = endingCode.replace("'", '"')

    return [summaryLine, startingCode, endingCode]

code_url = 'http://localhost:3000/intervalCode'
def get_code_entries(startTime, endTime, fileName):
        
        # This is the only data required by the api 
        data = {
        'begin': startTime,
        'end': endTime,
        'filename': fileName,
        }
        # Making the get request
        response = requests.get(code_url, params=data)
        # print(f"summary: {response.json()}")

        summaryLine = ["not available", "", ""]
        if len(response.json()) > 0:
            summaryLine  = get_code_summary(response.json())

        return summaryLine


def writeClusters(goal, clusters) :

    print("\t{")
    print(f'\t\tgoal: "{goal}",')
    print('\t\tclusters: [')

    for cluster in clusters:

        startingCode = cluster['startingCode']
        endingCode = cluster['endingCode']
        filename = cluster['fileName']
        summary = cluster['summary']

        sIndex = startingCode.find('<header role="banner">')
        if (sIndex != -1):
            startingCode = startingCode[sIndex:]

        eIndex = endingCode.find('<header role="banner">')
        if (eIndex != -1):
            endingCode = endingCode[eIndex:]

        startingCode = startingCode.replace("\n", "\\n \\\n")
        endingCode = endingCode.replace("\n", "\\n \\\n")

        
        print("\t\t\t{")
        print(f'\t\t\t\tsummary: "{summary}",')
        print(f"\t\t\t\tfilename: '{filename}',")
        print(f"\t\t\t\tstartingCode: '{startingCode}',")
        print(f"\t\t\t\tendingCode: '{endingCode}',")
        print("\t\t\t},")


    print('\t\t]')
    print("\t},")




codeDF = pd.read_csv('web/data/codeCluster_IFStudio.csv')
codeDF.set_axis(['startTime', 'endTime', 'type'], axis=1, inplace=True)
# print(codeDF)

# _________________________ Right now, these are hand created.

clusters = []

print("var codeClusters = [")

# Task: Change the menu item "Parent Resources" to "Recommended Reading". 
startTime = 1097741
endTime = 1097741
fileName = "header.html"
[codeSummary, startingCode, endingCode] = get_code_entries(startTime, endTime, fileName)
startingCode = startingCode.replace("Recommended Resources", "Parent Resources")
endingCode = endingCode.replace("Recommended Resources", "Recommended Reading")
clusters.append({'summary': "Change the text of the menu item Parent Resources to Recommended Reading", 'startingCode': startingCode, 'endingCode': endingCode, 'fileName': fileName})

writeClusters("Change the Parent Resources menu item.", clusters)


clusters = []
# Currently, there's an 80 pixel border around "Visit Our School", the "Our students..." 
# sentence and the "Contact Us" button. Figure out how to change it to a 60 pixel border. 
startTime = 1170508
endTime = 1170508
fileName = "index.css"
[codeSummary, startingCode, endingCode] = get_code_entries(startTime, endTime, fileName)
startingCode = startingCode.replace("padding: 60px;", "padding: 80px;")
clusters.append({'summary': "Change the 80 pixel border around Visit Our School to 60 pixels.", 'startingCode': startingCode, 'endingCode': endingCode, 'fileName': fileName})

#  Then, make it so that "Our students..." text has a larger inset from the border (i.e. make 
# the text occupy a narrower space and the gray space to the left and right is larger)
startTime = 1170508
endTime = 1171945
fileName = "index.css"
[codeSummary, startingCode, endingCode] = get_code_entries(startTime, endTime, fileName)
clusters.append({'summary': "Change the margins so that Our students... occupies a narrower area.", 'startingCode': startingCode, 'endingCode': endingCode, 'fileName': fileName})

writeClusters("Modify CSS to change the look of the Visit Our School banner on the home page.", clusters)


clusters = []
# Suppose you wanted to make the Classroom News header stand out more - font size twice as big
startTime = 1171945
endTime = 1173916
fileName = "index.css"
[codeSummary, startingCode, endingCode] = get_code_entries(startTime, endTime, fileName)
clusters.append({'summary': "Make the font size for Classroom News twice as big.", 'startingCode': startingCode, 'endingCode': endingCode, 'fileName': fileName})

writeClusters("Define a new CSS style and use it to make the header Classroom News twice as big.", clusters)

clusters = []
# add the CSS to define the sticky behavior
startTime = 1174758
endTime = 1174758
fileName = "header.css"
[codeSummary, startingCode, endingCode] = get_code_entries(startTime, endTime, fileName)
clusters.append({'summary': "Define a sticky style that is in a fixed position 50pixels below the top of the screen.", 'startingCode': startingCode, 'endingCode': endingCode, 'fileName': fileName})

# add the CSS to define the sticky behavior
startTime = 1174758
endTime = 1174758
fileName = "dynamic-dom.ts"
[codeSummary, startingCode, endingCode] = get_code_entries(startTime, endTime, fileName)
clusters.append({'summary': "Call the method within setup to initialize the sticky behavior.", 'startingCode': startingCode, 'endingCode': endingCode, 'fileName': fileName})

# add the CSS to define the sticky behavior
startTime = 1174758
endTime = 1175771
fileName = "sticky.js"
[codeSummary, startingCode, endingCode] = get_code_entries(startTime, endTime, fileName)
clusters.append({'summary': "Add a method to toggle the sticky behavior by adding and removing the sticky class to the header.", 'startingCode': startingCode, 'endingCode': endingCode, 'fileName': fileName})

writeClusters("Create a sticky header so that the header will be visible even when users scroll", clusters)

print("]")

# var codeClusters = [
#     {
#         goal: "This is a super duper fascinating goal.",
#         clusters: [
#             {
#                 summary: "here's a summary of this code change",
#                 startingCode: 'imagenet_classes = [] ',    
#                 endingCode: 'import pandas as pd '
#             }
#      }
# ]




