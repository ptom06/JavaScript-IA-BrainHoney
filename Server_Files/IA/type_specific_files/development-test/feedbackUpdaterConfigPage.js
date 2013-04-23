function() {
	if(typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {"feedback":[],"keyword":[],"matchAll":[],"default-feedback":""};
	else if(typeof window['IA-Storage']["feedback"] == "undefined" || typeof window['IA-Storage']["keyword"] == "undefined" || typeof window['IA-Storage']["matchAll"] == "undefined") {
		window['IA-Storage']["feedback"] = [];
		window['IA-Storage']["keyword"] = [];
		window['IA-Storage']["matchAll"] = [];
		window['IA-Storage']["default-feedback"] = "";
	} else {
		//	Data in window is already initialized.
		//IsLog.c(window['IA-Storage']);
	}
	if($(this).attr("id").indexOf(/\d/) != -1)
		var arrayIndex = $(this).attr("id").substr($(this).attr("id").indexOf(/\d/));
	else
		var arrayIndex = $(this).attr("name").substr($(this).attr("name").indexOf(/\d/));
	
	IsLog.c("This is the arrayIndex "+arrayIndex);
	IsLog.c("This is the \"this\"- "+$(this).attr("id"));
	//	Feedback section
	if($("#feedback"+arrayIndex).val() === "") {
		IsLog.c("Notice: feedback not yet typed in. "+arrayIndex);
	} else if(typeof $("#feedback"+arrayIndex).val() == "string") {
		window['IA-Storage']['feedback'][arrayIndex] = $("#feedback"+arrayIndex).val();
	} else {
		IsLog.c("Error: feedback input not found! \"#feedback"+arrayIndex+"\"");
	}
	//	Keyword section
	if($("#keyword"+arrayIndex).val() === "") {
		IsLog.c("Notice: keyword not yet typed in. "+arrayIndex);
	} else if(typeof $("#keyword"+arrayIndex).val() == "string") {
		window['IA-Storage']['keyword'][arrayIndex] = $("#keyword"+arrayIndex).val();
	} else {
		IsLog.c("Error: Keyword input not found! \"#keyword"+arrayIndex+"\"");
	}
	//	matchAll section
	window['IA-Storage']['matchAll'][arrayIndex] = !$("#matchAll"+arrayIndex).prop("checked");
	IsLog.c("This is the \'window\'");
	IsLog.c(window['IA-Storage']);
	return true;
}