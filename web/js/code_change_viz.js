width = 500;
height = 100;

var dataByFileName = {}

function initialize() {
    
    var keys = Object.keys(codeChangeTimes);
    
    var totalPrint = 0;

    var totalCommentAdds = 0;
    var totalCommentRemovals = 0;

    var totalLineAdds= 0;
    var totalLineChanges = 0;
    var totalLineRemovals = 0;

 
    for (key in keys) {

        // changeData.push({time: codeState1Time, print: printInfo["count"], commentAdds: commentInfo["countAdd"], commentRemoves: commentInfo["countRemoved"], 
        //                 lineAdd: modInfo["addcount"], lineChange: modInfo["changecount"], lineRemoves: modInfo["removecount"], code_text: codeState1});


        var fileData = _getChangeDataForFilename(keys[key]);
        // console.log("filedata for " + keys[key] + " is " + JSON.stringify(fileData));
        if ((fileData.length > 1) && (keys[key] != "webData") && (!keys[key].includes("/dist/"))) {
            console.log("adding data for " + keys[key] + fileData.length);
            dataByFileName[keys[key]] = fileData;

            console.log("print", "commentAdds", "commentRemovals", "lineAdd", "lineChange", "lineRemoves");

            for (var data in fileData) {
                // console.log(JSON.stringify(fileData[data]));
                if (fileData[data]["time"] > 0 ) {

                    console.log(fileData[data]["print"], fileData[data]["commentAdds"], fileData[data]["commentRemoves"], fileData[data]["lineAdd"], 
                        fileData[data]["lineChange"], fileData[data]["lineRemoves"]);

                    totalPrint += fileData[data]["print"];

                    totalCommentAdds += fileData[data]["commentAdds"];
                    totalCommentRemovals += fileData[data]["commentRemoves"];

                    totalLineAdds += fileData[data]["lineAdd"];
                    totalLineChanges += fileData[data]["lineChange"];
                    totalLineRemovals += fileData[data]["lineRemoves"];

                    // if ((fileData[data]["numAdds"] > 0) || (fileData[data]["numRemovals"] > 0)) {
                    //     if (fileData[data]["printAdds"] > 0) totalPrintAdds += fileData[data]["printAdds"];
                    //     if (fileData[data]["commentAdds"] > 0) totalCommentAdds += fileData[data]["commentAdds"];

                    //     if (fileData[data]["printRemovals"] > 0) totalPrintRemovals += fileData[data]["printRemovals"];
                    //     if (fileData[data]["commentRemovals"] > 0) totalCommentRemovals += fileData[data]["commentRemovals"];

                    //     if (fileData[data]["numAdds"] > 0) totalLineAdds += fileData[data]["numAdds"];
                    //     if (fileData[data]["numRemoves"] > 0) totalLineRemovals += fileData[data]["numRemoves"];

                    //     totalCodeChanges += 1;
                    // }

                    
                }
            }

            console.log(totalPrint, totalCommentAdds, totalCommentRemovals, totalLineAdds, 
                        totalLineChanges, totalLineRemovals);
            
        } 
        // else {
        //     // console.log("filtering data for " + keys[key]);
        // }

    }

    // print out some stats about coding behavior
    // console.log("printAdds " + totalPrintAdds);
    // console.log("commentAdds " + totalCommentAdds);
    // console.log("printRemovals " + totalPrintRemovals);
    // console.log("commentRemovals " + totalCommentRemovals);
    
    // console.log("lineAdds " + totalLineAdds);
    // console.log("lineRemovals " + totalLineRemovals);

    // console.log("num code changes " + totalCodeChanges );

    // console.log("print adds" + ", " + "comment adds" + ", " + "lines added" + ", " + "print removes" + ", " + "comment removes" + ", " + "line removes" + ", " + "code edits");
    // console.log(totalPrintAdds + ", " + totalCommentAdds + ", " + totalLineAdds + ", " + totalPrintRemovals + ", " + totalCommentRemovals + ", " + totalLineRemovals + ", " + totalCodeChanges);

    // removing clusters for now
    // d3.csv("../data/codeCluster_gitMosaic.csv", function(data) {
    //     // for (var i = 0; i < data.length; i++) {
    //     //     console.log(data[i]);
    //     // }

    //     displayCodeClusterViz(data);
    // });

    // var tI = getIndexForTime(16112);
    // console.log("16112 : " + tI);

}


