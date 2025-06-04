# Used Prompts

## My first prompt:

Please ignore all the previous instructions.

### Role:
You are a seasoned web developer, highly skilled in modern JavaScript programming and proficient in styling web pages using CSS.

### Task:
Your task is to create a webpage for a stopwatch and timer, following the functional and technical specifications described below.

## Functional specification:
1. It has to have an aesthetic design, using elegant and modern colors.
2. The homepage must include two buttons: one for the stopwatch and one for the timer.
3. If the user clicks the "stopwatch" button, it should navigate to the stopwatch page using a smooth slide transition.
4. If the user clicks the "timer" button, it should navigate to the timer page using a smooth slide transition.
5. Stopwatch and timer pages must have a back button to return to the home page.
6. For the stopwatch functionality. 
   1. It always needs to be initialized to 00:00:00.
   2. It must have two buttons: the "clear" button to reset the stopwatch to 00:00:00, and the "start/pause/continue" button, which, depending on the stopwatch's state, needs to change dynamically. If the stopwatch is in the initial state, it should start the stopwatch; if the stopwatch is running, it should be able to stop the stopwatch; if the stopwatch is stopped with time greater than zero, then let it continue from there.
7. For the timer functionality:
   1. It must have a numeric keyboard to allow the user to set the time.
   2. It must have a "set" button to set the time after entering the time value.
   3. Once the time is set, two buttons must appear: the "clear" button to reset the timer to 00:00:00 to let the user set a new time, and the "start/pause/continue" button, which, depending on the timer's state, needs to change dynamically. If the timer is in the initial state, it should start the timer countdown; if the timer is running, it should be able to stop the countdown; if the timer is stopped with time less than the initial set time, then let it continue the countdown from there.

## Technical specification:
1. Use SOLID principles to code the solution.
2. Split the code into different files.
3. Use classes over functions.
4. Use the modern JavaScript programming language for logic. The logic must only be placed into JS files. Do not use the script tag for logic.
5. Use HTML for the web elements. index.html is the home page.
6. Use CSS for the style. Use style.css for styles.
7. Use the /stopwatch-AMR folder to build the web app.

## Style Reference:
1. The timer, stopwatch, and initial buttons must be centered.
2. Do not use the whole screen; it must be placed proportionally to the screen.
3. Use elegant and modern colors.
4. It has to be aesthetic according to new trends.
5. Look at the image to understand the style and design.

Since you are a seasoned and skillful web developer, you should ask questions to gain a better understanding.

## Chatbot asked questions as expected accordignly with my prompt:

Let me ask a few clarifying questions to ensure I build exactly what you need:
1. Time Format: For the stopwatch, should it display hours:minutes:seconds (HH:MM:SS) or minutes:seconds:milliseconds (MM:SS:MS)?
2. Timer Input: For the timer's numeric keyboard, should users be able to set hours, minutes, and seconds, or just minutes and seconds?
3. Notifications: When the timer reaches 00:00, should there be any visual/audio notification?
4. Background: I see the reference image has a beautiful cafe background. Would you like me to use a similar background image or create a modern gradient background?

## My answers to the cahtbot questions:
1. Time Format: For the stopwatch, should it display hours:minutes:seconds (HH:MM:SS) or minutes:seconds:milliseconds (MM:SS:MS)?
    1.1 Answer: It must displayed in HH:MM:SS
2. Timer Input: For the timer's numeric keyboard, should users be able to set hours, minutes, and seconds, or just minutes and seconds?
    2.1 Answer: User can be able to set hours, minutes, and seconds. Allow user to set them separately by choosing the pair of numbers that want to set.
3. Notifications: When the timer reaches 00:00, should there be any visual/audio notification?
    3.1 Answer:  Yes a funny sound, like a fart.
4. Background: I see the reference image has a beautiful cafe background. Would you like me to use a similar background image or create a modern gradient background?
    4.1 Answer: I would like to use motivational backgrounds, with black as the main color and some grays. Use motivational images like reaching a peak, climbing a mountain, or spinning in the air like gymnasts do.

## Second prompt, because I detected an issue.

It's working. However, I see an issue with the "start/pause/continue" button in both the stopwatch and timer. In the stopwatch, when I click on "Start" and the stopwatch begins running, the button still says "Start." Look at the image.

For the timer, once the time is set, it never says "Start"; it says "Continue." Look at the image.

Also, for the timer, when the time's up, it doesn't sound a fart; it just sends an alert.