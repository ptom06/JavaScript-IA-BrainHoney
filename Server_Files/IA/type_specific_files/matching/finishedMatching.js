function(){
	IsLog.c('We have clicked the Finish button');
	questions = window['IA-Storage']['questions'];
	IsLog.c(questions);
	for(var i=0; i<questions.length;i++){
		IsLog.c($("#answerBlank"+i).val());
		IsLog.c($("#distractor"+i).text());
	}
}