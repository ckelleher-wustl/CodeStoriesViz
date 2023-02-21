width = 500;
height = 100;

// mainData = []
var dataByFileName = {}

function initialize() {
    
    var keys = Object.keys(codeChangeTimes);
    
    for (key in keys) {
        var fileData = _getChangeDataForFilename(keys[key]);
        // console.log("filedata for " + keys[key] + " is " + JSON.stringify(fileData));
        if ((fileData.length > 1) && (keys[key] != "webData")) {
            // console.log("adding data for " + keys[key] + fileData.length);
            dataByFileName[keys[key]] = fileData;
        } else {
            // console.log("filtering data for " + keys[key]);
        }
    }

    // removing clusters for now
    d3.csv("../data/codeCluster_wordle_byFile.csv", function(data) {
        // for (var i = 0; i < data.length; i++) {
        //     console.log(data[i]);
        // }

        displayCodeClusterViz(data);
    });

    // var tI = getIndexForTime(16112);
    // console.log("16112 : " + tI);

}


function _getChangeDataForFilename(fileName) {
    // console.log("getting change data for " + fileName);
    var changeTimes = codeChangeTimes[fileName];

    // console.log("change times: " + fileName);
    // console.log("\t" + JSON.stringify(changeTimes));
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
                
                // console.log(fileName + " code interval: " + codeState1Time + " - " + codeState2Time);
                // console.log("codeState1: " + codeState1);
                // console.log("codeState2: " + codeState2);

                // calculate difference patch
                var patch = Diff.structuredPatch(codeState1Time + "s", codeState2Time + "s", codeState1, codeState2, null, null, [ignorewhitespace=true]);
                var numHunks = patch['hunks'].length;

                var numAdds = 0;
                var numRemoves = 0;

                var lines = [];
                for(var h = 0; h < numHunks; h++) {
                    lines = patch['hunks'][h]['lines'];

                    for (var line in lines) {
                        var currLines = lines[line].trim();
                        if (currLines.length > 1) {
                            if (lines[line].startsWith("+")) {
                                numAdds += 1;
                            } else if (lines[line].startsWith("-")) {
                                numRemoves += 1;
                            }
                        }
                    }
                }

                if (codeState2Time == eventTimes[i]) {
                    // store the change info for rendering
                    if (changeIndex == 1) {
                        // this is the initial data point
                        changeData.push({time: codeEntries[codeState1I]["time"], numAdds: lines.length, numRemoves: 0, code_text: codeState1})
                        // console.log("adding in initial " + codeEntries[codeState1I]["time"]);
                    }

                    changeData.push({time: codeEntries[codeState2I]["time"], numAdds: numAdds, numRemoves: numRemoves, code_text: codeState2})
                    changeIndex += 1;
                    // console.log("adding entry with changes " + codeEntries[codeState2I]["time"]);
                } else { 
                    changeData.push({time:codeEntries[i]["time"], numAdds: -1, numRemoves: -1, code_text: "n/a"});

                    // console.log("codeState2Time == eventTimes[i]" + codeState2Time + " = " + eventTimes[i]);
                    // console.log("entry with no changes " + eventTimes[i]);
                }
            } else {
                // there are no indices for these times
                changeData.push({time:codeEntries[i]["time"], numAdds: -1, numRemoves: -1, code_text: "n/a"})

                // console.log("CAN'T FIND: " + changeTimes[changeIndex-1] + "( " + codeState1I + " ) - " + changeTimes[changeIndex] + "( " + codeState2I + " )");
            }
        }

        // console.log("main data:" + JSON.stringify(changeData));
    }

    // console.log("eventTimes  " + JSON.stringify(eventTimes));
    // console.log("changeData for " + fileName +  " "  + JSON.stringify(changeData));
    return changeData;
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
        // console.log("d " + JSON.stringify(d));
        var startPos = getIndexForTime(d.startTime);
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

    // console.log("dataByFileName " + JSON.stringify(d3.entries(dataByFileName)) );
    // var entries = d3.entries(dataByFileName);
    // for (entry in d3.entries(dataByFileName)) {
    //     // console.log(entries[entry]["key"] );

    //     // + " " + JSON.stringify(entries[entry]["value"])
    //     var values = entries[entry]["value"];
    //     for (value in values) {
    //         if (values[value]["numAdds"] != -1){
    //             console.log("\t" + values[value]["time"] + " " +values[value]["numAdds"]);
    //         }
    //     }
    // }

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
        var changes = d.value.numAdds + d.value.numRemoves;

        if (changes < 0) {
            return 0;
        } else {
            return( 3 + (changes)/150 * (maxWidth) )
        }
    })
    .attr('fill', function(d) {
        var proportion = (d.value.numAdds/(d.value.numAdds + d.value.numRemoves))
        var color = _interpolateColor('pink', 'lightgreen', proportion)
        return color;
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

            while ((prevRecord.numAdds == -1) && (idx > 0)) {
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

