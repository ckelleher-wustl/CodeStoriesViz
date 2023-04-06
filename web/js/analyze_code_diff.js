// determine whether a given line contains some kind of printing, regardless of whether it's added or removed.
function isPrintStatement(statement) {
    if (statement.includes("print(") || statement.includes("console.log(") || statement.includes("alert(")) {
        // console.log("\tprint: " + statement);
        return true;
    } else {
        return false;
    }
}

// determine whether a given line is a comment
function isCommentStatement(statement) {
    if (statement.startsWith('#') || statement.startsWith('//')) {
        return true;
    } else {
        return false;
    }
}

// determine whether a given line is an add or delete - we don't want to count context lines
function isModifiedStatement(statement) {
    statement = statement.trim();
    if (statement.startsWith('+') || statement.startsWith('-')) {
        return true;
    } else {
        return false;
    }
}

function trimStatement(statement) {
    // strip off the +/- that indicates whether this has been added or removed
    if (statement.startsWith("+") || statement.startsWith("-")) {
        statement = statement.substring(1).trim();
    }

    statement = statement.trim();

    // strip off comment characters.
    if (statement.startsWith('#')) {
        statement = statement.substring(1).trim();
    } else if (statement.startsWith("//")) {
        statement = statement.substring(2).trim();
    }

    return statement;
}


var printStatements = []; 
function countPrints(patch) { 

    printStatements = []; 
    
    console.log("NEW PRINTS PATCH");
    var numHunks = patch['hunks'].length;

    var lines = [];

    // iterate through the hunks in this patch(diff)
    for(var h = 0; h < numHunks; h++) {

        // get the lines from the current hunk
        lines = patch['hunks'][h]['lines'];


        for (var line in lines) {
            // console.log("looking at: " + line);

            // determine whether this is a print statement of some flavor.
            if (isPrintStatement(lines[line]) && isModifiedStatement(lines[line])) {

                // get the trimmed statement so we can keep track of uniqueness
                var stmt = trimStatement(lines[line]);

                // console.log("trimmed: " + stmt + " " + (stmt in printStatements));

                if (!(printStatements.includes(stmt))) {
                    // console.log("\tappend:" + stmt + (printStatements.includes("stmt")) + printStatements.length);
                    printStatements.push(stmt);
                }

            }
        }

        
    }

    var html = "<br> Print Statements (" + printStatements.length + "):\n<ul>";
    for (var s in printStatements) {
        html += "<li>" + printStatements[s] + "</li>"
    }
    html += "</ul>"

    return {count: printStatements.length, html: html};
}

var commentsAdded = [];
var commentsRemoved = [];
function countComments(patch) {
    
    commentsAdded = [];
    commentsRemoved = [];
    
    console.log("NEW COMMENTS PATCH");
    var numHunks = patch['hunks'].length;

    var lines = [];

    // iterate through the hunks in this patch(diff)
    for(var h = 0; h < numHunks; h++) {

        // get the lines from the current hunk
        lines = patch['hunks'][h]['lines'];


        for (var line in lines) {
            // console.log("looking at: " + line);

            // if it's not a print statement then we want to see whether it's a comment
            if (!isPrintStatement(lines[line]) && isModifiedStatement(lines[line])) {

                // trim off +/- stuff
                var stmt = lines[line].substring(1).trim();

                // console.log("possible Comment:_" + stmt + "_" + isCommentStatement(stmt));

                if ((stmt.length > 0) && (isCommentStatement(stmt))) {
                    if ((lines[line].trim()[0] == "+") && !(commentsAdded.includes(stmt))) {
                        // console.log("\tappend:" + stmt + (printStatements.includes("stmt")) + printStatements.length);
                        commentsAdded.push(trimStatement(stmt));
                    } else if ((lines[line].trim()[0] == "-") && !(commentsRemoved.includes(stmt))) {
                        // console.log("\tappend:" + stmt + (printStatements.includes("stmt")) + printStatements.length);
                        commentsRemoved.push(trimStatement(stmt));
                    }
                }

            }
        }
    
    }

    var html = "<br> Comments Added (" + commentsAdded.length + "):\n<ul>";
    for (var s in commentsAdded) {
        html += "<li>" + commentsAdded[s] + "</li>"
    }
    html += "</ul>"

    html += "<br> Comments Removed (" + commentsRemoved.length + "):\n<ul>";
    for (var s in commentsRemoved) {
        html += "<li>" + commentsRemoved[s] + "</li>"
    }
    html += "</ul>"

    return {countAdd: commentsAdded.length, countRemoved: commentsRemoved.length, html: html};
}

function stripPunctuation(codeLine) {
    codeLine = codeLine.replaceAll("(", " ");
    codeLine = codeLine.replaceAll(")", " ");
    codeLine = codeLine.replaceAll(",", " ");
    codeLine = codeLine.replaceAll("{", " ");
    codeLine = codeLine.replaceAll("}", " ");
    codeLine = codeLine.replaceAll("[", " ");
    codeLine = codeLine.replaceAll("]", " ");

    codeLine = codeLine.replaceAll(";", "");

    return codeLine;
}

