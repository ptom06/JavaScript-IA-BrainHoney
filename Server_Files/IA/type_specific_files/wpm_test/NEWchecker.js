/* check 5 letters at a time and return colored text */
function letterCompare(p,s){
	var p_index=0;
	var s_index=0;
	var p_array=new Array();
	var i=0;
	var x=0;
	var currentMatch=0;
	var lastMatch=0;
	var matches=new Array();
	
	if(s.length % 5 == 0 ){
		while (s.length() >= p_index){
			p_array[i]= p.substr(p_index,5);
			p_index=p_index +5;
			i++;
		}
		while(p_array.length > matches.length){
			currentMatch = s.search(p_array[x]);
			if(currentMatch = lastMatch || (currentMatch > lastMatch && currentMatch < lastMatch + 15)&& currentMatch >= matches.length*5){
				matches[x] = currentMatch;
				lastMatch = currentMatch;	
			}else{
				matches[x] = -1;	
			}
			
			x++;
			
		}
	}
	
}