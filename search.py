
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
           
            # seed value is what we need for first cluster page
            if (key == "seed"):
                keyValue = cluster.get(key).strip().lower() 

            # other pages are encoded as attributes with their values holding visit times
            else:
                keyValue = str(key).strip().lower()

            # clean up punctuation that may be present    
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
    ignoreWords = ["lichess", "org", "api", "python", "pytorch", "documentation", "tutorial", "image"]
    for pageString in pageStrings:
        words = []

        # break the full page title into words
        for word in pageString.split():

            # if the word isn't something we should ignore
            if word.strip() not in ignoreWords and word not in stopWords:
                
                # stem it
                stemmedWord = ps.stem(word)

                # if stemmed word is also not a stopword, add it to the wordlist
                if (stemmedWord not in stopWords) and (len(stemmedWord) > 1):
                    words.append(ps.stem(word))

        keywords = keywords.union(set(words))
    
    return keywords


def getOriginCluster(page, allClusters):

    # it's most likely a page within a cluster
    for cluster in allClusters:
        if page in cluster:
            return cluster

    # but it could theoretically be the seed too
    for cluster in allClusters:
        # print(f"origin search: {cluster}")
        if cluster['seed'] == page:
            return cluster
    
    # otherwise this is a page we haven't assigned to a cluster
    return None

    


def getClusters(df):
    debug = True # flag to enable debugging messages

    # keep an index of clusters
    df['clusterID'] = -1
    clusterIndex = 0

    # break these into clusters that are started by either a search or a revisit not in the current cluster
    allClusters = []
    currCluster={}
    for index, row in df.iterrows():
        time = row['time']
        type = row['type']
        page = row['page']

        # by default, assign the next df row to the current cluster
        # we'll override this later where appropriate
        df.at[index,'clusterID'] = clusterIndex

        # cut off any comments after the page title; update page and df data
        end = 0
        try:
            end = page.index(";")
        except:
            end = len(page)
        row['page'] = page[0:end]
        page = row['page']

        # at this point, we should have a valid entry for time, type, and page.


        # if this is a search or an out-of-cluster revisit, then this should possibly start a new cluster
        if ( (type == "search") or (type == "typed") or ((type == "revisit") and (page not in currCluster)) ) :

            if debug:
                print(f"Possible new cluster: {page} {len(currCluster)}")

            if (currCluster != {}):
                # print(f"does cluster have a beginning: {('begin' in currCluster)}")

                # this is a first cluster that didn't originate with a search, so we need to
                # do some extra work to ensure that it has appropriately set data
                if (not('begin' in currCluster)):

                    if debug:
                        print(f"cluster has no meta-data - assigning: {page}")

                    # find the min and max so we can identify the begin and end of the cluster
                    min = -1
                    max = -1
                    seed = ""

                    # loop through all the existing keys to determine min, max, and seed
                    for attr in currCluster.keys():
                        if isinstance(currCluster[attr], int):
                            # print(f"{attr} is {currCluster[attr]} ")
                            pass
                        else:
                            # these are going to the page attrs that have non-int types
                            # print(f"{attr} is {currCluster[attr]}")
                            
                            # set the min and max access times
                            if (min == -1) or (min > currCluster[attr][0]):
                                min = currCluster[attr][0]
                                seed = attr
                            if (max == -1) or (max < currCluster[attr][len(currCluster[attr])-1]):
                                max = currCluster[attr][len(currCluster[attr])-1]
                    currCluster["begin"] = min
                    currCluster["end"] = max
                    currCluster["seed"] = seed

                # at this point, even a cluster that was missing begin, end, etc should have that info

                # # we have a valid currCluster, add to all clusters so that page starts a new one
                # allClusters.append(currCluster)

            
            

            # figure out whether the page is actually part same revisited cluster as current seed
            originClusterCurrent = getOriginCluster(currCluster.get('seed'), allClusters)
            originClusterPage = getOriginCluster(page, allClusters)
                

            # while this is a potential cluster start, it's already in the current cluster
            if currCluster.get('seed') == page:
                if debug:
                    print( f"SAME SEED: {currCluster.get('seed') == page} {currCluster.get('seed')} == {page} ")
                
                currCluster[page] = [time]
                currCluster["end"] = time
            # if it's a first entry, we may not have recorded the current data yet.
            elif len(currCluster) == 0:
                if (debug):
                    print(f"starting cluster: {page}")
                currCluster["begin"] = time
                currCluster["end"] = time
                currCluster["seed"] = page

            # while revisit is a potential cluster start it's in the same cluster as a previous revisit, so should be appended 
            # to that one.
            elif (originClusterCurrent != None) and (originClusterCurrent == originClusterPage):
                if debug:
                    print(f"\Extend cluster: MATCH")
                    print(f"Origin cluster for {currCluster.get('seed')} IS: \n\t{originClusterCurrent}")
                    print(f"Origin cluster for {page} IS: \n\t{originClusterCurrent}")

                currCluster[page] = [time]
                currCluster["end"] = time
            
            else:
                if (len(currCluster) > 0):
                    if debug:
                        print(f"ADDING CLUSTER: \n\t{currCluster}")

                    # we have a valid currCluster, add to all clusters so that page starts a new one
                    allClusters.append(currCluster)

                    currCluster = {}
                    currCluster["seed"] = page
                    currCluster["type"] = type
                    currCluster["begin"] = time
                    currCluster["end"] = time

                    # the current df row should be considered part of the next cluster, so adjust the clusterIndex
                    clusterIndex += 1
                    df.at[index,'clusterID'] = clusterIndex

        # this page belongs to the current cluster and should be added
        else:
            # this is a new page for the current cluster
            if (page not in currCluster):
                currCluster[page] = [time]
                currCluster["end"] = time

                if debug:
                    print(f"\tadding to current cluster {page}")
            
            # we've already seen this page in the current cluster
            else:
                currCluster[page].append(time)
                currCluster["end"] = time
                # print("\tupdating " + str(page) + str(currCluster[page]))

                if debug:
                    print(f"\tadding access within cluster {page} {currCluster[page]}")


    # add whatever cluster is currently in process
    if (len(currCluster) > 0):
        allClusters.append(currCluster)
        
    return allClusters 


