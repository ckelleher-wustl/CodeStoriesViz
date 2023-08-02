codeFiles = ["script.js", "animations.scss", "index.html", "guess.scss", "boilerplate.scss", "notes.md"]
pathToCode = "web/storystudy/wordleCode/"

codeMap = {}

def loadCode():

    for filename in codeFiles:
        file = open(pathToCode + filename, "r")
        code = file.read()

        code = code.replace('\'', '"')
 
        # print(f"{filename}: {code[0:25]}")
        codeMap[filename] = code


def generatePage():
    html = ""
    html += "<div class='sticky2-div'>\n"
    html += "\t<ul id='linkList' class='tab-list'>\n"

    for filename in codeFiles:
        fileRoot = filename.split('.')[0]
        data_url = "code_Wordle_" + fileRoot + ".html"

        html += "\t\t<li class='tab-item'><a href='#' data-url='" + data_url + "' code='" + codeMap[filename] + "'>" + filename + "</a></li>\n"

    html += "\t</ul>\n"
    html += "\t<input type='text' id='codeSearchTerms'></input>\n"
    html += "\t<button onclick='searchChangedCode()'>Search</button>\n"
    html += "</div>"

    html += "<div id='contentContainer'>\n"
    html += "\t<!-- Content will be dynamically loaded here -->\n"
    html += "</div>"

    
    print("\n\n")
    print(html)


loadCode()
generatePage()
