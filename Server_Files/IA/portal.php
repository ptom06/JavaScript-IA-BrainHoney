<?PHP
session_start();
// This file is meant to be called using Ajax from anywhere. It adds lines to a log file, so some injection attacks should be cleaned out...
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Allow-Headers: *");

error_reporting(E_ALL);
ini_set('display_errors','On');
$return_json ="{";

/*	IE will only "POST" with a content-type of text/plain - therefore we have to parse it out of the raw header (which we custom-built into our IE $.post	*/
/*	reference: https://github.com/MoonScript/jQuery-ajaxTransport-XDomainRequest	*/
if(isset($HTTP_RAW_POST_DATA)) {
	parse_str($HTTP_RAW_POST_DATA, $_POST);
}
$POST_GET = array_merge($_POST, $_GET);

//	The following will ensure that the properly library of functions is called and exists
if(!isset($POST_GET['ia_type'])) {
	$return_json .= "\"ERROR\":\"IA Type undefined!\"";
	echo $return_json."}";
	session_write_close();
	exit;
}

$default_case_set = false;
try {
	$get_typeObject = null;
	require_once("type_specific_files/".$POST_GET['ia_type']."/".$POST_GET['ia_type'].".lib.php");
	if($POST_GET['action'] == "check" || !is_null($get_typeObject)) {
		$typeObjectFH = fopen("type_specific_files/".$POST_GET['ia_type']."/typeObject.lib.json", "r");
		$typeObject = fread($typeObjectFH, filesize("type_specific_files/".$POST_GET['ia_type']."/typeObject.lib.json"));
		$return_json .= "\"file-modified-time\":\"".date("r", filemtime("type_specific_files/".$POST_GET['ia_type']."/typeObject.lib.json"))."\",";
		fclose($typeObjectFH);
		//$typeObject = preg_replace("/\\/","\\\\",$typeObject);
		//$typeObject = preg_replace("/\"/","\\\"",$typeObject);
		$typeObject = preg_replace("/\/\/[^\n\r]+[\r\n]/i","",$typeObject);
		$typeObject = preg_replace("/[\t\n\r]/i","",$typeObject);
		$typeObject = preg_replace("/\"\s*\+\s*\"/i","",$typeObject);
		$typeObject = preg_replace("/\"\s*\+\s*\"/i","",$typeObject);
		$typeObject = preg_replace("/\/\*[.\r\n\s]+\*\//imU","",$typeObject);
	}
} catch(Exception $e) {
	$return_json .= "\"ERROR\": \"".$e."\"";
	echo $return_json."}";
	session_write_close();
	exit;
}
//	The following will ensure the the required functions have been defined within the libraries

function create($filename=null){
	global $POST_GET;
	if(is_null($filename))
		$filename = check("file");
	$return_json = "\"filename\":".json_encode($filename);
	$return_json .= ",\"file_lock\":{";
	
		$bytes_written = 0;										//	Initialize our file write counter
	
		//str_replace ( mixed $search , mixed $replace , mixed $subject [, int &$count ] )
		$myFile = $filename;
		$folders = array();
		//echo $myFile;
		preg_match_all("/^(.+[\/\\\\])([^\/\\\\]+.json)$/i", $myFile, $folders);
		//$myFile = (count($folders) > 2)?$folders[2][0]:$myFile;
		//print_r($folders);
		if(count($folders) > 1) {
			$folders = (count($folders[1]) >= 1)?$folders[1][0]:"";
			//print_r($folders);
			$folders = explode("/", $folders);
			//print_r($folders);
			$folder_trail = "./";
		} else {
			$folders = array();
			$return_json .= "\"ERROR\":\"Save file location invalid; ".$myFile."\",";
		}
		//print_r($folders);
		foreach($folders as $folder) {
			if(!is_dir($folder_trail.$folder) && $folder != "") {
				//echo $folder_trail.$folder."\n";
				mkdir($folder_trail.$folder);
			}
			$folder_trail .= $folder."/";
		}
		//$myFile = $POST_GET["type"].str_replace(" " , "","courses.".$POST_GET["bhCourseId"]). ".json";//Define log file
		$fh = fopen($myFile, 'w');	//	Open the log for writing! (will overwrite previous information in file)
		if(flock($fh, LOCK_EX)) {								//	Lock the file to force exclusive write
	
			$stringData = 1;									//	get the JSON string and write it to the file
			$stringData = $POST_GET['JSONString'];
			$bytes_written += fwrite($fh, $stringData);
	
			flock($fh, LOCK_UN); 			//	Now that we've written all the data we can unlock the file!
			fclose($fh);										//	... and close it.
	
			if($bytes_written > 0)								//	Now to let the client know what happened.
				$return_json .= '"status":"success","bytes_written":"'.$bytes_written.'"';
			else
				$return_json .= '"status":"failure", "message":"Error:write failed!"';
		} else {
			$return_json .= '"status":"failure","message":"Error:file lock failed!"';
		}
	
	$return_json .= "}";
	return $return_json;
}

