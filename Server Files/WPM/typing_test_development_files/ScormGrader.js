/*

This JavaScript is intended to attach to BrainHoney's implementation of a SCORM grading api.

Since you don't exactly pass it which grade to set, it assumes the grade to be connected to whichever page the user is on (and this script is run from).
That means that the page needs to be a "Gradable Activity" which is set in the BrainHoney syllabus. Also the "Completion and score set by content (SCO)" needs to be checked and it is a "Rendered activity content with student's responses (SCO supports review mode)".

With these settings (and probably "Add to gradebook" as well) there should be an available grade for this script to assign a number of points to.

*/

if(api != null) {						//	If the api has already been connected to we probably want a fresh session, so terminate it.
	api.Terminate("");
}

var api;								//	Now we can assume that api exists, this will allow us to use the variable witout a critical error

function getAPIErrors() {				//	This function is used to collect errors from various actions performed with the SCORM api
	var errorTemp = api.GetLastError("");	//	This function is provided by BrainHoney and the documentation can be found here: http://dec2011.brainhoney.com/docs/SCORM_GetLastError
	if (errorTemp == '0') {
		errorVar = false;				//	false seems a good indication of no errors (since the function is called getAPIErrors, true would seem to be affirmative)
	} else {
		errorVar = api.GetErrorString(errorTemp);	//	If there are errors (api.GetLastError("") returns something other than '0') then we'll return those!
	}
	if(errorVar != false)
		console.log("Error: SCORM api returned error '"+errorVar+"'");
	return errorVar;
}
function initializeAPI(){
	api = findApiHost(window);			//	This function is provided by BrainHoney and the documentation for it can be found here: http://dec2011.brainhoney.com/docs/SCORM_Overview
	var success = api.Initialize("");	//	The functions within the api object require empty strings to be passed. I don't know why, but according to the documentation they are required.
	if(!success)						//	On failure let's gracefully log it so we can debug in the future.
		console.log("Error: failed initialize on SCORM api!");
	var errors = getAPIErrors();		//	Double check: collect any errors, just in case.
	return (!errors)?success:errors;	//	It's always nice to have a meaningful return value. This seems as good a thing as any to return.
}
function commitAPI() {					//	When the grades are all in, let's use this function to commit them! (otherwise they are not saved)
	if(api != null){
		//	Before we commit we need to set one other value 'cmi.completion_status'
		var success = api.SetValue("cmi.completion_status","Completed");
		var errors = getAPIErrors();
		if(success && !errors) {
			console.log("Notice: SCORM api set grade to complete. Once committed no further changes can be made (except by grader in BrainHoney).");
		} else {
			console.log("Error: SCORM api failed to set grade to complete!");
		}
		console.log("Notice: SCORM api Committing changes!");
		success = api.Commit({"callback":terminateAPI});	//	The syntax here is specific, the parameter here can be either an object containing 2 properties ("callback" [required] and "scope" [optional]) or an empty string.
	} else {
		console.log("Error: SCORM api commit called without api properly initialized.");	//	Hopefully this never happens.
		return false;					//	It doesn't make sense to continue beyond this point, does it?
	}
	if(!success)
		console.log("Error: SCORM api commit failed.");	//	There should be an error, but since the next line outputs it we'll let it do that part.
	errors = getAPIErrors();		//	Double check: collect any errors, just in case.
	return (!errors)?success:errors;
}
function terminateAPI(){				//	This function is used as the handler for api.Commit() it should not be called anywhere else. Please don't.
	var success = api.Terminate("");
	if(!success)						//	On failure let's gracefully log it so we can debug in the future.
		console.log("Error: failed terminate on SCORM api!");
	else								//	On success we'll still log it since this is sort of important. (After termination the api will/should function differently)
		console.log("Notice: Commit success, SCORM api terminated.");
	var errors = getAPIErrors();		//	Double check: collect any errors, just in case.
	return (!errors)?success:errors;	//	Since this is a handler, this return value is somewhat useless. Still, might as well have one, right? Of course right.
}

