function() {
	var error = false;
	var errorMessage = "These fields cannot be blank: ";
	var JSONString = "";
	
	var formInputs = $("input,textarea,select");
	
	var requiredFields = {
		"timeLimit":"You need a time limit.",
		"expectedWPM":"You need an expected words per min.",
		"errorValue":"You need to penalize errors (you could put zero).",
		"errorValue":"You need to penalize errors (you could put zero).",
	};
	
	var formObject = {};					
	for(var i=0; i < formInputs.length; i++) {
		if((["assessmentSubmit"]).indexOf($(formInputs[i]).attr("id")) == -1) {
			var objectKey = (($(formInputs[i]).attr("id"))?$(formInputs[i]).attr("id"):$(formInputs[i]).attr("name"));
			if(formObject[objectKey] == null)
				formObject[objectKey] = ($(formInputs[i]).val().trim());
			else if($(formInputs[i]).val() != "") {
				if(typeof formObject[objectKey] == "string")
					formObject[objectKey] = [formObject[objectKey]];
				formObject[objectKey].push($(formInputs[i]).val().trim());
			}
		}
	}
	IsLog.c(formObject);
	JSONString = JSON.stringify(formObject);
	$.post(
		portalURL,
		{
			"ia_type":"development-test",
			"JSONString":JSONString,
			"domain": bhDomain,
			"courseTitle": (window.parent.bhCourseTitle)?window.parent.bhCourseTitle:"UNTITLED",
			"courseID": (window.parent.bhCourseId)?window.parent.bhCourseId:"NOCOURSEID",
			"itemID": getIAObject($(this)).getItemId(),
			"itemTitle": (window.parent.bhItemTitle)?window.parent.bhItemTitle:"NOTITLE",
			"action":"create"
		},
		function(data) {
			IsLog.c(JSONString);
			$("body").append($("<h2>Assesment created successsfully</h2>"));
			IsLog.c(arguments);
		}
	).error(function(){
		IsLog.c("Config save failed.");
	});
}