/*
	*	To use this function:
		1. Give it no parameters and receive
			a) JSON string containing the "courseID" (which will tell you if the access is for configuration or for student interaction)
			b) the file that contains the grading configuration (or will when the configuration is saved)
		2. Give it "student" to get the boolean return of whether or not this is the configuration interface or not.
		3. Anything else (except nothing) will return the file path that needs to be opened to retrieve the configuration.
*/
function check($return_val="json"){
	global $POST_GET,$courseID,$prac_exam;
	$bhCourseID = $POST_GET['courseID'];
	//print_r($POST_GET);
	$file_name_parts = array("itemID","domain","courseID","itemTitle","json");	//	These are the possible parts of the filename to check for
	$filename = "courses/".cleanString($POST_GET['courseTitle'])."/IDONTEXIST";					//	This is purely an example... this will never (and should never) exit as a valid file
	$loopCount = 0;
	$maxLoops = count($file_name_parts)-1;
	while(!file_exists($filename) && $loopCount < $maxLoops) {
		//	Loop until the file is found...
		$filename = "courses/".cleanString($POST_GET['courseTitle']).((isset($POST_GET['courseTitle']))?"/":"");
		foreach($file_name_parts as $part) {
			//	Build the expected filename...
			$filename .= cleanString((isset($POST_GET[$part]))?$POST_GET[$part]:$part).".";
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
	
	$conf_obj = json_decode($filename,true);
	$prac_exam=$conf_obj['pracFin'];
	
	if($return_val == "json")
		return "\"courseID\":".json_encode($courseID).",\"filename\":\"".$filename."\"";
	else if($return_val == "student") {
		if(file_exists($filename))
			return true;
		else
			return false;
	}else
		return $filename;
}

function cleanString($str) {
	return preg_replace("/[^\w\d]/","-",preg_replace("/\s/","_",$str));
}

/*$typeObjectStudent = "";
$typeObjectTeacher = "{" .
	"\"simple_text\": {" . 
			"\"inputElementsString\":\"<input type=\\\"text\\\" id=\\\"submitString\\\"/><input type=\\\"button\\\" id=\\\"submitButton\\\" value=\\\"submit\\\"/>\"" .
			",\"methods\": " . 
				"[" . 
					"{" . 
						"\"name\": \"submitClick\"" . 
						",\"type\": \"click\"" . 
						",\"id\": \"submitButton\"" . 
						",\"handler\": \"function() {" . 
							"alert($(\\\"#submitString\\\").val());" .  //this works properly for attaching events
						"}\"" . 
					"}" . 
				"]" .  
	"}" . 
	"}";*/
switch($POST_GET['action']) {
	case "done":
		$return_json .= done();
	break;
	case "start":
		$return_json .= start();
	break;
	case "create":
		$return_json .= create();
	break;
	case "check":
		$return_json .= check();
		
		if(check("student")) {
			if($prac_exam =="exam"){
				$typeObject = preg_replace("/\#EXAM\#/iU","",$typeObject);
				$typeObject = preg_replace("/\#PRAC\#.+\#PRAC\#/iU","",$typeObject);
				$typeObject = preg_replace("/\#CONFIG\#.+\#CONFIG\#/iU","",$typeObject);
			}else{
				$typeObject = preg_replace("/\#PRAC\#/iU","",$typeObject);
				$typeObject = preg_replace("/\#EXAM\#.+\#EXAM\#/iU","",$typeObject);
				$typeObject = preg_replace("/\#CONFIG\#.+\#CONFIG\#/iU","",$typeObject);
			}
		} else {
			$typeObject = preg_replace("/\#CONFIG\#/iU","",$typeObject);
			$typeObject = preg_replace("/\#EXAM\#.+\#EXAM\#/iU","",$typeObject);
			$typeObject = preg_replace("/\#PRAC\#.+\#PRAC\#/iU","",$typeObject);
		}
		$return_json .= ",\"typeObject\":".$typeObject;
	break;
	default:
		if(function_exists($POST_GET['action'])) {
			$return_json .= eval("return ".$POST_GET['action']."();");
		} else {
			$return_json .= "\"error\":\"\\\"".$POST_GET['action']."\\\" function not defined in lib\"";
		}
	break;
}
$return_json = preg_replace('/([\:,\[])\s*null\s*([,\}\]])/i', '\1"null"\2', $return_json);
echo $return_json."}";
session_write_close();
?>