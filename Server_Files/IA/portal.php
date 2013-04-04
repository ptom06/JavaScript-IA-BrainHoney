<?PHP
session_start();
// This file is meant to be called using Ajax from anywhere. It adds lines to a log file, so some injection attacks should be cleaned out...
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Allow-Headers: *");

error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors','On');
$return_json ="{";

/*	IE will only "POST" with a content-type of text/plain - therefore we have to parse it out of the raw header (which we custom-built into our IE $.post	*/
/*	reference: https://github.com/MoonScript/jQuery-ajaxTransport-XDomainRequest	*/
if(isset($HTTP_RAW_POST_DATA)) {
	parse_str($HTTP_RAW_POST_DATA, $_POST);
}
$POST_GET = array_merge($_POST, $_GET);

date_default_timezone_set('America/Denver');

//	The following will ensure that the properly library of functions is called and exists
if(!isset($POST_GET['ia_type'])) {
	$return_json .= "\"ERROR\":\"IA Type undefined!\"";
	echo $return_json."}";
	session_write_close();
	exit;
}

if(!is_dir("type_specific_files/".$POST_GET['ia_type'])) {
	$return_json .= "\"ERROR\": \"Misconfiguration; Invalid type (\\\"".$POST_GET['ia_type']."\\\").\"";
	echo $return_json."}";
	session_write_close();
	exit;
}

try {
	$get_typeObject = null;
	if(file_exists("type_specific_files/".$POST_GET['ia_type']."/".$POST_GET['ia_type'].".lib.php"))
		include_once("type_specific_files/".$POST_GET['ia_type']."/".$POST_GET['ia_type'].".lib.php");
	$typePbjectFP = "type_specific_files/".$POST_GET['ia_type']."/typeObject.lib.json";	//	Here's the file!
	if(($POST_GET['action'] == "check" || !is_null($get_typeObject)) && @file_exists($typePbjectFP)) {
		$typeObjectFH = fopen($typePbjectFP, "r");									//	Open the file
		$typeObject = fread($typeObjectFH, filesize($typePbjectFP));				//	Read the file
		$return_json .= "\"file-modified-time\":\"".date("r", filemtime($typePbjectFP))."\",";	//	Put some evidence in the JSON that things are working.
		fclose($typeObjectFH);														//	Close the file
		//$typeObject = preg_replace("/\\/","\\\\",$typeObject);					//	Escape slashes	(introduces some problems. don't use this.)
		//$typeObject = preg_replace("/\"/","\\\"",$typeObject);					//	Escape quotes (doesn't work. don't do it.)
		$typeObject = preg_replace("/\/\/[^\n\r]+[\r\n]/i","",$typeObject);			//	Remove all comments (from "//" to the end of the line)
		$typeObject = preg_replace("/[\t\n\r]/i","",$typeObject);					//	Remove all tabs and newline characters
		$typeObject = preg_replace("/\"\s*\+\s*\"/i","",$typeObject);				//	Remove all " + " patterns (these are from concatenating the lines)
		$typeObject = preg_replace("/\"\s*\+\s*\"/i","",$typeObject);				//	Remove all " + " patterns again (in case there were doubles)
		$typeObject = preg_replace("/\/\*[.\r\n\s]+\*\//imU","",$typeObject);		//	Remove all comments (from "/*" to "*/")
	} else if($POST_GET['action'] !== "check" && $POST_GET['action'] !== "create") {
		$return_json .= "\"ERROR\": \"json config file not found.\"";
		echo $return_json."}";
		session_write_close();
		exit;
	}
} catch(Exception $e) {
	$return_json .= "\"ERROR\": \"".$e."\"";
	echo $return_json."}";
	session_write_close();
	exit;
}
//	The following will ensure the the required functions have been defined within the libraries

