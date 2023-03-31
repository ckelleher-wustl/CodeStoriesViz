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



function countPrints(patch) { 
    var printStatements = [] 
    
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

function countComments(patch) { 
    var commentsAdded = [];
    var commentsRemoved = [];
    
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
                        commentsAdded.push(stmt);
                    } else if ((lines[line].trim()[0] == "-") && !(commentsRemoved.includes(stmt))) {
                        // console.log("\tappend:" + stmt + (printStatements.includes("stmt")) + printStatements.length);
                        commentsRemoved.push(stmt);
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




