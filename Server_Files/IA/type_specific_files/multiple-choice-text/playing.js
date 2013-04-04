var thigie = function() {
	var response = $("<span></span>");
	response.attr("id", "response");
	response.text("this is just a test");
	//IsLog.c(this);
	response.css("color", "purple").css("display","block").css("padding-left","2em");
	$(this).parent().append(response);
}
