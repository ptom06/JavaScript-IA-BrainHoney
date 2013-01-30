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
  o = o.replace(/\s+$/, '');
  n = n.replace(/\s+$/, '');
  
  var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/) );
  var str = "";
  var colors = new Array();
  	  colors[0] = "FF0033";
	  colors[1] = "87FF8B";

  var oSpace = o.match(/\s+/g);
  
  if (oSpace == null) {
    oSpace = ["\n"];
  } else {
    oSpace.push("\n");
  }
  var nSpace = n.match(/\s+/g);
  if (nSpace == null) {
    nSpace = ["\n"];
  } else {
    nSpace.push("\n");
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

function diff( o, n ) {
  var ns = new Object();
  var os = new Object();
  
  for ( var i = 0; i < n.length; i++ ) {
    if ( ns[ n[i] ] == null )
      ns[ n[i] ] = { rows: new Array(), o: null };
    ns[ n[i] ].rows.push( i );
  }
  
  for ( var i = 0; i < o.length; i++ ) {
    if ( os[ o[i] ] == null )
      os[ o[i] ] = { rows: new Array(), n: null };
    os[ o[i] ].rows.push( i );
  }
  
  for ( var i in ns ) {
    if ( ns[i].rows.length == 1 && typeof(os[i]) != "undefined" && os[i].rows.length == 1 ) {
      n[ ns[i].rows[0] ] = { text: n[ ns[i].rows[0] ], row: os[i].rows[0] };
      o[ os[i].rows[0] ] = { text: o[ os[i].rows[0] ], row: ns[i].rows[0] };
    }
  }
  
  for ( var i = 0; i < n.length - 1; i++ ) {
    if ( n[i].text != null && n[i+1].text == null && n[i].row + 1 < o.length && o[ n[i].row + 1 ].text == null && 
         n[i+1] == o[ n[i].row + 1 ] ) {
      n[i+1] = { text: n[i+1], row: n[i].row + 1 };
      o[n[i].row+1] = { text: o[n[i].row+1], row: i + 1 };
    }
  }
  
  for ( var i = n.length - 1; i > 0; i-- ) {
    if ( n[i].text != null && n[i-1].text == null && n[i].row > 0 && o[ n[i].row - 1 ].text == null && 
         n[i-1] == o[ n[i].row - 1 ] ) {
      n[i-1] = { text: n[i-1], row: n[i].row - 1 };
      o[n[i].row-1] = { text: o[n[i].row-1], row: i - 1 };
    }
  }
  
  return { o: o, n: n };
}