/*	This function has 1 basic use.
		INPUT_PARAMETER		RETURN
	1)	null				[JSON string]	If $POST_GET contains the required information - it writes the file or overwrites the file
*/
function default_write_configuration_json_file($filename=null){
	global $POST_GET;
	if(is_null($filename))
		$filename = default_get_configuration_parameters("name");
	$return_json = "\"filename\":".json_encode($filename);
	$return_json .= ",\"file_lock\":{";
	
	$bytes_written = 0;							//	Initialize our file write counter
	
	//	Assuming that the filename contains folders (or not)
	//	Collect the folder names (as strings) and put them in an array.
	$folders = array();							//	Strictly speaking, this isn't required, as the next line will overwrite this.
	//	Match everything up to the final slash (either type) and then the final file name ending in ".json"
	preg_match_all("/^(.*[\/\\\\])([^\/\\\\]+\.json)$/i", $filename, $folders);
	//	If there were no folders to match (and no leading slash) then the array should be empty (or perhaps contain only one element)
	if(count($folders) > 1) {
		//	One last check here, if the position 1 doesn't contain anything, then it's empty (duh) if not - get it.
		$folders = (count($folders[1]) >= 1)?$folders[1][0]:"";
		//	Now take that string and break it apart by slashes - turning it into the array we wanted.
		$folders = preg_split("[\\\/]", $folders);
		//	For good measure we'll add in the "start from the current folder" location.
		$folder_trail = "./";
	} else {
		//	Otherwise error.
		$folders = array();
		$return_json .= "\"ERROR\":\"Save file location invalid; ".$filename."\",";
	}
	//	Now we make sure those folders exist
	foreach($folders as $folder) {
		//	If it's not a folder, then make it one.
		if(!is_dir($folder_trail.$folder) && $folder != "") {
			mkdir($folder_trail.$folder);
		}
		//	Noving on to the next one...
		$folder_trail .= $folder."/";
	}
	//	Open the file for writing, place the pointer at the beginning (to overwrite anything that was already there)
	$fh = fopen($filename, 'w');	//	Open the log for writing! (will overwrite previous information in file)
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

/*	This function has 3 basic uses.
		INPUT_PARAMETER		RETURN
	1)	not null			[string]		It retrieves the location of the instance-specific json configuration
	2)	"student"|"bool"	[boolean]		It can tell you if the current access is the first (unconfigured) one or not
	3)	"file"				[string]		It retrieves the contents of the configuration file
	4)	"json"				[JSON string]	It retrieves a JSON string containing
	4a)											courseID (which tells you if it's a meant to be configuration or not)
	4b)											filename (which is the location of the configuration file, even if there isn't one)
*/
function default_get_configuration_parameters($return_val="json"){
	global $POST_GET;
	//	It is important to note here that any of these variables existing in $POST_GET will cause this function to look for it in the file path, it will NOT cause it to write the file including that value... meaning this is only partially implemented so far.
	$file_name_parts = array("itemID","domain","courseID","itemTitle","json");	//	These are the possible parts of the filename to check for
	$filename = "courses/FILETHATDOESNOTEXIST";
	$loopCount = 0;
	$maxLoops = count($file_name_parts)-1;
	while(!file_exists($filename) && $loopCount < $maxLoops) {
		//	Loop until the file is found...
		//	The courseTitle is required (mostly)
		$filename = "courses/".cleanString($POST_GET['courseTitle']).((isset($POST_GET['courseTitle']))?"/":"");
		foreach($file_name_parts as $part) {
			//	Build the expected filename...
			$filename .= cleanString((isset($POST_GET[$part]))?$POST_GET[$part]:$part).".";
		}
		$filename = substr($filename, 0, strlen($filename)-1);					//	Get rid of that pesky trailing "."
		$removed_part = array_shift($file_name_parts);							//	Remove thee first value from the filename
		$loopCount++;															//	Iterate the loop counter so that we don't get all infinite on the CPU
	}
	switch (strtolower(substr($return_val,0,4))) {
		case "stud":
		case "bool":
			return file_exists($filename);
		break;
		case "json":
			return "\"courseID\":".json_encode(file_exists($filename)).",\"filename\":\"".$filename."\"";
		break;
		case "file":
			if(file_exists($filename))		
				return file_get_contents($filename);
			else
				return $filename;
		break;
		default:
			return $filename;
		break;
	}
}

//	This is used in the file names... we don't want weird characters causing the file to not be written, do we?
function cleanString($str) {
	return preg_replace("/[^\w\d]/","-",preg_replace("/\s/","_",$str));
}

//	Here is the main action of the page. We either load one of the default actions, or we attempt to load a custom one for the type (which will be loaded in from the "type_specific_files" folder)
//	if the "type_specific_files" folder doens't contain the appropriate file the "require_once" call around line 29 should have caused a fatal error and we won't get this far.
switch($POST_GET['action']) {
	case "create":
	case "write_configuration_json_file":
		if(function_exists("write_configuration_json_file")) {
			$return_json .= write_configuration_json_file();
		}else
		if(function_exists("default_write_configuration_json_file")) {
			$return_json .= default_write_configuration_json_file();
		} else {
			$return_json .= "\"error\":\"\\\"default_write_configuration_json_file\\\" function not defined in lib\"";
		}
	break;
	case "check":
	case "get_configuration_parameters":
		if(function_exists("get_configuration_parameters")) {
			$return_json .= get_configuration_parameters();
		} else if(function_exists("default_get_configuration_parameters")) {
			$return_json .= default_get_configuration_parameters();
		} else {
			$return_json .= ",\"error\":\"\\\"default_get_configuration_parameters\\\" function not defined in lib\"";
		}
		//	I'd like to see this whole section be replaced with a more elegant configuration method. The heavily escaped strings could probably be moved into their own files to be automatically escaped...
		if(isset($type_remove_markers)) {
			if(is_array($type_remove_markers)) {
				for($i=0; $i < count($type_remove_markers); $i++) {
					if(is_array($type_remove_markers[$i])) {
						if($type_remove_markers[$i]['remove'] == "all")
							$typeObject = preg_replace("/\#".$type_remove_markers[$i]['marker']."\#.+\#".$type_remove_markers[$i]['marker']."\#/iU","",$typeObject);
						else
							$typeObject = preg_replace("/\#".$type_remove_markers[$i]['marker']."\#/iU","",$typeObject);
					}
				}
			}
		}
		try {
			$typeObject = json_decode($typeObject, true);
		} catch(Exception $e) {
			$return_json .= ",\"ERROR\": \"".$e."\"";
			echo $return_json."}";
			session_write_close();
			exit;
		}
		//	Process conditional data
		foreach($typeObject as $typeName=>$typeData) {
			if(isset($typeObject[$typeName]['conditional'])) {
				if(isset($typeObject[$typeName]['conditional']['condition'])) {
					if(isset($typeObject[$typeName]['conditional']['condition']['variable'])) {
						if(isset($POST_GET[$typeObject[$typeName]['conditional']['condition']['variable']])) {
							if($POST_GET[$typeObject[$typeName]['conditional']['condition']['variable']] == $typeObject[$typeName]['conditional']['condition']['value']) {
								foreach($typeObject[$typeName]['conditional'] as $key=>$value)
									$typeObject[$typeName][$key] = $value;
								unset($typeObject[$typeName]['condition']);
							} else {
								$return_json .= ",\"ERROR\": \"".$typeObject[$typeName]['conditional']['condition']['variable']." is not ".$typeObject[$typeName]['conditional']['condition']['value']."\"";
								echo $return_json."}";
								session_write_close();
								exit;
							}
						} else {
							$return_json .= ",\"ERROR\": \"".$typeObject[$typeName]['conditional']['condition']['variable']." can not be used as a condition because it is not set.\"";
							echo $return_json."}";
							session_write_close();
							exit;
						}
					} else {
						$return_json .= ",\"ERROR\": \"Condition variable not set.\"";
						echo $return_json."}";
						session_write_close();
						exit;
					}
				}
				unset($typeObject[$typeName]['conditional']);
			}
		}
		//	Detect file names and load the file instead of the name...
		foreach($typeObject as $typeName=>$typeData) {
			if(isset($typeData['methods'])) {
				foreach($typeData['methods'] as $methodI=>$methodObject) {
					if(preg_match("/^[^\r\n\s]+\.\w+$/",$methodObject['handler'],$matches)) {
						//$return_json .= ",\"external-file\":\"".$matches[0]."\"";
						if(file_exists("type_specific_files/".$POST_GET['ia_type']."/".$matches[0])) {
							$handler_data = file_get_contents("type_specific_files/".$POST_GET['ia_type']."/".$matches[0]);
							$typeObject[$typeName]['methods'][$methodI]['handler'] = preg_replace("/^[^=]*=?\s*function[^\(]*(\([^\)]*\))/", "function$1", $handler_data);
						} else
							$typeObject[$typeName]['methods'][$methodI]['handler'] = "function() { IsLog.c(\"IA: Error: handler file not found!\"); }";
					}
				}
			}
			foreach($typeData as $dataName=>$dataObject) {
				if(is_string($dataObject)) {
					if(preg_match("/^[^\r\n\s]+\.\w+$/",$dataObject,$matches)) {
						//$return_json .= ",\"external-file\":\"".$matches[0]."\"";
						if(file_exists("type_specific_files/".$POST_GET['ia_type']."/".$matches[0])) {
							$file_data = file_get_contents("type_specific_files/".$POST_GET['ia_type']."/".$matches[0]);
							$typeObject[$typeName][$dataName] = preg_replace("/^[^=]*=?\s*function[^\(]*(\([^\)]*\))/", "function$1", $file_data);
						} else
							$typeObject[$typeName][$dataName] = "ERROR: file not found!";
					}
				}
			}
		}
		//	Put the typeObject into a string (like it was before)
		$typeObject = json_encode($typeObject);
		//	Add the type object to the output (finally!)
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