function(){
	var questions = window['IA-Storage']['questions'];
	for(var i=0; i < questions.length; i++) {
		var userQuestion = {
				"questionText": $("#question-option"+i).text(),
				"questionAnswerLetter": $("#answerChoiceSelect"+i).val(),
				"questionAnswer": false,
				"found": false,
				"feedback": false
		};
		for(var j=0; j < questions.length; j++) {
			if(questions[j].question == userQuestion.questionText) {
				userQuestion.questionAnswer = questions[j].answer;
				userQuestion.feedback = questions[j].feedback;
			}
		}
		for(var j=0; j < questions.length; j++) {
			if($("#distractor"+j).text().replace(/^\w+[\.\,\)\;\:\s\-\]\}]?\s{0,}/, "") == userQuestion.questionAnswer && userQuestion.questionAnswerLetter == (/^\w+/).exec($("#distractor"+j).text())) {
				userQuestion.found = true;
			}
		}
		$("#leftBox"+i).find("#feedbackSpan"+i).text( (!userQuestion.found)?userQuestion.feedback:"Correct!" );
		$("#leftBox"+i).find(".feedback").each( function() {
			$(this).css("height", "auto");
			$(this).css("height", $(this).height()+"px");
		} );
	}
	
}