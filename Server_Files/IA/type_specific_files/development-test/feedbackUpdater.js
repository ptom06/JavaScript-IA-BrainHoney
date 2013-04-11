function() {
	if(typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {"feedback":[],"keyword":[]};
	var arrayIndex = $(this).attr("id").substr($(this).attr("id").indexOf(/\d/));
	IsLog.c("UPdating IA-Storage");
	IsLog.c(window['IA-Storage']);
	window['IA-Storage']['feedback'][arrayIndex] = $("#feedback"+i).val();

	window['IA-Storage']['keyword'][arrayIndex] = $("#keyword"+i).val();
	IsLog.c(window['IA-Storage']);
}