<?PHP
$return_json .= "\"SCORM\":false,";
$get_typeObject = true;
function removedget_configuration_parameters(){
	return "\"configuration\":".default_get_configuration_parameters("file");
}
function load_configuration(){
	return "\"configuration\":".default_get_configuration_parameters("file");
}
?>