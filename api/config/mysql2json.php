<?php

/**
 * Filename: mysql2json.class.php
 * Purpose: Convert mysql resultset data into JSON(http://json.org) format
 * Author: Adnan Siddiqi <kadnan@gmail.com>
 * License: PHP License
 * Date: Tuesday,June 21, 2006
 *
 */
class mysql2json {

	function getJSON($resultSet, $affectedRecords) {
		$numberRows = 0;
		$arrfieldName = array();
		$i = 0;
		$json = "";
		while ($i < mysql_num_fields($resultSet)) {
			$meta = mysql_fetch_field($resultSet, $i);
			if ($meta) {
				$arrfieldName[$i] = $meta->name;
			}
			$i++;
		}
		$i = 0;
		$json = "{\"status\":\"OK\",\"data\": [";
		while ($row = mysql_fetch_array($resultSet, MYSQL_NUM)) {
			$i++;
			$json.="{";
			for ($r = 0; $r < count($arrfieldName); $r++) {
				$json.="\"$arrfieldName[$r]\":\"" . str_replace("\"", "\\\"", $row[$r]) . "\"";
				if ($r < count($arrfieldName) - 1) {
					$json.=",";
				} else {
					$json.="";
				}
			}
			if ($i != $affectedRecords) {
				$json.="},";
			} else {
				$json.="}";
			}
		}
		$json.="]}";
		return $json;
	}

}