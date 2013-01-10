var inlineAssessmentIdCounter = 0;
var teacherStudent = "";
var courseID = true;

var bhDomain;
if(window.parent)
	bhDomain = window.parent.location.host;
else
	bhDomain = "NOTFOUND.";
bhDomain = (bhDomain.indexOf("\.") != -1)?bhDomain.substring(0, bhDomain.indexOf("\.")):bhDomain;
if(bhDomain == "") {
	bhDomain = "NOTFOUND";
}


function InlineAssessment(elementArg) {
	var text_area;
	var startCount=0;
	var doneCount = 0;
	//	static for class
	this.allTypes = {		//all the available types. Each one needs to have the same formatting, even if it is null ,e.g., 'methods': [NULL], so the coding can be consistent
		'wpm_test': {
			inputElementsString: "<form>Time remaining:<input id=\"txt\" readonly type=\"text\" value=\"\" border=\"0\" name=\"disp\">\n" +
				"	<br />\n" +
				"	<div id=\"inputText\" style=\"position:static; width:823px; height:166px;\">\n" +
				"	<textarea id=\"area1\"  onkeydown=\"return disableCtrlKeyCombination(event);\" onKeyUp=\"return disableCtrlKeyCombination(event);\"  style=\"font-family:Arial, Helvetica, sans-serif;\" readonly rows=\"10\" cols=\"133\"></textarea>"	+
				"    	<div id=\"textCorrection\" style=\"position:relative ; z-index:999; top:-168px;left:0px; width:inherit; height:inherit; background:white; overflow:auto; border:thin; border-style:solid; border-color:#B4B4B4;\">Type the text that appears here in the box below. Click Start to begin.	" +
				"		</div>" +
				"    </div>" +
				"   <br /> " + 
				"   <input class=\"in\" type=\"submit\" action=\"vstart\" id=\"vStart\" value=\"Start Test\" />" +
				"	<input type=\"submit\" name=\"done\" id=\"done\" value=\"Done\" onClick=\"doneClicked();\" />" +
				"    <br /> " + 
				"   <textarea id=\"userText\" onKeyDown=\"return disableCtrlKeyCombination(event); \" onKeyUp=\"diffString1(document.getElementById('area1').value,this.value);\" rows=\"10\" cols=\"100\" name=\"user_text\" ></textarea>" + 
				"   <br />  " +
				"   <div id=\"scoreTable\" >" +             
				" 	</div></form>",
			configurationElementString:"<form><h2 style=\"color:teal\">Test Type</h2>" +
        		"<label for=\"practiceRadio\"><input type=\"radio\" name=\"testType\" checked=\"checked\" value=\"false\" id=\"practiceRadio\" />Practice</label>" + 	
        		"<label for=\"finalRadio\"><input type=\"radio\" name=\"testType\" value=\"true\" id=\"finalRadio\" />Final</label>" +
        		"<div id=\"practiceDiv\">" +
            	"<h3 style=\"color:teal\">Practice Exam (Instructor Input)</h3>" + 
	           	"<p>low and high WPM must be concentric around the midrange WPM</p>" +
            	"<p>These are only for the illustration that happens below and are not important to the test itself</p>" +
            	"<input id=\"lowWPM\" type=\"text\"  placeholder=\"low WPM...\" 	/>" +
            	"<br>" + 
				"<input id=\"midWPM\" type=\"text\"  placeholder=\"midrange WPM...\" 	/>" + 
            	"<br>" + 
              	"<input id=\"highWPM\" type=\"text\" readonly=\"readonly\" placeholder=\"high WPM...\" 	/>" + 
            	"<br>" +
            	"<input id=\"PracticeTitle\" type=\"text\" name=\"title\" placeholder=\"Practice title...\" />" +
            	"<br>" +
           		"<p>Practice #</p>" +
            	"<select id=\"practiceNum\" >" +
                "<option value=\"1\">1</option>" +
                "<option value=\"2\">2</option>" +
                "<option value=\"3\">3</option>" +
                "<option value=\"4\">4</option>" +
                "<option value=\"5\">5</option>" +
            	"</select>" +
            	"<br/>" +
           		"<textarea id=\"practiceText\" name=\"assesment\" rows=\"8\" cols=\"64\" placeholder=\"the instructor will input the material for which the student will be assesed in this box\"></textarea>" +
            	"<br/>" +
        		"<br/>" +
            	"<input id=\"practiceSubmit\" type=\"button\" value=\"Finished\" />" +
        		"</div>" +
         		"<div id=\"finalDiv\" >" +
        		"<h3 style=\"color:teal\">Final Exam (Instructor Input)</h3>" +
            	"<div class=\"align-left\">" +
                "Time limit (seconds):" +
            	"</div>" +
            	"<div>" +
                "<input id=\"timeLimit\" type=\"text\"  placeholder=\"time limit (seconds)...\" />" +
            	"</div>" +
            	"<div class=\"align-left\">" +
                "Total points:" +
            "</div>"+
            "<div>"+
                "<input id=\"totalPoints\" type=\"text\" placeholder=\"Insert total point\"/>" +
            "</div><br />" +
			
            "<h4 style=\"color:teal\">Grading Options</h4>" +
            "<div class=\"align-left\">" +
                "Expected words per minute:" +
            "</div>" +
            "<div>" +
                "<input id=\"ecpectedWPM\" type=\"text\" placeholder=\"Insert expected WPM\"/>" +
           "</div>" +
            "<div>" +
            	"<input type=\"checkbox\" id=\"incldueErrors\" />Account for errors?" +
            "</div>" +
            "<div id=\"spaceFill\" style=\"height:1.5em\">" +
                "<div id=\"gradingOptions\" contenteditable=\"false\">" +
                    "Subtract <input type=\"text\" style=\"max-width:20px\" id=\"errorValue\" />" +
                    "<select id=\"errorValueType\">" +
                        "<option value=\"percent\">percent</option>" +
                        "<option value=\"points\">points</option>" +
                    "</select>" +
                    "per error" +
                "</div>" +
            "</div>" +
            "<div>" +
            	"<span><textarea id=\"finalText\" rows=\"8\" cols=\"64\" placeholder=\"input test here...\"></textarea></span>" +
        	"</div>" +
        	"<div>" +
            	"<span><input id=\"finalSubmit\" type=\"button\"  value=\"Finished\" /></span>" +
            "</div>" +
        "</div>" +
        "<div id=\"result\"></div>" +
        "<div id=\"jsonR\"></div></form>",
			'methods': 
			[
				{
					'name': "startClick",
					'type': "click",
					'id': "vStart",
					'handler':function(){
						startCount++;
						if (startCount == 1){
							$.post(
								"portal.php",
								//"https://isdev.byu.edu/is/share/BrainHoney/portal.php",
								{action: "start", timeLimit:"120", totalPoint:"10", errorType:"percent", pointsOff:"1", expectedWPM:"30", text:"This is the final." },
								//{action: "start", bhCourseID:window.parent.bhCourseId },
								//For when the files save properly
								function(data){
									if(typeof data === "string")
										text_area = JSON.parse(data);
									else
										text_area = data;
									document.getElementById("area1").innerHTML = text_area.welcome.les_text;
									document.getElementById("textCorrection").innerHTML = text_area.welcome.les_text;
									var seconds = text_area.time; 
									//console.log(seconds);
									InitTimer(seconds);
								},
								"json"
							);
						}
						var message="Sorry, right-click has been disabled"; 
						function clickIE() {if (document.all) {(message);return false;}} 
						function clickNS(e) {if 
						(document.layers||(document.getElementById&&!document.all)) { 
						if (e.which==2||e.which==3) {(message);return false;}}} 
						if (document.layers) 
							{document.captureEvents(Event.MOUSEDOWN);document.onmousedown=clickNS;} 
						else{document.onmouseup=clickNS;document.oncontextmenu=clickIE;} 
						document.oncontextmenu=new Function("return false");
						function submitScores() {
							if(initialized == true && doneClicked == true) {
								setScore(cpm);
								window.clearInterval(intervalVar);
							}
						}
					}
				},
				{
					'name': "doneClick",
					'type': "click",
					'id': "done",
					'handler':function(){
						doneCount++;
						userInput = $('textarea#userText').val();
						console.log(userInput);
						var Jstring = JSON.stringify(userInput);
						console.log(Jstring);
						if (doneCount == 1){
							$.post(
								"portal.php",
								//"https://isdev.byu.edu/is/share/BrainHoney/portal.php",
								{action: "done" , ui: userInput },
								function(data){
									table = JSON.parse(data);
									document.getElementById("scoreTable").innerHTML = table.scores;
									StopTimer();
								}
							);
						}
						setScore(table.grade);
					}
				},
				{
					'name': "startup",
					'fireAutomatically': true,
					'type': "change",
					'id': "practiceRadio",
					'handler':function(e){
						var optionsChecked = false;						
						$("#finalDiv").hide(); 		//initally hides the final input information						
						$("#gradingOptions").hide();	//initially hides the grading options
						$(".align-left").css("float","left");	//formats the text so it ligns up
						$(".align-left").css("min-width","200px");
						$("#incldueErrors").change( 		//hides and shows grading options based on whether or not the checkbox is checked
							function(){
								if(this.checked){
									$("#gradingOptions").show("fast");
									optionsChecked = true;
								}else{
									$("#gradingOptions").hide();
									optionsChecked = false;
								}
							}
						);
						$("#finalRadio").change( 		// when "final" radio is chosen, the practice information is hidden and the final information is shown
							function(){
								if(this.checked){
									$("#practiceDiv").hide();
									$("#finalDiv").show();
								}	
							}
						);
						$("#practiceRadio").change( 	// when "final" radio is chosen, the practice information is hidden and the final information is shown
							function(){
								if(this.checked){
									$("#finalDiv").hide();
									$("#practiceDiv").show();
								}	
							}
						);
	//the low, mid and high WPM values need to be concesntric around the mid, for the purpose the game, so the high is calculated to avoid confusion and errors
						$("#lowWPM").change(changeValue); 
						$("#midWPM").change(changeValue);
						function changeValue(){
							var lowWPM = $("#lowWPM").val()*1;		//multiplied by 1 to convert from a string to an int
							var midWPM = $("#midWPM").val()*1;
							if( lowWPM != "" && midWPM != ""){
								if(lowWPM  <=  midWPM )
									$("#highWPM").val(2*midWPM - lowWPM); 
							}
						}
						$("#practiceSubmit").click(stringToJSONPractice);	//attaching event to the submit buttons
						$("#finalSubmit").click(stringToJSONFinal);
						function stringToJSONPractice(){					//creates a JSON string to be submitted to the portal, and then becomes a text file. Specifically for Practice as it has different inputs
							var error = false;										//error originally set to false. If a field is not filled out properly, error will be set to true and a message will be displayed
							var errorMessage = "These fields cannot be blank:\n";
							var JSONString = "";
							var lowWPM = $("#lowWPM").val();
							var midWPM = $("#midWPM").val();
							var title = $("#PracticeTitle").val();
							var text = $("#practiceText").val();
							if(lowWPM == ""){
								errorMessage += "low WPM\n";
								error = true;	
							}
							if( midWPM == ""){
								errorMessage += "mid WPM\n";
								error = true;	
							}
							if( title == ""){
								errorMessage += "title\n";
								error = true;	
							}
							if( text == ""){
								errorMessage += "text\n";
								error = true;	
							}
							if(!error){
								//JSON string created with all the necessary information
								jsonString = "" +
									'{ ' + 
										'lowWPM":' +	JSON.stringify(lowWPM) + ', ' +
										'"midWPM":' + JSON.stringify(midWPM) +', ' +
										'"highWPM":' + JSON.stringify($("#highWPM").val()) + ', ' +
										'"title":' + JSON.stringify(title) + ', ' + 
										'"practiceNum":' + JSON.stringify($("#practiceNum").val()) + ', ' +
										'"text":' + JSON.stringify(text) + ', ' +
										'"userID":' + JSON.stringify(window.parent.bhUserId) +
									'}';
								//posting to PHP portal which saves file
								$.post(
									"https://isdev.byu.edu/is/dev/David/wpmFinal/portal.php",
									{"type":"practice", "JSONString":jsonString, "bhCourseId":window.parent.bhCourseId, "bhCourseTitle":window.parent.bhCourseTitle},
									function(data) {
					  					console.log(data);			//posts success or failure to console
										$("#inputBody").html("<h2>Assesment created successsfully</h2>");
									}
								);
							}else{
								alert(errorMessage);		//creates an alert dialogue with fields needing to be filled out
							}
						}
						function stringToJSONFinal(){
							//same comments as above but adjusted for final
							var error = false;
							var errorMessage = "These fields cannot be blank:\n";
							var JSONString = "";
							var timeLimit = $("#timeLimit").val();
							var totalPoints = $("#totalPoints").val();
							var finalText = $("#finalText").val();
							var expectedWPM = $("#ecpectedWPM").val();
							var errorValue = $("#errorValue").val();
							var errorType = $("#errorValueType").val();
							if(timeLimit == ""){
								errorMessage += "time limit\n";
								error = true;	
							}
							if(totalPoints == ""){
								errorMessage += "total points\n";
								error = true;	
							}
							if(finalText == ""){
								errorMessage += "text\n";
								error = true;	
							}
							if(expectedWPM == ""){
								errorMessage += "expected words per minute\n";
								error = true;	
							}
							if(optionsChecked){
								if(errorValue == ""){
									errorMessage += "error value\n";
									error = true;	
								}
							}else{
								errorValue = null;
								errorType = null;
							}		
							if(!error){
									jsonString = '{ ' +
										'"timeLimit":' + JSON.stringify(timeLimit)  + ', ' +
										'"totalPoint":' + JSON.stringify(totalPoints) + ', ' +
										'"errorType":' + JSON.stringify(errorType)  + ', ' +
										'"errorValue":' + JSON.stringify(errorValue) + ', ' +
										'"expectedWPM":' + JSON.stringify(expectedWPM) + ', ' +
										'"text":' + JSON.stringify(finalText) + ', ' +
										'"userID":' + JSON.stringify(window.parent.bhUserId) +
									'}';
								var postVars = {
									"type":"final",
									"JSONString":jsonString, /*"bhCourseId":window.parent.bhCourseId,*/
									"bhCourseID":"practiceClass",
									action:"create",
									domain: bhDomain,
									courseTitle: (window.parent.bhCourseTitle)?window.parent.bhCourseTitle:"UNTITLED",
									courseID: (window.parent.bhCourseId)?window.parent.bhCourseId:"NOCOURSEID",
									itemID: (window.parent.bhItemId)?window.parent.bhItemId:"NOTIEMID",
									itemTitle: (window.parent.bhItemTitle)?window.parent.bhItemTitle:"NOTITLE"
								};
								console.log(postVars);
								$.post(
									//"https://isdev.byu.edu/is/dev/David/wpmFinal/portal.php",
									"portal.php",
									postVars,
									function(data) {
										console.log(data);
										$("#inputBody").html("<h2>Assesment created successsfully</h2>");
									}
								);
							}else{
								alert(errorMessage);	
							}
						}
					}
				}	
			]
		},
		'simple_text': {
			'inputElementsString':"<input type=\"text\" id=\"submitString\"/><input type=\"button\" id=\"submitButton\" value=\"submit\"/>",
			'methods': 
				[
					{
						'name': "submitClick",
						'type': "click",
						'id': "submitButton",
						'handler': function() {
							alert($("#submitString").val()); //this works properly for attaching events
						}
					}
				]
		}
	};
	
	this.type;
	this.id = inlineAssessmentIdCounter++;
	
	this.setElement = function( elementArg ) {
		this.emptyElement();
		if(!this.isElement(elementArg)) {			//checks to make sure it is a valid DOM element
			throw 'Error (Inline Assessment): element must be a valid dom element.'; 
		}
		this.element = elementArg;
		this.setType( this.element ); 
		this.display( this.element );
		if (this.allTypes[this.type].methods.length > 0){
			this.setEvents();
		}
		return this.element;
	};
	
	this.isElement = function(obj) {
		try {
			//Using W3 DOM2 (works for FF, Opera and Chrom)
			return obj instanceof HTMLElement;
		}
		catch(e){
			//Browsers not supporting W3 DOM2 don't have HTMLElement and
			//an exception is thrown and we end up here. Testing some
			//properties that all elements have. (works on IE7)
			return (typeof obj==="object") &&
				(obj.nodeType===1) && (typeof obj.style === "object") &&
				(typeof obj.ownerDocument ==="object");
		}
	}
	
	this.setType = function() {
		if(!this.element) {
			throw "Error (Inline Assessment): You can't set the type before there is an element defined.";
			return false;
		} else {
			this.type = this.element.getAttribute("type");		//retrieves the "type" from the HTML tag. This what defines pretty much everything!
		}
		
		//Shorthand or statement. if it finds the type in the predefined types at the top, it returns the element string unput, else it outputs a message
		if(teacherStudent == "Teacher"){
			var inputElementString = (this.allTypes[this.type]) ? this.allTypes[this.type].configurationElementString : "<span>Inline assessment input element type not found (" + this.type + "). Please define them before using this tool.</span>";
		}else{
		var inputElementString = (this.allTypes[this.type]) ? this.allTypes[this.type].inputElementsString : "<span>Inline assessment input element type not found (" + this.type + "). Please define them before using this tool.</span>";
		}
		
		var DOMNodesCreate = $("<div>"+inputElementString+"</div>"); 		//wraps element string in a div
		this.DOMNodes = DOMNodesCreate;										//adds to the proper place in the HTML page
		return this.type;
	}
	
	this.emptyElement = function() {			//clears up to 1000 elements from a given node. 
		if(this.element) {
			var loopLimit = 1000;
			var loopCount = 0;
			if(this.element.children != undefined) {
				while(this.element.children.length > 0 && loopCount < loopLimit) {
					this.element.removeChild(this.element.children[0]);
					loopCount++;
				}
			} else
				throw "Error (Inline Assessment): element.children undefined. element must be invlid DOM (for instance: it could be a text node instead of an element node)";
		}
		return true;
	};
	
	this.display = function() {			//adds formatted information to the proper DOM node
		this.emptyElement();
		if( this.DOMNodes ) {
			for(var i=0; i < this.DOMNodes.length; i++)
				this.element.appendChild( this.DOMNodes[i] );
		} else {
			throw "Error (Inline Assessment): the intended DOM elements are invalid.";
			return false;
		}
		return this.element;
	};
	
	this.setEvents = function(){ //this allows for the dynamic creation of events. In the types object above, you can have an array of events with their respective information
		for(var i=0;i<this.allTypes[this.type].methods.length;i++) {
			if(this.allTypes[this.type].methods[i].fireAutomatically === true) {
				this.allTypes[this.type].methods[i].handler();
			}
			var inputElement = $("#"+this.allTypes[this.type].methods[i].id);
			if(typeof inputElement == 'array') {
				inputElement = inputElement[0];
			}
			switch(this.allTypes[this.type].methods[i].type) {	///only two types of events are included but more can be added. "Click" event is default. 
			//Onload has already been run.
				case "change":
					inputElement.change(this.allTypes[this.type].methods[i].handler);
				break;
				default: //click Event
					inputElement.click(this.allTypes[this.type].methods[i].handler);
				break;
			}
		}
	}
	
	this.setElement( elementArg );

	if(!this.element) {
		if(!this.setElement( elementArg )) {
			if(!this.element || this.element === undefined) {
				throw "Error (Inline Assessment): element not specified.";
				return false;
			}
			//throw "Error (Inline Assessment): failed creating element input.";
			//return false;
		}
	}
	console.log(this);			//logs the entire object in the console
	return this;
}
InlineAssessment.prototype.getId = function() { return this.id; };					//additionally functionalities that may or may nto be needed
InlineAssessment.prototype.getType = function() { return this.type; };
InlineAssessment.prototype.getElement = function() { return this.element; };

