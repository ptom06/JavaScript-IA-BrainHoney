/* check 5 letters at a time and return colored text */
function letterCompare(p,s){
	var p_index=0;
	var s_index=0;
	var p_array=new Array();
	var i=0;
	var x=0;
	var y=0;
	var currentMatch=0;
	var lastMatch=0;
	var badMatch=2;
	var matches=new Array();
	var str = "";					//	Initilize the string
 	var colors = new Array();		//	Define our marking colors
  	  colors[0] = "e3e3e3";		//	Mistakes are this color
	  colors[1] = "87FF8B";		//	Attention markings are this color
	
	/*IsLog.c("pri= "+ p);
	IsLog.c("sec= "+ s);*/
	
	while (s.length >= p_index){
		p_array[i]= p.substr(p_index,5);
		p_index=p_index +5;
		i++;
	}
	while(p_array.length > matches.length){
		currentMatch = s.indexOf(p_array[x],((matches.length*5)-5));
		IsLog.c(p_array[x]);
		if(currentMatch == lastMatch || currentMatch == lastMatch+5){
			matches[x] = currentMatch;
			lastMatch = currentMatch;
			IsLog.c("Matches["+ x +"]:" + matches[x] + " Perfect Match");
		}else if(currentMatch == badMatch+5){
			matches[x] = currentMatch;
			lastMatch = currentMatch;
			matches[x-1] = badMatch;
			IsLog.c("Matches[" +x+ "]:" + matches[x] + " Perfect from Bad");
		}else if(currentMatch < lastMatch + 11 && matches[x-1] == -1){
			matches[x] = currentMatch;
			lastMatch = currentMatch;
			IsLog.c("Matches["+x+"]:" + matches[x] + " Good after wrong");
		}else if(currentMatch < badMatch+11 && matches[x-1] == -1){
			matches[x] = currentMatch;
			lastMatch = currentMatch;
			matches[x-1] = badMatch;
			IsLog.c("Matches["+x+"]:"+ matches[x]+" Good from Bad after wrong");
		}else if(currentMatch < lastMatch + 11 && matches[x-1] != -1){
			matches[x] = -1;
			lastMatch = currentMatch;
			IsLog.c("Matches["+x+"]:"+ matches[x]+" NO MATCH because extra letters from good");
		}else if(currentMatch < badMatch+11 && matches[x-1] != -1){
			matches[x] = -1;
			lastMatch = currentMatch;
			matches[x-1] = badMatch;
			IsLog.c("Matches["+x+"]:"+ matches[x]+" NO MATCH because extra letters from bad");
		}else if(currentMatch != -1 && currentMatch > lastMatch + 11){
			matches[x] = -1;
			badMatch = currentMatch;
			IsLog.c("Matches["+x+"]:"+ matches[x]+" NO MATCH but match found after 10+");
		}else{
			matches[x] = -1;
			IsLog.c("Matches["+x+"]:"+ matches[x]+" No Match");	
		}
		x++;
	}
	
	while(y < matches.length){
		if(matches[y] == -1){
			str += '<span style="background:#'+ colors[0] + '">'+ p_array[y] +"</span>"
		}else{
			str +=	p_array[y];
		}
		y++;
	}
	IsLog.c("MatchesLength"+ matches.length);
	str+= '<span style="background:#'+ colors[1] + '">'+p.substr(matches.length*5)+"</span>";
	document.getElementById("textCorrection").innerHTML = str;
	
	var score=0;
	x=0;
	while(x < matches.length){
		if(matches[x] != -1){
			score++;	
		}
		x++;
	}
	IsLog.c("Score "+ score);
	return score;
}

 