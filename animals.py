import ast
import nltk
from nltk.corpus import wordnet as wn

# get a list of imagenet classes and find "tigers"
with open("imagenet1000_clsidx_to_labels.txt", "r") as f:
    imagenet_classes = ast.literal_eval(f.read())
            
    # print(imagenet_classes)
            
    for k, v in imagenet_classes.items():
        if "tiger" in v:
            print(str(k) + "  " + str(v))



    # nltk.download()
    food = wn.synset("food.n.02")
    food_list = list(set([w for s in food.closure(lambda s:s.hyponyms()) for w in s.lemma_names()]))
    
   

    # Remove punctuation and lower
    for food_item in food_list:
        food_list = [food for sublist in food_item.lower().split("_") for food_item in food_list]
        food_list

    print(food_list[:5])