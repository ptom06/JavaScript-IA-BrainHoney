function() {
	if (typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {"image":[],"feedback":[]}
	else if(typeof window['IA-Storage']['text'] == "undefined" || typeof window['IA-Storage']['feedback'] == "undefined") {
		window['IA-Storage']['image'] = [];
		window['IA-Storage']['sound'] = [];
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
		IsLog.c("Error: image file path input not found! \"#image"+arrayIndex+"\"");	
	}
	//	sound path Section
	if($("#sound"+arrayIndex).val() === "") {
		IsLog.c("Notice: Nothing has been typed in: \"sound"+arrayIndex+"\"");	
	} else if(typeof $("#sound"+arrayIndex).val() == "string") {
		IsLog.c("We should be storing the text");
		window['IA-Storage']['sound'][arrayIndex] = $("#sound"+arrayIndex).val();
	} else {
		IsLog.c("Error: Options Text input not found! \"#sound"+arrayIndex+"\"");	
	}
	//	text Section
	if($("#text"+arrayIndex).val() === "") {
		IsLog.c("Notice: Nothing has been typed in: \"text"+arrayIndex+"\"");	
	} else if(typeof $("#text"+arrayIndex).val() == "string") {
		IsLog.c("We should be storing the text");
		window['IA-Storage']['text'][arrayIndex] = $("#text"+arrayIndex).val();
	} else {
		IsLog.c("Error: Options Text input not found! \"#text"+arrayIndex+"\"");	
	}
		var imageObj = window['IA-Storage']['image'],
		soundObj = window['IA-Storage']['sound'];
		textObj = window['IA-Storage']['text'];
}
