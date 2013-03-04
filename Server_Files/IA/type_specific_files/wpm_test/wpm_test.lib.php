<?PHP
$json_conf = json_decode(default_get_configuration_parameters("file"), true);
if($json_conf) {
	$prac_exam = $json_conf['pracFin'];
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

	/*function to determine the number of errors */
function GetError($str1,$str2){
		$error=0;
		for($i=0;$i<strlen($str1);$i++){
			if(isset($str2[$i])){
				if($str1[$i] !=$str2[$i])
				$error++;
				} else
			$error++;
		}
		return $error;
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
	global $word, $wpm, $totalError, $cpm, $accuracy, $user_text, $total_time, $time_start, $_SESSION, $grade, $goalWPM, $errorPenalty, $percentPoints, $POST_GET;
	
	$course_info=default_get_configuration_parameters("file");
	$conf_obj = json_decode($course_info,true);
	
	$goalWPM=$conf_obj['expectedWPM'];
	$missingWordError=$conf_obj['missedWord'];
	$extraWordError=$conf_obj['extraWord'];	
	$oneLetterError=$conf_obj['oneLetterError'];
	$twoLetterError=$conf_obj['twoLetterError'];
	$manyErrors=$conf_obj['manyErrors'];
		
	$user_text =$POST_GET['ui'];
	$time_start=$_SESSION['start'];
	$les_text = $_SESSION['text'];
	$gradingObj = json_decode($POST_GET['gradingObj'], true);
	$oneWrong=0;
	$twoWrong=0;
	$manyWrong=0;
	$extraWord=0;
	$missingWord=0;
	$totalError=0;
	
	$earliestTimestamp = 0;
	$latestTimestamp = 10000000000000;
	foreach($gradingObj["matches"] as $position => $matchData){
		$error_code =($matchData["code"]);
		switch ($error_code){
			case "EM"://exact match- no penalty
				break;
			case "1L"://1 letter wrong
				$oneWrong++;
				$totalError++;
				break;
			case "EW"://extra word
				$extraWord++;
				$totalError++;
				break;
			case "MW"://missing word
				$missingWord++;
				$totalError++;
				break;
			case "2L":// 2 letters wrong
				$twoWrong++;
				$totalError++;
				break;
			default:// more than 2 letters
				$manyWrong++;
				$totalError++;
			
		}
		
	}
		
	$total_time=microtime(true)-$time_start;
	$char=strlen($les_text);
	$inputChar=strlen($user_text);
	$word=$inputChar/5;
	$wpm=round(($inputChar/5)/($total_time / 60));
	$cpm=round((($inputChar/5)/($total_time / 60))- $totalError);
	$totalWords = $inputChar/5;
	$accuracy=100-round(GetError($les_text,$user_text) * 100 /$char);
	
	$grade = ($word/($total_time-($oneWrong*$oneLetterError)-($extraWord*$extraWordError)-($missingWord*$missingWordError)-($twoWrong*$twoLetterError)-($manyWrong*$manyErrors)));	
	
	
	$return_json = "\"scores\":".json_encode(getScoreTable()).", \"grade\":".json_encode($grade)."";
	return $return_json;
}
function getScoreTable() {
	global $word, $wpm, $totalError, $cpm, $accuracy, $user_obj, $total_time, $time_start, $grade, $percentPoints, $errorPenalty ;
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
    $results .= "         <td class='td'><b>CWPM</b> (correct words per minutes)</td>"; 
    $results .= "         <td class='td' id='cpm'><b>".$cpm."</b></td>";
    $results .= "   </tr>";
    $results .= "   <tr>";
    $results .= "         <td class='td'><b>Accuracy</b> (%)</td>";
    $results .= "         <td class='td' id='accuracy'><b>".$accuracy."</b></td>";
    $results .= "   </tr>";
	//testing only
	$results .= "   <tr>";
    $results .= "         <td class='td'><b>Grade</b> (%)</td>";
    $results .= "         <td class='td' id='accuracy'><b>".$grade."</b></td>";
    $results .= "   </tr>";
    $results .= "</table>";
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