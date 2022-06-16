
import pandas as pd
import nltk
from nltk import PorterStemmer
from nltk.corpus import stopwords

nltk.download('stopwords')

ps = PorterStemmer()

def getKeywords(cluster):
    pageStrings = []
    for key in cluster.keys():
        if (key not in ["begin", "end", "type"]):
            if (key == "seed"):
                keyValue = cluster.get(key).strip().lower()
                keyValue = keyValue.replace(".", " ")
                keyValue = keyValue.replace("-", " ")
                keyValue = keyValue.replace("(", "")
                keyValue = keyValue.replace(")", "")
                keyValue = keyValue.replace("\"", "")
                keyValue = keyValue.replace("\'", "")
                pageStrings.append(keyValue)
            else:
                keyValue = str(key).strip().lower()
                keyValue = keyValue.replace(".", " ")
                keyValue = keyValue.replace("-", " ")
                keyValue = keyValue.replace("(", "")
                keyValue = keyValue.replace(")", "")
                keyValue = keyValue.replace("\"", "")
                keyValue = keyValue.replace("\'", "")
                pageStrings.append(keyValue)
            
            # print(f"key: {key} {cluster.get(key)}")

    keywords = set()
    stopWords = set(stopwords.words('english'))
    for pageString in pageStrings:
        words = []
        for word in pageString.split():
            stemmedWord = ps.stem(word)
            if (stemmedWord not in stopWords):
                words.append(ps.stem(word))
        # print(words)
        keywords = keywords.union(set(words))
    
    return keywords

   



df = pd.read_csv('web/data/searchEvts.csv')

# split the type: pagedesc into separate columns
split = df['filename'].str.split(":", 1, expand=True)

df = pd.concat([df, split], axis=1)


# rename the column names so there's reasonable names for all
df.set_axis(['eventID', 'time', 'filename', 'type', 'page'], axis=1, inplace=True)
print(df)

# break these into clusters that are started by either a search or a revisit not in the current cluster
allClusters = []
currCluster={}
for index, row in df.iterrows():
    time = row['time']
    type = row['type']
    page = row['page']

    end = 0
    try:
        end = page.index(";")
    except:
        end = len(page)
    
    page = page[0:end]

    if ( (type == "search") or ((type == "revisit") and (page not in currCluster)) ) :
        if (currCluster != {}):
            allClusters.append(currCluster)
        # print(str(len(allClusters)) + ": "  + str(currCluster))

        if currCluster.get('seed') == page:
            # print( f"SAME SEED: {currCluster.get('seed') == page} {currCluster.get('seed')} == {page} ")
            currCluster[page] = [time]
            currCluster["end"] = time
        
        else:
            currCluster = {}
            currCluster["seed"] = page
            currCluster["type"] = type
            currCluster["begin"] = time
            currCluster["end"] = time

    else:
        if (page not in currCluster):
            currCluster[page] = [time]
            currCluster["end"] = time
            # print("\tadding " + str(page))
        else:
            currCluster[page].append(time)
            currCluster["end"] = time
            # print("\tupdating " + str(page) + str(currCluster[page]))

    # todo - do we want to think about detecting linkages between searches at this point? (not yet)
    # export this into a csv that can be used in d3

    #todo - get updated data post-cleaning pass

print("\n\nFINAL CLUSTERS:")
idx = 0
for cluster in allClusters:
    # if len(cluster.keys()) <= 4:
    print( f"{idx}: {str(cluster)}" )
    idx += 1

print("\n\nCLUSTERS TESTING:")

# make lists of clusters that are continuations of the same idea -
# in other words where there's some common keywords

clusterGroups = []
clusterGroup = []
prevCluster = None
prevKeys = set()
debug = False
for cluster in allClusters:
    currKeys = getKeywords(cluster)

    commonKeys = prevKeys.intersection(currKeys)
    # if (len(commonKeys) > 0) :
    # print(cluster)

    if len(commonKeys) > 0:
        # there's affinity between curr and prev clusters

        # this is a new clustergroup - so we need to add prev and curr
        if len(clusterGroup) == 0:
            clusterGroup.append(prevCluster)
            clusterGroup.append(cluster)

            if debug:
                print("\nNEW CLUSTER:")
                print(f"\tprevious: {prevCluster}")
                print(f"\tprevKeys: {prevKeys}")
                print(f"\tcurrent: {cluster}")
                print(f"\tcurrKeys: {currKeys}")
                print(f"\tintersection: {commonKeys}")

        # this is an existing clustergroup - so we just need to add curr
        else:
            clusterGroup.append(cluster)
            if debug:
                print(f"\tcurrent: {cluster}")
                print(f"\tcurrKeys: {currKeys}")
                print(f"\tintersection: {commonKeys}")

        # print("\tand...")
        prevKeys = currKeys.union(prevKeys)  # this should join so union them together
    else:
        print(f"\n\nNO CLUSTER: {cluster}")
        prevKeys = currKeys
        
        clusterGroups.append(clusterGroup) # save the previous cluster
        clusterGroup = [] # reset the clusterGroup

    prevCluster = cluster

print("seed,startTime,endTime")
lowerBound = 1365 # this is hard coded but probably shouldn't be.
upperBound = 36026 # hard coded last event
for clusterGroup in clusterGroups:
    if len(clusterGroup) > 0:
        startTime = clusterGroup[0]['begin']
        endTime = clusterGroup[len(clusterGroup)-1]['end']
        # print(f"'gap','gap',{lowerBound},{startTime}")
        print(f"'{clusterGroup[0]['seed']}',{startTime},{endTime}")
        lowerBound = endTime

# print(f"'gap','gap',{lowerBound},{upperBound}")



# print("\n\nseed,startTime,endTime")
# startTime = 0
# for clusterGroup in clusterGroups:
#     if len(clusterGroup) > 0:
#         startCluster = clusterGroup[0]['begin']
#         endCluster = clusterGroup[len(clusterGroup)-1]['end']
#         print(f"'gap',{startTime},{startCluster}")
#         startTime = endCluster