function _interpolateColor(color1, color2, percentage) {
    var interpolate = d3.interpolate(color1, color2);
    return interpolate(percentage);
}

// there has to be a better way to do this
var fileNum = 0;
var numFiles = 8;
var lastFilename = "hi";

function displayCodeClusterViz(data) {
    console.log("displayCodeCluster " + JSON.stringify(data));
    var maxWidth = 1200/eventTimes.length;  
    var svgContainer = d3.select("#svg_test");

    var newSvg = svgContainer.append("svg");

    fileNum = 0;
    numFiles = 8;
    lastFilename = "";

    newSvg.attr("width", 1500).attr("height", 30 * numFiles)
    .selectAll("rect")
    .data( data )
    .enter()
    .append('rect')
    .attr('x', function(d) {
        console.log("rect d " + JSON.stringify(d));
        var startPos = getIndexForTime(d.startTime);
        console.log("startPos " + startPos);
        return 10 + startPos * maxWidth;
    })
    .attr('y', function(d) {
        console.log("lastFilename = " + lastFilename + " d.fileName = " + d.filename);
        if (lastFilename == "") {
            lastFilename = d.filename;
        }

        if (lastFilename != d.filename) {
            lastFilename = d.filename;
            fileNum += 1;
        }

        return 5 + (30 * fileNum);
    })
    .attr('width', function(d) {
        var startPos = getIndexForTime(d.startTime);
        var endPos = getIndexForTime(d.endTime);

        return (endPos - startPos) * maxWidth;
    })
    .attr('height', 20)
    .attr('stroke', 'black')
    .attr('fill', 'aliceblue')

    .on("click", function(d, i) {

        // // look for the previous change to this file, which might not be at the previous eventTime.
        var startPos = getIndexForTime(d.startTime);
        var endPos = getIndexForTime(d.endTime);

        console.log("d is " + JSON.stringify(d.fileName));
        console.log(startPos + " - " + endPos);

        var fileName = "";
        var keys = Object.keys(dataByFileName);
        for (key in keys) {
            console.log("key" + JSON.stringify(dataByFileName[keys[key]][startPos]));
            var startTimeData = dataByFileName[keys[key]][startPos];
            if (startTimeData["numAdds"] != -1) {
                fileName = keys[key];
            }
        }

        console.log("filename is " + fileName);
        displayCodeChangeSummary(dataByFileName[fileName][startPos].time, dataByFileName[fileName][startPos].code_text, dataByFileName[fileName][endPos].time, dataByFileName[fileName][endPos].code_text);

        var svgContainer = d3.select("#svg_test");
        var msg = svgContainer.select("p");
        msg.text(fileName + ": " + d.startTime + " - " + d.endTime);
    });

    newSvg.append("line")
    .attr('x1', 0)
    .attr('y1', 15)
    .attr('x2', 1200)
    .attr('y2', 15)
    .attr('stroke', 'gray');

}


