<?php
header("Content-Type: application/json; charset=utf-8");
require '../config/mysql2json.class.php';
require '../config/config.php';

$link = mysql_connect($db_host, $db_username, $db_password) OR die(mysql_error());
$db_select = mysql_select_db( $db_database ) OR die(mysql_error());
$query = sprintf('SELECT cityName_ja, cityId, countryName_en FROM cityInfo WHERE cityName_en LIKE %s ORDER BY tourcount DESC LIMIT 5;', $_GET["q"]);
$res = mysql_query($query);
if( !is_string($res) ){
    $num = mysql_affected_rows($link);
    $objJSON = new mysql2json();
    print(trim($objJSON->getJSON($res,$num)));
}else{
    echo json_encode( array('status' => 'SQL_ERROR', 'error' => 'clipget_failed') );
}
mysql_close($link);
exit;
