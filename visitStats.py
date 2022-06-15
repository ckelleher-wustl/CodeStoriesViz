from operator import contains
import pandas as pd
import json

# the goal here is to generate basic stats about the visits so that we can track where things came from.
# for each page, I want to keep 1) a count of how many times it has been visited
# and 2) the search that was used to get there.

df = pd.read_csv('searchEvts.csv')

# split the type: pagedesc into separate columns
split = df['filename'].str.split(":", expand=True)

df = pd.concat([df, split], axis=1)
# rename the column names so there's reasonable names for all
df.set_axis(['eventID', 'time', 'filename', 'type', 'page', 'hmm'], axis=1, inplace=True)
print(df)

currentSearch = ""
history = {}
for i in range(0, len(df)):
    type = df.iloc[i]["type"]
    title = df.iloc[i]["page"]
    time = df.iloc[i]["time"]

    if (type =="search"):
        currentSearch = title
        print(f"{type} {title} {time}")
    elif ("visit" in str(type)):
        if title in history.keys():
            history[title] = {"search": history[title]['search'], "count": history[title]['count'] + 1}
            if currentSearch == history[title]['search']:
                print(f"\t REVISIT {title}({history[title]['search']}, {history[title]['count']})")
            else:
                print(f"\t PAST REVISIT {title}({history[title]['search']}, {history[title]['count']})")
        else :
            history[title] = {"search": currentSearch, "count": 1}
            print(f"\t NEW VISIT {title}({history[title]['search']}, {history[title]['count']})")

    # print(f"{type} {title}")

print("\n\n")
# print(history.keys())
keyList = list(history.keys())
keyList.sort(key = lambda x: history[x]["count"], reverse = True)
for i in keyList:
    if (history[i]["count"]> 1):
        print(f"{i} {history[i]['count']}")


with open('./web/data/repeatVisits.json', 'w') as fp:
    json.dump(history, fp)