function getClosestMatch(codeLine, comparisonLines) {
    var closestMatchLine = "";
    var closestMatchValue = 0;
    for (var cl in comparisonLines) {

        var similarity = stringSimilarity.compareTwoStrings(stripPunctuation(codeLine), stripPunctuation(comparisonLines[cl]));
        if (similarity > closestMatchValue) {
            closestMatchValue = similarity;
            closestMatchLine = comparisonLines[cl];
        }
    }

    // console.log("source: " + codeLine);
    // console.log("best match: " + closestMatchLine);
    // console.log("match value: " + closestMatchValue);

    return {target: codeLine, match: closestMatchLine, score: closestMatchValue};
}

// I'm going to start by just trying to get non-print non-comment related activity and then worry about whether it's truly new or modified next.
function countModifiedLines(patch) {

    // this is assuming that the current print and comment info apply to this patch. Should be true now, but reordering things could make a mess.

    var addedLines = [];
    var removedLines = [];
    var changedLines = [];

    var numHunks = patch['hunks'].length;
    var lines = [];

    // iterate through the hunks in this patch(diff)
    for(var h = 0; h < numHunks; h++) {

        // get the lines from the current hunk
        lines = patch['hunks'][h]['lines'];

        for (var line in lines) {
            if (isModifiedStatement(lines[line])) {
                var stmt = trimStatement(lines[line]);

                if ((stmt.length> 1) && !printStatements.includes(stmt) && !(commentsAdded.includes(stmt) && !(commentsRemoved.includes(stmt)))) {
                    if (lines[line].startsWith("+")) {
                        addedLines.push(stmt);
                    } 
                }
            }
        }

        // this happens separately to avoid ordering issues
        for (var line in lines) {
            if (isModifiedStatement(lines[line])) {
                var stmt = trimStatement(lines[line]);

                if ((stmt.length> 1) && !printStatements.includes(stmt) && !(commentsAdded.includes(stmt) && !(commentsRemoved.includes(stmt)))) {
                    if (lines[line].startsWith("-")) {
                        // we want to avoid double counting 
                        if (!addedLines.includes(stmt)) {
                            removedLines.push(stmt);
                        }
                    }
                }
            }
            
        }
    }

    var linesToRemoveFromAdded = [];
    var linesToRemoveFromRemoved = [];
    for (var rl in removedLines) {
        var matchInfo = getClosestMatch(removedLines[rl], addedLines);

        // this is a modified line
        if (matchInfo['score'] > .65) {
            const isMatch = (element) => {
                // console.log("element "+ element);
                // console.log("line " + this);
                return (element == this);
            }

            // get the index of the match in addedLines
            var idx = addedLines.findIndex(line => line == matchInfo["match"]);

            // remove from addedLines
            linesToRemoveFromAdded.push(idx);

            // get the index of target in removedLines
            idx = removedLines.findIndex(line => line == matchInfo["target"]);

            // remove from removedLines
            // removedLines.splice(idx,idx);
            linesToRemoveFromRemoved.push(idx);

            // console.log("removed " + matchInfo["match"] + " " + idx);
            changedLines.push(matchInfo["match"]);


        }
    }

    // pull out the modified ones from the added and removed lists to avoid double counting.
    var newAddedLines = [];
    for (var line in addedLines) {
        if (!(linesToRemoveFromAdded.includes(parseInt(line)))) {
            newAddedLines.push(addedLines[line]);
        } 
    }
    addedLines = newAddedLines;

    var newRemovedLines = [];
    for (var line in removedLines) {
        if (!(linesToRemoveFromRemoved.includes(parseInt(line)))) {
            newRemovedLines.push(removedLines[line]);
        } 
    }
    removedLines = newRemovedLines;

    var html = "<br> Added Lines (" + addedLines.length + "):\n<ul>";
    for (var s in addedLines) {
        var text = addedLines[s].replaceAll("<", "&lt;").replace(">", "&gt;");
        html += "<li><pre>" + text + "</pre></li>"
    }
    html += "</ul>"

    html += "<br> Changed Lines (" + changedLines.length + "):\n<ul>";
    for (var s in changedLines) {
        var text = changedLines[s].replaceAll("<", "&lt;").replace(">", "&gt;");
        html += "<li><pre>" + text + "</pre></li>"
    }
    html += "</ul>"
    
    html += "<br> Removed Lines (" + removedLines.length + "):\n<ul>";
    for (var s in removedLines) {
        var text = removedLines[s].replaceAll("<", "&lt;").replace(">", "&gt;");
        html += "<li><pre>" + text + "</pre></li>"
    }
    html += "</ul>"
    return {count: removedLines.length, html: html};

}




