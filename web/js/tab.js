var initTest = false;
var linkList = document.getElementById("linkList");
var contentContainer = document.getElementById("contentContainer");


function openTab(tabName) {
  var i, tabContent;
  tabContent = document.getElementsByClassName("tab");
  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
  }
  document.getElementById(tabName).style.display = "block";

  if (tabName == "test") {
    linkList = document.getElementById("linkList");
    contentContainer = document.getElementById("contentContainer");

    linkList.addEventListener("click", (event) => {
        console.log("click on link")
        event.preventDefault();
        const link = event.target.closest("a");

        if (link) {
            const url = link.getAttribute("data-url");
            loadContent(url);
        }
    });
  }
}


function loadContent(url) {
  fetch(url)
      .then((response) => response.text())
      .then((html) => {
      contentContainer.innerHTML = html;
      })
      .catch((error) => {
      console.error("Error fetching content:", error);
      });
}