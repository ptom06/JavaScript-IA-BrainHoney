function() {
	if (typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {"question":[],"answer":[],"feedback":[]}
	else if(typeof window['IA-Storage']['question'] == "undefined" || typeof window['IA-Storage']['answer'] == "undefined" || typeof window['IA-Storage']['feedback'] == "undefined") {
		window['IA-Storage']['question'] = [];
		window['IA-Storage']['answer'] = [];
		window['IA-Storage']['feedback'] = [];
	}else{
		//	Data in window has already been initialized.
	}
	if((/\d+/).test($(this).attr("id")))
		var arrayIndex = (/\d+/).exec($(this).attr("id"));
	else
		IsLog.c("Notice: We didn't enter the correct statement");	
	
	IsLog.c("this is the array index: " + arrayIndex);
	IsLog.c('This is the \"this\": '+$(this).attr("id"));
	//	Question Section
	if($("#question"+arrayIndex).val() === "") {
		IsLog.c("Notice: Nothing has been typed in: \"question"+arrayIndex+"\"");	
	} else if(typeof $("#question"+arrayIndex).val() == "string") {
		IsLog.c("We should be storing the text");
		window['IA-Storage']['question'][arrayIndex] = $("#question"+arrayIndex).val();
		IsLog.c(window['IA-Storage']['question']);
	} else {
		IsLog.c("Error: Options Text input not found! \"#question"+arrayIndex+"\"");	
	}
	//	Answer Section
	if($("#answer"+arrayIndex).val() === "") {
		IsLog.c("Notice: Nothing has been typed in: \"answer"+arrayIndex+"\"");	
	} else if(typeof $("#answer"+arrayIndex).val() == "string") {
		IsLog.c("We should be storing the text");
		window['IA-Storage']['answer'][arrayIndex] = $("#answer"+arrayIndex).val();
		IsLog.c(window['IA-Storage']['answer']);
	} else {
		IsLog.c("Error: Options Text input not found! \"#answer"+arrayIndex+"\"");	
	}
	//	feedback section
	if($("#feedback"+arrayIndex).val() === "") {
		IsLog.c("Notice: Nothing has been typed in: \"feedback"+arrayIndex+"\"");	
	} else if(typeof $("#feedback"+arrayIndex).val() == "string") {
		IsLog.c("We should be storing the text");
		window['IA-Storage']['feedback'][arrayIndex] = $("#feedback"+arrayIndex).val();
		IsLog.c(window['IA-Storage']['feedback']);
	} else {
		IsLog.c("Error: Options Text input not found! \"#feedback"+arrayIndex+"\"");	
	}
	
	//var textObj = window['IA-Storage']['question'],
		//feedbackObj = window['IA-Storage']['answer'];
	//var newDiv = $("<span></span>");
	//newDiv.text(textObj[0]);
	//$('.inline-assessment').append(newDiv);
	/*IsLog.c("this is my newest log");
	IsLog.c(typeof feedbackObj);
	IsLog.c(feedbackObj);
	$('#optionsPreview').empty();
	$('#feedbackPreview').empty();
	$('#optionsPreview').append(textObj[0]);
	$('#feedbackPreview').append(feedbackObj[0]);
	IsLog.c('this is the text');
	IsLog.c(textObj);*/
	//IsLog.c(newDiv);
}
