

window.addEventListener('load', OnMenuReady, false);

function OnMenuReady() {

	  document.getElementById("left-nav-menu").style.left = "-18vw";

  $('#menu-btn').click(function() {

    if (document.getElementById("left-nav-menu").style.left == "-18vw") {
      document.getElementById("left-nav-menu").style.left = "0px";
      $(".main").get(0).addEventListener("click", closeLeftMenu, true);
		if($(".nav-close").length){
			$(".nav-close").get(1).addEventListener("click", closeLeftMenu, true);
		}




    }
    else {

      closeAllMenus();
    }



  });

  $('#edit-roster').click((e)=>{
       window.location.href = "season_select_menu.html";
  });
	$('#cubs-pitch').click((e)=>{
       window.location.href = "pitchData.html";
  });

    $('#pitch-tracker').click((e)=>{
       window.location.href = "../index.html";
  });

  function closeAllMenus() {
    document.getElementById("left-nav-menu").style.left = "-18vw";
    removeMenuListeners();

  }

  function closeLeftMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById("left-nav-menu").style.left = "-18vw";
    removeMenuListeners();
  }

  function removeMenuListeners() {
    $(".main").get(0).removeEventListener("click", closeLeftMenu, true);
    $(".nav-close").get(1).removeEventListener("click", closeLeftMenu, true);

  }


}
