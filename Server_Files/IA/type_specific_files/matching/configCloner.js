function(){
	if(typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {};
	var numChoices = $("#numChoices").val(),
		question = window['IA-Storage']['question'] || [],
		answer = window['IA-Storage']['answer'] || [],
		feedback = window['IA-Storage']['feedback'] || [];	
	IsLog.c('You have selected '+numChoices+' options');
	IsLog.c(window['IA-Storage'] );
	//IsLog.c(window['IA-Storage']['question']);
	//IsLog.c(window['IA-Storage']['answer']);

	if(numChoices){
		var repeatNode = window['IA-Storage']['repeatElementNode'] || $("#repeatNode").clone(true, true);
		window['IA-Storage']['repeatElementNode'] = repeatNode;
		$("#repeatNode").remove();
		$("#repeatArea").empty();
		for (var i=0; i<numChoices; i++){
			IsLog.c('Adding Node '+(i+1));
			var addNode = repeatNode.clone(true, true),
				textareas = addNode.find("textarea,input");
			addNode.attr('id','clonetext'+i);
			//IsLog.c('this is addNode: ');
			//IsLog.c(addNode);
			//IsLog.c(textareas);
			$(textareas[0]).attr("id",$(textareas[0]).attr("id").replace(/\d+/, i));	//	question
			//	Dont need to clone the value //$(textareas[0]).attr("value",$(textareas[0]).attr("value").replace(/\d+/, i));
			$(textareas[1]).attr("id",$(textareas[1]).attr("id").replace(/\d+/, i));	//	answer
			//$(textareas[1]).attr("value",$(textareas[1]).attr("value").replace(/\d+/, i));
			$(textareas[2]).attr("id",$(textareas[2]).attr("id").replace(/\d+/, i));	//	feedback
			$(addNode.find("span")[0]).attr("id",$(addNode.find("span")[0]).attr("id").replace(/\d+/, i));
			$(addNode.find("span")[0]).html(i+1);
			
			$("#repeatArea").append(addNode);
			if(i < question.length)
				$(textareas[0]).val(question[i])
			else
				IsLog.c('question was not long enough');
			if(i < answer.length)
				$(textareas[1]).val(answer[i])
			else
				IsLog.c('answer wasnt long enough');
			if(i < feedback.length)
				$(textareas[2]).val(feedback[i])
			else
				IsLog.c('feedback wasn\'t long enought');
		}		
	}else
		IsLog.c('it has been broke');
		
	if(this instanceof HTMLElement) {
		for(var i=0; i < assessmentElements.length; i++) {
			if(typeof assessmentElements[i].setEvents == "function") {
				assessmentElements[i].setEvents();
			}
		}
	}
}