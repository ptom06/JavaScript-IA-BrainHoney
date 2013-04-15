function() {
    //  You could modify the config example if you need to gather more than one piece of data, but in ours we don't.
    $.post(
        portalURL,
        {
            "ia_type":      "development-test",             //  This NEEDS to be the ia_type for your new type
            "action":       "done",                     //  again, you can change this to fit your taste. You're writing it, after all
            "JSONString":   "{\"inputField\":"+JSON.stringify($("#inputField").val())+"}",     //  It still seems silly to me that I called them the same thing, but it's only an example...
            "domain": bhDomain,                             //  The rest of these are for the flexibility built into the system. please retain them
            "courseTitle": (window.parent.bhCourseTitle)?window.parent.bhCourseTitle:"UNTITLED",
            "courseID": (window.parent.bhCourseId)?window.parent.bhCourseId:"NOCOURSEID",
            "itemID": getIAObject($(this)).getItemId(),     //  This one is different, and it is so to provide the facility to specify your "type" in the HTML base (the class="inline-assessment" element which triggers this whole sequence)
            "itemTitle": (window.parent.bhItemTitle)?window.parent.bhItemTitle:"NOTITLE"
        },
        function(data) {
            //  On success we should let the user know, don't you think?
            data = JSON.parse(data);
			IsLog.c("done response:");
            IsLog.c(data);
            $(($("#submitButton").length > 0)?"#submitButton":"body").after($("<span>"+((data.feedback != "")?"<h4>"+data.feedback+"</h4>":"<h4>Error retrieving feedback.</h4>")+"</span>"));
        }
    );
}