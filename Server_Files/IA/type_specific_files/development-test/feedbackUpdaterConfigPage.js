function() {
	if(typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {"feedback":[],"keyword":[],"default-feedback":""};
	else if(typeof window['IA-Storage']["feedback"] == "undefined" || typeof window['IA-Storage']["keyword"] == "undefined") {
		window['IA-Storage']["feedback"] = [];
		window['IA-Storage']["keyword"] = [];
		window['IA-Storage']["default-feedback"] = "";
	} else {
		//	Data in window is already initialized.
		//IsLog.c(window['IA-Storage']);
	}
	var arrayIndex = $(this).attr("id").substr($(this).attr("id").indexOf(/\d/));
	if($("#feedback"+arrayIndex).val())
		window['IA-Storage']['feedback'][arrayIndex] = $("#feedback"+arrayIndex).val();
	else {
		IsLog.c("Error: feedback input not found! \"#feedback"+arrayIndex+"\"");
	}
	if($("#keyword"+arrayIndex).val())
		window['IA-Storage']['keyword'][arrayIndex] = $("#keyword"+arrayIndex).val();
	else {
		IsLog.c("Error: feedback input not found! \"#keyword"+arrayIndex+"\"");
	}
	IsLog.c("This is the \'window\'");
	IsLog.c(window['IA-Storage']);
	return true;
}