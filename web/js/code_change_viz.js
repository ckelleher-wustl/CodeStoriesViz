width = 500;
height = 100;

function initialize() {

    var mainChanges = codeChangeTimes["main.py"];
    console.log(mainChanges);

    var numAdds = 0;
    var numRemoves = 0;
    if (mainChanges.length > 1) {
        for (var i = 1; i < 3; i++) {
            var codeState1I = _getIForTimeAndFile(mainChanges[i-1], "main.py", i-1, codeEntries);
            var codeState1 = codeEntries[codeState1I]["code_text"];
            var codeState1Time = codeEntries[codeState1I]["time"];

            var codeState2I = _getIForTimeAndFile(mainChanges[i], "main.py", i, codeEntries);
            var codeState2 = codeEntries[codeState2I]["code_text"];
            var codeState2Time = codeEntries[codeState2I]["time"];

            var patch = Diff.structuredPatch(codeState1Time + "s", codeState2Time + "s", codeState1, codeState2, null, null, [ignorewhitespace=true]);
            var numHunks = patch['hunks'].length;

            // console.log("Patch: " + patch);
            for(var h = 0; h < numHunks; h++) {
                var lines = patch['hunks'][h]['lines'];

                for (var line in lines) {
                    var currLines = lines[line].trim();
                    if (currLines.length > 1) {
                        console.log("line: " + currLines.length + " " + currLines) ;
                        if (lines[line].startsWith("+")) {
                            numAdds += 1;
                        } else if (lines[line].startsWith("-")) {
                            numRemoves += 1;
                        }
                    }
                }

            }

            console.log("numAdds " + numAdds);
            console.log("numRemoves " + numRemoves);
        }
    }

}

function displayCodeChangeViz() {
    // console.log("events list by key")
    // console.log(eventListsByKey)

    // console.log("code change times")
    // console.log(codeChangeTimes)

    // console.log("eventTimes")
    // console.log(eventTimes)
    
    var svgContainer = d3.select("#svg_test");

    const svg = svgContainer.append("svg");
    const line = svg.append('line')
    .attr('x1', 0)
    .attr('y1', 50)
    .attr('x2', 500)
    .attr('y2', 50)
    .attr('stroke', 'black');

    const g = svg.append('g');
    const data = d3.range(10).map(() => d3.randomUniform(0, 20)());
    g.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d, i) => 25 + 25 * i)
    .attr('cy', 50)
    .attr('r', d => d)
    .attr('fill', 'blue');
}
