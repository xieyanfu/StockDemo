<?php

// defines
define("STATUS_OK", 1);
define("STATUS_NO", 2);

// database config variables
$db_host = 'rubicon.cs.scitec.kobe-u.ac.jp';
$db_database = 'fujikawa';
$db_username = 'fujikawa';
$db_password = 'cs24';

// include json_encode
if (!function_exists("json_encode")) {

	function json_encode($object) {
		require_once("JSON.php");
		$json = new Services_JSON();
		return $json->encode($object);
	}

}

// connect db
function connectDb() {
	global $db_host;
	global $db_username;
	global $db_password;
	global $db_database;
	$connection = mysql_connect($db_host, $db_username, $db_password);
	if (!$connection) {
		return mysql_error();
	}
	$db_select = mysql_select_db($db_database);
	if (!$db_select) {
		return mysql_error();
	}
	return $connection;
}

// sanitizing for SQL
function s($s) {
	return mysql_real_escape_string($s);
}

// html escape
function h($s) {
	return htmlspecialchars($s);
}

// templete json response and exit
function exitWithJson($st) {
	if ($st == STATUS_OK) {
		print('{ "status":"OK", "data": [ ] }');
	}
	if ($st == STATUS_NO) {
		print('{ "label":"NO MATCH RESULTS", "comment":"データがありません。"}');
	}
	exit;
}

// Check if the input from alphanumeric characters only
function isAlphanumeric($in) {
	return !mb_ereg('[^0-9a-zA-Z]', $in);
}