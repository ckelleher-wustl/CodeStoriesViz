saveLogs = false

function logUserAction(context, action) {

    if (saveLogs) {

        const formData = new FormData();
        formData.append("context", context);
        formData.append("action", action);

        // "http://localhost:3000/updatecodetext
        fetch("http://127.0.0.1:5000/add_event", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(message => {
            console.log(message);
            // You can update the UI or perform any other actions based on the response
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }
  }
