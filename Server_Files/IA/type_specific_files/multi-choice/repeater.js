function() {
	if(typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {};
	var numChoices = $("#numChoices").val(),
		text = window['IA-Storage']['text'] || [],
		feedback = window['IA-Storage']['feedback'] || [];	
	IsLog.c('You have selected '+numChoices+' options');	
	
	if(numChoices){
		var repeatNode = window['IA-Storage']['repeatElementNode'] || $("#repeatNode").clone(true, true);
		window['IA-Storage']['repeatElementNode'] = repeatNode;
		$("#repeatNode").remove();
		$("#repeatArea").empty();
		for(var i=0; i<numChoices; i++){
			IsLog.c('Adding node '+(i+1));
			var addNode = repeatNode.clone(true, true);
			addNode.attr('id','cloneText'+i);
			$(addNode.find("textarea")[0]).attr("id",$(addNode.find("textarea")[0]).attr("id").replace(/\d+/, i));
			$(addNode.find("textarea")[1]).attr("id",$(addNode.find("textarea")[1]).attr("id").replace(/\d+/, i));
			$(addNode.find("span")[0]).attr("id",$(addNode.find("span")[0]).attr("id").replace(/\d+/, i));
			$(addNode.find("span")[0]).html(i+1);
									
			$("#repeatArea").append(addNode);
		}
	}
}