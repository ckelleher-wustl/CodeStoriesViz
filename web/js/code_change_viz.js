width = 500;
height = 100;

mainData = []

function initialize() {

    var mainChanges = codeChangeTimes["main.py"];
    console.log("Main Changes: " + mainChanges);
    console.log("All Event Times: " + eventTimes);

    
    //  change this so that we can not draw in time periods where there's no activity
    if (mainChanges.length > 1) {
        changeIndex = 1;
        
        // for (var i = 1; i < mainChanges.length; i++) {
        for (var i = 1; i < eventTimes.length; i++) {
            
            //  initialize the code state info
            var codeState1I = _getIForTimeAndFile(mainChanges[changeIndex-1], "main.py", i-1, codeEntries);
            var codeState1 = codeEntries[codeState1I]["code_text"];
            var codeState1Time = codeEntries[codeState1I]["time"];

            var codeState2I = _getIForTimeAndFile(mainChanges[changeIndex], "main.py", i, codeEntries);
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
                    mainData.push({time: codeEntries[codeState1I]["time"], numAdds: lines.length, numRemoves: 0})
                }

                mainData.push({time: codeEntries[codeState2I]["time"], numAdds: numAdds, numRemoves: numRemoves})
            } else {
                mainData.push({time:codeEntries[i]["time"], numAdds: -1, numRemoves: -1})
            }
        }

        console.log("main data:" + mainData);
        console.log("main changes:" + mainChanges);
    }
}

    //     for (var i = 1; i < mainChanges.length; i++) {

    //         //  initialize the code state info
    //         var codeState1I = _getIForTimeAndFile(mainChanges[i-1], "main.py", i-1, codeEntries);
    //         var codeState1 = codeEntries[codeState1I]["code_text"];
    //         var codeState1Time = codeEntries[codeState1I]["time"];

    //         var codeState2I = _getIForTimeAndFile(mainChanges[i], "main.py", i, codeEntries);
    //         var codeState2 = codeEntries[codeState2I]["code_text"];
    //         var codeState2Time = codeEntries[codeState2I]["time"];

    //         // calculate difference patch
    //         var patch = Diff.structuredPatch(codeState1Time + "s", codeState2Time + "s", codeState1, codeState2, null, null, [ignorewhitespace=true]);
    //         var numHunks = patch['hunks'].length;

    //         var numAdds = 0;
    //         var numRemoves = 0;

    //         for(var h = 0; h < numHunks; h++) {
    //             var lines = patch['hunks'][h]['lines'];

    //             for (var line in lines) {
    //                 var currLines = lines[line].trim();
    //                 if (currLines.length > 1) {
    //                     if (lines[line].startsWith("+")) {
    //                         numAdds += 1;
    //                     } else if (lines[line].startsWith("-")) {
    //                         numRemoves += 1;
    //                     }
    //                 }
    //             }
    //         }

    //         // store the change info for rendering
    //         if (i == 1) {
    //             // this is the initial data point
    //             mainData.push({time: codeEntries[codeState1I]["time"], numAdds: lines.length, numRemoves: 0})
    //         }

    //         mainData.push({time: codeEntries[codeState2I]["time"], numAdds: numAdds, numRemoves: numRemoves})
    //     }
    // }



function _interpolateColor(color1, color2, percentage) {
    var interpolate = d3.interpolate(color1, color2);
    return interpolate(percentage);
}


function displayCodeChangeViz() {
    var maxWidth = 1200/mainData.length;
    
    var svgContainer = d3.select("#svg_test");

    const svg = svgContainer.append("svg")
        .attr("width", 1500)
        .attr("height", 200);
    const line = svg.append('line')
    .attr('x1', 0)
    .attr('y1', 50)
    .attr('x2', 1200)
    .attr('y2', 50)
    .attr('stroke', 'black');

    const g = svg.append('g');
    // const data = d3.range(10).map(() => d3.randomUniform(0, 20)());
    g.selectAll('circle')
    .data(mainData)
    .enter()
    .append('circle')
    .attr('cx', (d, i) => 10 + (maxWidth * i))
    .attr('cy', 50)
    .attr('r', function(d) {
        var changes = d.numAdds + d.numRemoves;
        // console.log("change count " + changes);
        // console.log("maxWidth " + maxWidth);
        // console.log((changes)/150 * (maxWidth) );

        return( 3 + (changes)/150 * (maxWidth) )
    })
    // } d => (3 + (d.numAdds + d.numRemoves)/150 * (maxWidth-15)) )
    .attr('fill', function(d) {
        var proportion = (d.numAdds/(d.numAdds + d.numRemoves))
        var color = _interpolateColor('pink', 'lightgreen', proportion)
        return color;
    });
}
