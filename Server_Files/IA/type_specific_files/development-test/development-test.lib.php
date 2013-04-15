<?PHP
//  This turns the "SCORM" javascript connection to BrainHoney's API on or off. If it is missing, then the API is initialized be default, which produces errors when the file is loaded outside of BrainHoney (since the API will not be available)
$return_json .= "\"SCORM\":false,";
//  This sets the portal to always include the typeObject in its response. This is useful to avoid getting "json config file not found." errors. These errors are thrown if the instance-specific file is not read and the action is neither "check" nor "create"
$get_typeObject = true;

function removedget_configuration_parameters(){
	return "\"message\":\"Hello\"";
}

function done() {
    //  This loads in the JSON parameters we just saved.
    $json_conf = json_decode(default_get_configuration_parameters("file"), true);
    $return_json = "\"feedback\":";                         //  Whee!! This feedback train is fun!
    //  But what feedback is specified?! Why, the one from the conf we loaded into $json_conf!
    $return_json .= ($json_conf['feedback0'])?json_encode($json_conf['feedback0']):"\"No input given.\"";  //  Yeah, at this point you may notice you gave this input a good or a bad name. Think about making it a good name.
	if(!$json_conf['feedback0']) {
		//var_dump($json_conf);
		//var_dump(default_get_configuration_parameters("file"));
		//var_dump(json_decode(default_get_configuration_parameters("file"),true));
	}
    return $return_json;
}
?>