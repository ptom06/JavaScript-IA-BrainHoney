<?PHP
session_start();
// This file is meant to be called using Ajax from anywhere. It adds lines to a log file, so some injection attacks should be cleaned out...
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Allow-Headers: *");

error_reporting(E_ALL);
ini_set('display_errors','On');
$return_json ="{";
function create($filename){
	$return_json = "{\"file_lock\":";
	
		$bytes_written = 0;										//	Initialize our file write counter
	
		//str_replace ( mixed $search , mixed $replace , mixed $subject [, int &$count ] )
		$myFile = $filename;
		$folders = array();
		preg_match_all("/^(.*[\/\\\\])([^\/\\\\]+.json)$/i", $myFile, $folders);
		//$myFile = (count($folders) > 2)?$folders[2][0]:$myFile;
		$folders = (count($folders) > 1)?$folders[1][0]:"";
		//print_r($folders);
		$folders = explode("/", $folders);
		//print_r($folders);
		$folder_trail = "./";
		foreach($folders as $folder) {
			if(!is_dir($folder_trail.$folder) && $folder != "") {
				mkdir($folder_trail.$folder);
			}
			$folder_trail .= $folder."/";
		}
		//$myFile = $_POST["type"].str_replace(" " , "","courses.".$_POST["bhCourseId"]). ".json";//Define log file
		$fh = fopen($myFile, 'w');	//	Open the log for writing! (will overwrite previous information in file)
		if(flock($fh, LOCK_EX)) {								//	Lock the file to force exclusive write
	
			$stringData = 1;									//	get the JSON string and write it to the file
			$stringData = $_POST['JSONString'];
			$bytes_written += fwrite($fh, $stringData);
	
			flock($fh, LOCK_UN); 			//	Now that we've written all the data we can unlock the file!
			fclose($fh);										//	... and close it.
	
			if($bytes_written > 0)								//	Now to let the client know what happened.
				$return_json .= '{"status":"success","bytes_written":"'.$bytes_written.'"}';
			else
				$return_json .= '{"status":"failure", "message":"Error:write failed!"}';
		} else {
			$return_json .= '{"status":"failure","message":"Error:file lock failed!"}';
		}
	
	$return_json .= ",";
}

