/*
	This script expects something to this effect will be run somewhere else:
	
function initTest() {
	IsLog.timerOn();
	window["typingText"] = "Mr. Speaker, Mr. Vice President, Members of Congress, fellow citizens: Fifty-one years ago, John F. Kennedy declared to this Chamber that “the Constitution makes us not rivals for power but partners for progress... It is my task,” he said, “to report the State of the Union – to improve it is the task of us all.” Tonight, thanks to the grit and determination of the American people, there is much progress to report. After a decade of grinding war, our brave men and women in uniform are coming home. After years of grueling recession, our businesses have created over six million new jobs. We buy more American cars than we have in five years, and less foreign oil than we have in twenty. Our housing market is healing, our stock market is rebounding, and consumers, patients, and homeowners enjoy stronger protections than ever before. Together, we have cleared away the rubble of crisis, and can say with renewed confidence that the state of our union is stronger. But we gather here knowing that there are millions of Americans whose hard work and dedication have not yet been rewarded. Our economy is adding jobs – but too many people still can’t find full-time employment. Corporate profits have rocketed to all-time highs – but for more than a decade, wages and incomes have barely budged.";
	window["typingTextInputId"] = "againstThis";
	window["typingTextOutputId"] = "checkThis";
	if(typeof window["typingText"] != "undefined")
		var primaryText = window["typingText"];
	else {
		IsLog.c("Error: can't match string, \"typingText\" not defined.");
		return -1;
	}
	if(typeof window["typingTextOutputId"] != "undefined") {
		if($("#"+window["typingTextOutputId"])) {
			var outputElement = $("#"+window["typingTextOutputId"]);
			outputElement.html(document.createTextNode(primaryText));
		} else {
			IsLog.c("Error: can't output results, \"#"+window["typingTextOutputId"]+"\" element not found.");
			return -1;
		}
	} else {
		IsLog.c("Error: can't output results, \"typingTextOutputId\" not defined.");
		return -1;
	}
	$("#againstThis").bind("keyup", function(event) {
		if(event.keyCode == 32 || this.originalEvent instanceof MouseEvent || this.originalEvent instanceof TouchEvent) {
			updateTestDisplay();
		} 
	});
}
*/

function updateTestDisplay() {
	var d = new Date();
	if(typeof window["typingText"] != "undefined")
		var primaryText = window["typingText"];
	else {
		IsLog.c("Error: can't match string, \"typingText\" not defined.");
		return -1;
	}
	if(typeof window["typingTextInputId"] != "undefined") {
		if($("#"+window["typingTextInputId"])) {
			var secondaryText = $("#"+window["typingTextInputId"]).val();
			IsLog.c("secondaryText: \""+secondaryText+"\"");
		} else {
			IsLog.c("Error: can't match string, \"#"+window["typingTextInputId"]+"\" element not found.");
			return -1;
		}
	} else {
		IsLog.c("Error: can't match string, \"typingTextInputId\" not defined.");
		return -1;
	}
	
	if(typeof window["typingTextOutputId"] != "undefined") {
		if($("#"+window["typingTextOutputId"])) {
			var outputElement = $("#"+window["typingTextOutputId"]);
			outputElement.html(document.createTextNode(primaryText));
		} else {
			IsLog.c("Error: can't output results, \"#"+window["typingTextOutputId"]+"\" element not found.");
			return -1;
		}
	} else {
		IsLog.c("Error: can't output results, \"typingTextOutputId\" not defined.");
		return -1;
	}

	var matchObject = complexStringMatcher(primaryText,secondaryText);
	var d2 = new Date();
	var delayInSeconds = (parseFloat( parseInt( d2.valueOf() ) - parseInt( d.valueOf() ) ) / 1000);
	$("body").last().append($("<div style=\"display: none;\">returned in "+delayInSeconds+" seconds</div>"));
	if(typeof matchObject.matches != "undefined") {
		var resultElement = $("<p></p>");
		for(var matchKey in matchObject.matches) {
			var m = matchObject.matches[matchKey];
			var wordSpan = $("<span></span>");
			if(m['data']['html'] != "") {
				wordSpan.html(m['data']['html']);
			} else {
				wordSpan.append(document.createTextNode("["+m['secondary']['text']+"]"));
			}
			wordSpan.append(document.createTextNode((m['primary']['space']!="")?m['primary']['space']:m['secondary']['space']));
			resultElement.append(wordSpan);
		}
		outputElement.html("");
		outputElement.append(resultElement);
	}
}

