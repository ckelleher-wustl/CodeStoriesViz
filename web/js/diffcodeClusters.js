
var clusterStart = 0;
var clusterEnd = 0;
var codeEntries = {}; // these are the code Entries for the current cluster 
var offset = 0;
var index = 1;

// var codeFiles = {};

let span = null;

    
$( document ).ready(function() {
    console.log( "ready!" );
    loadCodeClusters();
    getCode();

    $('#show-prev-btn').on( "click", function(){
        showPreviousEntry();
    } );
    $('#show-next-btn').on( "click", function(){
        showNextEntry();
    } );

})

function getDiff(codeState1, codeState2) {
    var diff = Diff.createTwoFilesPatch("previous", "current", codeState1, codeState2,null,null,{context:100});
    // console.log(diff)
    var diffHtml = Diff2Html.html(diff, {
        drawFileList: false,
        //matching: 'words',
        outputFormat: 'side-by-side',
    });

    return diffHtml;
}

function showDiff(code1Time, code2Time, codeState1, codeState2) {
 
    var diff = Diff.createTwoFilesPatch("previous " + code1Time, "current " + code2Time, codeState1, codeState2,null,null,{context:100});
    // console.log(diff)
    var diffHtml = Diff2Html.html(diff, {
        drawFileList: false,
        //matching: 'words',
        outputFormat: 'side-by-side',
    });
    document.getElementById('diff').innerHTML = diffHtml;
}

// show all the comments in an interval of time, typically between two code states
function showComments(commentEntries, startTime, endTime){
    const search = document.getElementById('search');
    var lastSearch = "None."
    var evtString = startTime + " - " + endTime + "<br>";
    for(var comment in commentEntries) {
        const currNote = JSON.stringify(commentEntries[comment]);
        evtString = evtString + currNote + "<br>";
        if (currNote.indexOf("search:") != -1) {
            lastSearch = currNote;
        }
    }
    evtString = "<b>" + lastSearch + "</b></br>" + evtString;

    $(search).html(evtString);
}

function getComments(startTime, endTime) {
    $.get('http://localhost:3000/getCommentsInRange', { startTime: startTime, endTime : endTime}, 
    function(response){
        var commentEntries = response;
        // console.log("0th comment" + JSON.stringify(commentEntries[0]));

        showComments(commentEntries, startTime, endTime);
    });
}

function getStatementClass(codeLine) {
    codeLine = codeLine.trim();
    // console.log(codeLine + "*" + codeLine[0] + "*")
    if (codeLine.startsWith("#")) {
        return "comment"
    } else if (codeLine.includes("def")) {
        return "function";
    } else if (codeLine.includes("print")) {
        return "print";
    } else if (codeLine.includes(":") && !(codeLine.includes("[:"))) {
        return "construct";
    } else if (codeLine.includes("(") || codeLine.includes(".")) {
        return "statement";
    }  else if (codeLine.includes("=")) {
        return "assignment";
    }  else if (codeLine.includes("import")) {
        return "import";
    } else {
        return "print";
    }
}

function getMatchInfo(line, lineGroup) {
    var match = stringSimilarity.findBestMatch(line.substring(1), lineGroup);
    var rating = match["bestMatch"]["rating"];
    var foundLine = match["bestMatch"]["target"];

    console.log("best match " + foundLine + " " + rating);

    let result = {
        rating: rating,
        line: foundLine
    }

    return result;
}

