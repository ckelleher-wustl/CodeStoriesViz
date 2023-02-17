var codeChangeTimes = {}
var codeChangeArray = []

var codeEntries = {}

var eventListsByKey = {} 
// var eventTimes = []


$( document ).ready(function() {
    // console.log( "ready!" );
    getAllCodeEdits();

})

// query the database for all code changes. Initialize and display the history overview
function getAllCodeEdits() {
    $.get('http://localhost:3000/getCodeText', { offset: 0, order : "ASC", limit: 500 }, 
        function(response){
            codeEntries = response;
            // console.log("0th entry" + JSON.stringify(codeEntries[0]));

            initializeHistoryOverview(codeEntries);
            // displayHistoryOverview(); // for now, removing the table view in favor of the bubble overview

            // testing different code summary option
            initialize();
            displayCodeChangeViz();
    });

}

function _getFilename(notesEntry) {
    var fileName = notesEntry.slice(6,-1).trim()
    if (fileName.includes(";")) {
        fileName = fileName.slice(0, fileName.indexOf(";"));
    }
    return fileName;
}

// helper function to find the previous code change for a file to account for toggling between files when editing
function _getIndexForPreviousFileChange(responses, fileName, time, idx) {
    
    var lastIndex = -1;

    // start looking at the idx for the current file and move down from there.
    for (var i = idx-1; i >=0; i--) {
        var resTime = responses[i]["time"];
        var resFile = _getFilename(responses[i]["notes"])
        // console.log("checking " + resTime + " " + resFile + " == " + fileName);
        if (resFile != fileName) {
            // console.log("diff file");
        } else if (resTime < time) { // want to make sure these aren't the same time somehow
                lastIndex = i;
                break;
        }
    }

    return lastIndex;

}

// helper function to find the appropriate code entry for a target time and file
function _getIForTimeAndFile(targetTime, targetFile, startingIdx, responses) {


    var resTime = responses[startingIdx]["time"];
    var resFile = _getFilename(responses[startingIdx]["notes"]);

    console.log("looking for " +targetTime + " " + targetFile + " " + resTime + " " + resFile);

    // fix situations were the predicted location for the time is wrong.
    while (resTime < targetTime) {
        startingIdx+=1;
        resTime = responses[startingIdx]["time"];
        resFile = _getFilename(responses[startingIdx]["notes"]);
    }

    while (resTime > targetTime) {
        startingIdx-=1;
        resTime = responses[startingIdx]["time"];
        resFile = _getFilename(responses[startingIdx]["notes"]);
    }

    // there's still an issue if there are entries for multiple files at the same time.
    // will fail if it doesn't find the right data point before the time > resTime (target time)
    while ( (resFile != targetFile) && (targetTime <= resTime) && (startingIdx < responses.length-1) ) {
        startingIdx += 1;
        resTime = responses[startingIdx]["time"];
        resFile = _getFilename(responses[startingIdx]["notes"]);
    }

    // it's possible this data point doesn't exist, so we should communicate that.
    if ((resFile == targetFile) && (targetTime == resTime)) {
        return startingIdx;
    } else {
        return -1;
    }

    // return startingIdx;
}


// gets the current and previous versions of the code and request an updated display
function generateCodeDisplay(responses, i, id, cmd) {


    // not all of this is totally reliable when there are multiple entries that 
    // may shift the index for the time. 
    var idInfo = id.split(";")
    var fileName = idInfo[0];
    var idx = idInfo[1];
    var time = idInfo[2];
    // console.log("show " + id);

    // console.log("looking for " + fileName + " " + time);

    i = _getIForTimeAndFile(time, fileName, i, responses);
    
    
    if (cmd == "+") {
        // console.log("cmd=" + cmd + " fileName=" + fileName + " idx=" + idx + " time=" + time);
        // console.log( JSON.stringify(responses[i]) );
        
        var resTime = responses[i]["time"];
        var resFile = _getFilename(responses[i]["notes"]);
        
        if ((resTime != time) || (resFile != fileName)) {
            // if resTime and resFile don't match then there's a problem. For now, just echo this.
            // console.log("Time and File Info DOESN'T MATCH");
            // console.log("\tresTime " + resTime + "==" + time);
            // console.log("\tresFile " + resFile + "==" + fileName);

        } else {
            // otherwise, we want to get the code files and display them
            var currCode = responses[i]["code_text"];

            var indexForPrevCode = _getIndexForPreviousFileChange(responses, fileName, time, i); // or idx?
            if (indexForPrevCode != -1) {
                var prevCode = responses[indexForPrevCode]["code_text"];
                var prevTime = responses[indexForPrevCode]["time"];

                console.log("Show code for " + fileName + " and times " + prevTime + " - " + time);

                displayCodeChangeSummary(prevTime, prevCode, time, currCode);
            } else {
                // console.log("No previous code for " + fileName + " and time " + time);
            }
        // var 
        }   
    }

}

    