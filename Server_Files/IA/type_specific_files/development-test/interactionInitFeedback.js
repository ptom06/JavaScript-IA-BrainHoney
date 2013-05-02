function() {
	if(typeof window['IA-Storage'] == "undefined")
		window['IA-Storage'] = {"feedback":[],"keyword":[],"default-feedback":""};
	else if(typeof window['IA-Storage']["feedback"] == "undefined" || typeof window['IA-Storage']["keyword"] == "undefined") {
		window['IA-Storage']["feedback"] = [];
		window['IA-Storage']["keyword"] = [];
		window['IA-Storage']["matchAll"] = [];
		window['IA-Storage']["default-feedback"] = "";
	} else {
		//	Data in window is already initialized.
		IsLog.c(window['IA-Storage']);
	}
	//	What is the point of this statement
	if(window['IA-Storage']["feedback"].length == 0) {
		$.post(
			portalURL,
			{
				"ia_type":"development-test",
				"domain": bhDomain,
				"courseTitle": (window.parent.bhCourseTitle)?window.parent.bhCourseTitle:"UNTITLED",
				"courseID": (window.parent.bhCourseId)?window.parent.bhCourseId:"NOCOURSEID",
				"itemID": getIAObject($(this)).getItemId(),
				"itemTitle": (window.parent.bhItemTitle)?window.parent.bhItemTitle:"NOTITLE",
				"action":"load_configuration"
			},
			function(data) {
				var configObject = JSON.parse(data);
				IsLog.c(configObject);
				for(var configProp in configObject['configuration']) {
					IsLog.c(configProp);
					window['IA-Storage'][configProp] = configObject['configuration'][configProp];
				}
				IsLog.c(window['IA-Storage']);
			}
		);
	} else {
		IsLog.c("feedback is not empty.");
		IsLog.c(window['IA-Storage']);
	}
	return true;
}