<?php
header("Content-Type: application/json; charset=utf-8");
require '../config/mysql2json.php';
require '../config/config.php';

$link = mysql_connect($db_host, $db_username, $db_password) OR die(mysql_error());
$db_select = mysql_select_db( $db_database ) OR die(mysql_error());
$response = array("status" => "ok");

function makeSQL($resource, $ga_kaku, $pred){
    $request = sprintf('select nikkei.date, kiji_headline from nikkei inner join %s on nikkei.kiji_id = %s.kiji_id', $resource, $resource);
    if ($ga_kaku != "" or $pred != ""){
        $request .= sprintf(" where ga_kaku = '%s' and predicate = '%s'", $ga_kaku, $pred);
    }
    $request .= " limit 10;";
    return $request;
}

$resource = "nikkei_pred";
if (s($_GET["resource"]) == "mecab"){
    $resource = "nikkei_mecab";
}

#$mysql_res = mysql_query(makeSQL($resource, "", ""));
$mysql_res = mysql_query(makeSQL($resource, s($_GET["ga_kaku"]), s($_GET["pred"])));

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