function complexStringMatchRecursionSearch(coreObject) {
	if(coreObject === false) return false;
	if(typeof coreObject != "object") {
		//IsLog.c("stringMatcher: typeof text:"+typeof(arguments[0]))
		//IsLog.c("stringMatcher: objectKeys:"+(arguments[0]))
		coreObject = {
			"primary":		{	"text":arguments[0],	"position":0	},
			"secondary":	{	"text":arguments[1],	"position":0	},
			"unmatchedBuffer": undefined,
			"matches":{},
			"recursionDepth": 0,
			"currentSearchRecursionDepth": 0,
			"maxRecusionDepth": Math.pow((arguments[0]).split(/\s+/).length, 2)
		};
		//IsLog.c("stringMatcher: initial object set.");
		//IsLog.c(coreObject);
	}
	coreObject.recursionDepth = (coreObject.recursionDepth == undefined)?0:parseInt(coreObject.recursionDepth)+1;
	coreObject.currentSearchRecursionDepth = (coreObject.currentSearchRecursionDepth == undefined)?0:parseInt(coreObject.currentSearchRecursionDepth);
	if(coreObject.recursionDepth > coreObject.maxRecursionDepth) {
		IsLog.c("stringMatcher: reached recursion limit.");
		return coreObject;
	}
	
	if(isNaN(coreObject.primary.position) || isNaN(coreObject.secondary.position)) {
		IsLog.c("stringMatcher: Error: position is not a number. "+coreObject.primary.position+":"+coreObject.secondary.position+" "+coreObject.currentSearchRecursionDepth+":"+coreObject.recursionDepth);
		return false;
	}

	//	load in the current words from the position index
	var restTextPrimary = coreObject.primary.text.substr(coreObject.primary.position);
	var currentPrimaryWord = restTextPrimary.substr(0, restTextPrimary.search(/\s|$/));
	restTextPrimary = restTextPrimary.substr(currentPrimaryWord.length);
	var currentPrimaryWhitespace = restTextPrimary.substr(0, restTextPrimary.search(/\S|$/));
	
	var restTextSecondary = coreObject.secondary.text.substr(coreObject.secondary.position);
	var currentSecondaryWord = restTextSecondary.substr(0, restTextSecondary.search(/\s|$/));
	restTextSecondary = restTextSecondary.substr(currentSecondaryWord.length);
	var currentSecondaryWhitespace = restTextSecondary.substr(0, restTextSecondary.search(/\S|$/));
	
	IsLog.c("stringMatcher: restTextSecondary = \""+restTextSecondary+"\"");
	
	//var currentPrimaryWord = coreObject.primary.text.substr(coreObject.primary.position, coreObject.primary.text.substr(coreObject.primary.position).search(/\s|$/,coreObject.primary.position));
	//var currentSecondaryWord = coreObject.secondary.text.substr(coreObject.secondary.position,  coreObject.secondary.text.substr(coreObject.secondary.position).search(/\s|$/,coreObject.secondary.position));
	var cpw = currentPrimaryWord;
	var cpwW = currentPrimaryWhitespace;
	var csw = (typeof coreObject.secondary.searchText == "undefined")? currentSecondaryWord : coreObject.secondary.searchText;
	var cswW = currentSecondaryWhitespace;

	//	loop while the position of either is not greater than the length of either 
	if(coreObject.primary.position > coreObject.primary.text.length) {		//	 && coreObject.secondary.position < coreObject.secondary.text.length
		//	We've exhausted the length of the text. Looks like this loop is finished. This case should be handled elsewhere and shouldn't happen.
		coreObject = testForWhitespaceError(coreObject);
		//IsLog.c("stringMatcher: Error: either the primary or the secondary index is out of range. ["+coreObject.primary.text.length+":"+coreObject.primary.position+","+coreObject.secondary.text.length+":"+coreObject.secondary.position+"]");
		return coreObject;
	} else {
		if(coreObject.currentSearchRecursionDepth > csw.length && coreObject.secondary.searchText) {
			//	Stop looking for a match if we've already moved ahead more words than there are letters in the secondary search word.
			coreObject = testForWhitespaceError(coreObject);
			if(!coreObject.discrepencyFound) {
				IsLog.c("stringMatcher: stopped looking for a match for \""+currentSecondaryWord+"\" because we've exceeded the length of the string we're looking for. depth:"+coreObject.recursionDepth+" word-depth:"+coreObject.currentSearchRecursionDepth+" csw.length:"+csw.length);
				coreObject.matches[coreObject.primary.position+"."+coreObject.secondary.position] = ({
					"timestamp": parseFloat( (new Date()).valueOf() / 1000 ),
					"primary":{"text":"","position":coreObject.primary.position,"space":""},
					"secondary":{"text":currentSecondaryWord,"position":coreObject.secondary.position,"space":cswW,"search":csw},
					"match":false,
					"code":"EW",
					"message": "Stopped looking, exceeded secondary string length: "+csw.length+" at "+coreObject.currentSearchRecursionDepth,
					"data": {"html":"<span class=\"extra-word\" title=\"You typed this word that wasn't in the text\">"+currentSecondaryWord+"</span>"}
				});
				//IsLog.c("stringMatcher: resetting primary text position from \""+coreObject.primary.position+"\" to \""+coreObject.primary.preloopPosition+"\"");
				//IsLog.c("stringMatcher: setting secondary text position from \""+coreObject.secondary.position+"\" to \""+(parseInt(coreObject.secondary.position) + csw.length + cswW.length)+"\"");
				//IsLog.c("stringMatcher: dumping unmatched buffer after match was not found for \""+csw+"\"");
				coreObject.primary.position = (coreObject.primary.preloopPosition)?coreObject.primary.preloopPosition:coreObject.primary.position;
				coreObject = movePointersForward(coreObject, 0, csw.length + cswW.length);
			}
			coreObject = resetObjectLoopParameters(coreObject);
		} else {
			//	We're not beyond our loop bounds at this point. Proceed with basic processing logic.
			IsLog.c("stringMatcher: evaluating primary word: \""+cpw+"\" at index "+coreObject.primary.position+" trailed by \""+cpwW+"\"");
			IsLog.c("stringMatcher: evaluating secondary word: \""+csw+"\" at index "+coreObject.secondary.position+" trailed by \""+cswW+"\" searchText:\""+coreObject.secondary.searchText+"\"");

			coreObject.discrepencyFound = false;		//	This boolean gives us an indicator regarding the status of our pattern matching.
			
			if(!coreObject.matches) coreObject.matches = {};
			if(coreObject.matchesOld) {
				if(typeof coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position] != "undefined") {
					if(typeof coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position].primary.text != "string")
						IsLog.c("stringMatcher: matches[\""+coreObject.primary.position+"\"].text is not a string: "+coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position].primary.text);
					if(
						cpw == coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position].primary.text &&
						cpwW == coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position].primary.space &&
						csw == coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position].secondary.text &&
						cswW == coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position].secondary.space &&
						(["MW", "EW", "MS", "Remainder"]).indexOf(coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position]['code']) == -1
					) {
						//IsLog.c("stringMatcher: matches provided this result already. Moving on. "+coreObject.currentSearchRecursionDepth+":"+coreObject.recursionDepth);
						IsLog.c("stringMatcher: \""+currentPrimaryWord+"\"=\""+currentSecondaryWord+"\" match already provided at recursion depth "+coreObject.recursionDepth+" and position "+coreObject.primary.position+":"+coreObject.secondary.position);
						coreObject = outputUnmatchedStringBuffer(coreObject, cpw, csw);
						coreObject.matches[coreObject.primary.position+"."+coreObject.secondary.position] = clone(coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position]);
						coreObject = movePointersForward(coreObject, (cpw.length + cpwW.length), (csw.length + cswW.length));
						coreObject.discrepencyFound = true;
					} else if((["Remainder"]).indexOf(coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position]['code']) > -1) {
						delete coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position];
					} else if(
						cpw == coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position].primary.text &&
						cpwW == coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position].primary.space &&
						csw == coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position].secondary.text &&
						cswW == coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position].secondary.space &&
						(["MW", "EW"]).indexOf(coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position]['code']) > -1
					) {
						//IsLog.c("stringMatcher: matches provided this result already. primary word missing. Moving on. "+coreObject.currentSearchRecursionDepth+":"+coreObject.recursionDepth);
						IsLog.c("stringMatcher: \""+currentPrimaryWord+"\"=\""+currentSecondaryWord+"\" match already provided at recursion depth "+coreObject.recursionDepth+" and position "+coreObject.primary.position+":"+coreObject.secondary.position);
						coreObject = outputUnmatchedStringBuffer(coreObject, cpw, csw);
						coreObject.matches[coreObject.primary.position+"."+coreObject.secondary.position] = clone(coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position]);
						coreObject = movePointersForward(coreObject, ((["EW"]).indexOf(coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position]['code']) > -1)?0:(cpw.length + cpwW.length), ((["MW"]).indexOf(coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position]['code']) > -1)?0:(csw.length + cswW.length));
						coreObject.discrepencyFound = true;
					} else if(
						cpw == coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position].primary.text &&
						cpwW == coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position].primary.space &&
						csw == coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position].secondary.text &&
						cswW == coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position].secondary.space &&
						(["MS"]).indexOf(coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position]['code']) > -1
					) {
						//IsLog.c("stringMatcher: matches provided this result already. missing space. Moving on. "+coreObject.currentSearchRecursionDepth+":"+coreObject.recursionDepth);
						IsLog.c("stringMatcher: \""+currentPrimaryWord+"\"=\""+currentSecondaryWord+"\" match already provided at recursion depth "+coreObject.recursionDepth+" and position "+coreObject.primary.position+":"+coreObject.secondary.position);
						coreObject = outputUnmatchedStringBuffer(coreObject, cpw, csw);
						coreObject.matches[coreObject.primary.position+"."+coreObject.secondary.position] = clone(coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position]);
						coreObject = movePointersForward(coreObject, (coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position].primary.text.length + coreObject.matchesOld[coreObject.primary.position+"."+coreObject.secondary.position].primary.space.length), (csw.length + cswW.length));
						coreObject.discrepencyFound = true;
					} else {
						IsLog.c("stringMatcher: match provided, but was not a match. matches[\""+coreObject.primary.position+"\"]");
					}
					if(coreObject.discrepencyFound) {
						coreObject = resetObjectLoopParameters(coreObject,"discrepencyFound");
					}
				}
			}
			
			if(coreObject.discrepencyFound) {
				//IsLog.c("stringMatcher: match preset found, skipping match logic.");
			} else if(coreObject.primary.position <= coreObject.primary.text.length && coreObject.secondary.position >= coreObject.secondary.text.length) {
				//	We've reached the end of the secondary, but not the end of the primary.
				coreObject = outputUnmatchedStringBuffer(coreObject, cpw, csw);
				coreObject.matches[coreObject.primary.position+"."+coreObject.secondary.position] = ({
					"timestamp": parseFloat( (new Date()).valueOf() / 1000 ),
					"primary":{"text":cpw + cpwW + restTextPrimary,"position":coreObject.primary.position,"space":""},
					"secondary":{"text":currentSecondaryWord,"position":coreObject.secondary.position,"space":cswW,"search":csw},
					"match":false,
					"code":"Remainder",
					"message":"\""+currentPrimaryWord+"\"=\""+currentSecondaryWord+"\" reached the end of the secondary string at recursion depth "+coreObject.recursionDepth+" and position "+coreObject.primary.position+":"+coreObject.secondary.position,
					"data": {"html":"<span class=\"untyped\">"+cpw + cpwW + restTextPrimary+"</span>"}
				});
				coreObject = movePointersForward(coreObject, (restTextPrimary.length + cpw.length + cpwW.length + 1), (csw.length + cswW.length));
				coreObject = resetObjectLoopParameters(coreObject);
			} else {
				var ndMatchRegExp = new RegExp("^"+csw.escapeRegExp()+"$");
				if(ndMatchRegExp.test(cpw)) {				//	checking for non discrepency (nd)
					IsLog.c("stringMatcher: found an exact match with pattern: "+ndMatchRegExp);
					IsLog.c("stringMatcher: \""+currentPrimaryWord+"\"=\""+currentSecondaryWord+"\" exact match found at recursion depth "+coreObject.recursionDepth+" and position "+coreObject.primary.position+":"+coreObject.secondary.position);
					coreObject = outputUnmatchedStringBuffer(coreObject, cpw, csw);
					coreObject.matches[coreObject.primary.position+"."+coreObject.secondary.position] = ({
						"timestamp": parseFloat( (new Date()).valueOf() / 1000 ),
						"primary":{"text":currentPrimaryWord,"position":coreObject.primary.position,"space":cpwW},
						"secondary":{"text":currentSecondaryWord,"position":coreObject.secondary.position,"space":cswW,"search":csw},
						"match":true,
						"code":"EM",
						"message":"\""+currentPrimaryWord+"\"=\""+currentSecondaryWord+"\" exact match found at recursion depth "+coreObject.recursionDepth+" and position "+coreObject.primary.position+":"+coreObject.secondary.position,
						"data": {"html":"<span class=\"correct\">"+currentPrimaryWord+"</span>"}
					});
					coreObject = movePointersForward(coreObject, (cpw.length + cpwW.length), (csw.length + cswW.length));
					coreObject = resetObjectLoopParameters(coreObject);
					coreObject.discrepencyFound = true;
				} else {
					//	This isn't an exact match. Now we try to find an in-exact match (with discrepencies)
					if(typeof coreObject.primary.preloopPosition == "undefined") {	//	If there isn't already a preloopPosition, we'll probably need one
						//IsLog.c("stringMatcher: setting primary preloop position for \""+cpw+"\" to "+coreObject.primary.position);
						coreObject.primary.preloopPosition = coreObject.primary.position;
					}
					if(typeof coreObject.secondary.preloopPosition == "undefined") {
						//IsLog.c("stringMatcher: setting secondary preloop position for \""+csw+"\" to "+coreObject.secondary.position);
						coreObject.secondary.preloopPosition = coreObject.secondary.position;
					}
					//	Populate an array of regular expressions to use
					//	We've already looked for one wildcard in each position. We are starting now assuming there needs to be two
					var minimumWildcards = 1;
					//	We also don't want to add wildcards beyond reason. At this point I've arbitrarily decided that half the word can be wrong and still be considered a valid match.
					var maximumWildcards = Math.floor(csw.length / 2);
					var matchingPatterns = [".","?","#"];
					var maxPotentialPatternVartiations = 2500;
					while(calculatePermutations(csw.length, matchingPatterns.length, maximumWildcards, maximumWildcards) > maxPotentialPatternVartiations && maximumWildcards > 0 && maximumWildcards >= minimumWildcards && matchingPatterns.length > 1) {
						if(maximumWildcards > (csw.length / 10)) {
							maximumWildcards--;
							//IsLog.c("stingMatcher: \""+csw+"\" is too long, knocking down number of wildcards to "+maximumWildcards);
						} else {
							maximumWildcards = Math.floor(csw.length / 2);
							var removedPatternOption = matchingPatterns.pop();
							//IsLog.c("stingMatcher: \""+csw+"\" is still too long, knocking down available wildcards to "+matchingPatterns.length);
						}
					}
					/*if(Math.pow(matchingPatterns.length*maximumWildcards, csw.length) > maxPotentialPatternVartiations) {
						 = [".","?","#"];	//	If there are too many variations the match will take too long.
						maximumWildcards = 4;
					}
					if(Math.pow(matchingPatterns.length*maximumWildcards, csw.length) > maxPotentialPatternVartiations) {
						matchingPatterns = [".","?","#"];	//	If the word length is longer the number of match variations grows exponentially.
						maximumWildcards = 3;
					}
					if(Math.pow(matchingPatterns.length*maximumWildcards, csw.length) > maxPotentialPatternVartiations) {
						matchingPatterns = [".","?","#"];	//	Keep checking...
						maximumWildcards = 2;
					}
					if(Math.pow(matchingPatterns.length*maximumWildcards, csw.length) > maxPotentialPatternVartiations) {
						matchingPatterns = [".","?"];	//	If we don't limit it, there are simply too many match possibilities to handle
						maximumWildcards = 4;
					}
					if(Math.pow(matchingPatterns.length*maximumWildcards, csw.length) > maxPotentialPatternVartiations) {
						matchingPatterns = ["."];	//	So we MUST knock it down, or the match speed will be unreasonably slow
						maximumWildcards = Math.floor(csw.length / 2);
					}*/
					//IsLog.c("stringMatcher: matching with maximum "+maximumWildcards+" wildcards of the following varieties: \""+matchingPatterns.join(",")+"\" (potentially producing "+calculatePermutations(csw.length, matchingPatterns.length, maximumWildcards, maximumWildcards)+" patterns)");
					if(maximumWildcards >= minimumWildcards) {
						//	we have at least 1 wildcard to check for.
						for(var p=minimumWildcards; p <= maximumWildcards;p++) {
							//	Loop through them and find the least number of wildcards that produce a match
							if(typeof coreObject.matchExpressions == "undefined")
								coreObject.matchExpressions = {};
							if(typeof coreObject.matchExpressions[csw] == "undefined")
								coreObject.matchExpressions[csw] = [];
							if(typeof coreObject.matchExpressions[csw][p-minimumWildcards] == "undefined") {
								//IsLog.c("stringMatcher: generating new expansive regular expression array to match string with "+i+" wildcards.");
								var allRegExp = generateMatchingPatternsArray(csw, maximumWildcards, minimumWildcards, matchingPatterns, true);
								for(var j=0; j < allRegExp.length; j++) {
									allRegExp[j] =  new RegExp("^"+allRegExp[j].join("$|^")+"$")
								}
								coreObject.matchExpressions[csw] = allRegExp;
								IsLog.c("stringMatcher: reading new regular expression index "+(p-minimumWildcards)+" of "+coreObject.matchExpressions[csw].length);
								var hugeRegExp = coreObject.matchExpressions[csw][p-minimumWildcards];
							} else {
								//IsLog.c("stringMatcher: reusing expansive regular expression array with "+i+" wildcards.");
								//IsLog.c("stringMatcher: reading regular expression index "+(p-minimumWildcards)+" of "+coreObject.matchExpressions[csw].length);
								var hugeRegExp = coreObject.matchExpressions[csw][p-minimumWildcards];
							}
							if(hugeRegExp.test(cpw)) {
								var searchResult = hugeRegExp.exec(cpw);
								var parseResult = parseSearchResult(searchResult, hugeRegExp.toString(), csw, p);
								IsLog.c("stringMatcher: \""+currentPrimaryWord+"\"=\""+currentSecondaryWord+"\" match found at recursion depth "+coreObject.recursionDepth+" and position "+coreObject.primary.position+" of "+coreObject.primary.text.length+","+coreObject.secondary.position+" of "+coreObject.secondary.text.length);
								coreObject = outputUnmatchedStringBuffer(coreObject, cpw, csw);
								coreObject.matches[coreObject.primary.position+"."+coreObject.secondary.position] = ({
									"timestamp": parseFloat( (new Date()).valueOf() / 1000 ),
									"primary":		{"text":currentPrimaryWord,"position":coreObject.primary.position,"space":cpwW},
									"secondary":	{"text":currentSecondaryWord,"position":coreObject.secondary.position,"space":cswW,"search":csw},
									"match":		false,
									"code":			p+"L",
									"message":		"\""+currentPrimaryWord+"\"=\""+currentSecondaryWord+"\" match found at recursion depth "+coreObject.recursionDepth+" and position "+coreObject.primary.position+" of "+coreObject.primary.text.length+","+coreObject.secondary.position+" of "+coreObject.secondary.text.length,
									"data": parseResult
								});
								coreObject = movePointersForward(coreObject, (cpw.length + cpwW.length), (csw.length + cswW.length));
								coreObject = resetObjectLoopParameters(coreObject);
								//IsLog.c("stringMatcher: current secondary.searchText = \""+coreObject.secondary.searchText+"\"");
								coreObject.discrepencyFound = true;
								break;
							} else {
								//	No match this time.
							}
						}
						//	At this point we have either found the match and the minimum number of wildcards, or we know that there is no match on this word pair
						if(!coreObject.discrepencyFound) {
							//	First, if there is no match...
							IsLog.c("stringMatcher: this string \""+csw+"\" is not a match to "+cpw);
							if((parseInt(coreObject.primary.position) + cpw.length + cpwW.length) < coreObject.primary.text.length) {
								//	The current primary word is unmatched, if we find it later, this becomes a missing word... add it to the buffer.
								coreObject = appendToUnmatchedStringBuffer(coreObject, cpw, cpwW, csw, cswW);
								//	If we still have room to search on the primary text... Move the primary position pointer forward
								coreObject = movePointersForward(coreObject, (cpw.length + cpwW.length), 0);
								//	We need to keep the secondary search word (but why, if we're not moving the pointer?)
								coreObject.secondary.searchText = currentSecondaryWord;
								//	Other than the above (which we need for reasons stated) remove the rest of the coreObject parameters.
								coreObject = resetObjectLoopParameters(coreObject, ["primary.preloopPosition","secondary.preloopPosition","currentSearchRecursionDepth","secondary.searchText","unmatchedBuffer","matchExpressions"]);
							} else {
								//	We're out of room on the primary string. This secondary word doesn't exist in it, this is an "extra word"
								coreObject = testForWhitespaceError(coreObject);
								if(!coreObject.discrepencyFound) {
									IsLog.c("stringMatcher: expansive match recursion reached the end and found no match. \""+currentSecondaryWord+"\" doesn't exist in the primary string.");
									//IsLog.c("stringMatcher: moving primary search position to preloop: from "+coreObject.secondary.position+" to"+coreObject.primary.preloopPosition);
									coreObject.primary.position = coreObject.primary.preloopPosition;
									coreObject = movePointersForward(coreObject, 0, (csw.length + cswW.length));
									if(typeof coreObject.unmatchedBuffer == "object")
										IsLog.c("stringMatcher: unmatched buffer contains: "+(objectKeys(coreObject.unmatchedBuffer).length)+" elements");
									else
										IsLog.c("stringMatcher: unmatched buffer contains: NOTHING");
									//IsLog.c("stringMatcher: current (ending) primary search position is: "+coreObject.primary.position);
									//IsLog.c("stringMatcher: preloop primary search position was: "+coreObject.primary.preloopPosition);
									//IsLog.c("stringMatcher: current (ending) secondary search position is: "+coreObject.secondary.position);
									//IsLog.c("stringMatcher: preloop secondary search position was: "+coreObject.secondary.preloopPosition);
									//IsLog.c("stringMatcher: dumping unmatched buffer after match was not found for \""+csw+"\")");
								}
								coreObject = resetObjectLoopParameters(coreObject);
							}
						} else {
							//	A match was found!
							//	We already performed our "match found" actions in the above for loop, so there isn't anything left to do here.
						}
					} else if((parseInt(coreObject.primary.position) + cpw.length + cpwW.length) < coreObject.primary.text.length) {
						//	we have no room for wildcards, move on to the next primary word to look for a match to this secondary word
						//IsLog.c("stringMatcher: finished recursing at primary string index: "+coreObject.primary.position);
						//IsLog.c("stringMatcher: adding \""+cpw+"\" ("+cpw.length+") and \""+cpwW+"\" ("+cpwW.length+") to "+coreObject.primary.position);
						coreObject = appendToUnmatchedStringBuffer(coreObject, cpw, cpwW, csw, cswW);
						coreObject = movePointersForward(coreObject, (cpw.length + cpwW.length), 0);
						coreObject = resetObjectLoopParameters(coreObject, ["secondary.searchText","currentSearchRecursionDepth"]);
						coreObject.secondary.searchText = currentSecondaryWord;
						//IsLog.c("stringMatcher: recursing at new primary string index: "+coreObject.primary.position+" (string length is "+coreObject.primary.text.length+")");
					} else {
						//	we have no room for wildcards and we've reached the end of the primary string, this secondary word doesn't exist in the primary string
						coreObject = testForWhitespaceError(coreObject);
						if(!coreObject.discrepencyFound) {
							IsLog.c("stringMatcher: simple match recursion reached the end and found no match. \""+currentSecondaryWord+"\" doesn't exist in the primary string.");
							coreObject.matches[coreObject.primary.position+"."+coreObject.secondary.position] = ({
								"timestamp": parseFloat( (new Date()).valueOf() / 1000 ),
								"primary":{"text":"","position":coreObject.primary.position,"space":""},
								"secondary":{"text":currentSecondaryWord,"position":coreObject.secondary.position,"space":cswW,"search":csw},
								"match":false,
								"code":"EW",
								"message":"simple match recursion reached the end and found no match. \""+currentSecondaryWord+"\" doesn't exist in the primary string.",
								"data": {"html":"<span class=\"extra-word\" title=\"You typed this word that wasn't in the text\">"+currentSecondaryWord+"</span>"}
							});
							IsLog.c("stringMatcher: moving secondary search position: "+coreObject.secondary.position+"+"+(csw.length + cswW.length)+"="+((parseInt(coreObject.secondary.position) + csw.length + cswW.length)));
							coreObject = movePointersForward(coreObject, 0, (csw.length + cswW.length));
							//IsLog.c("stringMatcher: unmatched buffer contains: "+(coreObject.unmatchedBuffer.join(",")));
							//IsLog.c("stringMatcher: current (ending) primary search position is: "+coreObject.primary.position);
							//IsLog.c("stringMatcher: preloop primary search position was: "+coreObject.primary.preloopPosition);
							//IsLog.c("stringMatcher: current (ending) secondary search position is: "+coreObject.secondary.position);
							//IsLog.c("stringMatcher: preloop secondary search position was: "+coreObject.secondary.preloopPosition);
							//IsLog.c("stringMatcher: dumping unmatched buffer after match was not found for \""+csw+"\")");
							delete coreObject.unmatchedBuffer;
							coreObject.primary.position = coreObject.primary.preloopPosition;
						}
						coreObject = resetObjectLoopParameters(coreObject);
					}	//	End of if(maximumWildcards >= minimumWildcards) else 
				}	//	End of exact match if(ndMatchRegExp.test(cpw)) else
			}	//	End of match preset detection
		}	//	End of if(coreObject.currentSearchRecursionDepth > csw.length && coreObject.secondary.searchText) else
	}	//	End of if(!(coreObject.primary.position < coreObject.primary.text.length && coreObject.secondary.position < coreObject.secondary.text.length)) else
	coreObject = complexStringMatchRecursionSearch(coreObject);			//	continue recursion loop
	return coreObject;
}

