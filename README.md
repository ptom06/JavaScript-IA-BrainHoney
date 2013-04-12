JavaScript-IA-BrainHoney
=========================

This is an Inline Assessment (IA) library. Currently there are only 2 types of assessment available:
* wpm_test
* listening



wpm_test
--------
This is an activity to test typing skill measured by "Words per Minute"

It is included within the HTML Template with the following code:

```HTML
<div class="inline-assessment" type="wpm_test"></div>
```
listening
---------
This calculates a grade based on a formula which allows deviation from the correct answer and penalizes on an interval beyond that point. The "stem" question is contained in the HTML to minimize complexity in the configuration.

It is included with the HTML Template with the following code:

```HTML
<div class="inline-assessment" type="listening">
	<div class="FullColumn">
		<div>
			<div class="audio-player" mm_ta_href="audio-player">
				<a href="https://isdev.byu.edu/is/share/jQuery.jPlayer/Uchtdorf1.mp3">"You Are My Hands" 2010 April General Conference - President Dieter F Uchtdorf</a>
			</div>
			<div class="BlockElement-caption"><i>MLU Audio File</i></div>
			<div class="BlockElement-creditline">© BYU Independent Study</div>
		</div>
	</div>
	<h4>What is the Mean Length of Utterance (MLU) for the above audio file?</h4>
</div>
```
Creation of new types
=========================
in the server folder structure there are 2 folders you need to understand before you make a new type;
* courses
* type_specific_files

These folders hold files loaded for very different purposes. "Courses" holds configuration files for instances of types and "type_specific_files" holds the files that define the type in general. In short, since these types are meant to be reused, they are intentionally kept generic and anything not perfectly generic is reserved for the instance-specific configuration file.

Now we'll cover the creation of a new type from generic to specific.