function handlePossibleModification(match, line, lineGroup, modLines) {

    line = line.substring(1);
    console.log("\n\nMODIFIED " + getStatementClass(line) + ": " + line);
    console.log("\t" + line + " " + match["rating"] + " " + JSON.stringify(match["line"]))

    console.log("line: " + line.length + " match: " + match["line"].length);
    console.log("line idx: " + (match["line"].indexOf(line)) + " match index: " + (line.indexOf(match["line"])) );

    // if it's a perfect match, then the differences were due to white space that were trimmed
    if (match["rating"] < 1) {

        console.log("line: " + line.length + " match: " + match["line"].length);
        console.log("line idx: " + (match["line"].indexOf(line)) + " match index: " + (line.indexOf(match["line"])) );

        // this is only allowing lines that have been cutoff - so align perfectly at 0. If there are places where the front is what gets cut off then....
        if ((line.length < match["line"].length) && (match["line"].indexOf(line) == 0)) {
            console.log("IGNORING: line is a substring of match[line]");
        } else if ((line.length > match["line"].length) && (line.indexOf(match["line"]) == 0)) {
            console.log("IGNORING: match[line] is a substring of line");
        } else {
            modLines.push(line);
            console.log("handle modlines now " + JSON.stringify(modLines));
        }
    } 

    // in both cases, it shouldn't show up as a deleted line
    const loc = lineGroup.indexOf(match["line"]);
    if (loc > -1) {
        lineGroup.splice(loc, 1);
    }

    lineDiff = Diff.diffWords(match["line"], line)

    console.log("lineDiff " + JSON.stringify(lineDiff))

    return modLines;
}

function summarizeCodeChanges() {
    // console.log("summarize code changes")
    var newLines = 0;
    var modLines = 0;

    var newLines = []
    var modLines = []
    var deletedLines = []

    if (index < codeEntries.length) {

        var codeState1 = cleanCodeText(codeEntries[index-1]["code_text"]);
        var codeState2 = cleanCodeText(codeEntries[index]["code_text"]);

        // var diff = Diff.createTwoFilesPatch("entry " + (i-1), "entry " + i, codeState1, codeState2,null,null,{context:100});
        var diff = Diff.structuredPatch("entry " + (index-1), "entry " + index, codeState1, codeState2,null,null,{context:100});

        if (diff['hunks'].length > 0) {
        
            var lines = diff['hunks'][0]['lines']
        

            // console.log("lines is " + JSON.stringify(lines))
            // I think what we need here is a removal depth
            console.log("\n")
            for (var idx in lines) {
                var line = lines[idx];
                line = line.trim();
                
                // filter out any whitespace lines
                if (line.length > 1) {
                    if (line.startsWith('+')) {
                        // console.log("ADDED " + getStatementClass(line.substring(1)) + ": " + line.substring(1) );
                        
                        if (deletedLines.length > 0) {

                            var match = getMatchInfo(line, deletedLines);

                            if (match["rating"] >= 0.7)  {
                                modLines = handlePossibleModification(match, line, deletedLines, modLines);
                                // console.log("+modlines now " + JSON.stringify(modLines));
                            } else {
                                newLines.push(line.substring(1));
                            }
                            // console.log("Best delete match " + JSON.stringify(match["line"]));
                        } else {
                            newLines.push(line.substring(1));
                        }
                    } else if (lines[idx].startsWith('-')) { //(line.startsWith('-')) { // there can be situations where - is the beginning of a code line 
                        console.log("REMOVED " + getStatementClass(line.substring(1)) + ": " + line.substring(1) );
                        // deletedLines.push(line.substring(1));    
                        
                        // console.log("checking newLines " + JSON.stringify(newLines));
                        
                        if (newLines.length > 0) {

                            var match = getMatchInfo(line, newLines);

                            if (match["rating"] >= 0.7)  {
                                modLines = handlePossibleModification(match, line, newLines, modLines);
                                // console.log("-modlines now " + JSON.stringify(modLines));
                            } else {
                                deletedLines.push(line.substring(1));
                            }
                            // console.log("Best add match " + JSON.stringify(match["line"]));
                        } else {
                            deletedLines.push(line.substring(1));
                        }
                    } 
                }
            }
        }
    }

    showCodeChanges(deletedLines, modLines, newLines);
}

