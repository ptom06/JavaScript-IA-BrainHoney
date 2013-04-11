function() {
	var validTimeLimit = true;
	var maxLoops = 10;
	var loopCount = 0;
	while(maxLoops > loopCount && $(".error-text").length > 0) {
		$(".error-text").remove();
	}
	if(typeof window['textStrings'] != "object") {
		IsLog.c("textStrings reset: "+(typeof window['textStrings']));
		IsLog.c(window['textStrings']);
		window['textStrings'] = [];
	} else {
		IsLog.c("textStrings found, not reset: "+window['textStrings']);
	}
	var time = $("#timeLimit").val();
	var invalidIndex = -1;
	for(i = 0; i < $('#numTexts').val(); i++){
		IsLog.c(window['textStrings']);
		if(window['textStrings'].length > i) {
			strLen=(window['textStrings'][i].length) / 5;
			if (strLen < (time * 2)){
				validTimeLimit = false;
				invalidIndex = i;
				break;
			}
		} else {
			validTimeLimit = false;
			invalidIndex = 0;
		}
	}

	if(validTimeLimit == true) {
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
					formObject[objectKey] = [($(formInputs[i]).val().trim())];
				else if($(formInputs[i]).val() != "") {
					if(typeof formObject[objectKey] == "string")
						formObject[objectKey] = [formObject[objectKey]];
					formObject[objectKey].push($(formInputs[i]).val().trim());
				}
			}
		}
		
		JSONString = JSON.stringify(formObject);
		$.post(
			portalURL,
			{
				"ia_type":"wpm_test",
				"type":$("#pracFin").val(),
				"JSONString":JSONString,
				"domain": bhDomain,
				"courseTitle": (window.parent.bhCourseTitle)?window.parent.bhCourseTitle:"UNTITLED",
				"courseID": (window.parent.bhCourseId)?window.parent.bhCourseId:"NOCOURSEID",
				"itemID": (window.parent.bhItemId)?window.parent.bhItemId:"NOTIEMID",
				"itemTitle": (window.parent.bhItemTitle)?window.parent.bhItemTitle:"NOTITLE",
				"action":"create",
				"studentID":	(window.parent.bhEnrollmentId)?window.parent.bhEnrollmentId:"NOSTUDENTID"
			},
			function(data) {
				IsLog.c(JSONString);
				$("body").append($("<h2>Assesment created successsfully</h2>"));
			}
		);
	} else {
		var shortText = $("<h2 class=\"error-text\" style=\"color:red\" >A text field is not long enough or the time limit is so long that students could finish before time expires.</h2>");
		try {
			IsLog.c($("textarea"));
			IsLog.c(invalidIndex);
			shortText.insertBefore($("textarea")[invalidIndex]);
		} catch (err) {
			alert('error:'+err.message);
		}
	}
}