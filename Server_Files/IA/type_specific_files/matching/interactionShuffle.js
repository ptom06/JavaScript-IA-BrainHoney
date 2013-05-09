function shuffle(o){
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
}

// this is a function from the pseudoApp
/*this.setRightAnswer = function(i) {
		if(this.getRightAnswer() != false)						//if there is a correct answer already, replace it
			this.answersArray[correctIndex].setAnswer(i);
		else{													//if there was not a correct answer, add it and randomize if array > 1
			this.answersArray.push(i);
			if(this.answersArray.length > 1)
				this.answersArray = shuffle(this.answersArray);
				
			for(var j=0; j<this.answersArray.length; j++){		//find the index of the correct answer, and update correctIndex
				if(this.answersArray[j] == i)
					this.correctIndex = j;
			}
		}
	};*/