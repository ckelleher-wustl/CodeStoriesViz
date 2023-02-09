var codeClusters = [
    {
            goal: "Change the Parent Resources menu item.",
            clusters: [
                    {
                            summary: "Change the text of the menu item Parent Resources to Recommended Reading",
                            filename: 'header.html',
                            startingCode: '<header role="banner">\n \
<div class="container">\n \
<a class="site-title" href="files/index.html">Nursery School</a>\n \
</div>\n \
<div id="main-menu-container">\n \
<div class="container">\n \
  <div class="navbar">\n \
    <div class="dropdown">\n \
      <button class="dropbtn">\n \
        <a id="about" href="files/about.html">About\n \
        </a>\n \
      </button>\n \
      <div class="dropdown-content">\n \
        <a id="tuition" href="files/tuition.html">Tuition</a>\n \
        <a id="staff" href="files/staff.html">Staff</a>\n \
        <a id="parent-handbook" href="files/parent_handbook.html">Parent Handbook</a>\n \
      </div>\n \
    </div>\n \
    <div class="dropdown">\n \
      <button class="dropbtn">\n \
        <a id="classrooms" href="files/classrooms.html">Classrooms\n \
        </a>\n \
      </button>\n \
      <div class="dropdown-content">\n \
        <a id="curriculum-overview" href="files/curriculum_overview.html">Curriculum Overview</a>\n \
        <a id="teddy-bears" href="files/teddy_bears.html">Teddy Bears</a>\n \
        <a id="panda-bears" href="files/panda_bears.html">Panda Bears</a>\n \
        <a id="bear-cubs" href="files/bear_cubs.html">Bear Cubs</a>\n \
        <a id="big-bears" href="files/big_bears.html">Big Bears</a>\n \
        <a id="sun-bears" href="files/sun_bears.html">Sun Bears</a>\n \
        <a id="bear-tracks" href="files/bear_tracks.html">Bear Tracks</a>\n \
        <a id="enrichment-program" href="files/enrichment_programs.html">Enrichment Program</a>\n \
      </div>\n \
    </div>\n \
    <a id="calendar" href="files/calendar.html">Calendar</a>\n \
    <a id="summer-camp" href="files/summer_camp.html">Summer Camp</a>\n \
    <div class="dropdown">\n \
      <button class="dropbtn">\n \
        <a id="get-involved" href="files/get_involved.html">Get Involved</a>\n \
      </button>\n \
      <div class="dropdown-content">\n \
        <a id="nursery-school-merchandise" href="files/nursery_school_merchandise.html">Nursery School\n \
          Merchandise</a>\n \
        <a id="parent-association" href="files/parent_association.html">Parent Association</a>\n \
      </div>\n \
    </div>\n \
\n \
    <a id="apply" href="files/apply.html">Apply</a>\n \
    <a id="forms" href="files/forms.html">Forms</a>\n \
\n \
    <a id="parent-resources" href="files/parent_resources.html">Parent Resources</a>\n \
  </div>\n \
</div>\n \
</div>\n \
</header>',
                            endingCode: '<header role="banner">\n \
<div class="container">\n \
<a class="site-title" href="files/index.html">Nursery School</a>\n \
</div>\n \
<div id="main-menu-container">\n \
<div class="container">\n \
  <div class="navbar">\n \
    <div class="dropdown">\n \
      <button class="dropbtn">\n \
        <a id="about" href="files/about.html">About\n \
        </a>\n \
      </button>\n \
      <div class="dropdown-content">\n \
        <a id="tuition" href="files/tuition.html">Tuition</a>\n \
        <a id="staff" href="files/staff.html">Staff</a>\n \
        <a id="parent-handbook" href="files/parent_handbook.html">Parent Handbook</a>\n \
      </div>\n \
    </div>\n \
    <div class="dropdown">\n \
      <button class="dropbtn">\n \
        <a id="classrooms" href="files/classrooms.html">Classrooms\n \
        </a>\n \
      </button>\n \
      <div class="dropdown-content">\n \
        <a id="curriculum-overview" href="files/curriculum_overview.html">Curriculum Overview</a>\n \
        <a id="teddy-bears" href="files/teddy_bears.html">Teddy Bears</a>\n \
        <a id="panda-bears" href="files/panda_bears.html">Panda Bears</a>\n \
        <a id="bear-cubs" href="files/bear_cubs.html">Bear Cubs</a>\n \
        <a id="big-bears" href="files/big_bears.html">Big Bears</a>\n \
        <a id="sun-bears" href="files/sun_bears.html">Sun Bears</a>\n \
        <a id="bear-tracks" href="files/bear_tracks.html">Bear Tracks</a>\n \
        <a id="enrichment-program" href="files/enrichment_programs.html">Enrichment Program</a>\n \
      </div>\n \
    </div>\n \
    <a id="calendar" href="files/calendar.html">Calendar</a>\n \
    <a id="summer-camp" href="files/summer_camp.html">Summer Camp</a>\n \
    <div class="dropdown">\n \
      <button class="dropbtn">\n \
        <a id="get-involved" href="files/get_involved.html">Get Involved</a>\n \
      </button>\n \
      <div class="dropdown-content">\n \
        <a id="nursery-school-merchandise" href="files/nursery_school_merchandise.html">Nursery School\n \
          Merchandise</a>\n \
        <a id="parent-association" href="files/parent_association.html">Parent Association</a>\n \
      </div>\n \
    </div>\n \
\n \
    <a id="apply" href="files/apply.html">Apply</a>\n \
    <a id="forms" href="files/forms.html">Forms</a>\n \
\n \
    <a id="parent-resources" href="files/parent_resources.html">Recommended Reading</a>\n \
  </div>\n \
</div>\n \
</div>\n \
</header>',
                    },
            ]
    },
    {
            goal: "Modify CSS to change the look of the Visit Our School banner on the home page.",
            clusters: [
                    {
                            summary: "Change the 80 pixel border around Visit Our School to 60 pixels.",
                            filename: 'index.css',
                            startingCode: '@import url("common.css");\n \
@import url("slideshow.css");\n \
#first-article-first-text {\n \
font-weight: lighter;\n \
line-height: 1.333;\n \
font-size: 1.728rem;\n \
color: #bbb;\n \
}\n \
\n \
#first-article-second-text {\n \
font-weight: lighter;\n \
line-height: 1.333;\n \
font-size: 1.2rem;\n \
}\n \
\n \
#visit-our-school {\n \
text-align: center;\n \
background-color: #eee;\n \
padding: 80px;\n \
margin-bottom: 2em;\n \
}\n \
\n \
#visit-our-school p {\n \
text-align: left;\n \
margin-bottom: 2em;\n \
font-size: 1.25em;\n \
}\n \
\n \
#visit-our-school a {\n \
color: #a51417;\n \
border: #a51417;\n \
border-width: 2px;\n \
border-radius: 6px;\n \
border-style: solid;\n \
font-size: 1rem;\n \
line-height: 1.1;\n \
padding: 8px 20px;\n \
}\n \
\n \
#column-view {\n \
display: flex;\n \
}\n \
\n \
.column {\n \
width: 50%;\n \
padding: 16px;\n \
font-size: 1em;\n \
}\n \
\n \
.column .inner-div {\n \
padding: 1em;\n \
border-style: solid;\n \
border-width: 1px;\n \
border-color: #eee;\n \
padding: 19px 24px;\n \
}\n \
\n \
.column-header {\n \
background-color: #2b8282;\n \
padding: 19px 24px;\n \
}\n \
\n \
.column h3 {\n \
text-align: left;\n \
color: white;\n \
font-size: 1.25em;\n \
}\n \
\n \
.column a {\n \
color: #a51417;\n \
text-decoration: underline;\n \
display: block;\n \
padding-left: 24px;\n \
margin-bottom: 1em;\n \
font-size: 1.25em;\n \
}\n \
\n \
.column a.inline {\n \
color: #a51417;\n \
text-decoration: underline;\n \
display: inline;\n \
padding-left: 3px;\n \
margin-bottom: 0em;\n \
font-size: 1em;\n \
}\n \
\n \
.entry__category a {\n \
font-size: 1em;\n \
color: #555;\n \
}\n \
\n \
article h2 {\n \
font-size: 1.25rem;\n \
}\n \
\n \
.column article a {\n \
text-decoration: none;\n \
margin: 0;\n \
padding: 0;\n \
}\n \
\n \
.column article {\n \
margin-top: 1em;\n \
margin-bottom: 1em;\n \
}\n \
\n \
main hr {\n \
border: none;\n \
background-color: #eee;\n \
height: 1px;\n \
}',
                            endingCode: '@import url("common.css");\n \
@import url("slideshow.css");\n \
#first-article-first-text {\n \
font-weight: lighter;\n \
line-height: 1.333;\n \
font-size: 1.728rem;\n \
color: #bbb;\n \
}\n \
\n \
#first-article-second-text {\n \
font-weight: lighter;\n \
line-height: 1.333;\n \
font-size: 1.2rem;\n \
}\n \
\n \
#visit-our-school {\n \
text-align: center;\n \
background-color: #eee;\n \
padding: 60px;\n \
margin-bottom: 2em;\n \
}\n \
\n \
#visit-our-school p {\n \
text-align: left;\n \
margin-bottom: 2em;\n \
font-size: 1.25em;\n \
}\n \
\n \
#visit-our-school a {\n \
color: #a51417;\n \
border: #a51417;\n \
border-width: 2px;\n \
border-radius: 6px;\n \
border-style: solid;\n \
font-size: 1rem;\n \
line-height: 1.1;\n \
padding: 8px 20px;\n \
}\n \
\n \
#column-view {\n \
display: flex;\n \
}\n \
\n \
.column {\n \
width: 50%;\n \
padding: 16px;\n \
font-size: 1em;\n \
}\n \
\n \
.column .inner-div {\n \
padding: 1em;\n \
border-style: solid;\n \
border-width: 1px;\n \
border-color: #eee;\n \
padding: 19px 24px;\n \
}\n \
\n \
.column-header {\n \
background-color: #2b8282;\n \
padding: 19px 24px;\n \
}\n \
\n \
.column h3 {\n \
text-align: left;\n \
color: white;\n \
font-size: 1.25em;\n \
}\n \
\n \
.column a {\n \
color: #a51417;\n \
text-decoration: underline;\n \
display: block;\n \
padding-left: 24px;\n \
margin-bottom: 1em;\n \
font-size: 1.25em;\n \
}\n \
\n \
.column a.inline {\n \
color: #a51417;\n \
text-decoration: underline;\n \
display: inline;\n \
padding-left: 3px;\n \
margin-bottom: 0em;\n \
font-size: 1em;\n \
}\n \
\n \
.entry__category a {\n \
font-size: 1em;\n \
color: #555;\n \
}\n \
\n \
article h2 {\n \
font-size: 1.25rem;\n \
}\n \
\n \
.column article a {\n \
text-decoration: none;\n \
margin: 0;\n \
padding: 0;\n \
}\n \
\n \
.column article {\n \
margin-top: 1em;\n \
margin-bottom: 1em;\n \
}\n \
\n \
main hr {\n \
border: none;\n \
background-color: #eee;\n \
height: 1px;\n \
}',
                    },
                    {
                            summary: "Change the margins so that Our students... occupies a narrower area.",
                            filename: 'index.css',
                            startingCode: '@import url("common.css");\n \
@import url("slideshow.css");\n \
#first-article-first-text {\n \
font-weight: lighter;\n \
line-height: 1.333;\n \
font-size: 1.728rem;\n \
color: #bbb;\n \
}\n \
\n \
#first-article-second-text {\n \
font-weight: lighter;\n \
line-height: 1.333;\n \
font-size: 1.2rem;\n \
}\n \
\n \
#visit-our-school {\n \
text-align: center;\n \
background-color: #eee;\n \
padding: 60px;\n \
margin-bottom: 2em;\n \
}\n \
\n \
#visit-our-school p {\n \
text-align: left;\n \
margin-bottom: 2em;\n \
font-size: 1.25em;\n \
}\n \
\n \
#visit-our-school a {\n \
color: #a51417;\n \
border: #a51417;\n \
border-width: 2px;\n \
border-radius: 6px;\n \
border-style: solid;\n \
font-size: 1rem;\n \
line-height: 1.1;\n \
padding: 8px 20px;\n \
}\n \
\n \
#column-view {\n \
display: flex;\n \
}\n \
\n \
.column {\n \
width: 50%;\n \
padding: 16px;\n \
font-size: 1em;\n \
}\n \
\n \
.column .inner-div {\n \
padding: 1em;\n \
border-style: solid;\n \
border-width: 1px;\n \
border-color: #eee;\n \
padding: 19px 24px;\n \
}\n \
\n \
.column-header {\n \
background-color: #2b8282;\n \
padding: 19px 24px;\n \
}\n \
\n \
.column h3 {\n \
text-align: left;\n \
color: white;\n \
font-size: 1.25em;\n \
}\n \
\n \
.column a {\n \
color: #a51417;\n \
text-decoration: underline;\n \
display: block;\n \
padding-left: 24px;\n \
margin-bottom: 1em;\n \
font-size: 1.25em;\n \
}\n \
\n \
.column a.inline {\n \
color: #a51417;\n \
text-decoration: underline;\n \
display: inline;\n \
padding-left: 3px;\n \
margin-bottom: 0em;\n \
font-size: 1em;\n \
}\n \
\n \
.entry__category a {\n \
font-size: 1em;\n \
color: #555;\n \
}\n \
\n \
article h2 {\n \
font-size: 1.25rem;\n \
}\n \
\n \
.column article a {\n \
text-decoration: none;\n \
margin: 0;\n \
padding: 0;\n \
}\n \
\n \
.column article {\n \
margin-top: 1em;\n \
margin-bottom: 1em;\n \
}\n \
\n \
main hr {\n \
border: none;\n \
background-color: #eee;\n \
height: 1px;\n \
}',
                            endingCode: '@import url("common.css");\n \
@import url("slideshow.css");\n \
#first-article-first-text {\n \
font-weight: lighter;\n \
line-height: 1.333;\n \
font-size: 1.728rem;\n \
color: #bbb;\n \
}\n \
\n \
#first-article-second-text {\n \
font-weight: lighter;\n \
line-height: 1.333;\n \
font-size: 1.2rem;\n \
}\n \
\n \
#visit-our-school {\n \
text-align: center;\n \
background-color: #eee;\n \
padding: 60px;\n \
margin-bottom: 2em;\n \
}\n \
\n \
#visit-our-school p {\n \
text-align: left;\n \
margin-left: 20px;\n \
margin-right: 20px;\n \
margin-bottom: 2em;\n \
font-size: 1.25em;\n \
}\n \
\n \
#visit-our-school a {\n \
color: #a51417;\n \
border: #a51417;\n \
border-width: 2px;\n \
border-radius: 6px;\n \
border-style: solid;\n \
font-size: 1rem;\n \
line-height: 1.1;\n \
padding: 8px 20px;\n \
}\n \
\n \
#column-view {\n \
display: flex;\n \
}\n \
\n \
.column {\n \
width: 50%;\n \
padding: 16px;\n \
font-size: 1em;\n \
}\n \
\n \
.column .inner-div {\n \
padding: 1em;\n \
border-style: solid;\n \
border-width: 1px;\n \
border-color: #eee;\n \
padding: 19px 24px;\n \
}\n \
\n \
.column-header {\n \
background-color: #2b8282;\n \
padding: 19px 24px;\n \
}\n \
\n \
.column h3 {\n \
text-align: left;\n \
color: white;\n \
font-size: 1.25em;\n \
}\n \
\n \
.column a {\n \
color: #a51417;\n \
text-decoration: underline;\n \
display: block;\n \
padding-left: 24px;\n \
margin-bottom: 1em;\n \
font-size: 1.25em;\n \
}\n \
\n \
.column a.inline {\n \
color: #a51417;\n \
text-decoration: underline;\n \
display: inline;\n \
padding-left: 3px;\n \
margin-bottom: 0em;\n \
font-size: 1em;\n \
}\n \
\n \
.entry__category a {\n \
font-size: 1em;\n \
color: #555;\n \
}\n \
\n \
article h2 {\n \
font-size: 1.25rem;\n \
}\n \
\n \
.column article a {\n \
text-decoration: none;\n \
margin: 0;\n \
padding: 0;\n \
}\n \
\n \
.column article {\n \
margin-top: 1em;\n \
margin-bottom: 1em;\n \
}\n \
\n \
main hr {\n \
border: none;\n \
background-color: #eee;\n \
height: 1px;\n \
}',
                    },
            ]
    },
    {
            goal: "Define a new CSS style and use it to make the header Classroom News twice as big.",
            clusters: [
                    {
                            summary: "Make the font size for Classroom News twice as big.",
                            filename: 'index.css',
                            startingCode: '@import url("common.css");\n \
@import url("slideshow.css");\n \
#first-article-first-text {\n \
font-weight: lighter;\n \
line-height: 1.333;\n \
font-size: 1.728rem;\n \
color: #bbb;\n \
}\n \
\n \
#first-article-second-text {\n \
font-weight: lighter;\n \
line-height: 1.333;\n \
font-size: 1.2rem;\n \
}\n \
\n \
#visit-our-school {\n \
text-align: center;\n \
background-color: #eee;\n \
padding: 60px;\n \
margin-bottom: 2em;\n \
}\n \
\n \
#visit-our-school p {\n \
text-align: left;\n \
margin-left: 20px;\n \
margin-right: 20px;\n \
margin-bottom: 2em;\n \
font-size: 1.25em;\n \
}\n \
\n \
#visit-our-school a {\n \
color: #a51417;\n \
border: #a51417;\n \
border-width: 2px;\n \
border-radius: 6px;\n \
border-style: solid;\n \
font-size: 1rem;\n \
line-height: 1.1;\n \
padding: 8px 20px;\n \
}\n \
\n \
#column-view {\n \
display: flex;\n \
}\n \
\n \
.column {\n \
width: 50%;\n \
padding: 16px;\n \
font-size: 1em;\n \
}\n \
\n \
.column .inner-div {\n \
padding: 1em;\n \
border-style: solid;\n \
border-width: 1px;\n \
border-color: #eee;\n \
padding: 19px 24px;\n \
}\n \
\n \
.column-header {\n \
background-color: #2b8282;\n \
padding: 19px 24px;\n \
}\n \
\n \
.column h3 {\n \
text-align: left;\n \
color: white;\n \
font-size: 1.25em;\n \
}\n \
\n \
.column a {\n \
color: #a51417;\n \
text-decoration: underline;\n \
display: block;\n \
padding-left: 24px;\n \
margin-bottom: 1em;\n \
font-size: 1.25em;\n \
}\n \
\n \
.column a.inline {\n \
color: #a51417;\n \
text-decoration: underline;\n \
display: inline;\n \
padding-left: 3px;\n \
margin-bottom: 0em;\n \
font-size: 1em;\n \
}\n \
\n \
.entry__category a {\n \
font-size: 1em;\n \
color: #555;\n \
}\n \
\n \
article h2 {\n \
font-size: 1.25rem;\n \
}\n \
\n \
.column article a {\n \
text-decoration: none;\n \
margin: 0;\n \
padding: 0;\n \
}\n \
\n \
.column article {\n \
margin-top: 1em;\n \
margin-bottom: 1em;\n \
}\n \
\n \
main hr {\n \
border: none;\n \
background-color: #eee;\n \
height: 1px;\n \
}',
                            endingCode: '@import url("common.css");\n \
@import url("slideshow.css");\n \
#first-article-first-text {\n \
font-weight: lighter;\n \
line-height: 1.333;\n \
font-size: 1.728rem;\n \
color: #bbb;\n \
}\n \
\n \
#first-article-second-text {\n \
font-weight: lighter;\n \
line-height: 1.333;\n \
font-size: 1.2rem;\n \
}\n \
\n \
#visit-our-school {\n \
text-align: center;\n \
background-color: #eee;\n \
padding: 60px;\n \
margin-bottom: 2em;\n \
}\n \
\n \
#visit-our-school p {\n \
text-align: left;\n \
margin-left: 20px;\n \
margin-right: 20px;\n \
margin-bottom: 2em;\n \
font-size: 1.25em;\n \
}\n \
\n \
#visit-our-school a {\n \
color: #a51417;\n \
border: #a51417;\n \
border-width: 2px;\n \
border-radius: 6px;\n \
border-style: solid;\n \
font-size: 1rem;\n \
line-height: 1.1;\n \
padding: 8px 20px;\n \
}\n \
\n \
#column-view {\n \
display: flex;\n \
}\n \
\n \
\n \
\n \
.column {\n \
width: 50%;\n \
padding: 16px;\n \
font-size: 1em;\n \
}\n \
\n \
.column .big-header {\n \
font-size: 2em;\n \
}\n \
\n \
.column .inner-div {\n \
padding: 1em;\n \
border-style: solid;\n \
border-width: 1px;\n \
border-color: #eee;\n \
padding: 19px 24px;\n \
}\n \
\n \
.column-header {\n \
background-color: #2b8282;\n \
padding: 19px 24px;\n \
}\n \
\n \
.column h3 {\n \
text-align: left;\n \
color: white;\n \
font-size: 1.25em;\n \
}\n \
\n \
.column a {\n \
color: #a51417;\n \
text-decoration: underline;\n \
display: block;\n \
padding-left: 24px;\n \
margin-bottom: 1em;\n \
font-size: 1.25em;\n \
}\n \
\n \
.column a.inline {\n \
color: #a51417;\n \
text-decoration: underline;\n \
display: inline;\n \
padding-left: 3px;\n \
margin-bottom: 0em;\n \
font-size: 1em;\n \
}\n \
\n \
.entry__category a {\n \
font-size: 1em;\n \
color: #555;\n \
}\n \
\n \
article h2 {\n \
font-size: 1.25rem;\n \
}\n \
\n \
.column article a {\n \
text-decoration: none;\n \
margin: 0;\n \
padding: 0;\n \
}\n \
\n \
.column article {\n \
margin-top: 1em;\n \
margin-bottom: 1em;\n \
}\n \
\n \
main hr {\n \
border: none;\n \
background-color: #eee;\n \
height: 1px;\n \
}',
                    },
            ]
    },
    {
            goal: "Create a sticky header so that the header will be visible even when users scroll",
            clusters: [
                    {
                            summary: "Define a sticky style that is in a fixed position 50pixels below the top of the screen.",
                            filename: 'header.css',
                            startingCode: 'header {\n \
overflow: auto;\n \
}\n \
\n \
\n \
#wustl-branding {\n \
background-color: #a51417;\n \
height: 2.625rem;\n \
overflow: hidden;\n \
padding-left: 4%;\n \
padding-top: 7px;\n \
}\n \
\n \
#main-menu-container {\n \
width: 100%;\n \
background-color: #3d3d3d;\n \
}\n \
\n \
.container {\n \
width: 92%;\n \
max-width: 71em;\n \
margin-left: auto;\n \
margin-right: auto;\n \
}\n \
\n \
#washu-logo {\n \
width: 256px;\n \
}\n \
\n \
.site-title {\n \
color: #3d3d3d;\n \
display: block;\n \
font-family: "Libre Baskerville", "Times New Roman", serif;\n \
width: calc( 100% - 65px);\n \
padding-top: 0.5em;\n \
padding-bottom: 0.5em;\n \
font-size: 3rem;\n \
font-weight: 400;\n \
line-height: 1.2;\n \
text-decoration: none;\n \
}\n \
\n \
.site-title:hover {\n \
color: #a51417;\n \
text-decoration: underline;\n \
}\n \
\n \
\n \
/* Navbar container */\n \
\n \
.navbar {\n \
overflow: hidden;\n \
background-color: #3d3d3d;\n \
font-family: Arial;\n \
}\n \
\n \
\n \
/* Links inside the navbar */\n \
\n \
.navbar a {\n \
float: left;\n \
font-size: 16px;\n \
color: white;\n \
text-align: center;\n \
padding: 14px 16px;\n \
text-decoration: none;\n \
}\n \
\n \
.navbar a:hover {\n \
text-decoration: underline;\n \
}\n \
\n \
\n \
header a {\n \
color: white;\n \
}\n \
\n \
\n \
/* The dropdown container */\n \
\n \
.dropdown {\n \
float: left;\n \
overflow: hidden;\n \
}\n \
\n \
\n \
/* Dropdown button */\n \
\n \
.dropdown .dropbtn {\n \
font-size: 16px;\n \
border: none;\n \
outline: none;\n \
color: white;\n \
padding: 14px 16px;\n \
background-color: inherit;\n \
}\n \
\n \
.dropdown .dropbtn a {\n \
font-size: 16px;\n \
border: none;\n \
outline: none;\n \
color: white;\n \
padding: 0;\n \
background-color: inherit;\n \
}\n \
\n \
\n \
/* Add a red background color to navbar links on hover */\n \
\n \
.navbar a:hover,\n \
.dropdown:hover .dropbtn {\n \
background-color: #555;\n \
}\n \
\n \
\n \
/* Dropdown content (hidden by default) */\n \
\n \
.dropdown-content {\n \
display: none;\n \
position: absolute;\n \
background-color: #f9f9f9;\n \
min-width: 160px;\n \
box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);\n \
z-index: 1;\n \
}\n \
\n \
\n \
/* Links inside the dropdown */\n \
\n \
.dropdown-content a {\n \
float: none;\n \
color: black;\n \
padding: 12px 16px;\n \
text-decoration: none;\n \
display: block;\n \
text-align: left;\n \
}\n \
\n \
\n \
/* Add a grey background color to dropdown links on hover */\n \
\n \
.dropdown-content a:hover {\n \
background-color: #ddd;\n \
}\n \
\n \
\n \
/* Show the dropdown menu on hover */\n \
\n \
.dropdown:hover .dropdown-content {\n \
display: block;\n \
}',
                            endingCode: 'header {\n \
overflow: auto;\n \
}\n \
\n \
/* The sticky class is added to the header with JS when it reaches its scroll position */\n \
.sticky {\n \
position: fixed;\n \
top: 0;\n \
width: 100%\n \
}\n \
\n \
#wustl-branding {\n \
background-color: #a51417;\n \
height: 2.625rem;\n \
overflow: hidden;\n \
padding-left: 4%;\n \
padding-top: 7px;\n \
}\n \
\n \
#main-menu-container {\n \
width: 100%;\n \
background-color: #3d3d3d;\n \
}\n \
\n \
.container {\n \
width: 92%;\n \
max-width: 71em;\n \
margin-left: auto;\n \
margin-right: auto;\n \
}\n \
\n \
#washu-logo {\n \
width: 256px;\n \
}\n \
\n \
.site-title {\n \
color: #3d3d3d;\n \
display: block;\n \
font-family: "Libre Baskerville", "Times New Roman", serif;\n \
width: calc( 100% - 65px);\n \
padding-top: 0.5em;\n \
padding-bottom: 0.5em;\n \
font-size: 3rem;\n \
font-weight: 400;\n \
line-height: 1.2;\n \
text-decoration: none;\n \
}\n \
\n \
.site-title:hover {\n \
color: #a51417;\n \
text-decoration: underline;\n \
}\n \
\n \
\n \
/* Navbar container */\n \
\n \
.navbar {\n \
overflow: hidden;\n \
background-color: #3d3d3d;\n \
font-family: Arial;\n \
}\n \
\n \
\n \
/* Links inside the navbar */\n \
\n \
.navbar a {\n \
float: left;\n \
font-size: 16px;\n \
color: white;\n \
text-align: center;\n \
padding: 14px 16px;\n \
text-decoration: none;\n \
}\n \
\n \
.navbar a:hover {\n \
text-decoration: underline;\n \
}\n \
\n \
\n \
header a {\n \
color: white;\n \
}\n \
\n \
\n \
/* The dropdown container */\n \
\n \
.dropdown {\n \
float: left;\n \
overflow: hidden;\n \
}\n \
\n \
\n \
/* Dropdown button */\n \
\n \
.dropdown .dropbtn {\n \
font-size: 16px;\n \
border: none;\n \
outline: none;\n \
color: white;\n \
padding: 14px 16px;\n \
background-color: inherit;\n \
}\n \
\n \
.dropdown .dropbtn a {\n \
font-size: 16px;\n \
border: none;\n \
outline: none;\n \
color: white;\n \
padding: 0;\n \
background-color: inherit;\n \
}\n \
\n \
\n \
/* Add a red background color to navbar links on hover */\n \
\n \
.navbar a:hover,\n \
.dropdown:hover .dropbtn {\n \
background-color: #555;\n \
}\n \
\n \
\n \
/* Dropdown content (hidden by default) */\n \
\n \
.dropdown-content {\n \
display: none;\n \
position: absolute;\n \
background-color: #f9f9f9;\n \
min-width: 160px;\n \
box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);\n \
z-index: 1;\n \
}\n \
\n \
\n \
/* Links inside the dropdown */\n \
\n \
.dropdown-content a {\n \
float: none;\n \
color: black;\n \
padding: 12px 16px;\n \
text-decoration: none;\n \
display: block;\n \
text-align: left;\n \
}\n \
\n \
\n \
/* Add a grey background color to dropdown links on hover */\n \
\n \
.dropdown-content a:hover {\n \
background-color: #ddd;\n \
}\n \
\n \
\n \
/* Show the dropdown menu on hover */\n \
\n \
.dropdown:hover .dropdown-content {\n \
display: block;\n \
}',
                    },
                    {
                            summary: "Call the method within setup to initialize the sticky behavior.",
                            filename: 'dynamic-dom.ts',
                            startingCode: 'import { HTMLLoader } from "../core/utils/html_loader";\n \
import { Accordion } from "./accordion";\n \
import { doSomething } from "./do-something";\n \
import { HTMLContent, itemsToCache } from "./html-imports";\n \
import { Slideshow } from "./slideshow";\n \
import {setupSticky} from "./sticky.js";\n \
\n \
// Put all function calls that need to be made on every page load inside the setupAll function body.\n \
export function PutStudentPageLoadOperationsInsideThisStudentBody() {\n \
// TODO: Put all operations that you want to happen on ever page load in this function.\n \
// For example you could write: Sticky.setup()\n \
doSomething();\n \
}\n \
\n \
export async function setupAll() {\n \
await new Promise((r: any) => setTimeout(r, 100));\n \
console.log("reloading");\n \
Slideshow.setupAll();\n \
Accordion.setupAll();\n \
PutStudentPageLoadOperationsInsideThisStudentBody();\n \
console.log("reloaded");\n \
}\n \
\n \
itemsToCache.forEach((item: HTMLContent) => {\n \
HTMLLoader.cacheHTML(item.name, item.content);\n \
});\n \
(window as any).HTMLLoader = HTMLLoader;\n \
\n \
console.log("dynamic-dom loaded");\n \
// Do not touch this line, needed to reinitialize code in the dynamic-dom.ts setupAll function\n \
window.addEventListener("newPageLoad", () => setupAll());\n \
',
                            endingCode: 'import { HTMLLoader } from "../core/utils/html_loader";\n \
import { Accordion } from "./accordion";\n \
import { doSomething } from "./do-something";\n \
import { HTMLContent, itemsToCache } from "./html-imports";\n \
import { Slideshow } from "./slideshow";\n \
import {setupSticky} from "./sticky.js";\n \
\n \
// Put all function calls that need to be made on every page load inside the setupAll function body.\n \
export function PutStudentPageLoadOperationsInsideThisStudentBody() {\n \
// TODO: Put all operations that you want to happen on ever page load in this function.\n \
// For example you could write: Sticky.setup()\n \
setupSticky();\n \
doSomething();\n \
}\n \
\n \
export async function setupAll() {\n \
await new Promise((r: any) => setTimeout(r, 100));\n \
console.log("reloading");\n \
Slideshow.setupAll();\n \
Accordion.setupAll();\n \
PutStudentPageLoadOperationsInsideThisStudentBody();\n \
console.log("reloaded");\n \
}\n \
\n \
itemsToCache.forEach((item: HTMLContent) => {\n \
HTMLLoader.cacheHTML(item.name, item.content);\n \
});\n \
(window as any).HTMLLoader = HTMLLoader;\n \
\n \
console.log("dynamic-dom loaded");\n \
// Do not touch this line, needed to reinitialize code in the dynamic-dom.ts setupAll function\n \
window.addEventListener("newPageLoad", () => setupAll());\n \
',
                    },
                    {
                            summary: "Add a method to toggle the sticky behavior by adding and removing the sticky class to the header.",
                            filename: 'sticky.js',
                            startingCode: 'export function setupSticky() {\n \
console.log("set up sticky");\n \
}',
                            endingCode: 'export function setupSticky() {\n \
console.log("set up sticky");\n \
\n \
window.onscroll = function() {toggleSticky()};\n \
\n \
}\n \
\n \
function toggleSticky() {\n \
// Get the header\n \
var header = document.getElementById("main-menu-container");\n \
console.log("header " + header);\n \
\n \
// Get the offset position of the navbar\n \
var sticky = header.offsetTop;\n \
\n \
if (window.pageYOffset > sticky) {\n \
    console.log("adding sticky");\n \
    header.classList.add("sticky");\n \
  } else {\n \
    console.log("removing sticky")\n \
    header.classList.remove("sticky");\n \
  }\n \
}',
                    },
            ]
    },
]

