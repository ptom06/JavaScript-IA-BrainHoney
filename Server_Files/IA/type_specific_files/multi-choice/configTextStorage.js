function() {
	if (typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {"text":[],"feedback":[]}
	else if(typeof window['IA-Storage']['text'] == "undefined" || typeof window['IA-Storage']['feedback'] == "undefined") {
		window['IA-Storage']['text'] = [];
		window['IA-Storage']['feedback'] = [];
	}else{
		//	Data in window has already been initialized.
	}
}