function showCodeChanges(deletedLines, modifiedLines, addedLines){
    // console.log("showCodeChanges " + JSON.stringify(deletedLines))
    const changesDiv = document.getElementById('changes');

    changeString = "<b>" + "DELETED LINES" + "</b>"
    changeString += "<ul>"
    for (var delLine in deletedLines) {
        changeString += "<li>" + getStatementClass(deletedLines[delLine]) + ": " + deletedLines[delLine] + "</li>"
    }
    changeString += "</ul>"

    changeString += "<b>" + "MODIFIED LINES" + "</b>"
    changeString += "<ul>"
    for (var modLine in modifiedLines) {
        changeString += "<li>" + getStatementClass(modifiedLines[modLine]) + ": " + modifiedLines[modLine] + "</li>"
    }
    changeString += "</ul>"

    changeString += "<b>" + "ADDED LINES" + "</b>"
    changeString += "<ul>"
    for (var addLine in addedLines) {
        changeString += "<li>" + getStatementClass(addedLines[addLine]) + ": " + addedLines[addLine] + "</li>"
    }
    changeString += "</ul>"


    $(changesDiv).html(changeString);
}

function setClusterBounds(startTime, endTime) {
    console.log("current cluster is " + startTime + " - " + endTime)
    clusterStart = startTime;
    clusterEnd = endTime;

    getCode();
}

function loadCodeClusters() {
    var clusterFile = 'data/codeCluster_IFStudio.csv'
    console.log("clusterFile is " + clusterFile)
    // $.csv.toObjects(clusterFile):

    $.get( clusterFile, function( CSVdata) {
        
        // data loaded - parse into objects
        console.log("CSVdata" + CSVdata)
        var clusterData = $.csv.toObjects(CSVdata)
        console.log("parsed data: " + JSON.stringify(clusterData))

        // iterate through objects and build a list, replace clusterList's HTML with it.
        const clusterList = document.getElementById('cluster_list');
        var listHTML = "<ul>"
        for(var cluster in clusterData) {
            var clusterEntry = clusterData[cluster]
            listHTML += "<li onclick='setClusterBounds(" + clusterEntry["startTime"] + "," + clusterEntry["endTime"] +")'>" + clusterEntry["startTime"] + "-" + clusterEntry["endTime"] + "</li>"

            if (clusterStart == 0) {
                clusterStart = clusterEntry["startTime"]
                clusterEnd = clusterEntry["endTime"]
            }
        }
        listHTML = listHTML + "</ul">

        $(clusterList).html(listHTML);


     });
}

function getCode() {
    // I think I want to change this so that it loads the csv of the code clusters and then makes a list and you can click on them
    console.log("get code");
    $.get('http://localhost:3000/intervalCode', { begin: clusterStart, end : clusterEnd}, 
    // $.get('http://localhost:3000/getCodeText', { offset: offset, order : "ASC"}, 
        function(response){
            codeEntries = response; 
            console.log("0th entry" + JSON.stringify(codeEntries[0]));
            
            index = 1; // display the first two code states in the cluster
            updateCodeDisplay();
            summarizeCodeChanges();
    });
}

function segmentCode(codeText){
    var header = codeText.substring(0,codeText.indexOf("def"));
    console.log("Header is: ");
    console.log(header);

    return header;
}

function cleanCodeText(codeText) {
    codeText = codeText.replaceAll(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
    codeText = codeText.replaceAll("'", "\"");
    codeText = codeText.replaceAll("|", "");

    return codeText;
}

function updateCodeDisplay() {
    // currently unused, but would it be helpful to show the notes for the two
    // var notes = codeEntries[index]["notes"];
    var codeState1 = cleanCodeText(codeEntries[index-1]["code_text"]);
    var codeState2 = cleanCodeText(codeEntries[index]["code_text"]);

    var startTime = codeEntries[index-1]["time"];
    var endTime = codeEntries[index]["time"];

    showDiff(startTime, endTime, codeState1, codeState2);

    

    getComments(startTime, endTime);
}

function showNextEntry() {
    index = index + 1;
    if (index >= codeEntries.length) {
        offset = codeEntries[codeEntries.length-2]["time"];
        index = 1;
        getCode();

        console.log("offset is: " + offset);
        // index = codeEntries.length -1;
    } else {
        updateCodeDisplay();
        summarizeCodeChanges();
    }
    console.log("code entries length: " + codeEntries.length)

}

function showPreviousEntry() {
    index = index - 1;
    if (index < 1) {
        index = 1;
    }
    updateCodeDisplay();
    summarizeCodeChanges();

}