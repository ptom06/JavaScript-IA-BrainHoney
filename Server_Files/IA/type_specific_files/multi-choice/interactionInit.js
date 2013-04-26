function() {
	if(typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {"text":[],"feedback":[]};
	else if(typeof window['IA-Storage']['text'] == "undefined" || typeof window['IA-Storage']['feedback'] == "undefined") {
		window['IA-Storage']['text'] = [];
		window['IA-Storage']['feedback'] = [];
	} else {
		//	Data in window is already initialized.
		IsLog.c(window['IA-Storage']);
	}
	//	What is the point of this statement
	if(window['IA-Storage']["text"].length == 0) {
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
				var text = window['IA-Storage']['text'],
					feedback = window['IA-Storage']['feedback'];
				//	Display the first options text to start.
				//$("#optionSpan").text(text[0]);
				//$("#feedbackSpan").text(feedback[0]);
				
				//	Clone the radio buttons with the text. Correlate the options with their feedback
				if(text){
					var cloner = window['IA-Storage']['cloneElementNode'] || $("#cloner").clone(true, true);
					window['IA-Storage']['cloneElementNode'] = cloner;
					$("#cloner").remove();
					$("#cloneArea").empty();
					for(var i=0; i<text.length; i++){
						IsLog.c('adding node '+(i+1));
						var addClone = cloner.clone(true, true);
						$(addClone).attr("id","clonedText"+i);
						$(addClone.find("#optionSpan"+i)).attr("id","optionSpan"+i);
						$(addClone.find(".feedback span")[0]).attr("id","feedbackSpan"+i);
						$(addClone.find(".feedback")[0]).attr("id","feedback"+i);
						$(addClone.find("input[name=optionsRadio]")).attr("id",$(addClone.find("input[name=optionsRadio]")).attr("name")+i);
						//IsLog.c("this is the optionsRadio: "+ $("optionsradio"+i));
						$("#cloneArea").append(addClone);
						if(i < text.length)
							$(addClone.find("span")[0]).html(text[i])
						else
							IsLog.c("Notice: this is not working");
						if(i<feedback.length)
							$(addClone.find("span")[1]).html(feedback[i])
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