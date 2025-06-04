# Initial prompt

Counter App V1

As an expert javascript web developer, I need to create a counters (stopwatch and countdown) web application based on an `index.html` seed file (attached) and an empty `script.js` file.

## UI description

### Header

The header of the page will be sticky at the top and will contain 3 items:

- the app name on the left (generate a cool name with an icon)
- a centered button ("Setup new counter +", on mobile can be replaced with a "+" floating action button on the bottom right of the page) that pops up the form to setup and start a new counter stopwatch/countdown below the app name.
- on the right I want a button that switches between light and dark themes. Should be a toggles button with 2 icons (a bulb to switch to light theme and a moon to switch to dark theme)

### New counter form

The form to create a new counter will consist of a switch button to select the type of counter (stopwatch or countdown) on the top. Add icons to each option (A green arrow up for stopwatch on the left and a red arrow down for countdown on the right)
Below the switch, add the timer setup input. Based on the `timer-setup.png` example image:

- If counter is set to stopwatch show the empty input and just a same-width button "Start" below it.
- If counter is set to countdown show the input and the UI (input and 0-9 buttons) and below them them, put "Start" and "Clear" buttons (both buttons should have same with as the input with a 1rem gap between them). When countdown setup is being set, detect user keyboard number inputs to set the timer. The countdown input maximum value will be 99 hours, 99 mins and 99 seconds
- Do not show milliseconds on timer setup

### Body

The body of the page will consist of a 2 columns UI on which stopwatch history will render on the left side, and countdown history on the right side. Put the title (counter type) and icon to each column header

### history

- Every active item will update its counter on real time as time goes on. Counters will show milliseconds.
- They will be vertically center aligned on the left. On the right each one will have it's actions depending on it's own state (active, paused, finished).
- Put consistent styles to each entry based on its status.
- All actions are icon buttons without text (put description on title tags) and have a small gap between them
- Below of each entry, add a label with depending of counter type:
  - Stopwatch: Date time info in which the stopwatch was created
  - Countdown: Initial countdown time (look at the example image `active-paused-coundtdown.jpg`)

## App behavior

### As page loads for first time:

- The header should only the app name and icon.
- The body of the page should show the create stopwatch/countdown centered on a box.

### As one counter is started, the UI will change to it's final form:

- Header will now show the "Setup new counter +" button
- The body will change to the 2 columns UI showing the history

### When a new stopwatch is submitted:

The stopwatch will render live count on top of stopwatch history.
Active entries will have a pause button to stop the counter
Paused entries will have a play (to resume counter) and a delete button (delete the entry)

### When a countdown is submitted:

The countdown will render live countdown on top of countdown history ordered by remaining time (entries with remaining time on 0 will be on the bottom).
Active entries will have a pause button to stop the counter
Paused entries will have a play (to resume counter), a reset (to restart to it's initial value) an a delete button (delete the entry)
Finished entries will have a play (to restart to it's initial value) an a delete button (delete the entry)
The play button will always be the last button on the right so that play/pause is always in the same place

### If all history elements are deleted, return to the initial UI.

### Countdown finish

When a count down is about to finish (less than 10 seconds) put some twinkle bg color
When finished, set it's styles to finished and show the countdown on 0 and play an alert sound (max 5 seconds). Use any random alert sound you find on free on the web

## Technical specifications

- The app UI should render correctly on mobile device screens. It should also support light and dark theme
- Use SOLID programming principles to create clean, reusable and performant code
- White semantic html with accessibility taken into consideration
- Store all the info in an in memory JS object (no need to restore info on close).
- Add a test suite based on jest test frameworks (and jsdom for DOM manipulation) that covers all the basic workflows (initial behavior, history, clear history elements, return to initial UI, pause/resume counters, alert when an countdown is finished). Create a package.json with all required packages, setup and commands to execute them.
- Create a Readme file with app documentation
- Use Font Awesome via CDN for the icons
- Use Tailwind css framework from CDN to achieve a professional look
- Use requestAnimationFrame for smoother counter rendering

Ask me all questions that you need to generate the best result

# Response

```
Thanks, this is a very detailed and well-structured spec! To move forward efficiently, here are a few quick questions to clarify before I implement everything:

1. **App Name & Icon**
   Do you want a specific theme for the name (e.g., playful, minimalist, retro)? I’ll generate a name like "TickTock ⏱️" unless you want to choose one.

2. **Countdown Input Behavior**
   From the image (`timer-setup.png`), I see numeric buttons below the input. Should these act as a virtual keypad (like a microwave), appending digits to form HHMMSS?

   * Example: Pressing "1" then "2" becomes `00:00:12`
   * Should the input auto-format into `hh:mm:ss` as digits are typed or clicked?

3. **Max Countdown Time**
   Just to confirm: `99:99:99` max means hours, minutes, and seconds can each go up to 99?

4. **Alert Sound**
   Do you want the alert to autoplay using the `<audio>` element with `autoplay` + `loop=false`, or should we trigger it via JavaScript with `audio.play()` on countdown end?

5. **Designing for Mobile**
   Should the FAB "+" button (on mobile) open a modal form or slide-up bottom drawer?

6. **Dark/Light Mode Toggle**
   Do you prefer Tailwind’s `dark:` class approach with a `class="dark"` on `<html>` (simpler) or toggle CSS variables manually?

7. **Testing Suite**
   Is `npm` assumed available? Do you want full `package.json` scaffolding with `jest`, `jsdom`, and scripts like `npm test`?

Once you answer these, I’ll generate the whole scaffold (`index.html`, `script.js`, `README.md`, `package.json`, and tests).
```

# Clarifications

1. ticktock sounds good, nice!
2. Yes, they should act as a virtual keypad. No need to auto-format into hh:mm:ss as digits are typed. Only when submitted and moved to the history
3. yes, the maximum input value will be 99:99:99. As mentioned on point 2, on entries it should be formatted to time format. For 99:99:99 it should shout a countdown of 100:40:39
4. Trigger it with JS
5. Open a modal yes
6. The simple tailwind dark: class approach
7. Yes, npm is available. Yes, give me the full scaffold.

## Final prompt

That did not work. From the docs, I should import tailwind like this <script src="https://cdn.tailwindcss.com"></script>.

Anyway, theme change is not working as expected. Seems it was ok `applying` dark class on html instead than body
