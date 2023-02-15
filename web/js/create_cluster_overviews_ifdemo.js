var codeClusters = [
  {
          goal: "Add a navbar item for a Photo Gallery.",
          clusters: [
                  {
                          summary: "Add a new drop down menu that will eventually go to a photo gallery page with sub-menu items for each classroom gallery.",
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
  <a id="parent-resources" href="files/parent_resources.html">Recommended Reading</a>\n \
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
  <div class="dropdown">\n \
    <button class="dropbtn">\n \
      <a id="all-photos" href="files/about.html">Photo Gallery</a>\n \
    </button>\n \
    <div class="dropdown-content">\n \
      <a id="teddy-bear-photos" href="files/teddy_bear_photos.html">Teddy Bear Photos</a>\n \
      <a id="panda-bear-photos" href="files/panda_bear_photos.html">Panda Bear Photos</a>\n \
      <a id="bear-cub-photos" href="files/bear_cubs_photos.html">Bear Cub Photos</a>\n \
      <a id="big-bear-photos" href="files/big_bear_photos.html">Big Bear Photos</a>\n \
      <a id="sun-bear-photos" href="files/sun_bear_photos.html">Panda Bear Photos</a>\n \
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
          goal: "Setup Photo Gallery page using a matrix organization.",
          clusters: [
                  {
                          summary: "Adding a call to the photo gallery overview page.",
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
  <div class="dropdown">\n \
    <button class="dropbtn">\n \
      <a id="all-photos" href="files/about.html">Photo Gallery</a>\n \
    </button>\n \
    <div class="dropdown-content">\n \
      <a id="teddy-bear-photos" href="files/teddy_bear_photos.html">Teddy Bear Photos</a>\n \
      <a id="panda-bear-photos" href="files/panda_bear_photos.html">Panda Bear Photos</a>\n \
      <a id="bear-cub-photos" href="files/bear_cubs_photos.html">Bear Cub Photos</a>\n \
      <a id="big-bear-photos" href="files/big_bear_photos.html">Big Bear Photos</a>\n \
      <a id="sun-bear-photos" href="files/sun_bear_photos.html">Panda Bear Photos</a>\n \
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
  <div class="dropdown">\n \
    <button class="dropbtn">\n \
      <a id="all-photos" href="files/photo_gallery.html">Photo Gallery</a>\n \
    </button>\n \
    <div class="dropdown-content">\n \
      <a id="teddy-bear-photos" href="files/teddy_bear_photos.html">Teddy Bear Photos</a>\n \
      <a id="panda-bear-photos" href="files/panda_bear_photos.html">Panda Bear Photos</a>\n \
      <a id="bear-cub-photos" href="files/bear_cubs_photos.html">Bear Cub Photos</a>\n \
      <a id="big-bear-photos" href="files/big_bear_photos.html">Big Bear Photos</a>\n \
      <a id="sun-bear-photos" href="files/sun_bear_photos.html">Sun Bear Photos</a>\n \
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
                  {
                          summary: "Setting up a page with divs for the links to each classroom gallery.",
                          filename: 'photo_gallery.html',
                          startingCode: '<!DOCTYPE html>\n \
<html lang="en">\n \
\n \
<head>\n \
<meta charset="UTF-8">\n \
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>\n \
<meta name="viewport" content="width=device-width, initial-scale=1.0">\n \
<meta http-equiv="X-UA-Compatible" content="ie=edge">\n \
<link rel="stylesheet" type="text/css" href="files/css/about.css">\n \
<title>About | Nursery School | Washington University in St. Louis</title>\n \
</head>\n \
\n \
<body>\n \
<ts-load data-name="header"></ts-load>\n \
<div id="page-content">\n \
  <main>\n \
      <article>\n \
          <header class="page-header">\n \
              <h1 class="page-title">Wash U Bears Photo Gallery</h1>\n \
          </header>\n \
          <div class="page-content">\n \
              <h2>\n \
                  See recent pictures from all of our classrooms.\n \
              </h2>\n \
          </div>\n \
      </article>\n \
  </main>\n \
</div>\n \
<ts-load data-name="footer"></ts-load>\n \
<script src="scripts/js/app.js"></script>\n \
</body>\n \
\n \
</html>',
                          endingCode: '<!DOCTYPE html>\n \
<html lang="en">\n \
\n \
<head>\n \
<meta charset="UTF-8">\n \
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>\n \
<meta name="viewport" content="width=device-width, initial-scale=1.0">\n \
<meta http-equiv="X-UA-Compatible" content="ie=edge">\n \
<link rel="stylesheet" type="text/css" href="files/css/photo_gallery.css">\n \
<title>About | Nursery School | Washington University in St. Louis</title>\n \
</head>\n \
\n \
<body>\n \
<ts-load data-name="header"></ts-load>\n \
<div id="page-content">\n \
  <main>\n \
      <article>\n \
          <header class="page-header">\n \
              <h1 class="page-title">Wash U Bears Photo Gallery</h1>\n \
          </header>\n \
          <div class="page-content">\n \
              <h2>\n \
                  See recent pictures from all of our classrooms.\n \
              </h2>\n \
          </div>\n \
      </article>\n \
\n \
      <div class="grid">\n \
          <div><img src="https://nurseryschool.wustl.edu/files/2018/04/IMG_7947-200x200.jpg" alt="Teddy Bears"><br><a href="files/teddy_bear_photos.html">Teddy Bears</a><br>(2.5 - 3 yrs, mornings)</br></div>\n \
          <div><img src="https://nurseryschool.wustl.edu/files/2018/04/IMG_4771-e1559412173955-200x200.jpg" alt="Panda Bears"><br><a href="files/panda_bear_photos.html">Panda Bears</a><br>(2.5 - 3 yrs, afternoons)</br></div>\n \
          <div><img src="https://nurseryschool.wustl.edu/files/2018/04/IMG_7220-200x200.jpeg" alt="Bear Cubs"><br><a href="files/bear_cubs_photos.html">Bear Cubs</a><br>(3 - 4 yrs, mornings)</br></div>\n \
          <div><img src="https://nurseryschool.wustl.edu/files/2018/04/bb4-e1559243199996-200x200.jpeg" alt="Big Bears"><br><a href="files/big_bear_photos.html">Big Bears</a><br>(4 - 5 yrs, mornings)</br></div>\n \
          <div><img src="https://nurseryschool.wustl.edu/files/2018/04/IMG_0732-200x200.jpg" alt="Sun Bears"><br><a href="files/sun_bear_photos.html">Sun Bears</a><br>(4 - 5 yrs, afternoons)</br></div>\n \
      </div>\n \
  </main>\n \
</div>\n \
<ts-load data-name="footer"></ts-load>\n \
<script src="scripts/js/app.js"></script>\n \
</body>\n \
\n \
</html>',
                  },
                  {
                          summary: "CSS to display a grid view that adapts to the available screen width.",
                          filename: 'photo_gallery.css',
                          startingCode: '',
                          endingCode: '@import url("common.css");\n \
@import url("side_menu.css");\n \
\n \
.grid {\n \
display: grid;\n \
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\n \
grid-gap: 1rem;\n \
}',
                  },
          ]
  },
  {
          goal: "Create a selected class style that will provide feedback on current page.",
          clusters: [
                  {
                          summary: "Adding a selected class to a navbar entry for testing purposes.",
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
  <div class="dropdown">\n \
    <button class="dropbtn">\n \
      <a id="all-photos" href="files/photo_gallery.html">Photo Gallery</a>\n \
    </button>\n \
    <div class="dropdown-content">\n \
      <a id="teddy-bear-photos" href="files/teddy_bear_photos.html">Teddy Bear Photos</a>\n \
      <a id="panda-bear-photos" href="files/panda_bear_photos.html">Panda Bear Photos</a>\n \
      <a id="bear-cub-photos" href="files/bear_cubs_photos.html">Bear Cub Photos</a>\n \
      <a id="big-bear-photos" href="files/big_bear_photos.html">Big Bear Photos</a>\n \
      <a id="sun-bear-photos" href="files/sun_bear_photos.html">Sun Bear Photos</a>\n \
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
  <div class="dropdown, selected">\n \
    <button class="dropbtn">\n \
      <a id="all-photos" href="files/photo_gallery.html">Photo Gallery</a>\n \
    </button>\n \
    <div class="dropdown-content">\n \
      <a id="teddy-bear-photos" href="files/teddy_bear_photos.html">Teddy Bear Photos</a>\n \
      <a id="panda-bear-photos" href="files/panda_bear_photos.html">Panda Bear Photos</a>\n \
      <a id="bear-cub-photos" href="files/bear_cubs_photos.html">Bear Cub Photos</a>\n \
      <a id="big-bear-photos" href="files/big_bear_photos.html">Big Bear Photos</a>\n \
      <a id="sun-bear-photos" href="files/sun_bear_photos.html">Sun Bear Photos</a>\n \
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
                  {
                          summary: "Defining a style for a selected navbar entry.",
                          filename: 'header.css',
                          startingCode: 'header {\n \
overflow: auto;\n \
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
                          endingCode: 'header {\n \
overflow: auto;\n \
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
.selected {\n \
border-width: 1px;\n \
border-color: white;\n \
background-color: #555;\n \
}\n \
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
          ]
  },
  {
          goal: "Add logic to add and remove a selected style to items in the navbar.",
          clusters: [
                  {
                          summary: "Adding a call to setup that can modify navbar drop down items.",
                          filename: 'dynamic-dom.ts',
                          startingCode: 'import { HTMLLoader } from "../core/utils/html_loader";\n \
import { Accordion } from "./accordion";\n \
import { doSomething } from "./do-something";\n \
import { HTMLContent, itemsToCache } from "./html-imports";\n \
import { Slideshow } from "./slideshow";\n \
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
import { setupNavBar } from "./nav-bar";\n \
import { HTMLContent, itemsToCache } from "./html-imports";\n \
import { Slideshow } from "./slideshow";\n \
\n \
// Put all function calls that need to be made on every page load inside the setupAll function body.\n \
export function PutStudentPageLoadOperationsInsideThisStudentBody() {\n \
// TODO: Put all operations that you want to happen on ever page load in this function.\n \
// For example you could write: Sticky.setup()\n \
doSomething();\n \
setupNavBar();\n \
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
                          summary: "Get the drop down items and print them as a starting point.",
                          filename: 'nav-bar.js',
                          startingCode: 'export function setupNavBar() {\n \
console.log("Set up navbar! ");\n \
var dropBtns = $(".dropbtn");\n \
\n \
for (dropBtn in dropBtns) {\n \
  console.log("dropBtn: " + dropBtns)\n \
}\n \
}\n \
',
                          endingCode: 'export function setupNavBar() {\n \
console.log("Set up navbar! ");\n \
var dropBtns = document.getElementsByClassName("dropbtn");\n \
\n \
for (var dropBtn in dropBtns) {\n \
  console.log("dropBtn: " + dropBtn)\n \
}\n \
}\n \
',
                  },
                  {
                          summary: "Setup a basic onclick method for drop down navbar items. Keep track of last clicked element.",
                          filename: 'nav-bar.js',
                          startingCode: 'export function setupNavBar() {\n \
console.log("Set up navbar! ");\n \
var dropBtns = document.getElementsByClassName("dropbtn");\n \
\n \
for (var dropBtn in dropBtns) {\n \
  console.log("dropBtn: " + dropBtn)\n \
}\n \
}\n \
',
                          endingCode: 'var selectedElement = null;\n \
\n \
export function setupNavBar() {\n \
console.log("Set up navbar! " + selectedElement);\n \
var dropBtns = document.getElementsByClassName("dropbtn");\n \
\n \
for (let i = 0; i < dropBtns.length; i++) {\n \
  dropBtns[i].onclick = function() { toggleSelected(this) };\n \
}\n \
}\n \
\n \
export function toggleSelected(element) {\n \
console.log("toggle " + element.id);\n \
\n \
selectedElement = element;\n \
console.log("selected Element is " + element.id);\n \
\n \
// element.classList.add("my-class");\n \
// element.classList.remove("my-class");\n \
\n \
}\n \
',
                  },
                  {
                          summary: "Use the last clicked element (selected) to add/remove selected style to navbar drop downs.",
                          filename: 'nav-bar.js',
                          startingCode: 'var selectedElement = null;\n \
\n \
export function setupNavBar() {\n \
console.log("Set up navbar! " + selectedElement);\n \
var dropBtns = document.getElementsByClassName("dropbtn");\n \
\n \
for (let i = 0; i < dropBtns.length; i++) {\n \
  dropBtns[i].onclick = function() { toggleSelected(this) };\n \
}\n \
}\n \
\n \
export function toggleSelected(element) {\n \
console.log("toggle " + element.id);\n \
\n \
selectedElement = element;\n \
console.log("selected Element is " + element.id);\n \
\n \
// element.classList.add("my-class");\n \
// element.classList.remove("my-class");\n \
\n \
}\n \
',
                          endingCode: 'var selectedElement = null;\n \
\n \
export function setupNavBar() {\n \
console.log("Set up navbar! " + selectedElement);\n \
var dropBtns = document.getElementsByClassName("dropbtn");\n \
\n \
for (let i = 0; i < dropBtns.length; i++) {\n \
  dropBtns[i].onclick = function() { setSelected(this) };\n \
}\n \
\n \
// because the page reloads when a menu item is selected we store\n \
// the selected one and then add/remove the "selected" class\n \
// based on the recorded value\n \
showSelectedNavbarItem();\n \
}\n \
\n \
export function setSelected(element) {\n \
console.log("toggle " + element.id);\n \
\n \
selectedElement = element;\n \
console.log("selected Element is " + element.id);\n \
}\n \
\n \
export function showSelectedNavbarItem() {\n \
var dropBtns = document.getElementsByClassName("dropbtn");\n \
console.log("Setting selection for " + selectedElement);\n \
\n \
// get all the dropbtns, set up the appropriate selections\n \
for (let i = 0; i < dropBtns.length; i++) {\n \
\n \
  // if this is the selected item\n \
  if ( (selectedElement != null) &&  (dropBtns[i].id == selectedElement.id) ) {\n \
      // element.classList.add("my-class");\n \
      // dropBtns[i].classList.add(", selected");\n \
      dropBtns[i].className = "dropbtn, selected"\n \
  } else {\n \
      dropBtns[i].className = "dropbtn"\n \
  }\n \
}\n \
}\n \
',
                  },
                  {
                          summary: "Extend the drop-down logic to apply to non-drop down navbar items.",
                          filename: 'nav-bar.js',
                          startingCode: 'var selectedElement = null;\n \
\n \
export function setupNavBar() {\n \
console.log("Set up navbar! " + selectedElement);\n \
var dropBtns = document.getElementsByClassName("dropbtn");\n \
\n \
for (let i = 0; i < dropBtns.length; i++) {\n \
  dropBtns[i].onclick = function() { setSelected(this) };\n \
}\n \
\n \
// because the page reloads when a menu item is selected we store\n \
// the selected one and then add/remove the "selected" class\n \
// based on the recorded value\n \
showSelectedNavbarItem();\n \
}\n \
\n \
export function setSelected(element) {\n \
console.log("toggle " + element.id);\n \
\n \
selectedElement = element;\n \
console.log("selected Element is " + element.id);\n \
}\n \
\n \
export function showSelectedNavbarItem() {\n \
var dropBtns = document.getElementsByClassName("dropbtn");\n \
console.log("Setting selection for " + selectedElement);\n \
\n \
// get all the dropbtns, set up the appropriate selections\n \
for (let i = 0; i < dropBtns.length; i++) {\n \
\n \
  // if this is the selected item\n \
  if ( (selectedElement != null) &&  (dropBtns[i].id == selectedElement.id) ) {\n \
      // element.classList.add("my-class");\n \
      // dropBtns[i].classList.add(", selected");\n \
      dropBtns[i].className = "dropbtn, selected"\n \
  } else {\n \
      dropBtns[i].className = "dropbtn"\n \
  }\n \
}\n \
}\n \
',
                          endingCode: 'var selectedElement = null;\n \
\n \
export function setupNavBar() {\n \
console.log("Set up navbar! " + selectedElement);\n \
\n \
// nav bar items with sub-menus are dropbtns\n \
var dropBtns = document.getElementsByClassName("dropbtn");\n \
for (let i = 0; i < dropBtns.length; i++) {\n \
  dropBtns[i].onclick = function() { setSelected(this) };\n \
}\n \
\n \
// nav bar items without sub-menus are just a hrefs\n \
var navbar = document.getElementsByClassName("navbar")[0];\n \
navbar.childNodes.forEach(function(item) {\n \
  if (item.tagName == "A") {\n \
      console.log("found a navbar link");\n \
      item.onclick = function() { setSelected(this) };\n \
  }\n \
})\n \
\n \
// because the page reloads when a menu item is selected we store\n \
// the selected one and then add/remove the "selected" class\n \
// based on the recorded value\n \
showSelectedNavbarItem();\n \
}\n \
\n \
export function setSelected(element) {\n \
console.log("toggle " + element.id);\n \
\n \
selectedElement = element;\n \
console.log("selected Element is " + element.id);\n \
}\n \
\n \
export function showSelectedNavbarItem() {\n \
var dropBtns = document.getElementsByClassName("dropbtn");\n \
console.log("Setting selection for " + selectedElement);\n \
\n \
// get all the dropbtns, set up the appropriate selections\n \
for (let i = 0; i < dropBtns.length; i++) {\n \
\n \
  // if this is the selected item\n \
  if ( (selectedElement != null) &&  (dropBtns[i].id == selectedElement.id) ) {\n \
      // element.classList.add("my-class");\n \
      // dropBtns[i].classList.add(", selected");\n \
      dropBtns[i].className = "dropbtn, selected"\n \
  } else {\n \
      dropBtns[i].className = "dropbtn"\n \
  }\n \
}\n \
}\n \
',
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