function testForWhitespaceError(coreObject) {
	if(coreObject.primary.preloopPosition != undefined && coreObject.secondary.preloopPosition != undefined) {
		var position = {"primary":coreObject.primary.preloopPosition,"secondary":coreObject.secondary.preloopPosition};
		coreObject.primary.position = coreObject.primary.preloopPosition;
		coreObject.secondary.position = coreObject.secondary.preloopPosition;
	} else {
		var position = {"primary":coreObject.primary.position,"secondary":coreObject.secondary.position};
	}
	//IsLog.c(position);
	var restText = coreObject.primary.text.substr(position.primary);
	var currentPrimaryWord = restText.substr(0, restText.search(/\s|$/));
	restText = restText.substr(restText.search(/\s|$/));
	var currentPrimaryWhitespace = restText.substr(0, restText.search(/\S|$/));
	
	var cpw = currentPrimaryWord;
	var cpwW = currentPrimaryWhitespace;
	
	restText = restText.substr(restText.search(/\S|$/));
	
	var currentPrimaryWord2 = restText.substr(0, restText.search(/\s|$/));
	restText = restText.substr(restText.search(/\s|$/));
	var currentPrimaryWhitespace2 = restText.substr(0, restText.search(/\S|$/));

	var restText = coreObject.secondary.text.substr(position.secondary);
	var currentSecondaryWord = restText.substr(0, restText.search(/\s|$/));
	restText = restText.substr(restText.search(/\s|$/));
	var currentSecondaryWhitespace = restText.substr(0, restText.search(/\S|$/));
	
	//var currentPrimaryWhitespace = coreObject.primary.text.substr(position.primary.substr(coreObjectPrimary.text.), coreObject.primary.text.substr(position.primary).search(/\s|$/));
	//var currentPrimaryWhitespace = coreObject.primary.text.substr(coreObject.primary.text.indexOf(/\s|$/, position.primary), 5);
	//IsLog.c("stringMatcher: currentPrimaryWord: \""+currentPrimaryWord+"\" whitespace: \""+currentPrimaryWhitespace+"\"");
	//IsLog.c("stringMatcher: currentPrimaryWord2: \""+currentPrimaryWord2+"\" whitespace2: \""+currentPrimaryWhitespace2+"\"");

	var csw = (typeof coreObject.secondary.searchText == "undefined")? currentSecondaryWord : coreObject.secondary.searchText;
	//IsLog.c("stringMatcher: testing match between \""+currentPrimaryWord+currentPrimaryWord2+"\" and \""+csw+"\"");
	if(currentPrimaryWord+currentPrimaryWord2 == csw && currentPrimaryWord != "" && csw != "") {
		IsLog.c("stringMatcher: missing space discrepency match!");
		coreObject.matches[coreObject.primary.position+"."+coreObject.secondary.position] = ({
			"timestamp": parseFloat( (new Date()).valueOf() / 1000 ),
			"primary":		{"text":currentPrimaryWord+cpwW+currentPrimaryWord2,"position":coreObject.primary.position,"space":currentPrimaryWhitespace2},
			"secondary":	{"text":currentSecondaryWord,"position":coreObject.secondary.position,"space":currentSecondaryWhitespace,"search":csw},
			"match":		false,
			"code":			"MS",
			"message":		"Missing space between \""+currentPrimaryWord+"\" and \""+currentPrimaryWord2+"\" match found at recursion depth "+coreObject.recursionDepth+" and position "+coreObject.primary.position+" of "+coreObject.primary.text.length+","+coreObject.secondary.position+" of "+coreObject.secondary.text.length,
			"data": {"html":""+currentPrimaryWord+"<span class=\"missing-space\" title=\"You forgot to put space between these words\">"+currentPrimaryWhitespace+"</span>"+currentPrimaryWord2}
		});
		//IsLog.c("stringMatcher: current primary position:"+coreObject.primary.position);
		//IsLog.c("stringMatcher: current secondary position:"+coreObject.secondary.position);
		coreObject = movePointersForward(coreObject, (currentPrimaryWord.length + cpwW.length) + (currentPrimaryWord2.length + currentPrimaryWhitespace2.length), (currentSecondaryWord.length + currentSecondaryWhitespace.length));
		//IsLog.c("stringMatcher: current secondary.searchText = \""+coreObject.secondary.searchText+"\"");
		coreObject.discrepencyFound = true;
	}
	
	return coreObject;
}