Inside the "type_specific_files" folder there is a folder for each type. The name is always the same as the name of the type, so make one (please don't use spaces or non-standard characers like "@", "#" or "$"). Inside the type folder there is only one required file; "typeObject.lib.json"

The contents of this file are JSON formatted as follows:
```JSON
{
	"development-test": {								/*	This MUST be the type name (the same as the folder which contains it)	*/
		"inputElementsString": "interactionPage.html",	/*	the inputElementsString is the HTML added to the page to provide the user elements with which to interact	*/
		"conditionals": [{								/*	The conditional section contains objects added to the main trunk under indicated conditions (variables passed to the portal)	*/
			"condition": {"variable":"action","value":"check"},	/*	This is an example condition that sends the configuration HTML property only when the "action" is "check"	*/
			"configurationElementsString": "configurationPage.html",	/*	this specifies the file which contains the HTML to load into this property	*/
			"methods": 									/*	Methods are described in detail in the main trunk section	*/
				[
					{
						"name": "testHandler",
						"type": "click",
						"id": "noElementId",
						"handler": "testFunction.js"
					}
				]
		}],
		"methods":										/*	methods are functions. Do not put more than one function into this property. The function is usually a hander, but can also be called outside of an event when necessary.	*/ 
			[
				{
					"name": "testHandler",				/*	The name is not specifically important, but giving it a helpful name will simplify debug if something goes wrong.	*/
					"type": "click",					/*	The type is used to define what event type to attach the handler to (This property is required, even if the function is not used as an event handler)	*/
					"id": "noElementId",				/*	This property is semi-optional. It can be "id", "tag" or "class" and is used to attach the handler to the element upon which the event will fire.	*/
					"handler": "testFunction.js"		/*	This property is required. It is either the function in text or the file name which contains the function.	*/
					"fireAutomatically": true,			/*	This property is optional. If you want the function to be executed as soon as the elements are on the page, then add it and set it to 'true'. This is the only way to get code to execute at that time.	*/
				}
			]
	}
}
```

The other primary file you need to know about is the "##TYPE-NAME##.lib.php" file (EG; "development-test.lib.php". This file is used to modify the default "actions" of the portal and to provide a location for any other coding required for the portal to provide processing not appropriate for the client.
The most useful options (and commonly required for accurate function) are in this example:
```PHP
<?PHP
//	This turns the "SCORM" javascript connection to BrainHoney's API on or off. If it is missing, then the API is initialized be default, which produces errors when the file is loaded outside of BrainHoney (since the API will not be available)
$return_json .= "\"SCORM\":false,";
//	This sets the portal to always include the typeObject in its response. This is useful to avoid getting "json config file not found." errors. These errors are thrown if the instance-specific file is not read and the action is neither "check" nor "create"
$get_typeObject = true;
?>
```
If you create any of the following functions (by name) in your "##.lib.php" file they will replace the default action defined in the portal:
* write_configuration_json_file
* get_configuration_parameters
* ANY function matching your "action" other than "create", "check" and anything listed above

Therefore... you can design your own sequence by chaining $.post requests with specific "action"s with one major limitation; the first request is always "check" and will load the typeObject. That is coded into the InlineAssessment.lib.js and will not be changable.

However the sequence I had in mind with the defaults were;
<ol>
	<li>"check" - which loads the page (either the interaction page or the configuration page, depending on wether or not there is a configuration file)
		<ol>
			<li>"create" - if the configuration page was loaded
				<ol>
					<li>END OF CHAIN</li>
				</ol>
			</li>
			<li>"done" - type-specific function that provides the feedback, grades and other information to complete the interaction.<br/>
				<span>Please note: this would have to be included in the "##.lib.php" file!</span>
				<ol>
					<li>END OF CHAIN</li>
				</ol>
			</li>
		</ol>
	</li>
</ol>

Steps to creating your own configuration
---------


-----
<h3>Step 1: Design the HTML</h3>

There are 2 HTML pages you'll need
1. The HTML for the interaction itself.
2. The HTML to configure the parameters used in the interaction and its grading/feedback.

For the sake of simplicity I'll use "interactionPage.html" and "configurationPage.html" mentioned in the above JSON sample.

interactionPage.html
```HTML
<input type="text" id="inputField"/><input type="button\" id="submitButton" value="submit\"/>
```

Pretty basic. The configuration page is always a little more complicated, so I'll describe it a little more than I did that one.

Every interaction is going to follow a basic assumption; the user will interact with it in some way and it will change in some way to indicate the result of the input. So at a minimum the portal will need some information to send to the user to indicate that the response was received. Our sample configuration page will provide for that input only.

configurationPage.html
```HTML
<input type="text" id="inputField"/><input type="button\" id="submitButton" value="submit\"/>
```

Don't be confused! Yes, they are identical. The only difference between them CAN be the handlers you attach with your "configObject.lib.json".

Now let's take a look at those handlers;

-----
<h3>Step 2: write the JavaScript configuration event handlers</h3>


At this point it may pay to remind you that the file names used in "typeObject.lib.json" must be located with it (in the same folder). Also - the handlers we are about to write can only be attached if the id/class/tag specified in "typeObject.lib.json" exist in the HTML that is loaded. It is potentially helpful to format your "typeObject.lib.json" into ONLY conditionals (nothing outside that property) to help keep it clear which HTML and which handlers go together. If your handlers are meant to be used in both HTMLs, then be sure the id/class/tag are the same.

Now let's get down to brass tacks, shall we? In our sample we have the most basic input imaginable (outside of NO input, which would be ludacris). To keep things consistently idyllic we'll assume we don't even want to validate the input at all! Now we're living dangerously, aren't we?

Our simple-as-it-can-be handler would look like this:
```JavaScript
function() {
	var formInputs = {};
	var gatherValues = ["inputField"];
	for(var i=0; i < gatherValues.length; i++) {
		formInputs[gatherValues[i]] = $("#"+gatherValues[i]).val();
		if(formInputs[gatherValues[i]] === "") {
			alert("Can't save settings until they are all filled out.\n"+$("#"+gatherValues[i]).attr("placeholder")+" is currently empty.");
			return false;
		}
	}
	/*
	//	This one looks good if you want all the "input" tags, but don't want to validate.
	for(var i=0; i < $("input").length; i++) {
		var key = (($("input")[i].name!="")?$("input")[i].name:$("input")[i].id);
		formInputs[key] = $($("input")[i]).val();
	}*/
	$.post(
		portalURL,
		{
			"ia_type":		"development-test",
			"action":		"create",
			"JSONString":	JSON.stringify(formInputs),
			"domain": bhDomain,
			"courseTitle": (window.parent.bhCourseTitle)?window.parent.bhCourseTitle:"UNTITLED",
			"courseID": (window.parent.bhCourseId)?window.parent.bhCourseId:"NOCOURSEID",
			"itemID": getIAObject($(this)).getItemId(),
			"itemTitle": (window.parent.bhItemTitle)?window.parent.bhItemTitle:"NOTITLE"
		},
		function(data) {
			data = JSON.parse(data);
			//IsLog.c(data);			/*	posts success or failure to console	*/
			$(($("#saveResponse").length > 0)?"#saveResponse":"body").html(((data.file_lock.status == "success")?"<h2>Assesment created successsfully</h2>":"<h2>Failed to save your configuration. Please contact Luke to determine the problem.</h2>"));
		}
	);
}
```

Alright, I'm sorry. I put in some validation. I couldn't help myself. I don't enjoy bad data or weird configurations. It isn't simple-as-it-can-be either. It's actually quite a bit more functional than that. Deal with it.

If you did it right and you clicked on that submit button you should get a response from portal that looks like this:
```JSON
{"SCORM":false,"filename":"courses\/UNTITLED\/demo-dev1.json","file_lock":{"status":"success","bytes_written":"101"}}
```

The "file_lock" property contains the success or failure, so the $.post success handler looks there to determine if it worked or not.

Once you have a working configuration page you're ready to build that feedback provider into your "##.lib.php" file.

-----
<h3>Step 3: write the "done" action into your "##.lib.php" file</h3>



-------
We can call these pages by whatever name is most appealing, but must be set in the typeObject.lib.json file as explained below
	The configurationPage.html needs to contain the inputs that are needed for the page.
```HTML
<input type="text" id="inputField"/><input type="button" id="submitButton" value="submit"/>
```
	after the configurationPage.html file has been created the file name needs to be added to the configurationElementsString area of the typeObject.lib.json file

-----
InteractionPage.html - 
	This file needs to contain the infromation used for ... and then put the filename into the "inputElementsString" area of the typeObject.lib.json file
the following is an example of creating a text box that has a submit button below it, a feedback text line between the 
	box and submit button. 
the functionality is carried out in the "testFunction.js"
```HTML
<textarea rows="15" cols="50"></textarea>
<div id="feedback">NA</div>
<input type="button" value="submit" id="submit">
```
	

-----
testFunciton.js - 
this file can be named whatever is desired, but must be set in the typeObject.lib.json file under the inputElementString section and as the handler method

```JSON
{
	"development-test": {								/*	This MUST be the type name (the same as the folder which contains it)	*/
		"inputElementsString": "interactionPage.html",	/*	the inputElementsString is the HTML added to the page to provide the user elements with which to interact	*/
		"conditionals": [{								/*	The conditional section contains objects added to the main trunk under indicated conditions (variables passed to the portal)	*/
			"condition": {"variable":"action","value":"check"},	/*	This is an example condition that sends the configuration HTML property only when the "action" is "check"	*/
			"configurationElementsString": "configurationPage.html",	/*	this specifies the file which contains the HTML to load into this property	*/
			"methods": 									/*	Methods are described in detail in the main trunk section	*/
				[
					{
						"name": "testHandler",
						"type": "click",
						"id": "noElementId",
						"handler": "testFunction.js"
					}
				]
		}],
		"methods":										/*	methods are functions. Do not put more than one function into this property. The function is usually a hander, but can also be called outside of an event when necessary.	*/ 
			[
				{
					"name": "testHandler",				/*	The name is not specifically important, but giving it a helpful name will simplify debug if something goes wrong.	*/
					"type": "click",					/*	The type is used to define what event type to attach the handler to (This property is required, even if the function is not used as an event handler)	*/
					"id": "noElementId",				/*	This property is semi-optional. It can be "id", "tag" or "class" and is used to attach the handler to the element upon which the event will fire.	*/
--->			-->		"handler": "testFunction.js"		/*	This property is required. It is either the function in text or the file name which contains the function.	*/
					"fireAutomatically": true,			/*	This property is optional. If you want the function to be executed as soon as the elements are on the page, then add it and set it to 'true'. This is the only way to get code to execute at that time.	*/
				}
			]
	}
}
```

-----
testFunction2.js

==============
