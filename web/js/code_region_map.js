var codeRegionMaps = {};

function readCSVAsObject(csvFile) {
    $.ajax({
      url: csvFile,
      dataType: "text",
      success: function(data) {
        const csvData = Papa.parse(data, {
          header: true, // Treat the first row as header row
          skipEmptyLines: true // Skip empty lines in the CSV file
        });

        const parsedData = csvData.data;
        // console.log(parsedData); // The CSV data as an array of objects
        addToRegionMap(csvFile, parsedData);
        
      },
      error: function(xhr, textStatus, errorThrown) {
        console.error("Error reading CSV file: ", errorThrown);
      }
    });
  }

// ok so this really needs to change b/c it means that only one 
function loadCodeRegionMaps() {
    // var mapFilenames = ['script.jsLineMap.csv', 'animations.scssLineMap.csv', 'index.htmlLineMap.csv', 'guess.scssLineMap.csv', 'notes.mdLineMap.csv', 'boilerplate.scssLineMap.csv']
    // // var mapFilenames = ['main.pyLineMap.csv']
    var path = 'data/storyStudy/' 

    for (idx in mapFilenames) {
        var filename = mapFilenames[idx];
        readCSVAsObject(path + filename);
    }
}

function addToRegionMap(filename, rawMap) {
    var regionMap = {}
    for (idx in rawMap) {
        var entry = rawMap[idx];
        regionMap[entry["line"]] = {lineID: entry["lineID"], regionID: entry["regionID"]};
        // console.log(entry);
    }

    filename = filename.substring(0, filename.length-11).split("/"); // this returns an array, which isn't what we want
    filename = filename[filename.length-1]; // get the last entry in the array
    codeRegionMaps[filename] = regionMap;
    console.log(codeRegionMaps);
}

function printMaps() {

    for (var key in codeRegionMaps) {
        console.log("KEY: " + key);
        console.log(codeRegionMaps[key]);
        console.log();
    }
}

function getRegionForLine(filename, line) {
    regionMap = codeRegionMaps[filename];
    line = line.replaceAll('"', "'");
    if ((regionMap) && (line in regionMap)) {
        return regionMap[line];
    } else {
        // These seem to be largely things that don't end up in the final state, so it makes sense that there aren't regions for them
        // console.log("trying to find " + line);
        // console.log(regionMap);
        return null;
    }
}