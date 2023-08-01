function searchCode() {

    var searchTerm = $('#searchTerms').val();
    var codeContent = $('.content');

    if (searchTerm) {

        codeContent.each( function() {
            // console.log(typeof(this) + " " +  this.hasAttribute("--end-code"));
            
            if ( typeof(this) == "object" && this.hasAttribute("--end-code")) {
                var endCode = this.getAttribute("--end-code");

                if (endCode) {
                    if (endCode.includes(searchTerm)) {
                        openContent(this, true);
                    } else {
                        openContent(this, false);
                    } 
                }
            } 

        });
    }
    searchBetweenCode();
}

function searchChangedCode() {

    var searchTerm = $('#searchTerms').val();

    var codeContent = $('.content');

    // if we have valid value for search term
    if (searchTerm) {

        // grab the starting / ending code to see whether changes have been made
        var firstResult = null;
        codeContent.each( function() {
            
            if ( typeof(this) == "object" && this.hasAttribute("--end-code") && this.hasAttribute("--start-code")) {
                var startCode = this.getAttribute("--start-code");
                var endCode = this.getAttribute("--end-code");

                // create a diff between the starting and ending code.
                var diff = Diff.createTwoFilesPatch("begin", "end", startCode, endCode ,null,null,{context:10});
                var lines = diff.split("\n");
                
                // iterate throught the lines
                var open = false;
                for (var line in lines) {
                    if (lines[line].includes(searchTerm)) {
                        if (lines[line].startsWith('+') || lines[line].startsWith('-')) {
                            open = true;
                        } 
                    }
                }

                if (open) {
                    // openContent(this, true);
                    // $( "#foo" )[ 0 ];
                    // openChange($(this)[0], true);
                    highlightChange(this, true);
                    if (!firstResult) {
                        firstResult = this;
                    }
                } else {
                    // openChange($(this)[0], false);
                    highlightChange(this, false);
                }
            }
        });

        console.log("firstResult " );
        console.log(firstResult + " " + $(firstResult).prev());
        scrollToElement($(firstResult).prev());
    } else {
        var codeContent = $('.content');
        codeContent.each( function() {
            highlightChange(this, false);
        });
    }

}

function searchBetweenCode() {
    var startingCodeLine = $('#searchStartLine').val();
    var endingCodeLine = $('#searchEndLine').val();;

    var codeContent = $('.content');

    // if we have valid values for both
    if (startingCodeLine && endingCodeLine) {

        // grab the starting / ending code to see whether changes have been made
        codeContent.each( function() {
            
            if ( typeof(this) == "object" && this.hasAttribute("--end-code") && this.hasAttribute("--start-code")) {
                var startCode = this.getAttribute("--start-code");
                var endCode = this.getAttribute("--end-code");

                // if the start and end lines are in the code, then open for now.
                if (endCode.includes(startingCodeLine) && endCode.includes(endingCodeLine)) {
                    // openContent(this, true);

                    var diff = Diff.createTwoFilesPatch("begin", "end", startCode, endCode ,null,null,{context:100});
                    var lines = diff.split("\n");
                    // console.log("diff is " + typeof(diff) + " " + lines.length);

                    var startLineIdx = 0;
                    var endLineIdx = 0;
                    var changes = []
                    for (var line in lines) {
                        if (lines[line].includes(startingCodeLine)) {
                            startLineIdx = parseInt(line);
                        } else if (lines[line].includes(endingCodeLine)) {
                            endLineIdx = parseInt(line);
                        } else if (lines[line].startsWith('+')) {
                            changes.push(parseInt(line));
                        }
                    }

                    var relevantChanges = false;
                    for (var change in changes) {
                        // console.log(change + ": " + changes[change] + typeof(changes[change]) + typeof(startLineIdx));
                        if ((changes[change] > startLineIdx) && (changes[change] < endLineIdx)) {
                            // console.log(startLineIdx + " < " + changes[change] + " < " + endLineIdx + " " +  (changes[change] > startLineIdx) + " " + (changes[change] > endLineIdx));
                            relevantChanges = true;
                        }
                    }

                    if (relevantChanges) {
                        openContent(this, true);
                    } else {
                        openContent(this, false);
                    }

                    // console.log("range is " + startLineIdx + " - " + endLineIdx + " " + changes);

                } else {
                    openContent(this, false);
                } 
            } 

        });
    }
}