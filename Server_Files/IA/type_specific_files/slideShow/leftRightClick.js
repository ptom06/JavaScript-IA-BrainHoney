function(){
	if(typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {"image":[],"sound":[], "autoPlay":[], "text":[]}
	else if(typeof window['IA-Storage']['image'] == "undefined" || typeof window['IA-Storage']['sound'] == "undefined" || typeof window['IA-Storage']['autoPlay'] == "undefined" || typeof window['IA-Storage']['text'] == "undefined") {
		window['IA-Storage']['image'] = [];
		window['IA-Storage']['sound'] = [];
		window['IA-Storage']['autoPlay'] = [];
		window['IA-Storage']['text'] = [];
	}
	var image = window['IA-Storage']['image'],
		sound = window['IA-Storage']['sound'],
		autoPlay = window['IA-Storage']['autoPlay'],
		text = window['IA-Storage']['text'],
		i = 0;
		IsLog.c('our current value of \"I\" is: '+i);
		IsLog.c(image[0]);
		if(this == $("#forward")[0] && i < image.length){
			IsLog.c('we should be moving forward');
			i++;
		}
		if($(this)==$("#back") && i>0){
			IsLog.c('we should be moving backwards');
		}
	
}