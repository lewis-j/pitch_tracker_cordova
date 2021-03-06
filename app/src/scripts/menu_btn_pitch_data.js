window.addEventListener('load', initMenu, false);

function initMenu() {
  console.log("reading new pitch");
  document.getElementById("left-nav-menu").style.left = "-18vw";

  $('#menu-btn').click(function() {

    if (document.getElementById("left-nav-menu").style.left == "-18vw") {
      document.getElementById("left-nav-menu").style.left = "0px";
      document.addEventListener("click", closeLeftMenu, true);




    } else {

      closeAllMenus();
    }



  });

  $('#edit-roster').click((e) => {
    window.location.href = "roster_edit.html";
  });
  $('#cubs-pitch').click((e) => {
    window.location.href = "pitch_data.html";
  });

  $('#pitch-tracker').click((e) => {
    window.location.href = "../index.html";
  });

  function closeAllMenus() {
    document.getElementById("left-nav-menu").style.left = "-18vw";
    removeMenuListeners();

  }

  function closeLeftMenu(event) {
    var ele = document.getElementById("left-nav-menu");
    // event.preventDefault();
    // event.stopPropagation();
    if (event.target !== ele && !ele.contains(event.target)) {
      console.log("event clicked");
      closeAllMenus()
    }

  }

  function removeMenuListeners() {
    document.removeEventListener("click", closeLeftMenu, true);

  }


}
