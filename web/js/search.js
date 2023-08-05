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

function searchFinalCode() {
    var searchTerm = $('#codeSearchTerms').val();
    console.log("searching final code for " + searchTerm);

    $('.tab-item').each( function() {
        var filename = this.textContent;
        var code = this.getAttribute("code");

        if ((searchTerm) && code.includes(searchTerm)) {
            console.log(searchTerm + "found in " + filename + ": " + code.substring(0, 15));
            $(this).addClass("highlight");
        } else {
            $(this).removeClass("highlight");
        }
    })

    highlightFinalCode(); 
}

function highlightFinalCode() {
    // console.log("highlightFinalCode");
  
    var searchTerm = $('#codeSearchTerms').val();
    // get all of the code elements
    $('.code').each(function () {
        var code = this.innerHTML;
        // remove any previously highlighted code 
        code = code.replaceAll('<span class="highlight">', ""); 
        code = code.replaceAll("</span>", "");

        if ((searchTerm) && code.includes(searchTerm)) {
            // console.log("RELEVANT " + code);
            code = code.replaceAll(searchTerm, "<span class='highlight'>" + searchTerm + "</span>");
        }

        this.innerHTML = code;
        // console.log(code);
    })
  }

function searchChangedCode() {

    var searchTerm = $('#searchTerms').val();
    var codeContent = $('.content');
    var button = codeContent.prev();

    // console.log(button);

    // if we have valid value for search term
    if (searchTerm) {

        // grab the starting / ending code to see whether changes have been made
        var firstResult = null;
        codeContent.each( function() {
            
            if ( typeof(this) == "object" && this.hasAttribute("--end-code") && this.hasAttribute("--start-code")) {
                var startCode = this.getAttribute("--start-code");
                var endCode = this.getAttribute("--end-code");

                // create a diff between the starting and ending code.
                var diff = Diff.createTwoFilesPatch("begin", "end", startCode, endCode ,null,null,{context:10, ignoreWhitespace: true});
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
                    highlightChange(this, true);
                    if (!firstResult) {
                        firstResult = this;
                    }
                } else {
                    // openChange($(this)[0], false);
                    highlightChange(this, false);
                }
            } else {
                //  if it's a change without code changes or a search then we want to unhighlight.
                highlightChange(this, false);
            }
        });

        button.each( function () {
            var buttonText = $(this).html();
            // console.log(searchTerm + " in " + buttonText + " " +  buttonText.includes(searchTerm));

            if (buttonText.includes(searchTerm)) {
                // console.log(searchTerm + " in " + buttonText);
                highlightChange($(this).next(), true);
                if(!firstResult) {
                    firstResult = this;
                }
            }
        })

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

                    var diff = Diff.createTwoFilesPatch("begin", "end", startCode, endCode ,null,null,{context:10, ignoreWhitespace:true});
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

function highlightCode(content) {

    if (!(content  instanceof jQuery)) {
        content = $(content);
    }

    var searchTerm = $('#searchTerms').val();
    
    //  if we have a current search term, highlight code matching it
    if (searchTerm) {

        const lines = $("span:contains('" + searchTerm + "')");

        // console.log("Matching lines ");
        // console.log(lines);

        lines.each(function() {
            var line = $(this).html(); 
            line = line.replaceAll(searchTerm, "<span class='highlight'>" + searchTerm + "</span>");
            $(this).html(line);
        });
    }
}