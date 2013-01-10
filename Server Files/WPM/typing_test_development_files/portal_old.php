<?PHP 
// This file is meant to be called using Ajax from anywhere. It adds lines to a log file, so some injection attacks should be cleaned out...
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Allow-Headers: *");
/*?>
<?php 

	$bytes_written = 0;										//	Initialize our file write counter
	
	//str_replace ( mixed $search , mixed $replace , mixed $subject [, int &$count ] )
	
	$myFile = $_POST["type"] . str_replace(" " , "", $_POST["bhCourseTitle"]). ".txt";								//	Define log file
	$fh = fopen($myFile, 'w');								//	Open the log for writing! (will overwrite previous information in file)
	if(flock($fh, LOCK_EX)) {								//	Lock the file to force exclusive write
		
		$stringData =  $_POST["JSONString"];				//	get the JSON string and write it to the file
		$bytes_written += fwrite($fh, $stringData);
		
		flock($fh, LOCK_UN); 								//	Now that we've written all the data we can unlock the file!
		fclose($fh);										//	... and close it.
		
		if($bytes_written > 0)								//	Now to let the client know what happened.
			echo '{"status":"success","bytes_written":"'.$bytes_written.'"}';
		else
			echo '{"status":"failure", "message":"Error:write failed!"}';
	} else {
		echo '{"status":"failure","message":"Error:file lock failed!"}';
	}
*/?>
<?PHP
session_start();
$return_json = "{";
/*Define variables*/
	$readonly='readonly="readonly"';
	$les_text=file_get_contents( "typingtext/0/0.txt" );
	$time_start=0;
	
	
function startup($les_text){	
	$wpmObj = new stdClass;
	$wpmObj->les_text = $les_text;
	return $wpmObj;
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
	/* if you hit start, timer starts and text is adjusted */
function vstart(){
	global $time_start, $_SESSION; 
		$time_start=microtime(true);
		$_SESSION['start'] = $time_start;
		$readonly="";
		$welcome="";
		$les_text=file_get_contents( "typingtext/0/0.txt" );
	}
	/* hit done, gets user input, parses to see differences, calculates time taken, runs GetError, calculates the number of words, finds WPM and Correct WPM and accuracy*/
function done(){
		global $word, $wpm, $totalError, $cpm, $accuracy, $user_text, $total_time, $time_start, $_SESSION;
		$les_text=file_get_contents( "typingtext/0/0.txt" );
		$time_start= ($_SESSION["start"]);
		$total_time=microtime(true)-$time_start;
		$char=strlen($les_text);
		$inputChar=strlen($user_text);
		$totalError = (GetError($les_text,$user_text));
		$word=substr_count($les_text,' ') + 1;
		$wpm=round(($inputChar/5)/($total_time / 60));
		$cpm=round((($inputChar/5)/($total_time / 60))- $totalError);
		$totalWords = ($word);
		$accuracy=100-round(GetError($les_text,$user_text) * 100 /$char);
		$readonly='readonly="readonly"';			
	}
function getScoreTable() {
	global $word, $wpm, $totalError, $cpm, $accuracy, $user_obj, $total_time, $time_start ;
	$results = "";
	$results .= "<table width='449' cellpadding='6' cellspacing='0' class='ta'>";
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
	$results .= "   <td>&nbsp;</td>";
    $results .= "</table>";
	return $results;
}
$POST_GET = array_merge($_POST, $_GET);
switch($POST_GET['action']) {
	case "done":
		global $user_text;
		$user_text =$_POST['ui'];
		done();
		$return_json .= "\"scores\":".json_encode(getScoreTable()).", \"grade\":".json_encode($cpm)."";
	break;
	case "start":
		vstart();
		$return_json .= "\"welcome\":".json_encode(startup($les_text))."";
	break;
	default:
	break;
}
$return_json = preg_replace('/([\:,\[])\s*null\s*([,\}\]])/i', '\1"null"\2', $return_json);
echo $return_json."}";
session_write_close();
?>
