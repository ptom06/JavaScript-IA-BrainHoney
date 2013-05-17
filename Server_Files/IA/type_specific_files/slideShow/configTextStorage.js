function() {
	if (typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {"image":[],"sound":[], "autoPlay":[], "text":[]}
	else if(typeof window['IA-Storage']['image'] == "undefined" || typeof window['IA-Storage']['sound'] == "undefined" || typeof window['IA-Storage']['autoPlay'] == "undefined" || typeof window['IA-Storage']['text'] == "undefined") {
		window['IA-Storage']['image'] = [];
		window['IA-Storage']['sound'] = [];
		window['IA-Storage']['autoPlay'] = [];
		window['IA-Storage']['text'] = [];
	}else{
		//	Data in window has already been initialized.
	}
	if((/\d+/).test($(this).attr("id")))
		var arrayIndex = (/\d+/).exec($(this).attr("id"));
	else
		IsLog.c("Notice: We didn't enter the correct statement");	
	
	IsLog.c("this is the array index: " + arrayIndex);
	IsLog.c('This is the \"this\": '+$(this).attr("id"));
	//	image text Section
	if($("#image"+arrayIndex).val() === "") {
		IsLog.c("Notice: Nothing has been typed in: \"image"+arrayIndex+"\"");	
	} else if(typeof $("#image"+arrayIndex).val() == "string") {
		IsLog.c("We should be storing the text for the image input");
		window['IA-Storage']['image'][arrayIndex] = $("#image"+arrayIndex).val();
	} else {
		IsLog.c("Error: Image file path input not found! \"#image"+arrayIndex+"\"");	
	}
	//	sound path Section
	if($("#sound"+arrayIndex).val() === "") {
		IsLog.c("Notice: Nothing has been typed in: \"sound"+arrayIndex+"\"");	
	} else if(typeof $("#sound"+arrayIndex).val() == "string") {
		IsLog.c("We should be storing the text");
		window['IA-Storage']['sound'][arrayIndex] = $("#sound"+arrayIndex).val();
	} else {
		IsLog.c("Error: Sound file path not found! \"#sound"+arrayIndex+"\"");	
	}
	
	//	text Section
	if($("#text"+arrayIndex).val() === "") {
		IsLog.c("Notice: Nothing has been typed in: \"text"+arrayIndex+"\"");	
	} else if(typeof $("#text"+arrayIndex).val() == "string") {
		IsLog.c("We should be storing the text");
		window['IA-Storage']['text'][arrayIndex] = $("#text"+arrayIndex).val();
	} else {
		IsLog.c("Error: Display text input not found! \"#text"+arrayIndex+"\"");	
	}
	//	auto-play Section
	window['IA-Storage']['autoPlay'][arrayIndex] = !$("#autoPlay"+arrayIndex).prop("checked");
	IsLog.c("This is the \'window\'");
	IsLog.c(window['IA-Storage']);
	return true;
		/*var imageObj = window['IA-Storage']['image'],
			soundObj = window['IA-Storage']['sound'],
			autoPlayObj = window['IA-Storage']['autoPlay'],
			textObj = window['IA-Storage']['text'];*/
}
