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
  // console.log(regionDiv.parent());

  var offset = regionDiv.offset().top - $(window).scrollTop();

  if(offset > window.innerHeight){
      // Not in view so scroll to it
      $('html,body').animate({scrollTop: offset}, 1000);
  } 
  
  // experiment with adding a pulsing border to bring user's attention to the relevant region
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