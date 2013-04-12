function() {
	var numTexts = $("#numTexts").val();
	IsLog.c("You selected "+numTexts+" texts!");
	if(typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {};
	var feedback = window['IA-Storage']['feedback'] || [/*
		"ONE ONE ONE ONE ONE ONE ONE ONE ONE ONE ONE ONE ONE ONE ONE ONE ONE ONE ONE ONE ONE ONE ONE ONE ONE ONE ONE ONE",
		"TWO TWO TWO TWO TWO TWO TWO TWO TWO TWO TWO TWO TWO TWO TWO TWO TWO TWO TWO TWO TWO TWO TWO TWO TWO TWO TWO TWO",
		"THREE THREE THREE THREE THREE THREE THREE THREE THREE THREE THREE THREE THREE THREE THREE THREE THREE THREE THREE",
		"FOUR FOUR FOUR FOUR FOUR FOUR FOUR FOUR FOUR FOUR FOUR FOUR FOUR FOUR FOUR FOUR FOUR FOUR FOUR FOUR FOUR FOUR FOUR",
		"FIVE FIVE FIVE FIVE FIVE FIVE FIVE FIVE FIVE FIVE FIVE FIVE FIVE FIVE FIVE FIVE FIVE FIVE FIVE FIVE FIVE FIVE FIVE",
		"SIX SIX SIX SIX SIX SIX SIX SIX SIX SIX SIX SIX SIX SIX SIX SIX SIX SIX SIX SIX SIX SIX SIX SIX SIX SIX SIX SIX",
		"SEVEN SEVEN SEVEN SEVEN SEVEN SEVEN SEVEN SEVEN SEVEN SEVEN SEVEN SEVEN SEVEN SEVEN SEVEN SEVEN SEVEN SEVEN SEVEN",
		"EIGHT EIGHT EIGHT EIGHT EIGHT EIGHT EIGHT EIGHT EIGHT EIGHT EIGHT EIGHT EIGHT EIGHT EIGHT EIGHT EIGHT EIGHT EIGHT",
		"NINE NINE NINE NINE NINE NINE NINE NINE NINE NINE NINE NINE NINE NINE NINE NINE NINE NINE NINE NINE NINE NINE NINE",
		"TEN TEN TEN TEN TEN TEN TEN TEN TEN TEN TEN TEN TEN TEN TEN TEN TEN TEN TEN TEN TEN TEN TEN TEN TEN TEN TEN TEN TEN"
	*/];
	var keyword = window['IA-Storage']['keyword'] || [/*
		"ONE",
		"TWO",
		"THREE",
		"FOUR",
		"FIVE",
		"SIX",
		"SEVEN",
		"EIGHT",
		"NINE",
		"TEN"
	*/];
	
	if(numTexts) {
		var repeatNode = window['IA-Storage']['repeatElementNode'] || $("#repeatNode").clone(true, true);
		window['IA-Storage']['repeatElementNode'] = repeatNode;
		$("#repeatNode").remove();
		$("#repeatArea").empty();
		for(var i=0;i<numTexts;i++) {
			IsLog.c("Adding node "+i);
			var addNode = repeatNode.clone(true, true);
			addNode.attr("id", "text"+i);
			$(addNode.find("textarea")[0]).attr("id","feedback"+i);
			$(addNode.find("input")[0]).attr("id","keyword"+i);
			$("#repeatArea").append(addNode);
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