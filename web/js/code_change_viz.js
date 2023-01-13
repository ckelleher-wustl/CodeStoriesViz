width = 500;
height = 100;

mainData = []
var dataByFileName = {}

function initialize() {

    var fileName = "main.py";
    mainData = _getChangeDataForFilename(fileName);

    // console.log(Object.keys(codeChangeTimes));
    var keys = Object.keys(codeChangeTimes)
    for (key in keys) {
        var fileData = _getChangeDataForFilename(keys[key]);
        dataByFileName[keys[key]] = fileData;

        console.log("key " + keys[key] + " " + fileData.length);

        console.log("FILE: " + keys[key]);
        for (item in fileData){
            console.log("\t" + fileData[item]["time"] +  ": " + fileData[item]["numAdds"] );
        }
    }

    // console.log("allData " + JSON.stringify(dataByFileName));
}

function _getChangeDataForFilename(fileName) {
    var changeTimes = codeChangeTimes[fileName];

    console.log("change times: " + fileName);
    console.log("\t" + JSON.stringify(changeTimes));
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
    var maxWidth = 1200/mainData.length;

    console.log(JSON.stringify(dataByFileName));
    
    var svgContainer = d3.select("#svg_test");

    var currentData = "";

    svgContainer.selectAll("svg")
    .data(d3.entries(dataByFileName))
    .enter()
    .append("svg").attr("width", 1500).attr("height", 50)
    // .append("line")
    // .attr('x1', 0)
    // .attr('y1', 25)
    // .attr('x2', 1200)
    // .attr('y2', 25)
    // .attr('stroke', 'black')

    .selectAll("circle")
    // .data(function(d,i) {
    //     console.log("d is " + d + dataByFileName[d].length);
    //     currentData = d;

    //     // d => (d3.entries(d["grades"]).map(obj => {
    //     //     obj['Name'] = d['Name']
    //     //     return obj;
    //     return(dataByFileName[d]);
    // })
    .data(  d => (d3.entries(d['value']).map(obj => {
             obj['fileName'] = d['key']
             return obj; })) )
    .enter()
    .append('circle')
    .attr('cx', (d, i) => 10 + (maxWidth * i))
    .attr('cy', 25)
    .attr('r', function(d) {
        return 10;
        // var changes = d.numAdds + d.numRemoves;

        // if (changes < 0) {
        //     return 0;
        // } else {
        //     return( 3 + (changes)/150 * (maxWidth) )
        // }
    })
    .attr('fill', function(d) {
        return "lightblue";
        // var proportion = (d.numAdds/(d.numAdds + d.numRemoves))
        // var color = _interpolateColor('pink', 'lightgreen', proportion)
        // return color;
    })
    .on("click", function(d, i) {
        console.log("point " + JSON.stringify(d));

        //  todo: I think to bring this back, I'm going to need to pass the name of the file somehow

        // // look for the previous change to this file, which might not be at the previous eventTime.
        // var idx = i;
        // var prevRecord = {}
        // if (idx >= 0) {
        //     idx-=1;
        //     prevRecord = mainData[idx];

        //     while (mainData[idx].numAdds == -1) {
        //         idx -=1;
        //         prevRecord = mainData[idx];
        //     }
        // }

        // displayCodeChangeSummary(mainData[idx].time, mainData[idx].code_text, d.time, d.code_text);
    });



    // const g = svg.append('g');
    // // const data = d3.range(10).map(() => d3.randomUniform(0, 20)());
    // g.selectAll('circle')
    // .data(mainData)
    // .enter()
    // .append('circle')
    // .attr('cx', (d, i) => 10 + (maxWidth * i))
    // .attr('cy', 50)
    // .attr('r', function(d) {
    //     var changes = d.numAdds + d.numRemoves;

    //     // there's no data for this point
    //     // console.log("changes: " + changes);
    //     if (changes < 0) {
    //         return 0;
    //     } else {
    //         return( 3 + (changes)/150 * (maxWidth) )
    //     }
    // })
    // // } d => (3 + (d.numAdds + d.numRemoves)/150 * (maxWidth-15)) )
    // .attr('fill', function(d) {
    //     var proportion = (d.numAdds/(d.numAdds + d.numRemoves))
    //     var color = _interpolateColor('pink', 'lightgreen', proportion)
    //     return color;
    // })
    // .on("click", function(d, i) {
    //     console.log("point " + d.time + " " + d.numAdds + " " + d.numRemoves);

    //     // look for the previous change to this file, which might not be at the previous eventTime.
    //     var idx = i;
    //     var prevRecord = {}
    //     if (idx >= 0) {
    //         idx-=1;
    //         prevRecord = mainData[idx];

    //         while (mainData[idx].numAdds == -1) {
    //             idx -=1;
    //             prevRecord = mainData[idx];
    //         }
    //     }

    //     displayCodeChangeSummary(mainData[idx].time, mainData[idx].code_text, d.time, d.code_text);
    // });
}

//     const svg = svgContainer.append("svg")
//         .attr("width", 1500)
//         .attr("height", 100);
//     const line = svg.append('line')
//     .attr('x1', 0)
//     .attr('y1', 50)
//     .attr('x2', 1200)
//     .attr('y2', 50)
//     .attr('stroke', 'black');

//     const g = svg.append('g');
//     // const data = d3.range(10).map(() => d3.randomUniform(0, 20)());
//     g.selectAll('circle')
//     .data(mainData)
//     .enter()
//     .append('circle')
//     .attr('cx', (d, i) => 10 + (maxWidth * i))
//     .attr('cy', 50)
//     .attr('r', function(d) {
//         var changes = d.numAdds + d.numRemoves;

//         // there's no data for this point
//         // console.log("changes: " + changes);
//         if (changes < 0) {
//             return 0;
//         } else {
//             return( 3 + (changes)/150 * (maxWidth) )
//         }
//     })
//     // } d => (3 + (d.numAdds + d.numRemoves)/150 * (maxWidth-15)) )
//     .attr('fill', function(d) {
//         var proportion = (d.numAdds/(d.numAdds + d.numRemoves))
//         var color = _interpolateColor('pink', 'lightgreen', proportion)
//         return color;
//     })
//     .on("click", function(d, i) {
//         console.log("point " + d.time + " " + d.numAdds + " " + d.numRemoves);

//         // look for the previous change to this file, which might not be at the previous eventTime.
//         var idx = i;
//         var prevRecord = {}
//         if (idx >= 0) {
//             idx-=1;
//             prevRecord = mainData[idx];

//             while (mainData[idx].numAdds == -1) {
//                 idx -=1;
//                 prevRecord = mainData[idx];
//             }
//         }

//         displayCodeChangeSummary(mainData[idx].time, mainData[idx].code_text, d.time, d.code_text);
//     });
// }
