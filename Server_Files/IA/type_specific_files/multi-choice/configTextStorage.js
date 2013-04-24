function() {
	if (typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {"text":[],"feedback":[]}
	else if(typeof window['IA-Storage']['text'] == "undefined" || typeof window['IA-Storage']['feedback'] == "undefined") {
		window['IA-Storage']['text'] = [];
		window['IA-Storage']['feedback'] = [];
	}else{
		//	Data in window has already been initialized.
	}
	if($(this).attr("id").indexOf(/\d/) != -1)
		var arrayIndex = $(this).attr("id").substr($(this).attr("id").indexOf(/\d/)); //  clarify this line of code
	IsLog.c("this is the array index: " + arrayIndex);
	IsLog.c('This is the \"this\": '+$(this).attr("id"));
}