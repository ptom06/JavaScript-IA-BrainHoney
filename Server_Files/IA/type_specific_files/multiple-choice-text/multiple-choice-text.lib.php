<?PHP

if($POST_GET['action'] == "check") {
	if(default_get_configuration_parameters("student")) {
		$type_remove_markers = array(
			array("remove"=>"all","marker"=>"CONFIG"),
			array("remove"=>"tag_only","marker"=>"INPUT")
		);
	} else {
		$type_remove_markers = array(
			array("remove"=>"all","marker"=>"INPUT"),
			array("remove"=>"tag_only","marker"=>"CONFIG")
		);
	}
}

function done(){
	global $_SESSION, $POST_GET;
	$return_json = "";
	$filepath = default_get_configuration_parameters("configlocation");
	$return_json .= "\"filepath\":\"".$filepath."\",";
	if(!file_exists($filepath)) {
		$return_json .= "\"ERROR\":\"Config file not found: (".$filepath.") ".$e."\"";
		return $return_json;
	}
	$configHandle = fopen($filepath,"r");
	try {
		$c = json_decode(fread($configHandle, filesize($filepath)));
	} catch (Exception $e) {
		$return_json .= "\"ERROR\":\"Could not load config file: (".$filepath.") ".$e."\"";
		return $return_json;
	}
	try {
		$a = json_decode($POST_GET['JSONString']);
	} catch (Exception $e) {
		$return_json .= "\"ERROR\":\"Could not parse student input. ".$e."\"";
		return $return_json;
	}
	fclose($configHandle);
	if(!is_numeric($a->{'inputField'})) {
		$return_json .= "\"ERROR\":\"Your response needs to be a number.\"";
		return $return_json;
	}
	try {
		$grade = $c->{'points'} + (($c->{'penalty'} / $c->{'deviance'}) * ( $c->{'grace'} - abs($c->{'correct'} - $a->{'inputField'})));
	} catch (Exception $e) {
		$return_json .= "\"ERROR\":\"Problems producing a grade. ".$e."\"";
		return $return_json;
	}
	if($grade > $c->{'points'})	$grade = $c->{'points'};
	if($grade < 0)				$grade = 0;
	$points_awarded = $grade;
	$grade = $grade / $c->{'points'};
	$return_json .= "\"feedback\":\"The correct answer was ".$c->{'correct'}.". You got ".$points_awarded." out of ".$c->{'points'}."\",";
	$return_json .= "\"grade\":".json_encode($grade)."";
	return $return_json;
}
?>