from html.parser import HTMLParser
import json


html_file = "clusters_MosaicNew.html"

html_string = [open(html_file, 'r', encoding="iso-8859-1").read()]

url_screenshotCount_map = json.load(open("url_count_map.json", 'r'))
screenshots_dir = "images/mosaic/"

oldPath_newPath_map = {}

class MyParse(HTMLParser):
    def __init__(self, *, convert_charrefs: bool = True) -> None:
        super().__init__(convert_charrefs=convert_charrefs)
        self.prev_img_path = ""

    def handle_starttag(self, tag, attrs):
        if tag=="img":
            #print("IMG:",dict(attrs)["src"])
            self.prev_img_path = dict(attrs)["src"]
        if tag=="a":
            #print("URL:",dict(attrs)["href"])
            if self.prev_img_path in oldPath_newPath_map.keys():
                new_img_path = oldPath_newPath_map[self.prev_img_path]
                print(self.prev_img_path, new_img_path, "again")
                html_string[0] = html_string[0].replace(self.prev_img_path, new_img_path)
            else:
                curr_url = dict(attrs)["href"]
                if curr_url in url_screenshotCount_map.keys():
                    new_img_path = screenshots_dir+"screenshot"+str(url_screenshotCount_map[curr_url])+".png"
                    oldPath_newPath_map[self.prev_img_path] = new_img_path
                    print(self.prev_img_path, new_img_path)
                    html_string[0] = html_string[0].replace(self.prev_img_path, new_img_path)
            #print(attrs)
    #def handle_data(self, data):
        #print(1, data, 2)

h=MyParse()
page=open(html_file, encoding="iso-8859-1").read()
h.feed(page)

with open(html_file[:-5]+"_photoUpdated.html", 'w') as f:
    f.write(html_string[0])

# from BeautifulSoup import BeautifulSoup
# page = BeautifulSoup(open("clusters_gitMosaic.html"))
