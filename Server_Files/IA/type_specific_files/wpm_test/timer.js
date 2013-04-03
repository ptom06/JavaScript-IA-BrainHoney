var mins, secs, TimerRunning=false, TimerID, TheElement, a;

 
 function InitTimer(seconds) //call the Init function when u need to start the timer
 {
	IsLog.c("parseInt: "+"");
	alert("parseInt: "+"");
	if(seconds != 0){
		a=(seconds/60);
		IsLog.c("parseInt: "+"");
		secs=(seconds%60);
	}else{
    	mins=2;
    	secs=0;
	}
    StopTimer();
    StartTimer();
 }
function StopTimer()
 {	 
    if(TimerRunning)
       clearInterval(TimerID);
    TimerRunning=false;
	
 }
 //TheElement displays the actual timer, checks to see if time ran out or subtracts a second
function loopTimer() {
	
	TheElement = document.getElementById("txt");
    TheElement.value = Pad(mins)+":"+Pad(secs);
	
    Check();
    
    if(mins<=0 && secs<=0)
       StopTimer();
	       
    if(secs==0)
    {
       mins--;
       secs=60;
    }
	
    secs--;
 }
//initializes timer and runs looptimer once a second
 function StartTimer()
 {
    TimerRunning=true;
	
	TimerID = window.setInterval("loopTimer()",1000);
 }
 
//if you run out of time it clicks done
function Check()
 {
     if(mins==0 && secs==0)
    {
     	clearInterval(TimerID);
	 	var doneButton = document.getElementById("done");
	 	doneButton.click();
    }
 }
 
function Pad(number) //pads the mins/secs with a 0 if its less than 10
 {
    if(number<10)
       number=0 + "" + number;
    return number;
 }