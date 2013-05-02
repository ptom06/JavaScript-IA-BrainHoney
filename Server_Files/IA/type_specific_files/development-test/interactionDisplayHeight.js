function() {
	var elementNumber = (/\d+/).exec($(this).attr("id"));
	$('.feedback').each(function(){$(this).css("height","0px")});
	$("#feedback"+elementNumber).css("height",$("#feedback"+elementNumber).css("height","auto").height()+"px");
}