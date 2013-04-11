/*This checks two strings to see if they are identical. If they are not it highlights the first input red */

function escape(s) {
    var n = s;
    n = n.replace(/&/g, "&amp;");
    n = n.replace(/</g, "&lt;");
    n = n.replace(/>/g, "&gt;");
    n = n.replace(/"/g, "&quot;");

    return n;
}

function diffString1( o, n ) {
  o = o.replace(/\s+$/, '');	//	Remove the trailing spaces from the "complete" text
  n = n.replace(/\s+$/, '');	//	Remove the trailing spaces from the "input" text
  
  //	Gather the "matched up" data from diff()
  var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/) );
  var str = "";					//	Initilize the string
  var colors = new Array();		//	Define our marking colors
  	  colors[0] = "FF0033";		//	Mistakes are this color
	  colors[1] = "87FF8B";		//	Attention markings are this color (not implemented)

  var oSpace = o.match(/\s+/g);	//	Gather the spaces. This is used to retain source formatting
  
  if (oSpace == null) {			//	The "spaces" array needs to have at least one whitespace character
    oSpace = ["\n"];
  } else {
    oSpace.push("\n");			//	Seriously, at least one.
  }
  var nSpace = n.match(/\s+/g);	//	This "spaces" array retains the formatting of the "input" text
  if (nSpace == null) {			//	Again, at least one whitespace character
    nSpace = ["\n"];
  } else {
    nSpace.push("\n");			//	Fo sho
  }

  //	These first two cases are for when the input is empty, either the whole thing is empty or the array parsed to empty stuff.
  if (out.n.length == 0) {
      for (var i = 0; i < out.o.length; i++) {
        str += '<span style="color:#'+ colors[0] + '">'+ escape(out.o[i]) + oSpace[i] +"</span>" ;
      }
  } else {
    if (out.n[0].text == null) {
      for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
        str +=  '<span style="color:#'+ colors[0] + '">'+ escape(out.o[n]) + oSpace[n] + "</span>";
      }
    }
    
	//	Loop through out.n (which is the object returned from diff()) and mark the words colors[0] that are wrong and leave the others alone...
    for ( var i = 0; i < out.n.length; i++ ) {
	  //	The contents of this loop are executed for every word of input
      if (out.n[i].text == null) {
        //	That's weird, there's a null in the middle of our input. This should probably not happen.
      } else {
		//	For this word - match it to something in our "o"
        var pre = "";
		//	Start looking, starting at where the current "n" row is, plus 1
		//	Loop until you find a word that diff() marked as a "text" match.
        for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++ ) {
          pre += '<span style="color:#' + colors[0] + '">'+ escape(out.o[n]) + oSpace[n] +"</span>" ;
        }
		//	Output the match and move on to the next "n"
        str += " " + out.n[i].text + nSpace[i] + pre;
      }
    }
  }
  
	document.getElementById("textCorrection").innerHTML = str;
	/*test;
	document.getElementById("textCorrection").innerHTML ;*/
}

