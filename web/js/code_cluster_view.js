var intervalStart = 3526
var intervalEnd = 3659

var clusters = {}

$( document ).ready(function() {
    console.log( "ready!" );
    getCodeInInterval(intervalStart,intervalEnd);
    getAllCodeIntervals();
})

function updateCodeDisplay(responses, i) {
    var codeState= responses[i]["code_text"];
    var time = responses[i]["time"]

    var lines = codeState.split("/\r?\n/");

    if(i > 0){
        var prevCodeState = responses[i-1]["code_text"];
        var prevTime = responses[i-1]["time"]

        var prevLines =  prevCodeState.split("/\r?\n/");
            
        var patch = Diff.structuredPatch(prevTime + "s", time + "s", prevCodeState, codeState, null, null, [ignorewhitespace=true]) 
        
        var numHunks = patch['hunks'].length;
        d3.select("#code_container").html(null);

        for(var h = 0; h < numHunks; h++) {
            var patchLines = patch['hunks'][h]['lines'];
            var oldStart = patch['hunks'][h]['oldStart'];
            var oldLines = patch['hunks'][h]['oldLines']
            var newStart = patch['hunks'][h]['newStart']
            var newLines = patch['hunks'][h]['newLines']
            
            // console.log("\n\n");
            // console.log("OLD START " + oldStart);
            // console.log("OLD LINES " + oldLines);
            // console.log("NEW START " + newStart);
            // console.log("NEW LINES " + newLines);

            for (var line in patchLines){
                console.log(lines[line])
            }

            d3.select('#code_container')
            .append('table')
            .selectAll('tr')
            .data(patchLines)
            .enter()
            .append('tr')
            .append('td')
            .append('pre')
            .text(function(d){
            return d;
            })
            .style("background-color", function(d) {
                if (d.startsWith("-")) {
                    return "pink"
                } else if (d.startsWith("+")) {
                    return "lightgreen"
                } else {
                    return "white"
                }
            });

            console.log("time is " + time + " " + i)
            }

        
    } else {

        d3.select("#code_container").html(null);

        d3.select('#code_container')
        .append('table')
        .selectAll('tr')
        .data(lines)
        .enter()
        .append('tr')
        .append('td')
        .append('pre')
        .text(function(d){
        return d;
        })
        .style("background-color", "aliceblue");

        console.log("time is " + time + " " + i)
    }

}


// todo: would like to not have a border around the navigation tables
function updateSelection(responses) {

    d3.select("#carousel_container").html(null);

    d3.select('#carousel_container')
    .append('table')
    .append('tr')
    .selectAll('td')
    .data(responses)
    .enter()
    .append('td')
    .text(function(d, i){
      return i + 1;
    })
    .on('click', function(d,i){ 
        updateCodeDisplay(responses, i);
    });

}

function updateClusters() {
    d3.select("#cluster_list").html(null);

    d3.select('#cluster_list')
    .append('table')
    .append('tr')
    .selectAll('td')
    .data(clusters)
    .enter()
    .append('td')
    .text(function(d, i){
      return d.startTime + " - " + d.endTime;
    })
    .attr("bgcolor", function(d,i) {
        if (d.startTime == intervalStart) {
            return "powderblue"
        } else {
            return "aliceblue"
        }
    })
    .on('click', function(d,i){ 
        // updateCodeDisplay(d);
        console.log("show cluster")
        intervalStart = d.startTime;
        intervalEnd = d.endTime;
        getCodeInInterval(d.startTime,d.endTime);
        updateClusters();
    });
}


function getCodeInInterval(start, stop) {
    
    $.get('http://localhost:3000/intervalCode', { begin: start, end : stop}, 
        function(response){
            codeEntries = response;
            console.log("0th entry" + JSON.stringify(codeEntries[0]));
            
            updateCodeDisplay(codeEntries, 0);
            updateSelection(codeEntries);
    });

}

function processCSV(csv) {
   clusters = csv;
   updateClusters();
}



function getAllCodeIntervals() {
    d3.csv("data/codeCluster_gitClassification.csv", processCSV);
}