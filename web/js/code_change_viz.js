width = 500;
height = 100;

function displayCodeChangeViz() {
    console.log("events list by key")
    console.log(eventListsByKey)

    console.log("eventTimes")
    console.log(eventTimes)
    
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
