<?php
header("Content-Type: application/json; charset=utf-8");
require '../config/mysql2json.php';
require '../config/config.php';

function makeSQL(){
    $request = 'select * from stockprice';
    if (s($_GET["brand_code"]) != ""){
        $request .= sprintf(" where brand_code = '%s'", s($_GET["brand_code"]));
    }
    else {
        $request .= sprintf(" where brand_code = '0101'");
    }
    $request .= " limit 5;";
    return $request;
}

$link = mysql_connect($db_host, $db_username, $db_password) OR die(mysql_error());
$db_select = mysql_select_db( $db_database ) OR die(mysql_error());
$res = mysql_query(makeSQL());
if( !is_string($res) ){
    $num = mysql_affected_rows($link);
    $objJSON = new mysql2json();
    echo $_GET['callback'] . "(" . (trim($objJSON->getJSON($res,$num))) . ")";
}else{
    echo $_GET['callback'] . "(" . json_encode( array('status' => 'ERROR', 'error' => 'failed') ) . ")";
}
mysql_close($link);
exit;
