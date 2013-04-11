function(){
	userInput = $('textarea#userText').val();
	$('textarea#userText').attr("disabled",true); 
	var Jstring = JSON.stringify(userInput);
	var gradeObj = JSON.stringify(window.mo);
	StopTimer();
		userInput = $('textarea#userText').val();
	originalText = $('textarea#area1').val();
	var score=letterCompare(originalText,userInput);
	$.post(
		portalURL,
		{
			"ia_type":"wpm_test",
			"action":	"done",
			"courseTitle": (window.parent.bhCourseTitle)?window.parent.bhCourseTitle:"UNTITLED",
			"courseID": (window.parent.bhCourseId)?window.parent.bhCourseId:"NOCOURSEID",
			"itemID": (window.parent.bhItemId)?window.parent.bhItemId:"NOTIEMID",
			"itemTitle": (window.parent.bhItemTitle)?window.parent.bhItemTitle:"NOTITLE",
			"ui":	userInput,
			"gradingObj": score,
			"studentID":	(window.parent.bhEnrollmentId)?window.parent.bhEnrollmentId:"NOSTUDENTID",
			"sessionID": (window.parent.sessionID)?window.parent.sessionID:"NOSESSIONID"
		},
			function(data){
				var table = JSON.parse(data);
				document.getElementById("scoreTable").innerHTML = table.scores;
				
				setScore(table.grade);
			}
	);

	if(typeof api != "undefined")
		setScore(score);
	else
		IsLog.c("Score not submitted, api not found.");
}