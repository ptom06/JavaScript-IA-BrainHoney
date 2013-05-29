function() {
	if(typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {"image":[],"sound":[], "autoPlay":[], "text":[], "textColor":[], "slideIndex": 0}
	else if(typeof window['IA-Storage']['image'] == "undefined" || typeof window['IA-Storage']['sound'] == "undefined" || 
			typeof window['IA-Storage']['autoPlay'] == "undefined" || typeof window['IA-Storage']['text'] == "undefined" ||
			typeof window['IA-Storage']['textColor'] == "undefined" || typeof window['IA-Storage']['slideIndex'] == "undefined") {
		window['IA-Storage']['image'] = [];
		window['IA-Storage']['sound'] = [];
		window['IA-Storage']['autoPlay'] = [];
		window['IA-Storage']['text'] = [];
		window['IA-Storage']['textColor'] = [];
		window['IA-Storage']['slideIndex'] = 0;
		
	}
	if(window['IA-Storage']["image"].length == 0) { //This should be something other than image.?.?
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
					text = configObject['configuration']['text'],	//window['IA-Storage']['image'];
					backgroundImage = $('.backgroundImage'),
					slideIndex = window['IA-Storage']['slideIndex'],
					textColor = window['IA-Storage']['textColor'];

				if($('.backgroundImage').length == 0){
					for(var i=0; i<image.length; i++){
						var imageElement = $("<div></div>");
						imageElement.attr("id", "displayImage"+i);
						imageElement.attr("class", "backgroundImage");
						imageElement.css("background-image", "url("+image[i]+")");
						imageElement.html("<div style=\"color:#"+textColor[i]+"\">"+text[i]+"</div>");
						$(".displayDiv").append(imageElement);
						//IsLog.c($('#displayImage'+i));
					}
				}else
					IsLog.c('We already loaded the images on the page');
				IsLog.c($('.backgroundImage').length);
				IsLog.c($('.backgroundImage')[0] instanceof HTMLElement);
				$($('.backgroundImage')[0]).addClass("currentSlide");
				$(".currentSlide").css("display","block");
				/*for(var i=0; i < backgroundImage.length; i++{
					//	have an if for setting and removing .currentSlide
				}*/

				if($(this)==$("#forward")){
					IsLog.c('were in the loop');
					if(backgroundImage == $(".currentSlide")){
						$(".currentSlide").css("display", "block");
					}
				}
				if($(this)==$("#back") && slideIndex > 0){
					slideIndex--;
				}
			}
		);
	} else {
		IsLog.c("feedback is not empty.");
		//IsLog.c(window['IA-Storage']);
	}
	return true;
}