//	This function is the main engine of the "compare" It builds an object with "o" and "n" properties that each contain marked up arrays of the "[o]riginal" and "i[n]put" strings
//	"o" and "n" are already arrays at this point. They were strings, then were "broken" into arrays at whitespace.
function diff( o, n ) {
  var ns = new Object();							//	Got to have a place to put the stuff...
  var os = new Object();
  
  for ( var i = 0; i < n.length; i++ ) {			//	build the ns object property "rows"
    if ( ns[ n[i] ] == null )
      ns[ n[i] ] = { rows: new Array(), o: null };	//	Initialize the "ns" position with both "rows" and the "o" holder. It is unclear if the "o" holder is ever used for anything.
    ns[ n[i] ].rows.push( i );						//	the "rows" array contains the indices of each word in the "n" array.
  }
  
  for ( var i = 0; i < o.length; i++ ) {			//	build the os object property "rows"
    if ( os[ o[i] ] == null )
      os[ o[i] ] = { rows: new Array(), n: null };	//	Initialize the "os" position with both "rows" and the "n" holder. It is unclear if the "n" holder is ever used for anything.
    os[ o[i] ].rows.push( i );						//	the "rows" array contains the indices of each word in the "o" array.
  }
  
  IsLog.c(ns);
  IsLog.c(os);
  /*	At this point we have the original input arrays "o" and "n"
  		Additionally we have objects "os" and "ns" which contain arrays of the indices and crossed "o" and "n" properties for each "rows" array.
  		I believe the "rows" is intended to provide a matching "index" for where the "input" word and "original" matched word intersect.
  */
  
  //	The following loop finds most of the matches missing the last word and where "n" contains words that "o" does not and somehow also the word preceeding the unmatched word
  for ( var i in ns ) {								//	Loop through "ns" looking for empty match data (provided by either a "row" array greater than 1 element (in either the input or the original) or an input position that is null in "os"
	//IsLog.c("IA: wpm_test; checker.js main matching loop - pre(n["+ns[i].rows[0]+"]):"+n[ns[i].rows[0]]);
    if ( ns[i].rows.length == 1 && typeof(os[i]) != "undefined" && os[i].rows.length == 1 ) {
		//	set the array position to a new object containing the original information, but reformatted into an object with "text" and "row" data.
      n[ ns[i].rows[0] ] = { text: n[ ns[i].rows[0] ], row: os[i].rows[0] };
      o[ os[i].rows[0] ] = { text: o[ os[i].rows[0] ], row: ns[i].rows[0] };
    }	//	If there is no match for the text, there is no object yet
	//IsLog.c("IA: wpm_test; checker.js main matching loop - post(n["+ns[i].rows[0]+"]):");
	//IsLog.c(n[ns[i].rows[0]]);
	//if(typeof os[i] == "object")
	//	IsLog.c(o[os[i].rows[0]]);
	//else
	//	IsLog.c("o not set");
  }
  
  //	At this point we have positions in "n" and "o" which are not yet initialzed to their object format
  //	The following loop looks for those unmatched positions by detecting when the "next" position is unmatched
  //	and setting it (the first unmatched position is always the word preceeding the "extra" word in the input
  //	This loop misses some, why? unknown.
  for ( var i = 0; i < n.length - 1; i++ ) {		// Loop through "n" looking for "text" which is positioned before uninitialized "text" matched against equivalently empty text in the "original" cross checked again by the thing we decided was null being equivalently null to the o position.
    if ( n[i].text != null && n[i+1].text == null && n[i].row + 1 < o.length && o[ n[i].row + 1 ].text == null && n[i+1] == o[ n[i].row + 1 ] ) {
		//IsLog.c("IA: wpm_test; checker.js find missing matches loop1. pre(n["+(i+1)+"]):"+n[i+1]);
		//IsLog.c("IA: wpm_test; checker.js find missing matches loop1. pre(o["+(n[i].row+1)+"]):"+o[n[i].row+1]);
      n[i+1] = { text: n[i+1], row: n[i].row + 1 };	//	What was null here becomes an object populated with null values in "text" and "row" gets the index of the null holder
      o[n[i].row+1] = { text: o[n[i].row+1], row: i + 1 };	//	Unless I'm wrong here, this appears redundant, since the previous loop should have already initialized these values to this. There must be some case where it doesn't (probably at the last index)
		//IsLog.c("IA: wpm_test; checker.js find missing matches loop1. post(n["+(i+1)+"]):");
		//IsLog.c(n[i+1]);
		//IsLog.c("IA: wpm_test; checker.js find missing matches loop1. post(o["+(n[i].row+1)+"]):");
		//IsLog.c(o[n[i].row+1]);
    } else {
		//IsLog.c("IA: wpm_test; checker.js find missing matches loop1. n index "+i+" does not satisfy the if");
	}
  }
  
  /*	At this point we have matching "o" and "n" arrays, which contain objects having "text" and "row" properties if matches were found
  		Since we don't completely understand why some are still missing - we keep looking for uninitialized positions in the arrays
  */
  
  for ( var i = n.length - 1; i > 0; i-- ) {		//	Loop through "n" looking for valid matches where the previous positions are null
    if ( n[i].text != null && n[i-1].text == null && n[i].row > 0 && o[ n[i].row - 1 ].text == null && n[i-1] == o[ n[i].row - 1 ] ) {
	  //IsLog.c("IA: wpm_test; checker.js find missing matches loop2. post(n["+(i-1)+"]):");
	  //IsLog.c(n[(i-1)]);
      n[i-1] = { text: n[i-1], row: n[i].row - 1 };
      o[n[i].row-1] = { text: o[n[i].row-1], row: i - 1 };
    }
  }
  
  return { o: o, n: n };
}

function complexMatchFunction(testString, inputString) {
	if(typeof arguments[2] != "undefined" && typeof penalty == "undefined")
		var penalty = arguments[2];
	if(typeof arguments[3] != "undefined")
		var testPosition = arguments[3];
	if(typeof arguments[4] != "undefined")
		var inputPosition = arguments[4];
	if(typeof arguments[5] != "undefined" && recurseDepth == "undefined")
		var recurseDepth = arguments[5];
		
	var currentTestWord = testString.substr(testPosition, testString.indexOf(testPosition, /\s/));
	//	match single letter discrepencies
	
}