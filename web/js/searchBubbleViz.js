function initializeSearchBubble() {
    var svgContainer = d3.select("#svg_search");
    var filename = svgContainer.attr("data");
    console.log("attempting to load " + filename + "...");
    d3.csv(filename, function(d) {
        // console.log("loaded data..." + d)

        displaySearchViz(d);
    });
}

// right now, there's no time correspondence between this and the code line, that would be nice to change.

function displaySearchViz(data) {

    var maxWidth = 1200/eventTimes.length;  // todo - fix this
    var svgContainer = d3.select("#svg_search");

    svgContainer.append("svg").attr("width", 1500).attr("height", 30)
    .selectAll("circle")
    .data(d3.entries(data))
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
    .attr('r', 10)
    .attr('fill', function(d) {

        var navString = d["value"]["filename"];

        if (navString) {
            if (navString.includes("localhost:3000")) {
                return "#E5E7E9"; // light gray - we want to de-emphasize this
            } else if (navString.includes("localhost:9000")) {
                return "#F39C12"
            }

            if (navString.startsWith("search")) {
                return '#154360'; // dark blue
            } else if (navString.startsWith("visit")) {
                return '#2980B9'; // medium blue
            } else if (navString.startsWith("revisit")) {
                return '#A9CCE3'; // lightblue
            }

            console.log("web: " + navString);
        }

        return '#yellow';
    })
    .on("click", function(d, i) {

        console.log("clicked on " + JSON.stringify(d));
        var overviewContainer = d3.select("#search_selected");

        // statsDiv.html(html);
        
        overviewContainer.html("<p>" + JSON.stringify(d));
    });


    svgContainer.selectAll("svg")
    .append("line")
    .attr('x1', 0)
    .attr('y1', 15)
    .attr('x2', 1200)
    .attr('y2', 15)
    .attr('stroke', 'gray');
}