function setScore(grade /*,questionCount=null */) {				//	This function sets the score and commits it. Only call this when the grade is finalized.
	var errors;							//	We'll be using this variable many times in this function, so we'll just initialize it null for now.
	//	First, let's discover if the grade has already been set!
	var scoreValue = api.GetValue('cmi.score.scaled');
	errors = getAPIErrors();			//	Double check: collect any errors, just in case.
	var completionState = getCompletionState();
	if(scoreValue != "" || completionState === true) {
		//	The score has already been set! I guess we ought to let everyone know they can't do this thing twice?
		if(completionState)
			console.log("Notice: SCORM api returned grade complete. Can't set a score that is complete. Aborting.");
		else
			console.log("Notice: SCORM api returned grade. Score should not be reset. Aborting.");
		var success = commitAPI();		//	There isn't anything to commit, but who cares.
		return false;					//	We didn't set the score, so always false.
	}
	//	'cmi.score.scaled' is always a percentage, represented as a decimal from 0.0 to 1.0, if it's beyond that range the api fails.
	//	If the questionCount (arguments[1]) is set then it is safe to assume that the grade is actually the number they got right.
	if(arguments[1]) {
		var score = grade / arguments[1];
	} else if(grade > 1 && grade <= 100) {		//	If it's not already a decimal, and if it can be made into one by /100
		var score = grade / 100;		//	Convert this number to the intended range!
	} else if(grade <= 1 && grade > 0) {	//	If it's a positive decimal
		var score = grade;
	} else {
		//	Since this error will potentially be visible to students trying to cheat the system, let's make it a little archaic.
		console.log("Error: invalid grade.");
		//	if we wanted a better error that states the real problem, this would be more accurate:
		//console.log("Error: grade must either be a decimal from 0.0 to 1.0 or a number between 1 and 100 to be a valid grade.");
		var success = commitAPI();		//	There isn't anything to commit, but since this could happen if a student were cheating we'll commit and quit.
		return false;					//	We didn't set the score, so always false.
	}

	var success = api.SetValue("cmi.score.scaled",score);
	if(success) {						//	The api call succeeeded - yey!
		console.log("Notice: 'cmi.score.scaled' set.");
		success = commitAPI();			//	Commit the grade to the gradebook.
		errors = getAPIErrors();		//	Collect errors
		if(success && !errors) {
			return success;				//	Return boolean (will always be true due to if)
		} else {
			if(success)					//	I don't know how this would happen, but I guess it's possible.
				console.log("Notice: partial success, grade was committed.");
			console.log("Error: Failed at commitAPI() after grade submission.");
			return false;
		}
		
	} else {							//	Failed at api.SetValue
		console.log("Error: Error setting score.");
		errors = getAPIErrors();
		return false;
	}
	return -1;							//	This shouldn't happen, but I like to know if things like this occur, so we'll return something here.
}

function getCompletionState() {			//	This function helps us determine if the score is "" because it was set to be that, or if the score is simply not yet marked complete...
	/*
		!!!	Please note there are 3 potential return values	!!!
		true	=	score was completed
		false	=	score has not yet been completed
		-1		=	error
	*/
	var scoreStatus = api.GetValue('cmi.completion_status');
	var errors = getAPIErrors();
	if(!errors) {
		console.log("Notice: Current score status is '"+scoreStatus+"'");
		return (scoreStatus.toLowerCase() == 'completed')?true:false;
	} else {
		console.log("Error: failed to return 'cmi.completion_status!");
		return -1;
	}
}

// Provided by BrainHoney from the URL: http://dec2011.brainhoney.com/docs/SCORM_Overview
function findApiHost(win) {
    // Look for the API first on this window
    if (win.API != null)  {
        return win.API;
    }
    // Try looking on frameset kin
    if (win.frames.length > 0) {
      for (var i=0; i<win.frames.length; i++) {
        if (win.frames[i].API != null)  {
          return win.frames[i].API;
        }
      }
    }
    // Try parent
    if (win.parent != win) {
        return findApiHost(win.parent);
    }
    // else give up
    return null;
}