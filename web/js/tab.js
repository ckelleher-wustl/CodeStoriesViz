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
          loadContent(url, contentContainer, null, null);
      }
  });

  }
}

function openCodeFile(url, regionID) {
  openTab("test")
  var contentContainer = $("#contentContainer");
  loadContent(url, contentContainer, scrollToRegion, regionID); 
}

function scrollToRegion(regionID) {
  var regionDiv = $("#" + regionID);
  if (!regionDiv.length) return; // If the element doesn't exist, exit the function

  const offsetTop = regionDiv.offset().top;
  const screenHeight = $(window).height();
  const scrollToY = offsetTop - (screenHeight / 2) + (regionDiv.outerHeight() / 2);

  $("html, body").animate({
    scrollTop: scrollToY
  }, 800); // You can adjust the duration (in milliseconds) for the scrolling animation
  
  // pulsing border to bring user's attention to the relevant region
  regionDiv.parent().addClass("fade-in-out-border");

  // Remove the animation class after the animation finishes
  regionDiv.parent().on("animationend", function() {
    $(this).removeClass("fade-in-out-border");
  });


}

function loadContent(url, container, callback, arg) {
  console.log("trying to load " + url + "into " + container.attr("id"))

  const ms = Date.now();

  fetch(url + "?dummy="+ms)
    .then((response) => response.text())
    .then((html) => {

      container.html( html );
      if (container.attr("id") == "historyTab"){
        initCollapsibles();
        
      } else if (container.attr("id") == "contentContainer") {
        initHistory();
      }

      if (callback!= null) {
        console.log("calling callback function");
        callback(arg);
      }
    })
    .catch((error) => {
      console.error("Error fetching content:", error);
    });
}