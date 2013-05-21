function() {
	if(typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {"image":[],"sound":[], "autoPlay":[], "text":[], "slideIndex": 0}
	else if(typeof window['IA-Storage']['image'] == "undefined" || typeof window['IA-Storage']['sound'] == "undefined" || typeof window['IA-Storage']['autoPlay'] == "undefined" || typeof window['IA-Storage']['text'] == "undefined" || typeof window['IA-Storage']['slideIndex'] == "undefined") {
		window['IA-Storage']['image'] = [];
		window['IA-Storage']['sound'] = [];
		window['IA-Storage']['autoPlay'] = [];
		window['IA-Storage']['text'] = [];
		window['IA-Storage']['slideIndex'] = 0;
		
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
				/*for(var configProp in configObject['configuration']) {
					IsLog.c(configProp);
					window['IA-Storage'][configProp] = configObject['configuration'][configProp];
				}*/
				IsLog.c(configObject);
				
				var image = configObject['configuration']['image'],
					text = configObject['configuration']['text'];	//window['IA-Storage']['image'];
				//IsLog.c($('.backgroundImage').length);
				if($('.backgroundImage').length == 0){
					for(var i=0; i<image.length; i++){
						var imageElement = $("<div></div>");
						imageElement.attr("id", "displayImage"+i);
						imageElement.attr("class", "backgroundImage");
						imageElement.css("background-image", "url("+image[i]+")");
						imageElement.text(text[i]);
						$(".displayDiv").append(imageElement);
						//IsLog.c($('#displayImage'+i));
					}
				}else
					IsLog.c('We already loaded the images on the page');
				IsLog.c($('.backgroundImage').length);
				IsLog.c($('.backgroundImage'));
				//	These if statements are for the forward and backwards.
				//	use the $('.backgroundImage') in the clicking forward and backwards
				var backgroundImage = $('.backgroundImage'),
					slideIndex = window['IA-Storage']['slideIndex'];
					
				/*if($(this)==$("#back") && slideIndex > 0){
					slideIndex--;
				}
				if(this == $("#forward")[0] && slideIndex < backgroundImage.length-1){
					slideIndex++;
				}
				slideIndex++;
				IsLog.c("SlideIndex is: "+slideIndex);*/

				//	I need to get all the image id's on the page so that i can call them.
				
				//IsLog.c(window['IA-Storage']['image'][0]);
				
				
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