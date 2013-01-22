var inlineAssessmentIdCounter = 0;
var teacherStudent = "Student";
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
if(!loc)
	var loc = window.location;
//if(!devRegEx)
	var devRegEx = /(dev|^$|localhost|10\.25\.)/i;
//if(!isserver)
	var isserver = (!devRegEx.test(loc.hostname))?"":"dev";

var portalURL = "https://is" + isserver + ".byu.edu/is/share/BrainHoney/IA/portal.php";
if(loc.hostname == "localhost")
	portalURL = "http://localhost/JavaScript-IA-BrainHoney/Server_Files/IA/portal.php";
//IsLog.c("using: "+portalURL);

if(!scriptsToLoadIA)
	var scriptsToLoadIA = [];
if(!scriptsToLoadIAIndex)
	var scriptsToLoadIAIndex = 0;

function InlineAssessment(elementArg) {
	var text_area;
	var startCount=0;
	var doneCount = 0;
	
	this.allowRedo = true;
	this.gradeHolder = $("<div></div>");
	$(this.gradeHolder).attr("id", "ai-grade"+this.id);

	
	this.type;
	this.id = inlineAssessmentIdCounter++;
	
	this.setElement = function( elementArg ) {
		this.emptyElement();
		if(!this.isElement(elementArg)) {			//checks to make sure it is a valid DOM element
			throw 'Error (Inline Assessment): element must be a valid dom element.'; 
		}
		this.element = elementArg;
		$(this.element).attr("id", "ia"+this.id);
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
		if(this.allTypes[this.type].teacherStudent == "Teacher" && typeof this.allTypes[this.type].configurationElementString == "string"){
			var inputElementString = (this.allTypes[this.type]) ? this.allTypes[this.type].configurationElementString : "<span>Inline assessment input element type not found (" + this.type + "). Please define them before using this tool.</span>";
		}else{
			var inputElementString = (this.allTypes[this.type]) ? this.allTypes[this.type].inputElementsString : "<span>Inline assessment input element type not found (" + this.type + "). Please define them before using this tool.</span>";
		}
		
		var DOMNodesCreate = $("<div>"+inputElementString+"</div>"); 		//wraps element string in a div
		this.DOMNodes = DOMNodesCreate;										//adds to the proper place in the HTML page
		//IsLog.c("Type set to "+this.type+" and created "+((this.DOMNodes.length)?this.DOMNodes.length:this.DOMNodes));
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
				throw "Error (Inline Assessment): element.children undefined. element must be valid DOM (for instance: it could be a text node instead of an element node)";
		}
		return true;
	};
	
	this.displayed = false;
	this.display = function() {			//adds formatted information to the proper DOM node
		//	We no longer want to empty the element, we sometimes need there to be content to describe the activity which is particular to the instance on the page - not global for the IA type.
		//	this.emptyElement();
		if($($("#ia"+this.id)[0]).html().indexOf($(this.DOMNodes).html()) > -1)
			this.displayed = true;
		if(this.displayed) {
			if(!(this.DOMNodes instanceof HTMLElement)) {
				for(var i=0; i < this.DOMNodes.length; i++) {
					$($("#ia"+this.id)[0]).html($($("#ia"+this.id)[0]).html().replace($(this.DOMNodes).html(),""));
					IsLog.c("apparently display has happened once already.");
					if($(this.DOMNodes[i]))
						$(this.DOMNodes[i]).remove();
					else
						IsLog.c("Error: Failed to remove the DOMNode["+i+"]");
					//this.element.removeChild( this.DOMNodes[i] );
				}
			} else {
				$(this.DOMNodes).remove();
				//this.element.removeChild( this.DOMNodes );
			}
		}
		if( this.DOMNodes ) {
			if(!(this.DOMNodes instanceof HTMLElement)) {
				for(var i=0; i < this.DOMNodes.length; i++) {
					if($("#ia"+this.id).find($(this.DOMNodes[i])).length == 0) {
						this.element.appendChild( this.DOMNodes[i] );
						if($(this.DOMNodes[i]).attr("id") == undefined)
							$(this.DOMNodes[i]).attr("id", getUniqueDOMId());
						else
							IsLog.c("DOMNode id: "+$(this.DOMNodes[i]).attr("id"));
					} else
						IsLog.c("Skipping element, already found.");
				}
			} else {
				this.element.appendChild( this.DOMNodes );
			}
		} else {
			throw "Error (Inline Assessment): the intended DOM elements are invalid.";
			return false;
		}
		this.displayed = true;
		//	This section disables the handlers and adds a display for the submission if the assessment has already been done.
		if(!this.allowRedo) {
			if(this.DOMNodes.length) {
				for(var e=0; e < this.DOMNodes.length; e++) {
					//$(this.DOMNodes).off("*");
					$(this.DOMNodes).unbind();
					$(this.DOMNodes).unbind("click");
					$(this.DOMNodes).unbind("change");
					if((["input","button","textarea","radio","select","option","fieldset","label"]).indexOf(this.DOMNodes.tagName)) {
						$(this.DOMNodes).attr("disabled", "disabled");
					}
				}
			} else {
				//$(this.DOMNodes).off("*");
				$(this.DOMNodes).unbind();
				$(this.DOMNodes).unbind("click");
				$(this.DOMNodes).unbind("change");
			}
			var allInputs = $(this.DOMNodes).find("input button textarea radio select option fieldset label");
			for(var k=0; k < allInputs.length; k++) {
				$(allInputs[k]).attr("disabled", "disabled");
			}
			if((["input","button","textarea","radio","select","option","fieldset","label"]).indexOf(this.DOMNodes.tagName)) {
				$(this.DOMNodes).attr("disabled", "disabled");
			}
		}
		//	Detect if the SCORM+ API is loaded and then check to see if the assessment has been completed
		if(! $.isReady ) {
			$(window).ready(function(){
				window.setTimeout("checkGradeCompletion();", 250);
				window.setTimeout("checkAPIErrors();", 1000);
			});
		} else {
			window.setTimeout("checkGradeCompletion();", 250);
			window.setTimeout("checkAPIErrors();", 1000);
		}
		this.element = $(this.element);
		return this.element;
	};
	
	this.setEvents = function(){ //this allows for the dynamic creation of events. In the types object above, you can have an array of events with their respective information
		//IsLog.c("Assigning methods:");
		//IsLog.c(this.allTypes[this.type].methods);
		for(var i=0;i<this.allTypes[this.type].methods.length;i++) {
			if(typeof this.allTypes[this.type].methods[i].handler == "string")
				IsLog.c("Error: The handler for "+this.type+":"+this.allTypes[this.type].methods[i].name+" appears to be a string?");		//this.allTypes[this.type].methods[i].handler = eval(this.allTypes[this.type].methods[i].handler);
			//IsLog.c(this.allTypes[this.type]);
			IsLog.c("Assigning handler: "+this.type+":"+this.allTypes[this.type].methods[i].name+"["+this.allTypes[this.type].methods[i].type+"]");
			if(this.allTypes[this.type].methods[i].fireAutomatically == true || this.allTypes[this.type].methods[i].fireAutomatically == "true") {
				IsLog.c("AutoFiring the handler: "+this.type+":"+this.allTypes[this.type].methods[i].name+"");
				this.allTypes[this.type].methods[i].handler();
			}
			var inputElement;
			if(this.allTypes[this.type].methods[i].id)
				inputElement = $("#"+this.allTypes[this.type].methods[i].id);
			if(this.allTypes[this.type].methods[i].class)
				inputElement = $("."+this.allTypes[this.type].methods[i].class);
			if(this.allTypes[this.type].methods[i].tag)
				inputElement = $(""+this.allTypes[this.type].methods[i].tag);
			//IsLog.c(inputElement);
			if(inputElement != null) {
				for(var j=0; j < inputElement.length; j++) {
					switch(this.allTypes[this.type].methods[i].type.toLowerCase()) {	///only two types of events are included but more can be added. "Click" event is default. 
					//Onload has already been run.
						case "change":
							$(inputElement[j]).change(this.allTypes[this.type].methods[i].handler);
						break;
						case "click":
							//IsLog.c("click event!");
							//IsLog.c(this.allTypes[this.type].methods[i].handler);
							$(inputElement[j]).click(this.allTypes[this.type].methods[i].handler);
						break;
						default: //bind Event
							$(inputElement[j]).bind(this.allTypes[this.type].methods[i].type, this.allTypes[this.type].methods[i].handler);
						break;
					}
				}
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
	//IsLog.c(this);			//logs the entire object in the console
	return this;
}
InlineAssessment.prototype.getId = function() { return this.id; };					//additionally functionalities that may or may nto be needed
InlineAssessment.prototype.getType = function() { return this.type; };
InlineAssessment.prototype.getElement = function() { return this.element; };
InlineAssessment.prototype.allTypes = 	this.allTypes = {		//all the available types. Each one needs to have the same formatting, even if it is null ,e.g., 'methods': [NULL], so the coding can be consistent
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
if(typeof assessmentElements == "undefined")
	var assessmentElements;
if(typeof scriptsToLoadIA == "undefined")
	var scriptsToLoadIA = [];
if(typeof scriptsToLoadIAIndex == "undefined")
	var scriptsToLoadIAIndex = 0;
function parseAssessmentObjects() {
	assessmentElements = collectAssessmentElements();
	//IsLog.c("IA: found "+assessmentElements.length+" assessment element(s).");
	for(var a=0; a < assessmentElements.length; a++) {
		if(assessmentElements[a] instanceof HTMLElement) {
			$.post(
				//"portal.php",
				portalURL,
				{
					"ia_type":		$(assessmentElements[a]).attr("type"),
					"action":		"check",
					"domain":		bhDomain,
					"courseTitle":	(window.parent.bhCourseTitle)?window.parent.bhCourseTitle:"UNTITLED",
					"courseID":		(window.parent.bhCourseId)?window.parent.bhCourseId:"NOCOURSEID",
					"itemID":		(window.parent.bhItemId)?window.parent.bhItemId:"NOTIEMID",
					"itemTitle":	(window.parent.bhItemTitle)?window.parent.bhItemTitle:"NOTITLE"
				},
				//{action: "start", bhCourseID:window.parent.bhCourseId },
				//For when the files save properly
				function(data){
					if(typeof data === "string") {
						var assessmentInfo = JSON.parse(data);
					} else {
						var assessmentInfo = data;
					}
					if(assessmentInfo.typeObject != null) {
						var typeName = Object.keys(assessmentInfo.typeObject)[0];
						InlineAssessment.prototype.allTypes[typeName] = assessmentInfo.typeObject[Object.keys(assessmentInfo.typeObject)[0]];
						InlineAssessment.prototype.allTypes[typeName].teacherStudent = "Student";
						if(assessmentInfo.courseID == false || assessmentInfo.courseID == "false")
							InlineAssessment.prototype.allTypes[typeName].teacherStudent = "Teacher";
						if(assessmentInfo.typeObject[typeName].methods) {
							//	Make sure required scripts are loaded...
							var localhostRegEx = new RegExp("localhost", "i");
							if(typeof getScript != "function" && !(localhostRegEx.test(loc.hostname))) {
								IsLog.c("Location: " + loc.hostname);
								IsLog.c("Location indexOf:" + localhostRegEx.test(loc.hostname));
								var scriptLoc = loc.protocol+"//is" + isserver + ".byu.edu/is/share/HTML_Resources/JavaScript/File_Loader/filesToLoad.js";
								IsLog.c("IA getScript wasn't set yet... adding $.cachedScript to jQuery and loading filesToLoad.js");
								$.cachedScript(scriptLoc).done(function(script, textStatus) {
									IsLog.c(arguments[2].getResponseHeader("ETag") + ": " + textStatus);
								});
							}
							if(typeof initializeAPI != "function") {
								var scriptLoc = loc.protocol+"//is" + isserver + ".byu.edu/is/share/BrainHoney/ScormGrader.js";
								$.cachedScript(scriptLoc).done(function(script, textStatus) {
									IsLog.c("IA "+arguments[2].getResponseHeader("ETag") + ": " + textStatus);
								});
							}
							if(InlineAssessment.prototype.allTypes[typeName].scripts) {
								InlineAssessment.prototype.allTypes[typeName].scriptIndex = 0;
								for(var c=0; c < InlineAssessment.prototype.allTypes[typeName].scripts.length; c++) {
									var scriptLoc = loc.protocol+"//is" + isserver + ".byu.edu/is/share/BrainHoney/IA/type_specific_files/"+typeName+"/"+InlineAssessment.prototype.allTypes[typeName].scripts[c];
									IsLog.c(scriptLoc);
									$.cachedScript(scriptLoc,{"dataType": "script","cache": true,"url": scriptLoc,"async": false}).done(function(script, textStatus) {
										//IsLog.c(InlineAssessment.prototype.allTypes[typeName]);
										InlineAssessment.prototype.allTypes[typeName].scriptIndex++;
										//IsLog.c(arguments);
										//IsLog.c(script + ": " + textStatus);
										if(InlineAssessment.prototype.allTypes[typeName].scriptIndex == InlineAssessment.prototype.allTypes[typeName].scripts.length) {
											IsLog.c("script loading complete!");
											loadAssessmentMethods();
										}
									});
								}
							}else
								loadAssessmentMethods();
						} else {
							loadAssessmentMethods();
						}
					} else {
						loadAssessmentMethods();
					}
				}, "json"
			);
		} else {
			IsLog.c("Not re-initializing the inline assessment element. It appears to already have been processed.");
		}
	}
}
function loadAssessmentMethods() {
	var assessmentInfo = InlineAssessment.prototype;
	for(var i=0; i < assessmentElements.length; i++) {
		var typeName =  $(assessmentElements[i]).attr("type");
		for(var b=0; b < assessmentInfo.allTypes[typeName].methods.length; b++) {
			if(typeof assessmentInfo.allTypes[typeName].methods[b].handler == "string") {
				IsLog.c("Building handler for "+typeName+":"+assessmentInfo.allTypes[typeName].methods[b].name+"["+assessmentInfo.allTypes[typeName].methods[b].type+"]");
				var funcString = assessmentInfo.allTypes[typeName].methods[b].handler;
				//IsLog.c(funcString);
				var defineString = "InlineAssessment.prototype.allTypes[\""+typeName+"\"].methods["+b+"].handler = "+funcString+"";
				try {
					eval(defineString);
				} catch (err) {
					IsLog.c("Error: type method string failed eval(): " + err.message);
					throw new Error("Error: "+typeName+" type method string failed eval(): " + err.message);
				}
				if(typeof InlineAssessment.prototype.allTypes[typeName].methods[b].handler != "function")
					IsLog.c("Error: Failed to assign handler!");
			}
		}
		courseID = assessmentInfo.courseID;
		//IsLog.c(InlineAssessment.prototype.allTypes[Object.keys(assessmentInfo.typeObject)[0]]);
		if(courseID === false){
			teacherStudent = "Teacher";
		}else{
			teacherStudent = "Student";	
		}
	}
	initAssessmentObjects();
}

function collectAssessmentElements() {
	//	First collect all the optional element types/definitions
	var assessmentElements = [];
	if(jQuery) {
		var iaE = $("INLINE_ASSESSMENT");
		var iaEh = $("INLINE-ASSESSMENT");
		var iaC = $(".inline-assessment");
		var iaId = $("#inline-assessment");
	} else {
		var iaE = document.getElementsByTagName("inline_assessment");
		var iaEh = document.getElementsByTagName("inline-assessment");
		var iaC = document.getElementsByClassName("inline-assessment");
		var iaId = document.getElementsById("inline-assessment");
	}
	if(iaE.length)
		assessmentElements = assessmentElements.concat(iaE);
	if(iaEh.length)
		assessmentElements = assessmentElements.concat(iaEh);
	if(iaC.length)
		assessmentElements = assessmentElements.concat(iaC);
	if(iaId.length)
		assessmentElements = assessmentElements.concat(iaId);
	//	Now let's put them into a clean array without invalid entries
	var retArray = [];
	for(var i=0; i < assessmentElements.length; i++) {
		for(var key in assessmentElements[i]) {
			if(key.match(/^\d+$/)) {
				retArray[retArray.length] = assessmentElements[i][key];
			}
		}
	}
	//	Return the cleaned array
	return retArray;
}
function initAssessmentObjects() {
	//IsLog.c(window['InlineAssessment'].prototype);
	for(var a=0; a < assessmentElements.length; a++) {
		assessmentElements[a] = new InlineAssessment(assessmentElements[a]);
	}
	//IsLog.c(assessmentElements[a]);
}
function checkGradeCompletion() {
	IsLog.c("IA SCORM+ API:The document is "+((! $.isReady )?"not ":"")+"finished loading.");
	for(var a=0; a < assessmentElements.length; a++) {
		if(typeof getScore == "function")
			var scormGrade = getScore();
		else {
			//throw new Error("getScore() not defined!!! Is the API not initialized by now?");
			IsLog.c("getScore() not defined!!! Is the API not initialized by now?");
			var scormGrade = "ERROR";
		}
		IsLog.c("scormGrade: "+scormGrade);
		if(scormGrade !== "" && scormGrade !== null && scormGrade !== false && scormGrade !== "false" && scormGrade !== "unknown") {
			IsLog.c("Grade retrieved: "+scormGrade);
			$(assessmentElements[a].gradeHolder).html("You already completed this assignment.<br/>Your score is "+( parseFloat(scormGrade) * 100 )+"%");
			$(assessmentElements[a].element).append(assessmentElements[a].gradeHolder);
		}
	}	
}
function checkAPIErrors() {
	if(!apiErrors)	apiErrors = null;
	var gottenAPIError = "";
	if(typeof getAPIErrors == "function") {
		gottenAPIError = getAPIErrors();
	}
	if(getScore() === "" && (apiErrors.length > 0 || apiErrors == null || ! api || gottenAPIError != "")) {
		for(var a=0; a < assessmentElements.length; a++) {
			$(assessmentElements[a].gradeHolder).html("There was an error loading the API. You may not be logged in as an enrolled student, or the API may not have been found.");
			$(assessmentElements[a].element).append(assessmentElements[a].gradeHolder);
		}	
	}
}

function getScriptIA() {
	if(scriptsToLoadIAIndex < scriptsToLoadIA.length && scriptsToLoadIA[scriptsToLoadIAIndex] != null) {
		$.cachedScript(scriptsToLoadIA[scriptsToLoadIAIndex]).done(function(script, textStatus) {
			IsLog.c(scriptsToLoadIA[scriptsToLoadIAIndex] + ": " + textStatus);
			scriptsToLoadIAIndex++;
			getScriptIA();
		});
	}
}

if( typeof jQuery.cachedScript != "function" ) {
	jQuery.cachedScript = function(url, options) {
		
		// allow user to set any option except for dataType, cache, and url
		options = $.extend(options || {}, {
			dataType: "script",
			cache: true,
			url: url
		});
		
		// Use $.ajax() since it is more flexible than $.getScript
		// Return the jqXHR object so we can chain callbacks
		return jQuery.ajax(options);
	};
}

if(! $.isReady ) {
	IsLog.c("IA: Document not yet ready...");
	$(document).ready(function(){								//this is the main part of the function. It creates an array of inline assesments. As it creates the array, it formats them each properly. This means we can have multiple inline assesment tags on a single page
		parseAssessmentObjects();
	});
} else {
	IsLog.c("IA: Document was ready.");
	parseAssessmentObjects();
}

if(typeof getUniqueDOMId != "function") {
	function getUniqueDOMId() {
		var randomId = ((arguments[0] == undefined)?"rid":arguments[0])+(Math.round(Math.random()*4095)).toString(16);
		var loopCount = 0;
		var maxLoops = 100;
		while(loopCount < maxLoops && $("#"+randomId) == null) {
			randomId = ((arguments[0] == undefined)?"rid":arguments[0])+(Math.round(Math.random()*1000)).toString(16);
		}
		return randomId;
	}
}
