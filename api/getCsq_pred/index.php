<?php
header("Content-Type: application/json; charset=utf-8");
require '../config/mysql2json.php';
require '../config/config.php';

$link = mysql_connect($db_host, $db_username, $db_password) OR die(mysql_error());
$db_select = mysql_select_db( $db_database ) OR die(mysql_error());
$response = array("status" => "ok");

function makeSQL($brand_code){
    $request = "";
    if ($brand_code != ""){
        $request = sprintf("select word, res_%s from nikkei_chiSquare order by res_%s desc limit 5;", $brand_code, $brand_code);
    }
    return $request;
}

foreach(split(',',s($_GET["brand_code"])) as $brand_code){
    if ($brand_code == ""){
        $brand_code = "0101";
    }
    $mysql_res = mysql_query(makeSQL($brand_code));
    if (!is_string($mysql_res)){
        while($row = mysql_fetch_array($mysql_res, MYSQL_ASSOC)){
            $response["data"][$brand_code][] = $row;
        }
    }
    else{
        $response["error"] = "NO DATA";
    }
}

if (s($_GET["format"]) == "json"){
        echo json_encode($response);
}
else {
        echo $_GET['callback'] . "(" . json_encode($response) . ")";
}
mysql_close($link);
exit;
