width = 500;
height = 100;

mainData = []
var dataByFileName = {}

function initialize() {

    var fileName = "main.py";
    mainData = _getChangeDataForFilename(fileName);

    
    var keys = Object.keys(codeChangeTimes);
    
    for (key in keys) {
        var fileData = _getChangeDataForFilename(keys[key]);
        if (fileData.length > 1) {
            dataByFileName[keys[key]] = fileData;
        }

        // for (item in fileData){
        //     console.log("\t" + fileData[item]["time"] +  ": " + fileData[item]["numAdds"] );
        // }
    }
    console.log(dataByFileName[keys[0]]);

    // console.log("allData " + JSON.stringify(dataByFileName));
}

function _getChangeDataForFilename(fileName) {
    var changeTimes = codeChangeTimes[fileName];

    // console.log("change times: " + fileName);
    // console.log("\t" + JSON.stringify(changeTimes));
    changeData = [];
    
    //  change this so that we can not draw in time periods where there's no activity
    if (changeTimes.length > 1) {
        changeIndex = 1;

        for (var i = 1; i < eventTimes.length; i++) {
            
            //  initialize the code state info
            var codeState1I = _getIForTimeAndFile(changeTimes[changeIndex-1], fileName, i-1, codeEntries);
            var codeState2I = _getIForTimeAndFile(changeTimes[changeIndex], fileName, i, codeEntries);

            if ((codeState1I != -1) && (codeState2I != -1) ) {

                var codeState1 = codeEntries[codeState1I]["code_text"];
                var codeState1Time = codeEntries[codeState1I]["time"];
            
                var codeState2 = codeEntries[codeState2I]["code_text"];
                var codeState2Time = codeEntries[codeState2I]["time"];

                // calculate difference patch
                var patch = Diff.structuredPatch(codeState1Time + "s", codeState2Time + "s", codeState1, codeState2, null, null, [ignorewhitespace=true]);
                var numHunks = patch['hunks'].length;

                var numAdds = 0;
                var numRemoves = 0;

                for(var h = 0; h < numHunks; h++) {
                    var lines = patch['hunks'][h]['lines'];

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
                    }

                    changeData.push({time: codeEntries[codeState2I]["time"], numAdds: numAdds, numRemoves: numRemoves, code_text: codeState2})
                    changeIndex += 1;
                } else {
                    changeData.push({time:codeEntries[i]["time"], numAdds: -1, numRemoves: -1, code_text: "n/a"})
                }
            } else {
                // there are no indices for these times
                changeData.push({time:codeEntries[i]["time"], numAdds: -1, numRemoves: -1, code_text: "n/a"})
            }
        }

        // console.log("main data:" + JSON.stringify(changeData));
    }

    return changeData;
}

function _interpolateColor(color1, color2, percentage) {
    var interpolate = d3.interpolate(color1, color2);
    return interpolate(percentage);
}


function displayCodeChangeViz() {
    var maxWidth = 1200/mainData.length;  // todo - fix this
    var svgContainer = d3.select("#svg_test");

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
    .attr('cx', (d, i) => 10 + (maxWidth * i))
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
        if (idx >= 0) {
            idx-=1;
            prevRecord = dataByFileName[d.fileName][idx];

            console.log("prev data" + JSON.stringify(prevRecord));

            while (dataByFileName[d.fileName].numAdds == -1) {
                idx -=1;
                prevRecord = dataByFileName[d.fileName][idx];
            }
        }

        var svgContainer = d3.select("#svg_test");
        var msg = svgContainer.select("p");
        msg.text(d.fileName + ": " + dataByFileName[d.fileName][idx].time + " - " + d.value.time);
        

        displayCodeChangeSummary(dataByFileName[d.fileName][idx].time, dataByFileName[d.fileName][idx].code_text, d.value.time, d.value.code_text);
    });


    svgContainer.selectAll("svg")
    .append("line")
    .attr('x1', 0)
    .attr('y1', 15)
    .attr('x2', 1200)
    .attr('y2', 15)
    .attr('stroke', 'gray');
}

