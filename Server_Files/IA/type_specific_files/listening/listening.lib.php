<?PHP
function start(){
	global $_SESSION;
	$time_start=microtime(true);
	$_SESSION['start'] = $time_start;
	$return_json = "\"time\":".json_encode($time_start)."";
	return $return_json;
}
	/* hit done, gets user input, parses to see differences, calculates time taken, runs GetError, calculates the number of words, finds WPM and Correct WPM and accuracy*/
function done(){
	global $_SESSION, $POST_GET;
	$return_json = "";
	$filepath = check("filepath");
	//$return_json .= "\"filepath\":\"".$filepath."\"";
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