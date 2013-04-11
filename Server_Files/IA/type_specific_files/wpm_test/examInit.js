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
			"sessionID": getSessionId()
		},
		function(data) {
			
		}
	);
}