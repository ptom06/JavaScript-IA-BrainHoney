function() {
	$('textarea#userText').attr("disabled",false);
	$('#vStart').attr("disabled",true);
	$("#scoreTable").html("");
	$("#userText").val("");
	IsLog.c($("#userText").val());
	$.post(
		portalURL,
		{
			"ia_type":		"wpm_test",
			"courseTitle": (window.parent.bhCourseTitle)?window.parent.bhCourseTitle:"UNTITLED",
			"courseID": (window.parent.bhCourseId)?window.parent.bhCourseId:"NOCOURSEID",
			"itemID": (window.parent.bhItemId)?window.parent.bhItemId:"NOTIEMID",
			"itemTitle": (window.parent.bhItemTitle)?window.parent.bhItemTitle:"NOTITLE",
			"action": "start",
			"selectedPrac": $('#PracSelect').val(),
			"studentID":	(window.parent.bhEnrollmentId)?window.parent.bhEnrollmentId:"NOSTUDENTID",
			"sessionID": (window.parent.sessionID)?window.parent.sessionID:"NOSESSIONID"
		},				
		function(data){
			if(typeof data === "string"){
				text_area = JSON.parse(data);
			}else{
				text_area = data;
			}
			document.getElementById("textCorrection").innerHTML = text_area.welcome.les_text;
			document.getElementById("area1").innerHTML = text_area.welcome.les_text;
			window["typingTextInputId"] = "userText";
			window["typingTextOutputId"] = "textCorrection";
			window["typingText"] = text_area.welcome.les_text;
			if(typeof window["typingText"] != "undefined")
				var primaryText = window["typingText"];
			else {
				IsLog.c("Error: can't match string, 'typingText' not defined.");
				return -1;
			}
			if(typeof window["typingTextOutputId"] != "undefined") {
				if($("#"+window["typingTextOutputId"])) {
					var outputElement = $("#"+window["typingTextOutputId"]);
					outputElement.html(document.createTextNode(primaryText));
				} else {
					IsLog.c("Error: can't output results, '#"+window["typingTextOutputId"]+"' element not found.");
					return -1;
				}
			} else {
				IsLog.c("Error: can't output results, 'typingTextOutputId' not defined.");
				return -1;
			}
			var seconds = text_area.time; 
			InitTimer(seconds);
		},
		"json"
	);
}