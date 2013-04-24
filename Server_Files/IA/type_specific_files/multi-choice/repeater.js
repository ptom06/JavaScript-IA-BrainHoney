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
			//IsLog.c(addNode);
			//IsLog.c('This is textarea');
			//IsLog.c($(addNode.find("textarea"))[1]);
			$(addNode.find("textarea")[0]).attr("id","optionsText"+i);
			$(addNode.find("textarea")[1]).attr("id","feedback"+i);
			//IsLog.c($(addNode.find("label"))[0]);
			//	Is there a way that you can just change the text but not lose the textarea???
			$(addNode.find("label")[0]).html("Options Text: "+(i+1)+"<textarea rows=\"2\" cols=\"56\" id=\"optionsText\" class=\"myText\"></textarea>");
			$(addNode.find("label")[1]).html("Feedback: <textarea rows=\"2\" cols=\"56\" id=\"feedback\" class=\"feedback\"></textarea>");
			
			//	what is this "addNode for???"
			//$(addNode)
			
			$("#repeatArea").append(addNode);
		}
	}
}