var complexStringMatcherStorage = [];
function complexStringMatcher(matchMain, matchFrom) {
	var primaryStrings = [];
	for(var i=0; i < complexStringMatcherStorage.length; i++) {
		IsLog.c("stringMatcher: reading from complexStringMatcherStorage array (length "+complexStringMatcherStorage.length+")");
		IsLog.c(complexStringMatcherStorage[i]);
		primaryStrings.push(complexStringMatcherStorage[i].primary.text);
	}
	if(primaryStrings.indexOf(matchMain) == -1)
		var returnObject = complexStringMatchRecursionSearch(matchMain, matchFrom);
	else {
		var retrievedObject = complexStringMatcherStorage[primaryStrings.indexOf(matchMain)];
		retrievedObject['matchesOld'] = clone(retrievedObject['matches']);
		delete retrievedObject['matches'];
		retrievedObject['secondary'].text = matchFrom;
		//retrievedObject['matches'] = {};
		var returnObject = complexStringMatchRecursionSearch(retrievedObject);
	}
	IsLog.c(returnObject);
	returnObject.primary.position = 0;
	returnObject.secondary.position = 0;
	returnObject.secondary.text = matchFrom;
	delete returnObject.matchesOld;
	delete returnObject.currentSearchRecursionDepth;
	delete returnObject.recursionDepth;
	
	/*var returnObjectCopy = clone(returnObject);
	var objectKeyArray = objectKeys(returnObjectCopy.matches);
	for(var i=0; i < objectKeyArray.length; i++) {
		objectKeyArray[i] = parseFloat(objectKeyArray[i]);
	}
	objectKeyArray.sort();
	var doneKeys = [];
	var objectKeysString = (","+objectKeyArray.join(",")+",");
	for(var i=0; i < objectKeyArray.length; i++) {
		var currentIndex = objectKeyArray[i].toString();
		var primaryPosition = currentIndex.substr(currentIndex.indexOf("."));
		if(objectKeysString.indexOf(currentIndex.substr(currentIndex.indexOf("."))) > -1 && doneKeys.indexOf(primaryPosition) == -1) {
			var matchingPrimaryPositionKeys = objectKeysString.substr(objectKeysString.indexOf(","+currentIndex+",")+1);
			var endingMatch = matchingPrimaryPositionKeys.match(new RegExp(primaryPosition+"\.\d+,("+primaryPosition+"){0}"));
			IsLog.c("stringMatcher: key \""+currentIndex+"\" has matchingPrimaryPositionKeys = \""+matchingPrimaryPositionKeys+"\"");
			if(endingMatch)
				IsLog.c("stringMatcher: endingMatch \""+endingMatch.join());
			doneKeys[doneKeys.length] = primaryPosition;
		}
	}*/
	
	var saveObject = clone(returnObject);
	var lastPosition = objectKeys(saveObject.matches).pop();
	IsLog.c("stringMatcher: last position \""+lastPosition+"\"");
	for(var matchPosition in saveObject.matches) {
		if(saveObject.matches[matchPosition].code == "Remainder" && matchPosition != lastPosition) {
			delete saveObject.matches[matchPosition];
		}
	}
	if(primaryStrings.indexOf(returnObject.primary.text) == -1) {
		complexStringMatcherStorage.push(saveObject);
	} else {
		complexStringMatcherStorage[primaryStrings.indexOf(returnObject.primary.text)] = saveObject;
	}
	//delete returnObject.primary;
	//delete returnObject.secondary;
	delete returnObject.maxRecusionDepth;
	delete returnObject.discrepencyFound;
	
	return returnObject;
}

