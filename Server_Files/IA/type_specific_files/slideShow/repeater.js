function() {
	if(typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {};
	var numChoices = $("#numChoices").val(),
		image = window['IA-Storage']['image'] || [],
		sound = window['IA-Storage']['sound'] || [],
		autoPlay = window['IA-Storage']['autoPlay'] || [],
		text = window['IA-Storage']['text'] || [],
		textColor = window['IA-Storage']['textColor'] || [];
	IsLog.c('You have selected '+numChoices+' options');
	IsLog.c(window['IA-Storage']['image']);
	IsLog.c(window['IA-Storage']['sound']);
	IsLog.c(window['IA-Storage']['text']);
	
	if(numChoices){
		var repeatNode = window['IA-Storage']['repeatElementNode'] || $("#repeatNode").clone(true, true);
		window['IA-Storage']['repeatElementNode'] = repeatNode;
		$("#repeatNode").remove();
		$("#repeatArea").empty();
		for(var i=0; i<numChoices; i++){
			IsLog.c('Adding node '+(i+1));
			var addNode = repeatNode.clone(true, true);
			addNode.attr('id','cloneText'+i);
			$(addNode.find("input")[0]).attr("id",$(addNode.find("input")[0]).attr("id").replace(/\d+/, i));//	image
			$(addNode.find("span")[0]).attr("id",$(addNode.find("span")[0]).attr("id").replace(/\d+/, i));//	image span
			$(addNode.find("span")[0]).html(i+1);
			$(addNode.find("input")[1]).attr("id",$(addNode.find("input")[1]).attr("id").replace(/\d+/, i));//	sound
			$(addNode.find("input")[2]).attr("name",$(addNode.find("input")[2]).attr("name").replace(/\d+/, i));//	autoplay
			$(addNode.find("input")[3]).attr("name",$(addNode.find("input")[3]).attr("name").replace(/\d+/, i));//	autoplay
			$(addNode.find("input")[3]).attr("id",$(addNode.find("input")[3]).attr("id").replace(/\d+/, i));//	autoplay
			$(addNode.find("textarea")[0]).attr("id",$(addNode.find("textarea")[0]).attr("id").replace(/\d+/, i));//	Text
			$(addNode.find("input")[4]).attr("id",$(addNode.find("input")[4]).attr("id").replace(/\d+/, i));//	TextColor
			if(autoPlay.length >= i){
				$(addNode.find("input")[2]).prop("checked", autoPlay[i]);
				$(addNode.find("input")[3]).prop("checked", !autoPlay[i]);
			}
			//	go over this portion
			$("#repeatArea").append(addNode);
			if(image.length > i)
				$(addNode.find("input")[0]).val(image[i])
			if(sound.length > i)
				$(addNode.find("input")[1]).val(sound[i])
			if(text.length > i)
				$(addNode.find("textarea")[0]).val(text[i])
			if(textColor.length > i)
				$(addNode.find("input")[4]).val(textColor[i])
				
		}
	}else
		IsLog.c('Error: You managed to break it');
	//	Need to better understand this portion
	if(this instanceof HTMLElement) {
		for(var i=0; i < assessmentElements.length; i++) {
			if(typeof assessmentElements[i].setEvents == "function") {
				assessmentElements[i].setEvents();
			}
		}
	}
}