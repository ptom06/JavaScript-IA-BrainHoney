function() {
	$.post(
		portalURL,
		{
			"ia_type": "wpm_test",
			"courseTitle": (window.parent.bhCourseTitle)?window.parent.bhCourseTitle:"UNTITLED",
			"courseID": (window.parent.bhCourseId)?window.parent.bhCourseId:"NOCOURSEID",
			"itemID": (window.parent.bhItemId)?window.parent.bhItemId:"NOITEMID",
			"itemTitle": (window.parent.bhItemTitle)?window.parent.bhItemTitle:"NOTITLE",
			"action": "default_case",
			"studentID":	(window.parent.bhEnrollmentId)?window.parent.bhEnrollmentId:"NOSTUDENTID",
			"sessionID":	getSessionId()
		},
		function(data) {
			var targetElement = $('#PracSelect');
			var numOfTexts;
			var JSONobj;
			if(typeof data === "string"){
				JSONobj = JSON.parse(data);
			}else{
				JSONobj = data;
			}
			numOfTexts = parseInt(JSONobj.numTexts);	
			for(i = 0; i < numOfTexts; i++) {
				var textArea = $("<option value=\""+i+"\">"+(i+1)+"</option>");
				targetElement.append(textArea);
			}
			if(this instanceof HTMLElement) {
				for(var i=0; i < assessmentElements.length; i++) {
					if(typeof assessmentElements[i].setEvents == "function") {
						assessmentElements[i].setEvents();
					}
				}
			}
		}
	);
}