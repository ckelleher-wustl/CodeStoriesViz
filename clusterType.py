# The requests library
import requests
from csv import reader
import js2py

from sqlalchemy import JSON
  

API_url = 'http://localhost:3000/intervalCode'
def getCodeForInterval(start, end):
    print(f"Interval: {start} - {end}")
       
    # This is the only data required by the api 
    data = {
    'begin': start,
    'end': end
    }

    # Making the get request
    response = requests.get(API_url, params=data)
    numCodeEntries = len(response.json())
    codeEntries = []

    print(f"\t # entries: {numCodeEntries}")

    for entry in response.json():
        codeEntries.append(entry["code_text"])

    code0Lines = codeEntries[0].split("\n")

    print("\n\tCODE0LINES:")
    for line in code0Lines:
        print(f"\t{line}")

    return codeEntries


DIFF_URL = "http://prettydiff.com:8000/api/"
def getCodeDiff(code0, code1):
    jsonDiff = " \
        function getDiff(codeState1, codeState2) { \
            print('hello world') \
        }" 

        # function getDiff(codeState1, codeState2) { \
        #     var diff = Diff.createTwoFilesPatch('previous', 'current', codeState1, codeState2,null,null,null); \
        #     // console.log(diff) \
        #     var diffHtml = Diff2Html.html(diff, { \
        #         drawFileList: false, \
        #         //matching: 'words', \
        #         outputFormat: 'side-by-side', \
        #     }); \
        #     return diffHtml; \
        # }"

    result = js2py.eval_js(jsonDiff)
    print(result(code0, code1))



    # data = {
    # 'pdiff_source': code0,
    # 'pdiff_diff': code1,
    # 'pdiff_mode': "diff",
    # }
    # # note: might want to use pdiff_sourcelabel and pdiff_difflabel 

    # # Making the get request
    # response = requests.get(DIFF_URL, params=data)
    # diff = len(response.json())
    # print(JSON.stringify(diff))      


# open file in read mode
with open('web/data/codeCluster_wordle.csv', 'r') as read_obj:
    # pass the file object to reader() to get the reader object
    csv_reader = reader(read_obj)
    # Iterate over each row in the csv using reader object

    count = 0
    for row in csv_reader:
        # row variable is a list that represents a row in csv
        if (row[0] != 'startTime') and (count < 5):
            startTime = row[0]
            endTime = row[1]
            codeEntries = getCodeForInterval(startTime, endTime)

            getCodeDiff(codeEntries[0], codeEntries[1])
        count += 1