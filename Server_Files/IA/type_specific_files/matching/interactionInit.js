function() {
	/*if (typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {"question":[],"answer":[],"feedback":[]}
	else if(typeof window['IA-Storage']['question'] == "undefined" || typeof window['IA-Storage']['answer'] == "undefined" || typeof window['IA-Storage']['feedback'] == "undefined") {
		window['IA-Storage']['question'] = [];
		window['IA-Storage']['answer'] = [];
		window['IA-Storage']['feedback'] = [];
	} else {
		//	Data in window is already initialized.
		IsLog.c(window['IA-Storage']);
	}*/
	if (typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {"questions":[]}
	//	What is the point of this statement
	if(window['IA-Storage']["questions"].length == 0) {
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
				/*for(var configProp in configObject['configuration']) {
					IsLog.c(configProp);
					window['IA-Storage'][configProp] = configObject['configuration'][configProp];
				}*/
				for(var configProp in configObject['configuration']){
					//window['IA-Storage']['questions'] = [];
					
						
					if(!(/(submit|done|finish|ok)/i).test(configProp)) {
						for (i=0; i<configObject['configuration'][configProp].length;i++){
							if(typeof window['IA-Storage']['questions'][i] == "undefined") {
								window['IA-Storage']['questions'][i] = {};
							}
							if(typeof window['IA-Storage']['questions'][i][configProp] == "undefined") {
								window['IA-Storage']['questions'][i][configProp] = configObject['configuration'][configProp][i];
							}
						}
					}
					//IsLog.c('This is my new object');
					//IsLog.c(window['IA-Storage']['questions'][i]);
				}
				IsLog.c(window['IA-Storage']);
				var questions = window['IA-Storage']['questions'];
					/*answer = window['IA-Storage']['answer'];
					feedback = window['IA-Storage']['feedback'];*/
				//	Display the first options text to start.
				//$("#optionSpan").text(text[0]);
				//$("#feedbackSpan").text(feedback[0]);
				
				//	Clone the radio buttons with the text. Correlate the options with their feedback
				if(questions){
					var cloner = window['IA-Storage']['cloneElementNode'] || $("#cloner").clone(true, true);
					window['IA-Storage']['cloneElementNode'] = cloner;
					$("#cloner").remove();
					$("#cloneArea").empty();
					for(var i=0; i<questions.length; i++){
						IsLog.c('adding node '+(i+1));
						var addClone = cloner.clone(true, true);
						$(addClone).attr("id","clonedText"+i);
						$(addClone.find("#leftBox")[0]).attr("id", "leftBox"+i);
						$(addClone.find(".question span")[0]).attr("id",$(addClone.find(".question span")[0]).attr("id").replace(/\d+/, i));	//	question
						$(addClone.find("select, option")[0]).attr("id",$(addClone.find("select, option")[0]).attr("id").replace(/\d+/, i));	//	answer
						//$(addNode.find("span")[0]).attr("id",$(addNode.find("span")[0]).attr("id").replace(/\d+/, i));	//	feedback
						//$(addClone.find("#optionSpan"+i)).attr("id","optionSpan"+i);
						$(addClone.find(".feedback").find("span")[0]).attr("id","feedbackSpan"+i);
						//$(addClone.find(".feedback")[0]).attr("id","feedback"+i);
						//$(addClone.find("input[name=optionsRadio]")).attr("id",$(addClone.find("input[name=optionsRadio]")).attr("name")+i);
						//IsLog.c("this is the optionsRadio: "+ $("optionsradio"+i));
						$("#cloneArea").append(addClone);
						IsLog.c("my Log");
						IsLog.c($(addClone.find("#feedbackSpan")[0]));
						if(i < questions[i].question.length)
							$(addClone.find(".question span")[0]).html(questions[i].question)
						else
							//IsLog.c("Notice: this is not working");
						//if(i<questions[i].answer.length)
						//	$(addClone.find(".answers span")[0]).html((i+1)+": "+questions[i].answer)
						if(i<questions[i].feedback.length)
							$(addClone.find("#feedbackSpan")[0]).html(questions[i].feedback)
						/*if(i<questions[i].answer.length){
							IsLog.c('here we go');
							IsLog.c($(addClone.find("select, option")[0]));
							$(addClone.find("select, option")[0]).append((i+1))
						}*/
					}
					questions = shuffle(questions);
					$($(".answers")[0]).empty();
					for(var i=0; i<questions.length; i++){
						$($(".answers")[0]).append("<div id=\"distractor"+i+"\"style=\"margin-bottom:0.5em\">"+((i+10).toString(26+10))+": "+questions[i].answer+"</div>");
					}
				}
				// show and hide feedback
				//IsLog.c('this is the log im looking for');
				//IsLog.c((/^\w+/).exec($(".answers").text()));
			}
		);
	} else {
		IsLog.c("feedback is not empty.");
		IsLog.c(window['IA-Storage']);
	}
	return true;
}