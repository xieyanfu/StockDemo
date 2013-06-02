<?php
header("Content-Type: application/json; charset=utf-8");
require '../config/mysql2json.php';
require '../config/config.php';

$link = mysql_connect($db_host, $db_username, $db_password) OR die(mysql_error());
$db_select = mysql_select_db( $db_database ) OR die(mysql_error());
$response = array("status" => "ok");

function makeSQL($brand_code){
    $request = 'select * from stockprice';
    if ($brand_code != ""){
        $request .= sprintf(" where brand_code = '%s'", $brand_code);
    }
    else {
        $request .= sprintf(" where brand_code = '0101'");
    }
    $request .= sprintf(" and (market_category = 't1' or market_category = 'i')");

    if (s($_GET["from"]) != "" and s($_GET["to"]) != ""){
        $request .= sprintf(" and date between '%s' and '%s'", s($_GET["from"]), s($_GET["to"]));
    }
    else {
        $request .= sprintf(" and date between '2008-01-01' and '2008-01-08'");
    }
    return $request;
}

$dates = array();
foreach(split(',',s($_GET["brand_code"])) as $brand_code){
    if ($brand_code == ""){
        $brand_code = "0101";
    }
    $mysql_res = mysql_query(makeSQL($brand_code));
    if (!is_string($mysql_res)){
        while($row = mysql_fetch_array($mysql_res, MYSQL_ASSOC)){
            $response["data"]["stockprices"][$brand_code][$row["date"]] = $row;
            if (in_array($row["date"], $response["data"]["dates"]) == FALSE){
                $response["data"]["dates"][] = $row["date"];
            }
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
