JavaScript-IA-BrainHoney
=========================

This is an Inline Assessment (IA) library. Currently there are only 2 types of assessment available:
* wpm_test
* listening



wpm_test
--------
This is an activity to test typing skill measured by "Words per Minute"

It is included within the HTML Template with the following code:

```HTML
<div class="inline-assessment" type="wpm_test"></div>
```
listening
---------
This calculates a grade based on a formula which allows deviation from the correct answer and penalizes on an interval beyond that point. The "stem" question is contained in the HTML to minimize complexity in the configuration.

It is included with the HTML Template with the following code:

```HTML
<div class="inline-assessment" type="listening">
	<div class="FullColumn">
		<div>
			<div class="audio-player" mm_ta_href="audio-player">
				<a href="https://isdev.byu.edu/is/share/jQuery.jPlayer/Uchtdorf1.mp3">"You Are My Hands" 2010 April General Conference - President Dieter F Uchtdorf</a>
			</div>
			<div class="BlockElement-caption"><i>MLU Audio File</i></div>
			<div class="BlockElement-creditline">© BYU Independent Study</div>
		</div>
	</div>
	<h4>What is the Mean Length of Utterance (MLU) for the above audio file?</h4>
</div>
```
