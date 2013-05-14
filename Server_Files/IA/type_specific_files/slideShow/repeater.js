function() {
	if(typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {};
	var numChoices = $("#numChoices").val(),
		image = window['IA-Storage']['text'] || [],
		text = window['IA-Storage']['feedback'] || [],
		sound = window['IA-Storage']['feedback'] || [];	
	IsLog.c('You have selected '+numChoices+' options');
	//IsLog.c(window['IA-Storage']['text'])
	//IsLog.c(window['IA-Storage']['feedback'])
	
	if(numChoices){
		var repeatNode = window['IA-Storage']['repeatElementNode'] || $("#repeatNode").clone(true, true);
		window['IA-Storage']['repeatElementNode'] = repeatNode;
		$("#repeatNode").remove();
		$("#repeatArea").empty();
		for(var i=0; i<numChoices; i++){
			IsLog.c('Adding node '+(i+1));
			var addNode = repeatNode.clone(true, true);
			addNode.attr('id','cloneText'+i);
			$(addNode.find("input")[0]).attr("id",$(addNode.find("input")[0]).attr("id").replace(/\d+/, i));
			$(addNode.find("input")[1]).attr("id",$(addNode.find("input")[1]).attr("id").replace(/\d+/, i));
			$(addNode.find("span")[0]).attr("id",$(addNode.find("span")[0]).attr("id").replace(/\d+/, i));
			$(addNode.find("span")[0]).html(i+1);
			$(addNode.find("input")[2]).attr("id",$(addNode.find("input")[2]).attr("id").replace(/\d+/, i));
			$(addNode.find("input")[3]).attr("name",$(addNode.find("input")[3]).attr("name").replace(/\d+/, i));
			$(addNode.find("input")[4]).attr("name",$(addNode.find("input")[4]).attr("name").replace(/\d+/, i));
			$(addNode.find("input")[4]).attr("id",$(addNode.find("input")[4]).attr("id").replace(/\d+/, i));
			
			//	go over this portion
			$("#repeatArea").append(addNode);
			if(image.length > i)
				$(addNode.find("input")[0]).val(image[i])
			if(text.length > i)
				$(addNode.find("input")[1]).val(text[i])
			if(sound.length > i)
				$(addNode.find("input")[2]).val(sound[i])
				
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