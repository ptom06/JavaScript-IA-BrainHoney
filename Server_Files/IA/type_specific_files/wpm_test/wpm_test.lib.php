<?PHP
$get_typeObject = true;
$json_conf = json_decode(default_get_configuration_parameters("file"), true);
if($json_conf) {
	$prac_exam = (in_array("pracFin",array_keys($json_conf)))?$json_conf['pracFin']:"pracFin not in array";
	$return_json .= "\"pracFin\":\"".$prac_exam."\",";
	if($POST_GET['action'] == "check") {
		if(in_array("pracFin", array_keys($json_conf))) {
			if($prac_exam == "exam"){
				$type_remove_markers = array(
					array("remove"=>"all","marker"=>"CONFIG"),
					array("remove"=>"all","marker"=>"PRAC"),
					array("remove"=>"tag_only","marker"=>"EXAM")
				);
			}else{
				$type_remove_markers = array(
					array("remove"=>"all","marker"=>"CONFIG"),
					array("remove"=>"all","marker"=>"EXAM"),
					array("remove"=>"tag_only","marker"=>"PRAC")
				);
			}
		} else {
			$type_remove_markers = array(
				array("remove"=>"all","marker"=>"PRAC"),
				array("remove"=>"all","marker"=>"EXAM"),
				array("remove"=>"tag_only","marker"=>"CONFIG")
			);
		}
	} else {
		if($prac_exam == "exam"){
			$type_remove_markers = array(
				array("remove"=>"all","marker"=>"CONFIG"),
				array("remove"=>"all","marker"=>"PRAC"),
				array("remove"=>"tag_only","marker"=>"EXAM")
			);
		}else{
			$type_remove_markers = array(
				array("remove"=>"all","marker"=>"CONFIG"),
				array("remove"=>"all","marker"=>"EXAM"),
				array("remove"=>"tag_only","marker"=>"PRAC")
			);
		}
	}
} else {
	$return_json .= "\"pracFin\":\"undefined\",";
	$type_remove_markers = array(
		array("remove"=>"all","marker"=>"PRAC"),
		array("remove"=>"all","marker"=>"EXAM"),
		array("remove"=>"tag_only","marker"=>"CONFIG")
	);
}

	/*Necessary for returning the json strings*/
function startup($les_text){	
	$wpmObj = new stdClass;
	$wpmObj->les_text = $les_text;
	return $wpmObj;
}

	/* if you hit start, timer starts and text is adjusted */
function start() {
	global $les_text, $timeLimit, $errorPenalty, $goalWPM, $percentPoints, $bhCourseID, $time_start, $_SESSION, $les_text, $timeLimit, $errorPenalty, $goalWPM, $percentPoints, $bhCourseID,$POST_GET;
	
	$course_info=default_get_configuration_parameters("file");
	$conf_obj = json_decode($course_info,true);
	
	$all_texts=$conf_obj['text'];
	$timeLimit=$conf_obj['timeLimit'];
	$prac_fin=$conf_obj['pracFin'];
	$goalWPM=$conf_obj['expectedWPM'];
	
	$time_start=microtime(true);
	
	if ($prac_fin=="exam"){
		$les_text= $all_texts[array_rand($all_texts,1)];
	}else{
		$i=$POST_GET['selectedPrac'];
		if(is_numeric($i)){
			$les_text= $all_texts[$i];
		}else{
			$les_text= $all_texts[array_rand($all_texts,1)];
		}
	}
	
	$_SESSION['start'] = $time_start;
	$_SESSION['goalWPM'] = $goalWPM;
	$_SESSION['text']=$les_text;
	$readonly="";
	$welcome="";
	$return_json = "\"welcome\":".json_encode(startup($les_text)).", \"time\":".json_encode($timeLimit)."";
	return $return_json;
}
	/* hit done, gets user input, parses to see differences, calculates time taken, runs GetError, calculates the number of words, finds WPM and Correct WPM and accuracy*/
function done(){
	global $word, $wpm, $totalError,  $_SESSION, $grade, $goalWPM, $POST_GET, $total_time, $time_start, $end_time;
		
	$goalWPM=$_SESSION['goalWPM'];
	$grade_obj = $POST_GET['gradingObj'];
	$time_start=$_SESSION['start'];
	//var_dump($grade_obj);
	$wpm=$grade_obj[0];
	$word=$grade_obj[2];
	$totalError=$grade_obj[1];
	$end_time=microtime(true);
	$total_time=$time_start - $end_time;
	
	$wpm=$wpm/($total_time);
	
	if(($wpm / $goalWPM) > 1){
		$grade = 1;	
	}else{
		$grade = ($wpm / $goalWPM);
	}
	
	$return_json = "\"scores\":".json_encode(getScoreTable()).",\"time\":".json_encode($grade)."";
	return $return_json;
}
function getScoreTable() {
	global $word, $wpm, $totalError, $cpm, $accuracy, $user_obj, $total_time, $time_start, $grade, $percentPoints, $errorPenalty, $end_time;
	$results = "";
	$results .= "<table width='100%' cellpadding='6' cellspacing='0' class='ta'>";
    $results .= "	<tr>";
    $results .= "         <th width='162' class='th' style='width: 10%'><div align='left'>Parameter</div></th>";
    $results .= "         <th width='131' class='th' style='width: 10%'><div align='left'>Your result</div></th>";
    $results .= "	</tr>";
    $results .= "   <tr>"; 
    $results .= "         <td class='td'><b>Total Words</b> (#)</td>"; 
    $results .= "         <td class='td' id='totalWords'><b>".$word."</b></td>";
    $results .= "   </tr>";
    $results .= "   <tr>";
    $results .= "         <td class='td'><b>GWPM</b> (gross word per minutes)</td>";
    $results .= "         <td class='td' id='wpm'><b>".$wpm."</b></td>";
    $results .= "   </tr>";
    $results .= "   <tr>";
    $results .= "         <td class='td'><b>Errors</b> (#)</td>";
    $results .= "         <td class='td' id='totalError'><b>".$totalError."</b></td>";
    $results .= "   </tr>";
	$results .= "   <tr>";
    $results .= "         <td class='td'><b>Time</b> (#)</td>";
    $results .= "         <td class='td' id='totalError'><b>".$total_time."</b></td>";
    $results .= "   </tr>";
	$results .= "   <tr>";
    $results .= "         <td class='td'><b>Time</b> (#)</td>";
    $results .= "         <td class='td' id='totalError'><b>".$time_start."</b></td>";
    $results .= "   </tr>";
	$results .= "   <tr>";
    $results .= "         <td class='td'><b>Time</b> (#)</td>";
    $results .= "         <td class='td' id='totalError'><b>".$end_time."</b></td>";
    $results .= "   </tr>";
    return $results;
}
$default_case_set = true;
function default_case() {
	global $json_conf;
	$retString = "";
	$retString .= "\"default-case\":\"success\"";
	
	$retString .= ",\"numTexts\":\"".$json_conf['numTexts']."\"";
	
	return $retString;
}
?>