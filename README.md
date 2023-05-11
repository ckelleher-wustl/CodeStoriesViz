## README 

### generateNumChanges.py
This Python script uses the get_code_entries() function from historyHierarchy.py and an inputted startTime and endTime to obtain the corresponding start_code text and end_code text. The start_code and end_code texts are compared to determine if changes to any lines have been made. The output is a CSV file (before_after_test.csv) that contains the number of changes made to each line of the code text. 

### generateHeatmap.html
This HTML file uses the D3.js library to create the heatmap visualization. Its input is a CSV file (before_after_test.csv), which is the output of the generateNumChanges.py script. 

### historyHierarchy.py
Was in the process of adding generateNumChanges as a function into this Python file to integrate the heatmap with the existing code stories visualization program. Currently using the codeCluster_wordle.csv to obtain the start and end code texts from the wordle database. 

### diff_helper.py
Used as a helper function in generateNumChanges.py.
