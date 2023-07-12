import historyQuery

def separate_lines(filename):
    groups = []
    current_group = []

    with open(filename, 'r') as file:
        for line in file:
            strippedLine = line.strip()  # Remove leading/trailing whitespace

            if strippedLine:
                current_group.append(line)
            elif current_group:
                groups.append(current_group)
                current_group = []

        if current_group:
            groups.append(current_group)

    return groups

filename = 'web/storystudy/wordleCode/script.js'
groups = separate_lines(filename)


historyFromCode = historyQuery.HistoryFromCode()
historyFromCode.initializeHistory('web/data/wordleStoryOverview.csv',"script.js")

for group in groups:
    print("<pre class='code'>")
    for line in group:
        print(f"{line[0:len(line)-1]}")
    print("</pre>")

    # print(group)
    activities = historyFromCode.getActivitiesForCode(group)
    for activity in activities:
        print(f"<button type='button' class='history active'>{activity}</button>")

    print("\n\n")


# # NOTE: a lot of these don't seem to match the final state of the code.
# # this is the code that we want to find the history for
# selectedCode = """
#     console.log('keypress');
#     const LettersPattern = /[a-z]/ // /^[A-Za-z][A-Za-z0-9]*$/;
#     let currentGuessCount = 1;
#     let currentGuess = document.querySelector('#guess' + currentGuess);
#     const words = ['apple', 'baker', 'store', 'horse', 'speak', 'clone', 'bread'];
#     let solutionWord = '';"""



# activities = historyFromCode.getActivitiesForCode(selectedCode)


# <button type='button' class='history active'>Adding a key listener (CHECK)</button>
# <button type='button' class='history active'>Figure out whether or not an entered character is a letter</button>
# <button type='button' class='history active'>build update letters function</button>
# <button type='button' class='history active'>Choosing a random correct answer for the puzzle</button>
# <button type='button' class='history active'>update script based on index updates to the gameboard.</button>
# for activity in activities:
#     print(f"<button type='button' class='history active'>{activity}</button")

# print("made everything without crashing.")
    