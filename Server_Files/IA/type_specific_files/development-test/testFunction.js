function() {
	if($(this).val() == "submit") {
		IsLog.c("Testing the \'window\'");
		IsLog.c(window['IA-Storage']);
		IsLog.c(window['IA-Storage']['default-feedback']);
		IsLog.c(window['IA-Storage']['feedback']);
		IsLog.c(window['IA-Storage']['keyword']);
		IsLog.c(window['IA-Storage']['matchAll']);
		
		//	Step 1: correlate the keywords with their feedback
		var feedbackObjs = [];
		if(typeof window['IA-Storage']['keyword'] != "string") {
			for(var i=0;i<window['IA-Storage']['keyword'].length; i++){
				feedbackObjs.push({keys: window['IA-Storage']['keyword'][i], text:window['IA-Storage']['feedback'][i],matchAll:window['IA-Storage']['matchAll'][i]});
			}
		} else {
			feedbackObjs.push({keys: window['IA-Storage']['keyword'], text:window['IA-Storage']['feedback'],matchAll:window['IA-Storage']['matchAll'][i]});
		}
		//	Step 2: build the regular expressions we'll use to "find" the keywords in the user text.
		for (var i=0; i<feedbackObjs.length; i++){
			var iO = feedbackObjs[i];
			if(!iO.matchAll)
				iO.matchExp = [new RegExp("(\\b"+(iO.keys.split(/[,\.\s;\:\&]+/).join("\\b|\\b"))+"\\b)","i")];
			else if(iO.matchAll) {
				iO.matchExp = iO.keys.split(/[,\.\s;\:\&]+/);
				for(var j=0; j < iO.matchExp.length; j++) {
					iO.matchExp[j] = new RegExp("\\b"+iO.matchExp[j]+"\\b","i");
					IsLog.c("new RegExp = "+iO.matchExp[j])
				}
			}
			IsLog.c("iO:");
			IsLog.c(iO);
			feedbackObjs[i] = iO;
		}
		
		//	Step 3: compare the regular expressions to the user text... if match then display feedback. if not then continue. If no match then display default feedback.
		var anyFound = false;
		var feedbackIndex = -1;
		IsLog.c(feedbackObjs);
		for (var i=0; feedbackObjs.length > i; i++){
			var allTrue = false;
			IsLog.c("matching ALL? "+feedbackObjs[i].matchAll);
			IsLog.c("comparing "+feedbackObjs[i].matchExp.length+" regular expressions.");
			for (var j=0; feedbackObjs[i].matchExp.length > j; j++){
				IsLog.c("looking at regExp: \""+feedbackObjs[i].matchExp[j]+"\"");
				allTrue = feedbackObjs[i].matchExp[j].test($("#user-text").val());
				IsLog.c("regExp \""+feedbackObjs[i].matchExp[j]+"\" test = "+feedbackObjs[i].matchExp[j].test($("#user-text").val())+"");
				if(feedbackObjs[i].matchAll === true) {
					if (allTrue == false) {
						IsLog.c("we're looking for ONE false... and this is false: \""+feedbackObjs[i].matchExp[j]+"\" is in \""+$("#user-text").val()+"\"");
						break;				//	We're looking for ANY of them to be false - if any are then this is not a match.
					} else
						IsLog.c("we're looking for ONE false... and this is true: \""+feedbackObjs[i].matchExp[j]+"\" is in \""+$("#user-text").val()+"\"");
				} else {
					if (allTrue == true) {
						IsLog.c("we're looking for ONE true... and this is true: \""+feedbackObjs[i].matchExp[j]+"\" is in \""+$("#user-text").val()+"\"");
						break;				//	We're looking for ANY of them to be true - 	if any are then this is a match.
					} else
						IsLog.c("we're looking for ONE true... and this is false: \""+feedbackObjs[i].matchExp[j]+"\" is in \""+$("#user-text").val()+"\"");
				}
			}
			if(allTrue){
				//$("#feedback").text(window['IA-Storage']['feedback'][i]);
				anyFound = true;
				feedbackIndex = i;
				break;	
			}	
		}
		if(anyFound) {
			IsLog.c("This is the feedback info im looking for");
			IsLog.c(feedbackIndex);
			$("#feedback").text(window['IA-Storage']["feedback"][feedbackIndex]);
		} else {
			IsLog.c("This is the default feedback");
			$("#feedback").text(window['IA-Storage']["default-feedback"]);
		}
		
		//$("#feedback").text(window['IA-Storage']['feedback'][2]);
		IsLog.c($("#feedback"));
		$("#feedback").addClass("feedback-shown");
		IsLog.c("clicked the button");
		$(this).val("hide");
	} else if($(this).val() == "hide") {
		$("#feedback").removeClass("feedback-shown");
		$(this).val("submit");
	}
}