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
	
	if(s.length % 5 == 0 ){
		while (s.length() >= p_index){
			p_array[i]= p.substr(p_index,5);
			p_index=p_index +5;
			i++;
		}
		while(p_array.length > matches.length){
			currentMatch = s.indexOf(p_array[x],(matches.length*5));
			if(currentMatch == lastMatch || currentMatch == lastMatch+5){
				matches[x] = currentMatch;
				lastMatch = currentMatch;
			}else if(currentMatch == badMatch+5){
				matches[x] = currentMatch;
				lastMatch = currentMatch;
				matches[x-1] = badMatch;
			}else if(currentMatch < lastMatch + 10 && matches[x-1] == -1){
				matches[x] = currentMatch;
				lastMatch = currentMatch;
			}else if(currentMatch < badMatch+10 && matches[x-1] == -1){
				matches[x] = currentMatch;
				lastMatch = currentMatch;
				matches[x-1] = badMatch;
			}else if(currentMatch < lastMatch + 10 && matches[x-1] != -1){
				matches[x] = -1;
				lastMatch = currentMatch;
			}else if(currentMatch < badMatch+10 && matches[x-1] != -1){
				matches[x] = -1;
				lastMatch = currentMatch;
				matches[x-1] = badMatch;
			}else if(currentMatch != -1 && currentMatch > lastMatch + 10){
				matches[x] = -1;
				badMatch = currentMatch;
			}else{
				matches[x] = -1;	
			}
			x++;
		}
	}
	while(y < matches.length){
		if(matches[y] == -1){
			str += '<span style="background:#'+ colors[0] + '">'+ p_array[y] +"</span>"
		}else{
			str +=	p_array[y];
		}
		y++;
	}
	str+= p.substr(matches.length*5);
	document.getElementById("textCorrection").innerHTML = str;
}

 