function displayCodeChangeViz() {
    var maxWidth = 1200/eventTimes.length;  // todo - fix this
    var svgContainer = d3.select("#svg_test");

    // changeData.push({time: codeState1Time, print: printInfo["count"], commentAdds: commentInfo["countAdd"], commentRemoves: commentInfo["countRemoved"], 
    //                     lineAdd: modInfo["addcount"], lineChange: modInfo["changecount"], lineRemoves: modInfo["removecount"], code_text: codeState1});

    svgContainer.selectAll("svg")
    .data(d3.entries(dataByFileName))
    .enter()
    .append("svg").attr("width", 1500).attr("height", 30)

    .selectAll("circle")
    .data(  d => (d3.entries(d['value']).map(obj => {
             obj['fileName'] = d['key'];
             return obj; })) )
    .enter()
    .append('circle')
    .attr('cx', function(d, i) {
        if (d.value.time == 0) {
            return 10;
        } else {
            return 10 + (maxWidth * i);
        }
    })
    .attr('cy', 15)
    .attr('r', function(d) {
        // console.log("d " + JSON.stringify(d));
        var changes = d.value.lineAdd + d.value.lineChange + d.value.lineRemoves + d.value.commentAdds + d.value.commentRemoves;
        console.log("changes " + changes);

        if (changes < 0) {
            return 0;
        } else {
            return( 3 + (changes)/150 * (maxWidth) )
        }
    })
    .attr('fill', function(d) {
        var proportion = ((d.value.lineAdd + d.value.lineChange )/(d.value.lineAdd + d.value.lineChange + d.value.lineRemoves + d.value.commentAdds + d.value.commentRemoves));
        var color = _interpolateColor('pink', 'lightgreen', proportion)
        return color;
        // return 'lightgreen';
    })
    .on("click", function(d, i) {

        // // look for the previous change to this file, which might not be at the previous eventTime.
        var idx = i;
        var prevRecord = {}
        console.log("showing idx " + i + " " + JSON.stringify(d));
        if (idx > 0) {
            idx-=1;
            prevRecord = dataByFileName[d.fileName][idx];

            //  dataByFileName[d.fileName][idx].time

            while ((prevRecord.addcount == -1) && (idx > 0)) {
                idx -=1;
                prevRecord = dataByFileName[d.fileName][idx];
            }
        }


        // this is what updates the header p with the filename and time ranges.
        // todo - add this to the clustering
        var svgContainer = d3.select("#svg_test");
        var msg = svgContainer.select("p");
        // msg.text(d.fileName + ": " + dataByFileName[d.fileName][idx].time + " - " + d.value.time);
        
        console.log("idx " + idx);
        console.log("diff " + d.fileName + ": " + dataByFileName[d.fileName][idx].time + " - " + d.value.time);

        if (d.value.time == 0) {
            console.log(" time is zero")
            displayCodeChangeSummary(0, "", d.value.time, d.value.code_text);
            msg.text(d.fileName + ": " + "0" + " - " + d.value.time);
        } else {
            displayCodeChangeSummary(dataByFileName[d.fileName][idx].time, dataByFileName[d.fileName][idx].code_text, d.value.time, d.value.code_text); 
            msg.text(d.fileName + ": " + dataByFileName[d.fileName][idx].time + " - " + d.value.time);
        }

        // displayCodeChangeSummary(dataByFileName[d.fileName][idx].time, dataByFileName[d.fileName][idx].code_text, d.value.time, d.value.code_text);
    });


    svgContainer.selectAll("svg")
    .append("line")
    .attr('x1', 0)
    .attr('y1', 15)
    .attr('x2', 1200)
    .attr('y2', 15)
    .attr('stroke', 'gray');
}


function _getChangeDataForFilename(fileName) {
    // console.log("getting change data for " + fileName);
    var changeTimes = codeChangeTimes[fileName];

    console.log("change times: " + fileName);
    console.log("\t" + JSON.stringify(changeTimes));
    changeData = [];
    
    //  change this so that we can not draw in time periods where there's no activity
    if (changeTimes.length > 1) {
        changeIndex = 1;

        for (var i = 1; i < eventTimes.length; i++) {

            //  initialize the code state info
            var codeState1I = _getIForTimeAndFile(changeTimes[changeIndex-1], fileName, 0, codeEntries);
            var codeState2I = _getIForTimeAndFile(changeTimes[changeIndex], fileName, 0, codeEntries);

            // console.log("i" + i + " " + changeTimes[changeIndex-1] + " - " + changeTimes[changeIndex] + "; " + codeState1I + " " + codeState2I);

            if ((codeState1I != -1) && (codeState2I != -1) ) {

                var codeState1 = codeEntries[codeState1I]["code_text"];
                var codeState1Time = codeEntries[codeState1I]["time"];
            
                var codeState2 = codeEntries[codeState2I]["code_text"];
                var codeState2Time = codeEntries[codeState2I]["time"];

                // calculate difference patch
                var patch = Diff.structuredPatch(codeState1Time + "s", codeState2Time + "s", codeState1, codeState2, null, null, [ignorewhitespace=true]);

                // console.log(codeState1Time  + "s" + " - " + codeState2Time + "s");

                // analyze print usage
                if(codeState1Time != codeState2Time) {
                    var printInfo = countPrints(patch);
                    var commentInfo = countComments(patch);
                    var modInfo = countModifiedLines(patch);

                    changeData.push({time: codeState1Time, print: printInfo["count"], commentAdds: commentInfo["countAdd"], commentRemoves: commentInfo["countRemoved"], 
                        lineAdd: modInfo["addcount"], lineChange: modInfo["changecount"], lineRemoves: modInfo["removecount"], code_text: codeState1});

                    changeIndex += 1;
                }

            }

            // console.log("main data:" + JSON.stringify(changeData));
        }

        // console.log("eventTimes  " + JSON.stringify(eventTimes));
        // console.log("changeData for " + fileName +  " "  + JSON.stringify(changeData));
    
    }
    return changeData;
}
