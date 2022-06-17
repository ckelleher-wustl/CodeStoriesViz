import pandas as pd
df = pd.read_csv("searchEvts.csv").sort_values("time")

df['action'] = df['filename'].str.split(':').str[0]
df = df[df.action!='search']

df['webpage'] = df.filename.str.split(":").str[1:].str.join(":").str.split(";").str[0]

errorCount = 0
for webpage, group in df.groupby("webpage"):
	if group.action.values[0] != "visit":
		print(webpage, "must be first visited before revisited")
		errorCount += 1
	if (group.action=="visit").sum() > 1:
		print(webpage, "can only be 'visited' once. After the first time it must be 'revisited'")
		errorCount += 1

print("error count:",errorCount)