function appendToUnmatchedStringBuffer(coreObject, cpw, cpwW, csw, cswW) {
	if(typeof coreObject.unmatchedBuffer == "undefined")
		coreObject.unmatchedBuffer = {};
	coreObject.unmatchedBuffer[coreObject.primary.position] = ({
		"primary":		{"text":cpw,"space":cpwW,"position":coreObject.primary.position},
		"secondary":	{"text":csw,"space":cswW,"position":coreObject.secondary.position}
	});
	IsLog.c("stringMatcher: adding \""+cpw+"\" to unmatchedBuffer["+coreObject.primary.position+"] (to be appended if the match is found later) current buffer length:\""+objectKeys(coreObject.unmatchedBuffer).length+"\"");
								
	return coreObject;
}
function outputUnmatchedStringBuffer(coreObject, cpw, csw) {
	if(coreObject.unmatchedBuffer) {
		for(var umbKey in coreObject.unmatchedBuffer) {
			coreObject.matches[coreObject.unmatchedBuffer[umbKey].primary.position+"."+coreObject.unmatchedBuffer[umbKey].secondary.position] = ({
				"timestamp": parseFloat( (new Date()).valueOf() / 1000 ),
				"primary":{"text":coreObject.unmatchedBuffer[umbKey].primary.text,"position":coreObject.unmatchedBuffer[umbKey].primary.position,"space":coreObject.unmatchedBuffer[umbKey].primary.space},
				"secondary":{"text":coreObject.unmatchedBuffer[umbKey].secondary.text,"position":coreObject.unmatchedBuffer[umbKey].secondary.position,"space":coreObject.unmatchedBuffer[umbKey].secondary.space},
				"match":false,
				"code":"MW",
				"message":"Failed to match this word, but \""+cpw+"\"=\""+csw+"\" extended match found at recursion depth "+coreObject.recursionDepth+" and position "+coreObject.primary.position+" of "+coreObject.primary.text.length+","+coreObject.secondary.position+" of "+coreObject.secondary.text.length,
				"data": {"html":"<span class=\"missing-word\" title=\"you skipped this word\">"+coreObject.unmatchedBuffer[umbKey].primary.text+"</span>"}
			});
			IsLog.c("stringMatcher: dumping unmatched buffer after outputting the contents \""+coreObject.unmatchedBuffer[umbKey].primary.text+"\" to coreObject.matches[\""+coreObject.unmatchedBuffer[umbKey].primary.position+"."+coreObject.unmatchedBuffer[umbKey].secondary.position+"\"] "+objectKeys(coreObject.unmatchedBuffer).length+" buffer elements added (match was found for \""+csw+"\")");
		}
		delete coreObject.unmatchedBuffer;
	} else {
		//IsLog.c("stringMatcher: no buffer to dump.");
	}
	return coreObject;
}

