var eventListsByKey = {} 
var eventTimes = []

var codeChangeTimes = {}


function initializeHistoryOverview(codeEntries) {

    // This sorts the code changes into a matrix by filename
    for (codeEntry in codeEntries) {

        // let's get the name of the file first
        var notes = codeEntries[codeEntry]['notes'];
        var fileName = notes.slice(6,-1).trim()
        var time = codeEntries[codeEntry]['time'];

        if ( !(fileName in codeChangeTimes) ) {
            codeChangeTimes[fileName] = [];
            console.log("added " + fileName);
        }

        codeChangeTimes[fileName].push(time);
        // console.log(codeEntry + " " + fileName + ": " + codeChangeTimes[fileName])
    }

    createEventsListByFile();

    console.log("eventTimes: " + eventTimes);
}

function displayHistoryOverview() {

    d3.select('#code_overview')
    .append('table')
    .selectAll('tr')
    .data(d3.values(eventListsByKey))
    .enter()
    .append('tr');

    d3.select("#code_overview")
    .selectAll("table")
    .selectAll("tr")
    .data(d3.values(eventListsByKey))
    .selectAll("td")
    .data(function(d, i) { 
        // console.log("selected line is " + d + " " + d3.keys(eventListsByKey)[i])
        return d; 
    })
    .enter()
    .append('td')
    .text(function(d, i) { return (d.text) ; }) // d is testData[i]
    .attr("id", function(d) {
        return(d.key + ";" + d.idx + ";" + d.time);
    })
    .on('click', function(d,i){ 
        // need to figure out which file this is.
        // console.log("selected element is " + d + " with id =" + this.id);
        generateCodeDisplay(codeEntries, i, this.id, d.text);
    });
}


function moreEventsExist(indices) {
    for (indexPair in indices) {
        if (indices[indexPair][0] < indices[indexPair][1]) {
            return true;
        } 
    }
    return false;
}

// needs codeChangeTimes
function getNextTime(indices) {
    minTime = Infinity;
    minKeyTime = {}
    for (indexPair in indices) {
        // console.log("indexPair: " + JSON.stringify(indexPair) + " " + JSON.stringify(indices));
        var nxtIdx = indices[indexPair][0];

        // if we haven't run out of data for this file
        if (nxtIdx < indices[indexPair][1]) {

            if (codeChangeTimes[indexPair][nxtIdx]< minTime) {
                // console.log("\tMINTIME " + minTime + " -> " +  codeChangeTimes[indexPair][nxtIdx] );
                minTime = codeChangeTimes[indexPair][nxtIdx]
            }

            minKeyTime[indexPair] = codeChangeTimes[indexPair][nxtIdx]
        } else {
            minKeyTime[indexPair] = codeChangeTimes[indexPair][indices[indexPair][1]]
        }
    }

    // console.log("returning minTime = " + minTime + " minKeyTime = " + JSON.stringify(minKeyTime));
    return [minTime, minKeyTime];
    
}


function createEventsListByFile() {
    var indices = {}
    for (key in codeChangeTimes) {

        // we're keeping a current index and a length for each of the file events lists.
        indices[key] = [0,codeChangeTimes[key].length];
    }

    eventListsByKey = {} // this is an attempt to move to a data structure that's more consistent with the matrix from the example
    eventTimes = []


    // while (moreEventsExist(indices)) {
    for (var i = 0; i < 61; i++) {
        var ret = getNextTime(indices);
        

        var nextTime = ret[0];

        // object for each time approach
        var activityAtTime = {}
        activityAtTime['time'] = nextTime;

        // events list approach
        eventTimes.push(nextTime); // record the next time


        for (key in ret[1]) {

            // object for each time
            if (ret[1][key] == nextTime) {
                activityAtTime[key] = true;
                // console.log("next time " + indices[key][0]);
                indices[key][0] = indices[key][0] + 1;
            } else {
                activityAtTime[key] = false;
            }

            if (!(key in eventListsByKey)) { 
                eventListsByKey[key] = [] // make an array for each key
            }

            // this is a redundant if statement to record the eventsByKey data
            if (ret[1][key] == nextTime) {
                eventListsByKey[key].push({text:"+", key: key, idx: (eventListsByKey[key].length), time: (eventTimes[eventListsByKey[key].length])} );
                // console.log("text: +" + key + " " +  (eventListsByKey[key].length) + " " + (eventTimes[eventListsByKey[key].length]));
                
                // indices[key][0] = indices[key][0] + 1; // this is currently done by the other if
            } else {
                eventListsByKey[key].push({text:"-", key: key, idx: (eventListsByKey[key].length), time: (eventTimes[eventListsByKey[key].length])});
            }
        }
        // console.log(moreEventsExist(indices) + JSON.stringify(activityAtTime));
    }
    // console.log(eventListsByKey);
}