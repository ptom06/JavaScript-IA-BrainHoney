function() {
	if($(this).val() == "submit") {
		IsLog.c("Testing the \'window\'");
		IsLog.c(window['IA-Storage']);
		IsLog.c(window['IA-Storage']['feedback'][2]);
		IsLog.c(window['IA-Storage']['keyword'][2]);
		IsLog.c(window['IA-Storage']['keyword'].length);
		
		//	Step 1: correlate the keywords with their feedback
		var feedbackObjs = [];
		if(typeof window['IA-Storage']['keyword'] != "string") {
			for(var i=0;i<window['IA-Storage']['keyword'].length; i++){
				feedbackObjs.push({keys: window['IA-Storage']['keyword'][i], text:window['IA-Storage']['feedback'][i],matchAny:true});
			}
		} else {
			feedbackObjs.push({keys: window['IA-Storage']['keyword'], text:window['IA-Storage']['feedback'],matchAny:true});
		}
		//	Step 2: build the regular expressions we'll use to "find" the keywords in the user text.
		for (var i=0; i<feedbackObjs.length; i++){
			var iO = feedbackObj[i];
			if(iO.matchAny)
				iO.matchExp = [new RegExp("(\b"+(iO.keys.split(/[,\.\s;\:\&]+/).join("\b|\b"))+"\b)","i")];
			else if(!iO.matchAny) {
				iO.matchExp = iO.keys.split(/[,\.\s;\:\&]+/);
				for(var j=0; j<iO.matchExp.length;j++) {
					iO.matchExp[j] = new RegExp("\b"+iO.matchExp[j]+"\b","i");
				}
			}
		}
		
		//	Step 3: compare the regular expressions to the user text... if match then display feedback. if not then continue. If no match then display default feedback.
		
		
		
		
		$("#feedback").text(window['IA-Storage']['feedback'][2]);
		IsLog.c($("#feedback"));
		$("#feedback").addClass("feedback-shown");
		IsLog.c("clicked the button");
		$(this).val("hide");
	} else if($(this).val() == "hide") {
		$("#feedback").removeClass("feedback-shown");
		$(this).val("submit");
	}
}
//make the feedback0 change the "0" using for loop.