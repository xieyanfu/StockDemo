<?php
header("Content-Type: application/json; charset=utf-8");
require '../config/mysql2json.php';
require '../config/config.php';

function makeSQL(){
    $request = 'select * from stockprice_brand';
    if (s($_GET["q"]) != ""){
        $request .= sprintf(" where company_name like '%s' or company_name_kana like '%s'", s($_GET["q"]), s($_GET["q"]));
    }
    $request .= " limit 5;";
    return $request;
}

$link = mysql_connect($db_host, $db_username, $db_password) OR die(mysql_error());
$db_select = mysql_select_db( $db_database ) OR die(mysql_error());
$query = makeSQL();
$res = mysql_query($query);
if( !is_string($res) ){
    $num = mysql_affected_rows($link);
    $objJSON = new mysql2json();
    echo $_GET['callback'] . "(" . (trim($objJSON->getJSON($res,$num))) . ")";
}else{
    echo $_GET['callback'] . "(" . json_encode( array('status' => 'ERROR', 'error' => 'failed') ) . ")";
}
mysql_close($link);
exit;
