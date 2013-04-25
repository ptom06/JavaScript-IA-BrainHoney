function() {
	if (typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {"text":[],"feedback":[]}
	else if(typeof window['IA-Storage']['text'] == "undefined" || typeof window['IA-Storage']['feedback'] == "undefined") {
		window['IA-Storage']['text'] = [];
		window['IA-Storage']['feedback'] = [];
	}else{
		//	Data in window has already been initialized.
	}
	if((/\d+/).test($(this).attr("id"))){
		var arrayIndex = (/\d+/).exec($(this).attr("id"));
		IsLog.c("this is the array index: " + arrayIndex);
		IsLog.c('This is the \"this\": '+$(this).attr("id"));
	}else{
		IsLog.c("Notice: We didn't enter the correct statement");	
	}
	
	
}