function check(){
	global $_POST,$courseID;
	//print_r($_POST);
	$file_name_parts = array("itemID","domain","courseID","itemTitle","json");	//	These are the possible parts of the filename to check for
	$filename = "courses/".$_POST['courseTitle']."/IDONTEXIST";					//	This is purely an example... this will never (and should never) exit as a valid file
	$loopCount = 0;
	$maxLoops = count($file_name_parts)-1;
	while(!file_exists($filename) && $loopCount < $maxLoops) {
		//	Loop until the file is found...
		$filename = "courses/".$_POST['courseTitle'].((isset($_POST['courseTitle']))?"/":"");
		foreach($file_name_parts as $part) {
			//	Build the expected filename...
			$filename .= ((isset($_POST[$part]))?$_POST[$part]:$part).".";
		}
		$filename = substr($filename, 0, strlen($filename)-1);					//	Get rid of that pesky trailing "."
		//echo "Checking for ".$filename."\n";
		$removed_part = array_shift($file_name_parts);							//	Remove thee first value from		 the filename
		//echo "Removed ".$removed_part."\n";
		$loopCount++;															//	Iterate the loop counter so that we don't get all infinite on the CPU
	}
	if(file_exists($filename)){
		//echo "Found file: ".$filename."\n";
		$courseID = true;
	}else{
		//echo "Did not find file: ".$filename."\n";
		$courseID = false;
	}
	return $filename;
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
function vstart(){
	global $time_start, $_SESSION, $les_text, $timeLimit, $errorPenalty, $goalWPM, $percentPoints, $bhCourseID;
		$time_start=microtime(true);
		//$courseInfo=file_get_contents( "courses.".$bhCourseID.".txt" );
		//$obj = json_decode($courseInfo);
		$time_start = 
		$_SESSION['start'] = $time_start;
		$_SESSION['errorPenalty'] = ($errorPenalty/100);
		$_SESSION['goalWPM'] = $goalWPM;
		$_SESSION['percentPoints'] = $percentPoints;
		$_SESSION['text']=$les_text;
		$readonly="";
		$welcome="";
		
	}
	/* hit done, gets user input, parses to see differences, calculates time taken, runs GetError, calculates the number of words, finds WPM and Correct WPM and accuracy*/
function done(){
		global $word, $wpm, $totalError, $cpm, $accuracy, $user_text, $total_time, $time_start, $_SESSION, $grade, $goalWPM, $errorPenalty, $percentPoints;
		//$les_text=file_get_contents( "typingtext/0/0.txt" );
		$time_start=($_SESSION["start"]);
		$errorPenalty=$_SESSION['errorPenalty'];
		$goalWPM=$_SESSION['goalWPM'];
		$percentPoints=$_SESSION['percentPoints'];
		$les_text = $_SESSION['text'];
		$total_time=microtime(true)-$time_start;
		$char=strlen($les_text);
		$inputChar=strlen($user_text);
		$totalError = (GetError($les_text,$user_text));
		$word=substr_count($les_text,' ') + 1;
		//$word=($inputChar/5);
		$wpm=round(($inputChar/5)/($total_time / 60));
		$cpm=round((($inputChar/5)/($total_time / 60))- $totalError);
		$totalWords = ($word);
		$accuracy=100-round(GetError($les_text,$user_text) * 100 /$char);
		$readonly='readonly="readonly"';
		
		if($percentPoints == "percent"){
			if(($wpm / $goalWPM) - ($errorPenalty * $totalError) > 1){
				$grade = 1 - ($errorPenalty * $totalError);	
			}else{
				$grade = ($wpm / $goalWPM) - ($errorPenalty * $totalError);
			}
		}
		if($percentPoints == "points"){
			if((($wpm - ($errorPenalty * $totalError)) / $goalWPM)>1){
				$grade=1;	
			}else{
				$grade = (($wpm - ($errorPenalty * $totalError)) / $goalWPM);
			}
		}
	}
function getScoreTable() {
	global $word, $wpm, $totalError, $cpm, $accuracy, $user_obj, $total_time, $time_start, $grade, $percentPoints, $errorPenalty ;
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
	//testing only
	/*$results .= "   <tr>";
    $results .= "         <td class='td'><b>Grade</b> (%)</td>";
    $results .= "         <td class='td' id='accuracy'><b>".$grade."</b></td>";
    $results .= "   </tr>";
	$results .= "   <tr>";
    $results .= "         <td class='td'><b>start</b> (%)</td>";
    $results .= "         <td class='td' id='accuracy'><b>".$time_start."</b></td>";
    $results .= "   </tr>";
	$results .= "   <tr>";
    $results .= "         <td class='td'><b>total</b> (%)</td>";
    $results .= "         <td class='td' id='accuracy'><b>".$total_time."</b></td>";
    $results .= "   </tr>";
	$results .= "   <tr>";
    $results .= "         <td class='td'><b>grading</b> (%)</td>";
    $results .= "         <td class='td' id='accuracy'><b>".$percentPoints."</b></td>";
    $results .= "   </tr>";
	$results .= "   <tr>";
    $results .= "         <td class='td'><b>penalty</b> (%)</td>";
    $results .= "         <td class='td' id='accuracy'><b>".$errorPenalty."</b></td>";
    $results .= "   </tr>";*/
	//
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
		$return_json .= "\"scores\":".json_encode(getScoreTable()).", \"grade\":".json_encode($grade)."";
	break;
	case "start":
		global $les_text, $timeLimit, $errorPenalty, $goalWPM, $percentPoints, $bhCourseID;
		//$bhCourseID=$_POST['bhCourseID'];
		//only needed for testing
		$les_text = $_POST['text'];
		$timeLimit = $_POST['timeLimit'];
		$errorPenalty=$_POST['pointsOff'];
		$goalWPM=$_POST['expectedWPM'];
		$percentPoints=$_POST['errorType'];
		//
		vstart();
		$return_json .= "\"welcome\":".json_encode(startup($les_text)).", \"time\":".json_encode($timeLimit)."";
	break;
	case "create":
		$filename = check();
		echo $filename;
		create($filename);
	break;
	case "check":
		global $courseID;
		$bhCourseID = $_POST['courseID'];
		check();
		$return_json .="\"courseID\":".json_encode($courseID)."";
	break;
	default:
	break;
}
$return_json = preg_replace('/([\:,\[])\s*null\s*([,\}\]])/i', '\1"null"\2', $return_json);
echo $return_json."}";
session_write_close();
?>