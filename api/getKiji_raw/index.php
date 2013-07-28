<?php
header("Content-Type: application/json; charset=utf-8");
require '../config/mysql2json.php';
require '../config/config.php';

$link = mysql_connect($db_host, $db_username, $db_password) OR die(mysql_error());
$db_select = mysql_select_db( $db_database ) OR die(mysql_error());
$response = array("status" => "ok");

function makeSQL(){
    $request = 'select kiji_id, date, kiji_headline, kiji_midashi, rate from nikkei';
    if (s($_GET["type"]) == "view"){
        if(s($_GET["start"]) != null){
            $request .= sprintf(" where rate is not NULL order by rate desc limit %d, 10;", s($_GET["start"]));
        }
        else{
            $request .= sprintf(" where rate is not NULL order by rate desc limit 10;");
        }
    }
    else {
        $request .= sprintf(" where rate is NULL limit 1;");
    }
	return $request;
}

$mysql_res = mysql_query(makeSQL());
if (!is_string($mysql_res)){
    while($row = mysql_fetch_array($mysql_res, MYSQL_ASSOC)){
        $response["data"][] = $row;
    }
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
