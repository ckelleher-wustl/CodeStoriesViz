thought process: I know I want to create some kind of app that searches Google reviews, and portrays outliers in terms of reviews and rating. I think my initial goal is to be able to create a scatter plot of all restaurants that meet a certain criteria (ie location, rating, review count), and see what the distribution looks like before creating a heuristic to identify "good" restaurants

an additional requirement is that I don't want to share my google maps client key on this code history once I create one, since that is a privacy concern, so I will load that from a file outside of this project

First issue I resolved: google only lets you get 20 results at a time, and three pages of this for a total of 60. However, I had to figure out to add a time delay between pages because otherwise the next_token wouldnt be valid

next issue: find a way to get more than 60 results for an area of interest.
This may include breaking the area into smaller groups and merging them.

I'm going to start with a simple solution of dividing the large radius into smaller radiuses. "Divide and conquer"

Update, I am going to just use my API key for development, and then change it after this project.

goal: get rid of overlapping data points