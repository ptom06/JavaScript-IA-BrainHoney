function() {
	if (typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {"question":[],"answer":[],"feedback":[]}
	else if(typeof window['IA-Storage']['question'] == "undefined" || typeof window['IA-Storage']['answer'] == "undefined" || typeof window['IA-Storage']['feedback'] == "undefined") {
		window['IA-Storage']['question'] = [];
		window['IA-Storage']['answer'] = [];
		window['IA-Storage']['feedback'] = [];
	} else {
		//	Data in window is already initialized.
		IsLog.c(window['IA-Storage']);
	}
	//	What is the point of this statement
	if(window['IA-Storage']["question"].length == 0) {
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
				IsLog.c(window['IA-Storage']);
				var question = window['IA-Storage']['question'],
					answer = window['IA-Storage']['answer'];
					feedback = window['IA-Storage']['feedback'];
				//	Display the first options text to start.
				//$("#optionSpan").text(text[0]);
				//$("#feedbackSpan").text(feedback[0]);
				
				//	Clone the radio buttons with the text. Correlate the options with their feedback
				if(question){
					var cloner = window['IA-Storage']['cloneElementNode'] || $("#cloner").clone(true, true);
					window['IA-Storage']['cloneElementNode'] = cloner;
					$("#cloner").remove();
					$("#cloneArea").empty();
					for(var i=0; i<question.length; i++){
						IsLog.c('adding node '+(i+1));
						var addClone = cloner.clone(true, true);
						$(addClone).attr("id","clonedText"+i);
						$(addClone.find(".question span")[0]).attr("id",$(addClone.find(".question span")[0]).attr("id").replace(/\d+/, i));	//	question
						$(addClone.find("textarea")[0]).attr("id",$(addClone.find("textarea")[0]).attr("id").replace(/\d+/, i));	//	answer
						//$(addNode.find("span")[0]).attr("id",$(addNode.find("span")[0]).attr("id").replace(/\d+/, i));	//	feedback
						//$(addClone.find("#optionSpan"+i)).attr("id","optionSpan"+i);
						$(addClone.find(".feedback span")[1]).attr("id","feedbackSpan"+i);
						//$(addClone.find(".feedback")[0]).attr("id","feedback"+i);
						//$(addClone.find("input[name=optionsRadio]")).attr("id",$(addClone.find("input[name=optionsRadio]")).attr("name")+i);
						//IsLog.c("this is the optionsRadio: "+ $("optionsradio"+i));
						$("#cloneArea").append(addClone);
						IsLog.c("my Log");
						IsLog.c($(addClone.find("#feedbackSpan")[0]));
						if(i < question.length)
							$(addClone.find(".question span")[0]).html(question[i])
						else
							IsLog.c("Notice: this is not working");
						if(i<question.length)
							$(addClone.find(".answers span")[0]).html((i+1)+": "+answer[i])
						if(i<feedback.length)
							$(addClone.find("#feedbackSpan")[0]).html(feedback[i])
					}
				}
				// show and hide feedback
			}
		);
	} else {
		IsLog.c("feedback is not empty.");
		IsLog.c(window['IA-Storage']);
	}
	return true;
}