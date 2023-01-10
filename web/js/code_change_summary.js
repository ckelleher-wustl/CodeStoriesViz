// note this depends on the existence of a div with id "#code_container"' perhaps at some point that should be abstracted away

function displayCodeChangeSummary(prevName, prevCode, currName, currCode) { //responses, i) {

    var lines = currCode.split("/\r?\n/");

    if(prevCode != null){
        
        var prevLines =  prevCode.split("/\r?\n/");
            
        var patch = Diff.structuredPatch(prevName + "s", currName + "s", prevCode, currCode, null, null, [ignorewhitespace=true]) 
        
        var numHunks = patch['hunks'].length;
        d3.select("#code_container").html(null);

        for(var h = 0; h < numHunks; h++) {
            var patchLines = patch['hunks'][h]['lines'];

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