var initTest = false;
// var linkList = document.getElementById("linkList");
// var contentContainer = document.getElementById("contentContainer");

var linkList = $("#linkList");
var contentContainer = $("#contentContainer");


function openTab(tabName) {
  var i, tabContent;
  tabContent = $(".tab");
  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].removeAttribute("style");
  }
  $("#"+tabName).attr("style", "display:block")

  if (tabName == "history") {
    // initCollapsibles();
  }

  if (tabName == "test") {
    linkList = $("#linkList");
    contentContainer = $("#contentContainer");

    linkList.on("click", (event) => {
      event.preventDefault();
      const link = event.target.closest("a");

      if (link) {
          const url = link.getAttribute("data-url");
          var contentContainer = $("#contentContainer");
          console.log("click on link " + url);
          console.log(contentContainer);
          loadContent(url, contentContainer);
      }
  });

  }
}

function loadContent(url, container) {
  console.log("trying to load " + url + "into " + container.attr("id"))

  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      
      console.log("loading " + container.attr("id"));
      if (container.attr("id") == "historyTab"){
        container.html( html );
        initCollapsibles();
        
      } else if (container.attr("id") == "contentContainer") {
        console.log( html.substring(0, 300))
        container.html(html);
        initHistory();
      } else {
        container.html( html );
      }
    })
    .catch((error) => {
      console.error("Error fetching content:", error);
    });
}