function movePointersForward(coreObject, primaryAdvance, secondaryAdvance) {
	//delete coreObject.matchExpressions;
	//	Move the primary position pointer forward
	//IsLog.c("stringMatcher: moving primary pointer from "+coreObject.primary.position+" to "+(coreObject.primary.position+parseInt(primaryAdvance))+" ("+primaryAdvance+")");
	coreObject.primary.position = parseInt(coreObject.primary.position) + primaryAdvance;
	//	Move the secondary position pointer forward
	//IsLog.c("stringMatcher: moving secondary pointer from "+coreObject.secondary.position+" to "+(coreObject.secondary.position+parseInt(secondaryAdvance))+" ("+secondaryAdvance+")");
	coreObject.secondary.position = parseInt(coreObject.secondary.position) + secondaryAdvance;
	//	Since we're moving the pointer ahead, we can assume we're looking forward to the next loop
	coreObject.currentSearchRecursionDepth = coreObject.currentSearchRecursionDepth+1;
	return coreObject;
}

function resetObjectLoopParameters(coreObject, keepParameters) {
	if(typeof keepParameters == "undefined")
		keepParameters = [];
	returnObject = coreObject;
	//delete returnObject.primary;
	//delete returnObject.secondary;
	//delete returnObject.maxRecusionDepth;
	//delete returnObject.recursionDepth;
	if(keepParameters.indexOf("discrepencyFound") == -1)
		delete returnObject.discrepencyFound;
	if(keepParameters.indexOf("currentSearchRecursionDepth") == -1)
		returnObject.currentSearchRecursionDepth = 0;
	if(keepParameters.indexOf("secondary.searchText") == -1)
		delete returnObject.secondary.searchText;
	if(keepParameters.indexOf("primary.preloopPosition") == -1)
		delete returnObject.primary.preloopPosition;
	if(keepParameters.indexOf("secondary.preloopPosition") == -1)
		delete returnObject.secondary.preloopPosition;
	if(keepParameters.indexOf("unmatchedBuffer") == -1)
		delete returnObject.unmatchedBuffer;
	return returnObject;
}

function generateMatchingPatternsArray(csw, maxOnes, minOnes, wildCards, individualGroups) {
	if(typeof individualGroups != "boolean")
		individualGroups = false;
	if(typeof wildCards == "undefined")
		wildCards = [".","?","#"];	//	. is standard RegExp, ? becomes the primary letter once or none (with ?), # becomes an added wildcard (to check for missing letters in secondary)
	var numberBase = wildCards.length+1;
	var returnArray = [];			//	Initialize the array we're building
	//IsLog.c("stringMatcher: typeof matchExpressions "+typeof returnArray);
	//	Now we make a numString to mask our positions for the wildcards
	var numString = "";								//	Start string
	for(var i=0; i < csw.length-minOnes; i++) {	//	add "0" until we get to within minimum of the end
		numString += "0";
	}
	for(var i=0; i < minOnes; i++) {
		numString += "1";							//	Since we want at least minimum wildcards, add those
	}
	//IsLog.c("stringMatcher: producing match patterns for \""+csw+"\" having no more than "+maxOnes+" and no less than "+minOnes+" of the following wildCards: \""+wildCards.join("\",\"")+"\"");
	var maximumCount = parseInt(numString.replace(new RegExp('[^'+(numberBase-1).toString()+']',"g"),numberBase-1), numberBase);		//	(wildCards.length)
	var possibleCombinations = Math.pow(numberBase, csw.length) - (1+minOnes);
	var calculatedAllCombinations = parseInt(calculatePermutations(csw.length, wildCards.length, maxOnes, minOnes));
	//IsLog.c("stringMatcher: there should be "+calculatedAllCombinations+" matches total");
	var calculatedCombinations = [];
	for(var i=minOnes; i <= maxOnes; i++) {
		calculatedCombinations[i] = calculatePermutations(csw.length, wildCards.length, i, i);
	}
	//IsLog.c("stringMatcher: There will be "+possibleCombinations+" possible wildcard combinations, but only "+maxOnes+" wildcards are allowed per pattern, so there should be "+calculatedCombinations.join(",")+". looping "+maximumCount+" times");
	for(var i=0; i < maximumCount; i++) {
		//	When the iterateBaseNumberString returns false, we've reached the end of the number
		if(!numString) {
			//IsLog.c("stringMatcher: Loop ended at "+i+" of "+maximumCount);
			//	When the iterateBaseNumberString returns anything other than a String or false, there was a problem (it's probably -1)
			break;
		} else if(numString.length > csw.length) {
			//IsLog.c("stringMatcher: Error: numString is longer than current secondary word ("+numString+" "+csw+")");
			break;
		}
		//	Begin building the match expression based on the binary number mask
		var matchExpression = (!individualGroups)?"(":"";
		var cswLength = csw.length;
		for(var bsi=0; bsi < cswLength; bsi++) {
			if(numString.substr(bsi,1) == "0")		//	If the digit in this position is a "0", then add the original leter
				matchExpression += csw.substr(bsi,1).escapeRegExp();		//	(((["[","-","[","]","/","{","}","(",")","*","+","?",".","\\","^","$","|"]).indexOf(csw.substr(bsi,1)) > -1)?"\\":"")+csw.substr(bsi,1);
			else if(wildCards.length > (parseInt(numString.substr(bsi,1))-1)) {
				matchExpression += (individualGroups)?"(":"";
				if(wildCards[(parseInt(numString.substr(bsi,1))-1)] == "?") {
					matchExpression += csw.substr(bsi,1).escapeRegExp()+"?";				//	(((["[","-","[","]","/","{","}","(",")","*","+","?",".","\\","^","$","|"]).indexOf(csw.substr(bsi,1)) > -1)?"\\":"")+
					matchExpression += (individualGroups)?")":"";
				} else if(wildCards[(parseInt(numString.substr(bsi,1))-1)] == "#") {
					matchExpression += "."+csw.substr(bsi,1).escapeRegExp()+((individualGroups)?")":"");	//	(((["[","-","[","]","/","{","}","(",")","*","+","?",".","\\","^","$","|"]).indexOf(csw.substr(bsi,1)) > -1)?"\\":"")+
				} else {
					matchExpression += wildCards[(parseInt(numString.substr(bsi,1))-1)];					//	If it is a "1" then add wildcard as defined
					matchExpression += (individualGroups)?")":"";
				}
			}
		}
		matchExpression += (!individualGroups)?")":"";
		//	If this expresion isn't already in the array (which it shouldn't be), then add it
		//IsLog.c("stringMatcher: generated pattern:\""+matchExpression+"\" from mask \""+numString+"\"");
		//IsLog.c("stringMatcher: \""+matchExpression+"\" belongs in position "+(matchExpression.match(/[\?\.]/g).length-1)+" of the array.");
		returnArrayIndex = matchExpression.match(/[^\\][\?\.]/g).length-1;
		if(returnArray[returnArrayIndex] == undefined)
			returnArray[returnArrayIndex] = [];
		//	We shouldn't have duplications, so I've removed the check for that to save process time
		returnArray[returnArrayIndex].push(matchExpression);
		/*if(returnArray[returnArrayIndex].indexOf(matchExpression) == -1) {
			returnArray[returnArrayIndex].push(matchExpression);
		}*/
		var sumall = 0;
		for(var sa=0; sa < returnArray.length; sa++) {
			sumall = sumall + parseInt(returnArray[sa].length);
		}
		if(calculatedAllCombinations <= sumall) {
			//	Detect if we've found them all
			//IsLog.c("stringMatcher: found all of them! "+calculatedAllCombinations+" <= "+sumall+" "+calculatedCombinations.join("+")+" "+(calculatedAllCombinations <= sumall));
			break;
		}
		//	Get the next value and continue the loop
		numString = iterateBaseNumberString(numString, maxOnes, minOnes, numberBase);
		//IsLog.c("stringMatcher: new mask \""+numString+"\"");
		//break;
	}
	if(returnArray[0] == undefined)
		returnArray[0] = [];
	for(var i=returnArray.length-1; i >= 0; i--) {
		if(i > 0)
			for(var j=0; j < returnArray[i-1].length; j++) {
				returnArray[i].push(returnArray[i-1][j]+"(.)");
			}
		else
			returnArray[0].push(csw.escapeRegExp()+"(.)");
	}
	//IsLog.c(returnArray);
	//IsLog.c("stringMatcher: returning new array of patterns length:"+returnArray.length);	
	return returnArray;
}

