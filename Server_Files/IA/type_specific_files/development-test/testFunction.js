function() {
	if($(this).val() == "submit") {
		IsLog.c($("#feedback"));
		$("#feedback").addClass("feedback-shown");
		IsLog.c("clicked the button");
		$(this).val("hide");
	} else if($(this).val() == "hide") {
		$("#feedback").removeClass("feedback-shown");
		$(this).val("submit");
	}
}
/*
var targetElement = (($('#textfields').length > 0)?$($('#textfields')[0]):null);
	if(!targetElement)
		return -1;
	var loopCount = 0;
	var maxLoops = 10;
	var textArea = $(\"textarea\")[$(\"textarea\").length-1];
	while(loopCount <= maxLoops && textArea) {
		if($(textArea).val())
			window['textStrings'][$(\"textarea\").length-1] = $(textArea).val();
		textArea.parentElement.removeChild(textArea);
		loopCount++;
		textArea = $(\"textarea\")[$(\"textarea\").length-1];
	}
	
	targetElement.empty();
	
	for(i = 0; i < $('#numTexts').val(); i++) {
		var textArea = $(\"<textarea rows=\\\"8\\\" cols=\\\"64\\\" placeholder=\\\"the instructor will input the material for which the student will be assesed in this box\\\"></textarea>\");
		textArea.attr(\"name\", \"text\");
		var additionalFormatting = $(\"<br/>\");
		if(textStrings[i])
			textArea.val(window['textStrings'][i]);
		targetElement.append(textArea);
		targetElement.append(additionalFormatting);
		/*	initAssessmentObjects();	*/
/*	}
	if(this instanceof HTMLElement) {
		for(var i=0; i < assessmentElements.length; i++) {
			if(typeof assessmentElements[i].setEvents == \"function\") {
				assessmentElements[i].setEvents();
			}
		}
	} 
	*/
