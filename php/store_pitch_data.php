<?php
include "./SQL_config.php";
$requestPayload = file_get_contents("php://input");

$object = json_decode($requestPayload);

$_id = NULL;
	 // insert into game_pitchers table.
	// PlayerData from UI
	 try{
			// pitchData from UI
	 // Query database to get last game_pitchers table entry.
	 // Need pitchers_id to make foreign fk_pitchers_id entry in
	 //   game_pitches table.
	 $sql = "SELECT `pitchers_id`
							FROM `srjc_game-pitchers`
							ORDER BY pitchers_id DESC
							LIMIT 1";
	$statement = $myconn -> prepare($sql);
	$statement -> execute();
    $statement -> bind_result($pid);
    if($statement -> fetch()){
    	$statement -> close();
    	$sqlGetPitch = "INSERT INTO `$mydbname`.`srjc_game-pitches`  (
			`pitches_id` ,
			`fk_pitchers_id` ,
			`time`,
			`pitchspeed` ,
			`pitchCount` ,
			`batterhandness` ,
			`endPlay` ,
			`firstpitch` ,
			`pitchType` ,
			`play` ,
			`xCoord` ,
			`yCoord`
			)
			VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";

			$pitchStatement = $myconn -> prepare($sqlGetPitch);

			foreach($object as $value){
			$pitchStatement -> bind_param("iisiisssssdd",$_id,$pid,$value -> timeStamp, $value-> pitchSpeed,$value ->gameCount->pitchCount,$value->batterHandedness,$value->endPlay,$value->firstPitch,$value->pitchType,$value->play,$value->xCoord,$value->yCoord);
			$pitchStatement -> execute();
			}

			$pitchStatement ->close();
     echo json_encode($responseObj); 

    }else{
   $statement -> close();
    }

	 } catch(Exception $e) {
        // echo "<pre>";
        // print_r($e);
        // echo "</pre>";
        echo "<h1>Database Connection Error!</h1>".$e;
        var_dump("Database Connection Error!");
        // do I use die() to cease running my code now?
        // could do include() here possible
        die ( "<h2>Final message</h2>" );
        // or do I choose to handle this differently?
        // header "Location: error.html";
    }



 $myconn-> close();

?>