# read in the search events data
df = pd.read_csv('web/data/searchEvts_gitClassification_filtered.csv')

# split the type: pagedesc into separate columns
split = df['filename'].str.split(":", 1, expand=True)
df = pd.concat([df, split], axis=1)

# rename the column names so there's reasonable names for all
df.set_axis(['eventID', 'time', 'filename', 'type', 'page'], axis=1, inplace=True)
print(f"DF:\n{df}")

# construct clusters based on the sequence of searches and page visits
allClusters = getClusters(df)



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
debug = True
for cluster in allClusters:
    currKeys = getKeywords(cluster)

    commonKeys = prevKeys.intersection(currKeys)

    if (debug):
        print(f"\n\nHANDLE CLUSTER: {cluster}")
        print(f"\tprevKeys: {prevKeys} \n\tcurrKeys: {currKeys}")
        print(f"\tcommon keys:{commonKeys} ({len(commonKeys)})")
    

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
                print("\n ADDING TO EXISTING CLUSTER:")
                print(f"\tcurrent: {cluster}")
                print(f"\tcurrKeys: {currKeys}")
                print(f"\tintersection: {commonKeys}")

        # print("\tand...")
        # prevKeys = currKeys.union(prevKeys)  # this should join so union them together
        prevKeys = currKeys # this is a much stronger requirement that there needs to be some affinity between the previous two things
    else:
        
        prevKeys = currKeys
        
        # clusterGroup.append(cluster) # add the current cluster to the group; this may be questionable
        # if there's anything in the previous cluster group, save it.
        if (len(clusterGroup) > 0):
            clusterGroups.append(clusterGroup) # save the previous cluster

        if debug:
            print(f"\n\nNO CLUSTER:")
            print(f"\tcurrent: {cluster}")
            print(f"current cluster group: \n\t{clusterGroup} - \n\t{clusterGroups}")
        clusterGroup = [] # reset the clusterGroup

    prevCluster = cluster

print("\n\nseed,startTime,endTime")
for clusterGroup in clusterGroups:
    if len(clusterGroup) > 0:
        startTime = clusterGroup[0]['begin']
        endTime = clusterGroup[len(clusterGroup)-1]['end']
        print(f"'{clusterGroup[0]['seed']}',{startTime},{endTime}")



# df = pd.read_csv('web/data/searchEvts.csv')
df.to_csv('web/data/baseClusters.csv')  


# print("\n\nseed,startTime,endTime")
# startTime = 0
# for clusterGroup in clusterGroups:
#     if len(clusterGroup) > 0:
#         startCluster = clusterGroup[0]['begin']
#         endCluster = clusterGroup[len(clusterGroup)-1]['end']
#         print(f"'gap',{startTime},{startCluster}")
#         startTime = endCluster

