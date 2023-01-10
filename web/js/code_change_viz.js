width = 500;
height = 100;

mainData = []

function initialize() {

    var mainChanges = codeChangeTimes["main.py"];
    console.log(mainChanges);

    if (mainChanges.length > 1) {
        for (var i = 1; i < mainChanges.length; i++) {
            var codeState1I = _getIForTimeAndFile(mainChanges[i-1], "main.py", i-1, codeEntries);
            var codeState1 = codeEntries[codeState1I]["code_text"];
            var codeState1Time = codeEntries[codeState1I]["time"];

            var codeState2I = _getIForTimeAndFile(mainChanges[i], "main.py", i, codeEntries);
            var codeState2 = codeEntries[codeState2I]["code_text"];
            var codeState2Time = codeEntries[codeState2I]["time"];

            var patch = Diff.structuredPatch(codeState1Time + "s", codeState2Time + "s", codeState1, codeState2, null, null, [ignorewhitespace=true]);
            var numHunks = patch['hunks'].length;

            var numAdds = 0;
            var numRemoves = 0;

            // console.log("Patch: " + patch);
            for(var h = 0; h < numHunks; h++) {
                var lines = patch['hunks'][h]['lines'];

                for (var line in lines) {
                    var currLines = lines[line].trim();
                    if (currLines.length > 1) {
                        // console.log("line: " + currLines.length + " " + currLines) ;
                        if (lines[line].startsWith("+")) {
                            numAdds += 1;
                        } else if (lines[line].startsWith("-")) {
                            numRemoves += 1;
                        }
                    }
                }

            }

            console.log("numAdds " + numAdds);
            console.log("numRemoves " + numRemoves);mainData.push({time: codeEntries[codeState1I]["time"], numAdds: lines.length, numRemoves: 0})

            // store the change info for rendering
            if (i == 1) {
                // this is the initial data point
                mainData.push({time: codeEntries[codeState1I]["time"], numAdds: lines.length, numRemoves: 0})
            }

            mainData.push({time: codeEntries[codeState2I]["time"], numAdds: numAdds, numRemoves: numRemoves})
        }
    }

    // console.log("main data" + JSON.stringify(mainData))

}

// var data = [1, 2, 3, 4, 5];

// var svg = d3.select("body").append("svg")
//   .attr("width", 200)
//   .attr("height", 200);

// var circles = svg.selectAll("circle")
//   .data(data)
//   .enter()
//   .append("circle")
//   .attr({
//       "cx": (d, i) => i * 50 + 25,
//       "cy": 25,
//       "r": d
//     });


function displayCodeChangeViz() {
    var maxWidth = 1500/mainData.length;
    
    var svgContainer = d3.select("#svg_test");

    const svg = svgContainer.append("svg");
    const line = svg.append('line')
    .attr('x1', 0)
    .attr('y1', 50)
    .attr('x2', 1500)
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
        console.log("change count " + changes);
        console.log("maxWidth " + maxWidth);
        console.log((changes)/150 * (maxWidth-15) );

        return( 3 + (changes)/150 * (maxWidth) )
    })
    // } d => (3 + (d.numAdds + d.numRemoves)/150 * (maxWidth-15)) )
    .attr('fill', 'blue');
}
