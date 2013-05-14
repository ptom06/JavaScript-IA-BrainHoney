function() {
	var error = false;
	var errorMessage = "These fields cannot be blank: ";
	var JSONString = "";
	
	//	do we need to have input included for the submit button or can we remove it?
	var formInputs = $("input,textarea");
	
	var requiredFields = {
		"default-feedback":"You must provide default feedback.",
	};
	
	var formObject = {};					
	for(var i=0; i < formInputs.length; i++) {
		if((["assessmentSubmit"]).indexOf($(formInputs[i]).attr("id")) == -1 && $(formInputs[i]).attr("id")) {
			var objectKey = (($(formInputs[i]).attr("id"))?$(formInputs[i]).attr("id"):$(formInputs[i]).attr("name")).replace(/\d/g,"").trim();
			IsLog.c($(formInputs[i]));
			IsLog.c($("#"+$(formInputs[i]).attr("id")));
			var formValue = (
				(($(formInputs[i]).attr("type"))?
					(
						(["radio","checkbox"].indexOf($(formInputs[i]).attr("type").toLowerCase()) > -1)?
							$(formInputs[i].tagName+":"+$(formInputs[i]).attr("type").toLowerCase()+"[name="+$(formInputs[i]).attr("name")+"]:checked"):
							$(formInputs[i])
					):
					$(formInputs[i])
				)
			).val().trim();
			if(formObject[objectKey] == null)
				formObject[objectKey] = formValue;
			else if($(formInputs[i]).val() != "") {
				if(typeof formObject[objectKey] == "string")
					formObject[objectKey] = [formObject[objectKey]];
				formObject[objectKey].push(formValue);
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