// #####################################################################################################

function createClusterView() {
    html=""

    for (clusterIdx in codeClusters) {

        var cluster = codeClusters[clusterIdx];

        // <fieldset class="goal" style="width: 100%;">
        //     <legend>Sub-goal</legend>
        //     <div>Print a list of imagenet classes from the imagenet 1000 mini set.</div>
        // </fieldset>
        html += '<fieldset class="goal" style="width: 100%;">\n'
        html += '\t<legend>Goal</legend>\n'
        html += '\t<div>' + cluster.goal + '</div>'
        html += '</fieldset>'


        // <button type='button' class='collapsible active'>CODE: print list of imagenet_classes</button>
        //     <div class='content' --start-code='imagenet_classes = []'
        //         --end-code='import pandas as pd'>
        //         <p> code content will go here</p> 
        //     </div> */}
        var clusterDiffs = cluster.clusters;
        for (clusterDiffIdx in clusterDiffs) {
            console.log("diff" + JSON.stringify(clusterDiffs[clusterDiffIdx]));
            var clusterDiff = clusterDiffs[clusterDiffIdx];

            html += "<button type='button' class='collapsible active'>" + clusterDiff.summary + "</button>";
            html += "<div class='content' --start-code='" + clusterDiff.startingCode + "'"; 
            html += "--end-code='" + clusterDiff.endingCode +"'";
            html += "--filename='" + clusterDiff.filename +"'>";
            html += "<p> code content will go here</p>";
            html += "</div>";
        }
    }

    return html;
}
