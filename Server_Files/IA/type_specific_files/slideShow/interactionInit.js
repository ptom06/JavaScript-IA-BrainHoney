function() {
	if(typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {"image":[],"sound":[], "autoPlay":[], "text":[]}
	else if(typeof window['IA-Storage']['image'] == "undefined" || typeof window['IA-Storage']['sound'] == "undefined" || typeof window['IA-Storage']['autoPlay'] == "undefined" || typeof window['IA-Storage']['text'] == "undefined") {
		window['IA-Storage']['image'] = [];
		window['IA-Storage']['sound'] = [];
		window['IA-Storage']['autoPlay'] = [];
		window['IA-Storage']['text'] = [];
	}
	if(window['IA-Storage']["image"].length == 0) { //This should be something other thatn image.?.?
		$.post(
			portalURL,
			{
				"ia_type":"development-test",
				"domain": bhDomain,
				"courseTitle": (window.parent.bhCourseTitle)?window.parent.bhCourseTitle:"UNTITLED",
				"courseID": (window.parent.bhCourseId)?window.parent.bhCourseId:"NOCOURSEID",
				"itemID": getIAObject($(this)).getItemId(),
				"itemTitle": (window.parent.bhItemTitle)?window.parent.bhItemTitle:"NOTITLE",
				"action":"load_configuration"
			},
			function(data) {
				var configObject = JSON.parse(data);
				IsLog.c(configObject);
				for(var configProp in configObject['configuration']) {
					IsLog.c(configProp);
					window['IA-Storage'][configProp] = configObject['configuration'][configProp];
				}
				/*IsLog.c(window['IA-Storage']);
				var image = window['IA-Storage']['image'],
					sound = window['IA-Storage']['sound'],
					autoPlay = window['IA-Storage']['autoPlay'],
					text = window['IA-Storage']['text'];
					IsLog.c("working it here");
					IsLog.c(image.length);
					IsLog.c(sound);
					IsLog.c(autoPlay);
					IsLog.c(text);
					
				if(image){
					for(var i = 0; i<image.length; i++){
						$(".displayDiv").append("<img id=\"displayImage"+i+" scr=\""+image[i]+"\"/>");
						$(".displayDiv").append("<span id=\"displayText"+i+"\">"+text[i]+"</span>");
					}
				}*/
			}
		);
	} else {
		IsLog.c("feedback is not empty.");
		//IsLog.c(window['IA-Storage']);
	}
	return true;
}