var assessmentElements;

$.post(
	"portal.php",
	//"https://isdev.byu.edu/is/share/BrainHoney/portal.php",
	{
		action: "check",
		domain: bhDomain,
		courseTitle: (window.parent.bhCourseTitle)?window.parent.bhCourseTitle:"UNTITLED",
		courseID: (window.parent.bhCourseId)?window.parent.bhCourseId:"NOCOURSEID",
		itemID: (window.parent.bhItemId)?window.parent.bhItemId:"NOTIEMID",
		itemTitle: (window.parent.bhItemTitle)?window.parent.bhItemTitle:"NOTITLE"
	},
	//{action: "start", bhCourseID:window.parent.bhCourseId },
	//For when the files save properly
	function(data){
		console.log(data);
		if(typeof data === "string") {
			var courseInfo = JSON.parse(data);
		} else {
			var courseInfo = data;
		}
		console.log(courseInfo);
		courseID = courseInfo.courseID;
		if(courseID === true){
			teacherStudent = "Student";	
		}else{
			teacherStudent = "Teacher";
		}
		if(! $.isReady ) {
			$(document).ready(function(){								//this is the main part of the function. It creates an array of inline assesments. As it creates the array, it formats them each properly. This means we can have multiple inline assesment tags on a single page
				assessmentElements = $("INLINE_ASSESSMENT");
				for(var a=0; a < assessmentElements.length; a++) {
					assessmentElements[a] = new InlineAssessment(assessmentElements[a]);
				}
			});
		} else {
			assessmentElements = $("INLINE_ASSESSMENT");
			for(var a=0; a < assessmentElements.length; a++) {
				assessmentElements[a] = new InlineAssessment(assessmentElements[a]);
			}
		}
	},
	"json"
);
