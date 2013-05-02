function() {
	if(typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {};
	var numTexts = $("#numTexts").val(),
		feedback = window['IA-Storage']['feedback'] || [],
		keyword = window['IA-Storage']['keyword'] || [],
		matchAll = window['IA-Storage']['matchAll'] || [];
	IsLog.c("You selected "+numTexts+" texts!");
	
	
	if(numTexts) {
		var repeatNode = window['IA-Storage']['repeatElementNode'] || $("#repeatNode").clone(true, true);
		window['IA-Storage']['repeatElementNode'] = repeatNode;
		$("#repeatNode").remove();
		$("#repeatArea").empty();
		for(var i=0;i<numTexts;i++) {
			IsLog.c("Adding node "+i);
			var addNode = repeatNode.clone(true, true);
			addNode.attr("id", "text"+i);
			$(addNode.find("textarea")[0]).attr("id",$(addNode.find("textarea")[0]).attr("id").replace(/\d+/, i));
			$(addNode.find("input")[0]).attr("id",$(addNode.find("input")[0]).attr("id").replace(/\d+/, i));
			$(addNode.find("input")[2]).attr("id",$(addNode.find("input")[2]).attr("id").replace(/\d+/, i));
			$(addNode.find("input")[1]).attr("name",$(addNode.find("input")[1]).attr("name").replace(/\d+/, i));
			$(addNode.find("input")[2]).attr("name",$(addNode.find("input")[2]).attr("name").replace(/\d+/, i));
			if(matchAll.length >= i) {
				$(addNode.find("input")[1]).prop("checked", matchAll[i]);
				$(addNode.find("input")[2]).prop("checked", !matchAll[i]);
			}
			IsLog.c("matchAll value: "+matchAll[i]);
			//$(addNode.find("input")[1]).attr("checked",(matchAll[i])?"checked":"");
			//$(addNode.find("input")[2]).attr("checked",(!matchAll[i])?"checked":"");
			var previewDiv = $();		
			$("#repeatArea").append(addNode)//.append("Feedback: <div>"+feedback+"</div> Keyword: <div>"+keyword+"</div>");
			if(feedback.length > i) {
				$(addNode.find("textarea")[0]).val(feedback[i]);
				IsLog.c("feedback was long enough");
			} else {
				IsLog.c("feedback was not long enough");
				IsLog.c(feedback);
			}
			if(keyword.length > i) {
				$(addNode.find("input")[0]).val(keyword[i]);
			}
		}
	} else
		IsLog.c("ERROR: Somehow you didn't want any texts?");
	if(this instanceof HTMLElement) {
		for(var i=0; i < assessmentElements.length; i++) {
			if(typeof assessmentElements[i].setEvents == "function") {
				assessmentElements[i].setEvents();
			}
		}
	}
}