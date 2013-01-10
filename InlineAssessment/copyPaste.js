function disableCtrlKeyCombination(e)
{
        //list all CTRL + key combinations you want to disable
        var forbiddenKeys = new Array;
		forbiddenKeys = ['a', 'n', 'c', 'x', 'v', 'j'];
        var key;
        var isCtrl;
        if(window.event)
        {
                key = window.event.keyCode;     //IE
                if(window.event.ctrlKey){
					return false;
				}
                        /*isCtrl = true;
                else
                        isCtrl = false;*/
        }
        else
        {
                //firefox & chrome
				key  = e.which;
                if(e.ctrlKey){
					return false;
				}
                       /* isCtrl = true;
                else
                        isCtrl = false;*/
        }
        //if ctrl is pressed check if other key is in forbidenKeys array
        /*if(isCtrl)
        {
                for(i=0; i<forbiddenkeys .length; i++)
                {
                        //case-insensitive comparation
                        if(forbiddenKeys[i].toLowerCase() == String.fromCharCode(key).toLowerCase())
                        {
                               alert("Key combination CTRL" + +String.fromCharCode(key) +" has been disabled.");			
								
                                return false;
                        }
                }
        }*/
        return true;
}
