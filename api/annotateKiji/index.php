<?php
header("Content-Type: application/json; charset=utf-8");
require '../config/mysql2json.php';
require '../config/config.php';

$link = mysql_connect($db_host, $db_username, $db_password) OR die(mysql_error());
$db_select = mysql_select_db( $db_database ) OR die(mysql_error());
$response = array("status" => "ok");

function makeSQL(){
	if ((s($_GET["rate"]) != null) and (s($_GET["kiji_id"]) != null)){
		$request = sprintf('update nikkei set rate = %d where kiji_id = "%s";', s($_GET["rate"]), s($_GET["kiji_id"]));
	}
	return $request;
}

$mysql_res = mysql_query(makeSQL());
if (!is_string($mysql_res)){
	$response["request"] = makeSQL();
	$response["response"] = $mysql_res;
}
else{
    $response["data"] = "";
    $response["error"] = "no data";
}

if (s($_GET["format"]) == "json"){
    echo json_encode($response);
}
else {
    echo $_GET['callback'] . "(" . json_encode($response) . ")";
}

mysql_close($link);
exit;
