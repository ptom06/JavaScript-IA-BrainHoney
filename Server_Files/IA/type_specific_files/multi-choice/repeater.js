function() {
	if(typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {};
	var numChoices = $("#numChoices").val(),
		text = window['IA-Storage']['text'] || [],
		feedback = window['IA-Storage']['feedback'] || [];	
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
			$(addNode.find("textarea")[0]).attr("id",$(addNode.find("textarea")[0]).attr("id").replace(/\d+/, i));
			$(addNode.find("textarea")[1]).attr("id",$(addNode.find("textarea")[1]).attr("id").replace(/\d+/, i));
			$(addNode.find("span")[0]).attr("id",$(addNode.find("span")[0]).attr("id").replace(/\d+/, i));
			$(addNode.find("span")[0]).html(i+1);
			//	go over this portion
			$("#repeatArea").append(addNode);
			if(i < text.length)
				$(addNode.find("textarea")[0]).val(text[i])
			else
				IsLog.c('feedback was not long enough');
			if(i < feedback.length)
				$(addNode.find("textarea")[1]).val(feedback[i])
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
	//	This is for the wysiwyg
	//	Add in the wysiwyg if requested.
	/*IsLog.c("ATTENTION: We are calling the wysiwyg.js file");
	tinymce.init({
			selector: "textarea",
			plugins: [
			"advlist autolink lists link image charmap print preview anchor",
			"searchreplace visualblocks code fullscreen",
			"insertdatetime media table contextmenu paste "
		],
		toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
	});*/
}