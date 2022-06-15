var width = 500;
var height = 200;

var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

var lastSelected = null;

function selectInterval(d,i) {
    // get start and end
    var start = this.getAttribute("start")
    var end = this.getAttribute("end")

    // document.getElementById("events_text").value = "cluster start: " + start + "\ncluster end: " + end
    showIntervalEvents(start, end)
    showCodeStates(start, end)
    showSearches(start, end)

    // console.log("click!" + this)
    this.setAttribute("stroke", "MediumBlue")
    if (lastSelected != null) {
        lastSelected.setAttribute("stroke", "LightSkyBlue")
    }
    lastSelected = this;
}

function createViz() {
    //Create SVG element
    var svg = d3.select("#svg_container")
    .append("svg")
    .attr("id", "svg_search")
    .attr("width", x)
    .attr("height", height);

    var svg_code = d3.select("#svg_code_container")
    .append("svg")
    .attr("id", "svg_code")
    .attr("width", x)
    .attr("height", height);

    svg_code.append("line")
        .attr("x1", 10)
        .attr("x2", x-100)
        .attr("y1", 50)
        .attr("y2", 50)
        .attr("stroke", "black")
    // .append("svg_code")
    // .attr("width", x)
    // .attr("height", height);

    console.log("page width is " + x);

    //Create line element inside SVG
    svg.append("line")
        .attr("x1", 10)
        .attr("x2", x-100)
        .attr("y1", 50)
        .attr("y2", 50)
        .attr("stroke", "black")

    svg.selectAll("line")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", function(d) {
            return (timeScale(d.time))
        })
        .attr("x2", function(d) {
            console.log("time scale " +  timeScale(2500)); 
            return (timeScale(d.time))
        })
        .attr("y1", 25)
        .attr("y2", 75)
        .attr("stroke", "MediumBlue")
    
}

function createClusters(intervals, svgName) {

    // console.log("create clusters: " + type + intervals);
 
    var svg = d3.select(svgName)

    svg.selectAll("rect")
        .data(intervals)
        .enter()
        .append("rect")
        .attr("x", function(d) {
            return (timeScale(d.startTime))
        })
        .attr("y", 35)
        .attr("width", function(d) {
            // console.log("time" + d.endTime + " " + d.startTime + " " + (d.endTime-d.startTime))
            return (timeScale(d.endTime) - timeScale(d.startTime))
        })
        .attr("height", 30)
        .attr("type", function(d) {
            return d.type
        })
        .attr("fill", function(d) {
            // console.log("type is " + d.type + (d.type === "'search'"))
            if (d.type == "'search'") {
                return "LightSkyBlue"
            } else {
                return "Bisque"
            }
        })
        .attr("start", function(d) {
            return d.startTime
        })
        .attr("end", function(d) {
            return d.endTime
        })
        .on('click', selectInterval)
}


//  I want to adapt the db side to get events btwn begin and end.
function showIntervalEvents(begin, end) {

    console.log("time interval is : " + begin + " - " + end);
    var tableCode = ""

    $.get('http://localhost:3000/', { offset: begin, end: end, order : "ASC"}, 
        function(data){
          for (var key in data) {
            if (data.hasOwnProperty(key)) {
                tableCode = tableCode + data[key]["time"]+ ": " +  data[key]["notes"] + "<br>"
            }
          }
          console.log(tableCode);

        //   var codeString = tableCode.replace("\r?\n|\r", "<br>")
          document.getElementById("evt_content").innerHTML = tableCode
    });           

}

function showCodeStates(begin, end) {
    console.log("time interval is : " + begin + " - " + end);
    var currCode = ""
    var codeHeader = ""

    $.get('http://localhost:3000/intervalCode/', { begin: begin, end: end, order : "ASC"}, 
        function(data){

            setIntervalCodeData(begin, end, data);

    });       

}

function showSearches(begin, end) {
    console.log("time interval is : " + begin + " - " + end);
    var currCode = ""
    var codeHeader = ""

    $.get('http://localhost:3000/intervalSearches/', { begin: begin, end: end, order : "ASC"}, 
        function(data){

            setIntervalSearchData(begin, end, data);

    });       

}


var data = null;
var clusters = null;
var codeClusters = null;
var gaps = null;
var minTime = 0;
var maxTime = 0;
var timeScale = null;
d3.csv("../data/searchEvts.csv", function(d) {
    data = d;
    minTime = data[0].time;
    maxTime = data[data.length-1].time;

    console.log("time span " + minTime + " " + maxTime);
    // create a time scale
    timeScale = d3.scaleLinear()
    .domain([minTime, maxTime])
    .range([10, x-100]);

    console.log('time ' + timeScale(3400))

    createViz();

    d3.csv("../data/allClusters.csv", function(d) {
        clusters = d;
        console.log("CLUSTERS: " + clusters);
        createClusters(clusters, "#svg_search");
    })

    d3.csv("../data/codeCluster.csv", function(d) {
        codeClusters = d;
        console.log("CODE CLUSTERS: " + codeClusters);
        createClusters(codeClusters, "#svg_code");
    })

})





