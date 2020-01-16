function storeData(PlayerData) {

	return xhrPost(PlayerData, "store_player_data.php");

}

function bulkStoreData(pitchesData) {

	return xhrPost(pitchesData, "store_pitch_data.php");

}

function getRosterList(){

			return xhrPost(null, "get_team_list.php");
}

function getRoster(){

			 return xhrPost(null, "get_team.php");
}

function xhrPost(sqlCallData, uri){

	return new Promise(function(resolve, reject){
var xhttp = new XMLHttpRequest();
xhttp.open("POST",url + uri);


xhttp.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE){
			if(this.status === 200) {
      console.log("xhttp Response:", xhttp.response);
      var obj = JSON.parse(xhttp.response);
				resolve(obj);

	 } else{
		    reject({
					 status: xhttp.status,
					 statusText: xhttp.statusText
				 });
	 }
 }
};
xhttp.onerror = function () {
console.error("** An error occurred during the transaction");
};

xhttp.send(JSON.stringify(sqlCallData));
});
}