function iterateBaseNumberString(string /*(string or integer) maxOnes (integer), minOnes (integer), numberBase (integer) */) {
	var length = string.length;				//	We need to ensure that the string we return is this length.
	var maxOnes = parseInt((typeof arguments[1] == "undefined")?string.length:arguments[1]);	//	We should only ever return a number with this many or less "1" in it.
	var minOnes = parseInt((typeof arguments[2] == "undefined")?1:arguments[2]);	//	We should only ever return a number with this many or less "1" in it.
	var numberBase = parseInt((typeof arguments[3] == "undefined")?2:arguments[3]);	//	If this isn't set, assume binary number set
	var numValue = (typeof(string) != "string")?0:parseInt(string, numberBase);	//	Start with this number (passed in as binary, but returned here in decimal)
	var hardMax = Math.pow(numberBase, length)-1;	//	We should never exceed this number (the resulting string would be too long)
	if(numValue > hardMax) {				//	If you pass in a number that is already out of range (which should be impossible) we should return -1
		IsLog.c("stringMatcher: ERROR: somehow we ended up with too large a number.");
		return -1;
	}
	numValue++;							//	Go up one (please note that this is not stored as a binary value at this point.)
	//	if there are more or less not "0"s than we should have, loop until we get to one that has the right number of "1"s
	var oneMatch = parseInt((numValue.toString(numberBase)).match(/[^0]/g).length);
	//IsLog.c("stringMatcher: the mask ("+(numValue.toString(numberBase))+") has "+oneMatch+" \"not zeroes\" compared "+maxOnes+" to allowed zeroes and "+minOnes+" required.");
	if(oneMatch > maxOnes || oneMatch < minOnes) {
		var maxLoops = hardMax-parseInt(numValue.toString(10));	//	don't loop long enough to exceed the max (this is a sort of double-check on that)
		var loopCounter = 0;
		//IsLog.c("stringMatcher: looping a maximum of "+maxLoops+" times to properly iterate our counter");
		while((numValue.toString(numberBase).match(/[^0]/g).length > maxOnes || numValue.toString(numberBase).match(/[^0]/g).length < minOnes) && loopCounter < maxLoops && numValue < hardMax) {
			//IsLog.c("stringMatcher: " + (numValue.toString(numberBase)) + " contains " + numValue.toString(numberBase).match(/[^0]/g).length + " \"not zeroes\" -- "+(numValue.toString(numberBase).match(/[^0]/g).length > maxOnes)+" || "+(numValue.toString(numberBase).match(/[^0]/g).length < minOnes));
			numValue = numValue+(numberBase-1);		//	numberBase-1
			loopCounter++;
		}
		//IsLog.c("stringMatcher: looped "+loopCounter+" times to produce a new value: \""+(numValue.toString(numberBase))+"\"");
		if(loopCounter >= maxLoops)			//	If the loop is too long we'll end up out of range. In that case we return false.
			return false;
	}
	numValue = numValue.toString(numberBase);	//	Convert our new number into a boolean string
	//IsLog.c("stringMatcher: iterating produced mask; \""+numValue+"\" which will now be lengthened by adding "+(length - numValue.length)+"x\"0\" to the beginning");
	loopCounter = 0;
	//	Verify that the resulting string is the right length.
	while(loopCounter < length && numValue.length < length) {
		numValue = "0"+numValue;
		loopCounter++;
	}
	return numValue;
}

function parseSearchResult(result, regularExpression, csw, wildCards) {
	var regExps = regularExpression.replace(/[\$\^\/]/g,"").split("|");
	var outString = "";		//	result["input"];
	var resultKeys = objectKeys(result);
	var regExpIndex = -1;
	for(var i=0; i < resultKeys.length; i++) {
		if(i != 0 && !isNaN(resultKeys[i]) && regExpIndex == -1 && result[resultKeys[i]] != undefined) {
			regExpIndex = parseInt(resultKeys[i])-1;
			IsLog.c("stringMatcher: matched primary word piece: \""+result[resultKeys[i]]+"\"");
		}
	}
	//IsLog.c("stringMatcher: regExp.exec() resultKeys:");
	//IsLog.c(regExps);
	//IsLog.c("stringMatcher: index/wildCards "+regExpIndex+"/"+wildCards+" = "+(regExpIndex/wildCards));
	regExpIndex = Math.round(regExpIndex/wildCards);
	regExp = regExps[regExpIndex];
	//IsLog.c("stringMatcher: regExp regExps["+regExpIndex+"] \""+regExp+"\"");
	//IsLog.c((new RegExp(regExp)).exec(result["input"]));
	var outObject = {"letters": [], "reg-exp":regExp};
	var inputStringIndex = 0;
	var secondaryStringIndex = 0;
	if(typeof regExp == "undefined") {
		IsLog.c("stringMatcher: Error: Attempted to read an invalid index in array of regular expressions.");
		return {"error":"Error: Attempted to read an invalid index in array of regular expressions."};
	}
	for(var i=0; i < regExp.length; i++) {
		if(regExp[i] == "(") {
			if(regExp[i+1] == "." && ((regExp.length > i+4 && regExp[i+3] == ")") || csw[secondaryStringIndex] == undefined)) {
				outString += "<span class=\"missing-letter\" title=\"You missed this letter\">"+result["input"][inputStringIndex]+"</span>";
				i = i+2;
				secondaryStringIndex++;
			} else if(regExp[i+2] == "?") {
				outString += "<span class=\"extra-letter\" title=\"You typed '"+regExp[i+1]+"'\">_</span>";
				//i = i+0;
				inputStringIndex--;
				secondaryStringIndex = secondaryStringIndex;
			} else {
				outString += "<span class=\"mistyped-letter\" title=\"You typed '"+csw[secondaryStringIndex]+"'\">"+((result["input"][inputStringIndex])?result["input"][inputStringIndex]:"_")+"</span>";
				i++;
				secondaryStringIndex++;
			}
			outObject.letters[outObject.letters.length] = {"primary":result["input"][inputStringIndex],"secondary":(regExp[i+2] == "?")?regExp[i+1]:""};
		} else if(result["input"][inputStringIndex]) {
			outObject.letters[outObject.letters.length] = {"primary":result["input"][inputStringIndex],"secondary":result["input"][inputStringIndex]};
			outString += result["input"][inputStringIndex];
			secondaryStringIndex++;
		}
		inputStringIndex++;
	}
	outObject.html = outString;
	//IsLog.c("stringMatcher: parseResult;");
	//IsLog.c(outObject);
	return outObject;
}

