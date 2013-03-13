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
	global $word, $wpm, $totalError, $cpm, $accuracy, $user_text, $total_time, $time_start, $_SESSION, $grade, $goalWPM, $errorPenalty, $percentPoints, $POST_GET, $totalError, $word_one, $word_two, $space, $string_one, $string_two, $remainder, $pri_index, $sec_index, $pri_array, $sec_array, $pri_index_array, $sec_index_array, $i, $word_count, $word_three;
		
	$user_text =$POST_GET['ui'];
	$time_start=$_SESSION['start'];
	$les_text = $_SESSION['text'];
	$goalWPM=$_SESSION['goalWPM'];
	$gradingObj = json_decode($POST_GET['gradingObj'], true);
	
	$totalError=0;
	$pri_word_one="";
	$pri_word_two="";
	$pri_word_three="";
	$sec_word_one="";
	$sec_word_two="";
	$sec_word_three="";
	$space=" ";
	$string_one="";
	$string_two="";
	$remainder="";
	$pri_index=0;
	$sec_index=0;
	$pri_array= array();
	$sec_array= array();
	$pri_index_array=array();
	$sec_index_array=array();
	$i=0;
	$x=0;
	$word_count=0;
	$stringmatch=0;
	$offset=0;
	$correct=0;
	
	foreach($gradingObj["matches"] as $position => $matchData){
		$word_one_obj =($matchData["primary"]);
		$word_two_obj =($matchData["secondary"]);
		array_push($pri_array,($word_one_obj["text"]));
		array_push($sec_array,($word_two_obj["text"]));
		array_push($pri_index_array,($word_one_obj["position"]));
		array_push($sec_index_array,($word_two_obj["position"]));
	}
	/*while($x < sizeof($pri_array)){
		if($x == 0){
			$string_one=$pri_array[$x];
			$x++;
		}else{
			$string_one=$string_one+" "+$pri_array[$x];
			$x++;
		}
	}*/
	
	function string_getter($i){
		if(($pri_index_array[$i+1]+strlen($remainder))-$pri_index_array[$i] > 5){
			$pri_word_one=$pri_array[$i];
			$string_one=$pri_word_one+" ";
			$sec_word_one=$sec_array[$i];
			$string_two=$sec_word_one+" ";
			return 0;
		}else if(($pri_index_array[$i+2]+$pri_index_array[$i+1]+strlen($remainder))-$pri_index_array[$i] > 5){
			$pri_word_one=$pri_array[$i];
			$pri_word_two=$pri_array[$i+1];
			$string_one=$pri_word_one+" "+$pri_word_two+" ";
			$sec_word_one=$sec_array[$i];
			$sec_word_two=$sec_array[$i+1];
			$string_two=$sec_word_one+" "+$sec_word_two+" ";
			return 1;
		}else{
			$pri_word_one=$pri_array[$i];
			$pri_word_two=$pri_array[$i+1];
			$pri_word_three=$pri_array[$i+2];
			$string_one=$pri_word_one+" "+$pri_word_two+" "+$pri_word_three+" ";
			$sec_word_one=$sec_array[$i];
			$sec_word_two=$sec_array[$i+1];
			$sec_word_three=$sec_array[$i+2];
			$string_two=$sec_word_one+" "+$sec_word_two+" "+$sec_word_three+" ";
			return 2;
		}
	}
	while($word_count < (strlen($string_one)/5)){
		$pri_index=string_getter($sec_index);
		$match=
		$stringmatch= substr_compare($string_one, $match[0], $offset, 5);
		if ($stringmatch == 0){
			$correct++;	
		}else{
			$totalError++;
		}
		$remainder=preg_replace("/.+".$string_one."/","", $string_two,1);
		$pri_index_array[$sec_index]= $pri_index_array + 5;
		$sec_index= $sec_index + $pri_index;
		$offset=$offset+5;
		$word_count++;
	}
	
	$total_time=microtime(true)-$time_start;
	$char=strlen($les_text);
	$inputChar=strlen($user_text);
	$word=$inputChar/5;
	$wpm=round(($inputChar/5)/($total_time / 60));
	$cpm=round((($inputChar/5)- $totalError)/($total_time / 60));
		
	if(($cpm / $goalWPM) > 1){
		$grade = 1;	
	}else{
		$grade = ($cpm / $goalWPM);
	}
	
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