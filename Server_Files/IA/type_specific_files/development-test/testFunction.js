function() {
	if($(this).val() == "submit") {
		IsLog.c("Testing the \'window\'");
		IsLog.c(window['IA-Storage']);
		$("#feedback").text(window['IA-Storage']['feedback0']);
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