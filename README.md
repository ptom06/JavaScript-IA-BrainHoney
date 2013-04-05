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
=============
Steps to creating your own configuration
---------
demo-localhost_dev.html

-----
typeObject.lib.json

-----
configurationPage.html
We can call these pages by whatever name is most appealing, but must be set in the typeObject.lib.json file as explained below
	The configurationPage.html needs to contain the inputs that are needed for the page.
```HTML
<input type="text" id="inputField"/><input type="button" id="submitButton" value="submit"/>
```
	after the configurationPage.html file has been created the file name needs to be added to the configurationElementsString area of the typeObject.lib.json file

-----
InteractionPage.html
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
testFunciton.js
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
--->		--->		----->	"handler": "testFunction.js"		/*	This property is required. It is either the function in text or the file name which contains the function.	*/
					"fireAutomatically": true,			/*	This property is optional. If you want the function to be executed as soon as the elements are on the page, then add it and set it to 'true'. This is the only way to get code to execute at that time.	*/
				}
			]
	}
}
```

-----
testFunction2.js

==============
