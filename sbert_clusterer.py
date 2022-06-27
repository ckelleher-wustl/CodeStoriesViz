import sys
sys.path.append("../sentence-transformers")#note I could NOT install this correctly, so I cloned the repo

from sentence_transformers import SentenceTransformer, util
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

import pandas as pd, numpy as np

df = pd.read_csv("searchEvts.csv")
df['webpage'] = df.filename.str.split(":").str[1:].str.join(":").str.split(";").str[0]

#Our sentences we like to encode
sentences = df['webpage'].values

#Sentences are encoded by calling model.encode()
embeddings = model.encode(sentences)
sim_matrix = util.cos_sim(embeddings,embeddings)

sim_df = pd.DataFrame(sim_matrix, columns=sentences, index=sentences)
sim_df.to_csv("similarity_df.csv",index=True)


cluster = True
if cluster:
    all_data = []
    for embedding, time in zip(embeddings, df['time']):
        data = embedding.tolist()
        data.append(time)
        all_data.append(data)

    from sklearn.preprocessing import StandardScaler

    all_data = StandardScaler().fit_transform(all_data)

    from sklearn.cluster import OPTICS, KMeans
    clustering_text = OPTICS(min_samples=4).fit(embeddings)
    clustering_time = OPTICS(min_samples=4).fit(df['time'].values.reshape(-1,1))

    df['cluster_text'] = clustering_text.labels_
    df['cluster_time'] = clustering_time.labels_

    #for each element in group: cluster buddies are the other elements in that group
    #check if there is overlap of cluster buddies
    df[["time","webpage","cluster_time","cluster_text"]].to_csv("time_text_clusters.csv",index=False)
