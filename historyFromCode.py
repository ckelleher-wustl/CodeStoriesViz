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


#  <pre class="code">
#     function greet(name) {
#       console.log("Hello, " + name + "!");
#     }

#     greet("World");
#   </pre>

for group in groups:
    print("<pre class='code'>")
    for line in group:
        print(f"{line[0:len(line)-1]}")
    print("</pre>\n\n")
    