function calculatePermutations(positionCount, optionCount, maxChoiceCount, minChoiceCount) {
	if(typeof minChoiceCount == "undefined") minChoiceCount = 1;
	var summation = Math.summate({
		"from":minChoiceCount,"to": maxChoiceCount,
		"variables":[{"symbol":"i"},{"symbol":"n","value":positionCount},{"symbol":"a","value":optionCount}],
		"equation":"( (Math.pow(a, i)) * ( Math.factorial(n)  ) / ( Math.factorial( i ) * Math.factorial( n - i ) ) )"
	});
	//IsLog.c("summation = "+summation);
	return summation;
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

if(typeof Math.summate == "undefined") {
	var summate = function(number) {
		var summation = 0;
		if(!isNaN(number)) {
			number = parseInt(number);
			while(number > 0) {
				summation = summation + number;
				number--;
			}
		} else if(typeof number == "object") {
			var equation = number.equation;
			var variables = number.variables;
			var from = parseFloat(number.from);
			var to = parseFloat(number.to);
			var counter = from;
			var maxLoops = to - from;		//100;
			var loopCount = 0;
			//IsLog.c("looping from "+from+" to "+to+", maxLoops = \""+maxLoops+"\"" + (maxLoops >= loopCount && from <= to));
			var variableBoundaryCharacters = ["\\s", "\\(", "\\)", "\\.", "\\*", "\\+", "\\/", "\\%", "^", "$"];
			while (maxLoops >= loopCount && from <= to) {
				//IsLog.c("while loop "+loopCount+".");
				var newEquation = equation;
				for(var i=0; i < variables.length; i++) {
					if(typeof variables[i].symbol == "string") {
						var regExp = new RegExp('(['+variableBoundaryCharacters.join()+'])'+(variables[i].symbol+"").replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")+'(['+variableBoundaryCharacters.join()+'])', 'g');
						//IsLog.c("attempting to replace \""+variables[i].symbol+"\" with \""+((typeof variables[i].value == "undefined")?from:variables[i].value)+"\"");
						newEquation = newEquation.replace(regExp, '$1'+((typeof variables[i].value == "undefined")?from:variables[i].value)+'$2');
					} else {
						IsLog.c(variables[i].symbol + " is not a string.");
					}
				}
				//IsLog.c("Step equation: \""+newEquation+"\"");
				try {
					var stepResult = eval(newEquation);
					summation = summation + stepResult;
					//IsLog.c("sumation step result: "+stepResult+" summation running total: "+summation);
				} catch(exception) {
					IsLog.c("Error performing summation! "+exception.message);
				}
				from = (typeof number.step != "undefined")?from+number.step:from+1;
				loopCount++;
			}
		}
		return summation;
	};
	Math.summate = summate;
}

if(typeof Math.factorial == "undefined") {
	var factorial = function(number) {
		number = parseInt(number);
		var first100Factorials = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600, 6227020800, 87178291200, 1307674368000, 20922789888000, 355687428096000, 6402373705728000, 121645100408832000, 2432902008176640000, 51090942171709440000, 1124000727777607680000, 25852016738884976640000, 620448401733239439360000, 15511210043330985984000000, 403291461126605635584000000, 10888869450418352160768000000, 304888344611713860501504000000, 8841761993739701954543616000000, 265252859812191058636308480000000, 8222838654177922817725562880000000, 263130836933693530167218012160000000, 8683317618811886495518194401280000000, 295232799039604140847618609643520000000, 10333147966386144929666651337523200000000, 371993326789901217467999448150835200000000, 13763753091226345046315979581580902400000000, 523022617466601111760007224100074291200000000, 20397882081197443358640281739902897356800000000, 815915283247897734345611269596115894272000000000, 33452526613163807108170062053440751665152000000000, 1405006117752879898543142606244511569936384000000000, 60415263063373835637355132068513997507264512000000000, 2658271574788448768043625811014615890319638528000000000, 119622220865480194561963161495657715064383733760000000000, 5502622159812088949850305428800254892961651752960000000000, 258623241511168180642964355153611979969197632389120000000000, 12413915592536072670862289047373375038521486354677760000000000, 608281864034267560872252163321295376887552831379210240000000000, 30414093201713378043612608166064768844377641568960512000000000000, 1551118753287382280224243016469303211063259720016986112000000000000, 80658175170943878571660636856403766975289505440883277824000000000000, 4274883284060025564298013753389399649690343788366813724672000000000000, 230843697339241380472092742683027581083278564571807941132288000000000000, 12696403353658275925965100847566516959580321051449436762275840000000000000, 710998587804863451854045647463724949736497978881168458687447040000000000000, 40526919504877216755680601905432322134980384796226602145184481280000000000000, 2350561331282878571829474910515074683828862318181142924420699914240000000000000, 138683118545689835737939019720389406345902876772687432540821294940160000000000000, 8320987112741390144276341183223364380754172606361245952449277696409600000000000000, 507580213877224798800856812176625227226004528988036003099405939480985600000000000000, 31469973260387937525653122354950764088012280797258232192163168247821107200000000000000, 1982608315404440064116146708361898137544773690227268628106279599612729753600000000000000, 126886932185884164103433389335161480802865516174545192198801894375214704230400000000000000, 8247650592082470666723170306785496252186258551345437492922123134388955774976000000000000000, 544344939077443064003729240247842752644293064388798874532860126869671081148416000000000000000, 36471110918188685288249859096605464427167635314049524593701628500267962436943872000000000000000, 2480035542436830599600990418569171581047399201355367672371710738018221445712183296000000000000000, 171122452428141311372468338881272839092270544893520369393648040923257279754140647424000000000000000, 11978571669969891796072783721689098736458938142546425857555362864628009582789845319680000000000000000, 850478588567862317521167644239926010288584608120796235886430763388588680378079017697280000000000000000, 61234458376886086861524070385274672740778091784697328983823014963978384987221689274204160000000000000000, 4470115461512684340891257138125051110076800700282905015819080092370422104067183317016903680000000000000000, 330788544151938641225953028221253782145683251820934971170611926835411235700971565459250872320000000000000000, 24809140811395398091946477116594033660926243886570122837795894512655842677572867409443815424000000000000000000, 1885494701666050254987932260861146558230394535379329335672487982961844043495537923117729972224000000000000000000, 145183092028285869634070784086308284983740379224208358846781574688061991349156420080065207861248000000000000000000, 11324281178206297831457521158732046228731749579488251990048962825668835325234200766245086213177344000000000000000000, 894618213078297528685144171539831652069808216779571907213868063227837990693501860533361810841010176000000000000000000, 71569457046263802294811533723186532165584657342365752577109445058227039255480148842668944867280814080000000000000000000, 5797126020747367985879734231578109105412357244731625958745865049716390179693892056256184534249745940480000000000000000000, 475364333701284174842138206989404946643813294067993328617160934076743994734899148613007131808479167119360000000000000000000, 39455239697206586511897471180120610571436503407643446275224357528369751562996629334879591940103770870906880000000000000000000, 3314240134565353266999387579130131288000666286242049487118846032383059131291716864129885722968716753156177920000000000000000000, 281710411438055027694947944226061159480056634330574206405101912752560026159795933451040286452340924018275123200000000000000000000, 24227095383672732381765523203441259715284870552429381750838764496720162249742450276789464634901319465571660595200000000000000000000, 2107757298379527717213600518699389595229783738061356212322972511214654115727593174080683423236414793504734471782400000000000000000000, 185482642257398439114796845645546284380220968949399346684421580986889562184028199319100141244804501828416633516851200000000000000000000, 16507955160908461081216919262453619309839666236496541854913520707833171034378509739399912570787600662729080382999756800000000000000000000, 1485715964481761497309522733620825737885569961284688766942216863704985393094065876545992131370884059645617234469978112000000000000000000000, 135200152767840296255166568759495142147586866476906677791741734597153670771559994765685283954750449427751168336768008192000000000000000000000, 12438414054641307255475324325873553077577991715875414356840239582938137710983519518443046123837041347353107486982656753664000000000000000000000, 1156772507081641574759205162306240436214753229576413535186142281213246807121467315215203289516844845303838996289387078090752000000000000000000000, 108736615665674308027365285256786601004186803580182872307497374434045199869417927630229109214583415458560865651202385340530688000000000000000000000, 10329978488239059262599702099394727095397746340117372869212250571234293987594703124871765375385424468563282236864226607350415360000000000000000000000, 991677934870949689209571401541893801158183648651267795444376054838492222809091499987689476037000748982075094738965754305639874560000000000000000000000, 96192759682482119853328425949563698712343813919172976158104477319333745612481875498805879175589072651261284189679678167647067832320000000000000000000000, 9426890448883247745626185743057242473809693764078951663494238777294707070023223798882976159207729119823605850588608460429412647567360000000000000000000000, 933262154439441526816992388562667004907159682643816214685929638952175999932299156089414639761565182862536979208272237582511852109168640000000000000000000000, 93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000];
		if(first100Factorials.length > number)
			return first100Factorials[number];
		else{
			IsLog.c("Error: factorial out of range. (up to 100 allowed, "+number+" given)");
			return -1;
		}
	};
	Math.factorial = factorial;
	//IsLog.c("Math.factorial prototype set.");
}
