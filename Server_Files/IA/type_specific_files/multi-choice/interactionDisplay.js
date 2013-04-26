function(){
	if($(this).val() == "submit"){
		IsLog.c('Testing the \"window\"');
		IsLog.c(window['IA-Storage']);
		//	Why is this optionsText?
		IsLog.c(window['IA-Storage']['text']) || [];
		IsLog.c(window['IA-Storage']['feedback']) || [];
	}
	
	
	//	clone the radio buttons so and give them their own properties
	
}