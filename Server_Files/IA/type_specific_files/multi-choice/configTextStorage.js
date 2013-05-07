function() {
	if (typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {"text":[],"feedback":[]}
	else if(typeof window['IA-Storage']['text'] == "undefined" || typeof window['IA-Storage']['feedback'] == "undefined") {
		window['IA-Storage']['text'] = [];
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
	//	Options Text Section
	if($("#text"+arrayIndex).val() === "") {
		IsLog.c("Notice: Nothing has been typed in: \"text"+arrayIndex+"\"");	
	} else if(typeof $("#text"+arrayIndex).val() == "string") {
		IsLog.c("We should be storing the text");
		window['IA-Storage']['text'][arrayIndex] = $("#text"+arrayIndex).val();
	} else {
		IsLog.c("Error: Options Text input not found! \"#text"+arrayIndex+"\"");	
	}
	//	Feedback Section
	if($("#feedback"+arrayIndex).val() === "") {
		IsLog.c("Notice: Nothing has been typed in: \"feedback"+arrayIndex+"\"");	
	} else if(typeof $("#feedback"+arrayIndex).val() == "string") {
		IsLog.c("We should be storing the text");
		window['IA-Storage']['feedback'][arrayIndex] = $("#feedback"+arrayIndex).val();
	} else {
		IsLog.c("Error: Options Text input not found! \"#feedback"+arrayIndex+"\"");	
	}
	
	var textObj = window['IA-Storage']['text'],
		feedbackObj = window['IA-Storage']['feedback'];
	//var newDiv = $("<span></span>");
	//newDiv.text(textObj[0]);
	//$('.inline-assessment').append(newDiv);
	IsLog.c("this is my newest log");
	IsLog.c(typeof feedbackObj);
	IsLog.c(feedbackObj);
	$('#optionsPreview').empty();
	$('#feedbackPreview').empty();
	$('#optionsPreview').append(textObj[0]);
	$('#feedbackPreview').append(feedbackObj[0]);
	IsLog.c('this is the text');
	IsLog.c(textObj);
	//IsLog.c(newDiv);
}
