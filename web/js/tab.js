var initTest = false;

var linkList = $("#linkList");
var contentContainer = $("#contentContainer");


function openTab(tabName) {
  var i, tabContent;
  tabContent = $(".tab");
  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].removeAttribute("style");
  }
  $("#"+tabName).attr("style", "display:block")

  if (tabName == "code") {
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
  openTab("code");
  var contentContainer = $("#contentContainer");
  loadContent(url, contentContainer, scrollToRegion, regionID); 
}

function openSubgoal(subgoalText) {
  openTab("history");
  const subgoal = $("fieldset:contains('" + subgoalText + "')");
  console.log("subgoal: " + subgoalText);
  console.log(subgoal);

  subgoalID = subgoal.attr("id");
  scrollToSubgoal(subgoalID);
}

function scrollToElement(element) {
  if (!(element  instanceof jQuery)) {
    element = $(element);
  }

  console.log(element);
  console.log(element.offset());
  
  const offsetTop = element.offset().top;
  const screenHeight = $(window).height();
  const scrollToY = offsetTop - (screenHeight / 2) + (element.outerHeight() / 2);

  console.log("scrollToY" + offsetTop + " " + screenHeight + " " + scrollToY);

  $("html, body").animate({
    scrollTop: scrollToY
  }, 800); // You can adjust the duration (in milliseconds) for the scrolling animation
}

function scrollToID(elementID) {
  
  // this assumes that the element is already on the screen, though it may be scrolled out of sight.
  var element = $("#" + elementID);
  if (!element.length) return; // If the element doesn't exist, exit the function

  scrollToElement(element);

  // const offsetTop = element.offset().top;
  // const screenHeight = $(window).height();
  // const scrollToY = offsetTop - (screenHeight / 2) + (element.outerHeight() / 2);

  // $("html, body").animate({
  //   scrollTop: scrollToY
  // }, 800); // You can adjust the duration (in milliseconds) for the scrolling animation
}

function highlightElement(element) {
  element.addClass("fade-in-out-border");

  // Remove the animation class after the animation finishes
  element.on("animationend", function() {
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
        loadCodeRegionMaps();
        // var mapFilenames = ['script.jsLineMap.csv', 'animations.scssLineMap.csv', 'index.htmlLineMap.csv', 'guess.scssLineMap.csv', 'notes.mdLineMap.csv', 'boilerplate.scssLineMap.csv']
        // for (var filename in mapFilenames) {
        //   loadCodeRegionMaps(mapFilenames[filename]);
        // }
        // loadCodeRegionMaps('animations.scssLineMap.csv');
        // loadCodeRegionMaps('script.jsLineMap.csv');
      } else if (container.attr("id") == "contentContainer") {
        initHistory();
      }

      if (callback!= null) {
        callback(arg);
      }
    })
    .catch((error) => {
      console.error("Error fetching content:", error);
    });
}

function scrollToRegion(regionID) {
  scrollToID(regionID);
  var regionDiv = $("#" + regionID);
  highlightElement(regionDiv.parent());
}

function scrollToSubgoal(subgoalID) {
  scrollToID(subgoalID);
  var subgoalElement = $("#" + subgoalID);
  highlightElement(subgoalElement);
}

function hoverEnterSubgoal(subgoal) {
  var goalText = subgoal.textContent.split("\n")[0]

  const subgoalElements = $('.subgoal-group:contains("' + goalText + '")');
  subgoalElements.each( function() {
    $(this).addClass("highlight");
  })

}

function hoverLeaveSubgoal(subgoal) {
  var goalText = subgoal.textContent.split("\n")[0]

  const subgoalElements = $('.subgoal-group:contains("' + goalText + '")');
  subgoalElements.each( function() {
    $(this).removeClass("highlight");
  })
}