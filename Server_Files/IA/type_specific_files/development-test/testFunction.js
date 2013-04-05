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