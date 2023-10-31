import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

df = pd.read_csv("/Users/joeyallen/Documents/CodeBase3/Project3/all_cafes.csv")
df.drop_duplicates(inplace=True)
# rating_dfs = []
# for rating in df['rating'].unique():
#     rating_df = df[df['rating']==rating]
#     rating_df = rating_df[rating_df['user_ratings_total'] > rating_df['user_ratings_total'].quantile(0.9)]
#     rating_dfs.append(rating_df)

# df = pd.concat(rating_dfs)

#detect outliers:
# df['count_zscore'] = (df['user_ratings_total'] - df['user_ratings_total'].mean()) / df['user_ratings_total'].std()
# df['rating_zscore'] = (df['rating'] - df['rating'].mean()) / df['rating'].std()

# #df = df[(df.count_zscore > 3) & (df.rating_zscore > 3)]
# print(df.rating_zscore, df.count_zscore)
#exit()


min_rating = 4.5
min_reviews = 80

df = df[(df.user_ratings_total >= min_reviews) & (df.rating >= min_rating)]

df['rating'] = df['rating']+np.random.random(df.shape[0])/100
# df['user_ratings_total'] = np.log(df['user_ratings_total'])

# df.plot.scatter(x="user_ratings_total",y="rating")
plt.figure(figsize=(10, 6))
plt.scatter(df['user_ratings_total'], df['rating'], color='blue', alpha=0.6)
plt.yscale('linear')
plt.xscale('log')
plt.xlabel('User Ratings Total (log-scale)')
plt.ylabel('Rating')
plt.title('Scatter Plot of Rating vs. User Ratings Total')

# Annotating the names
for i, row in df.iterrows():
    plt.annotate(row['name'], (row['user_ratings_total'], row['rating']), fontsize=8, rotation=40)

plt.show()