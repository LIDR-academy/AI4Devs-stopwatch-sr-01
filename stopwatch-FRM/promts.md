# First attempt
---
# Role
You are an expert fullstack JS developer

# Goal
Create a webpage develop as a stopwatch and a countdown timer, following those acceptance criteria:
Technical critera:
1. you must implement a MVC architecture and separate the code in folders acordingly
2. Use JS Vanilla
3. Apply the SOLID principles, separarating the logic in functions and commenting what they do
4. Implement all necesary logs in the console
5. Catch all possible exceptions
6. For CSS use tailwind 
7. Use a mobile firts aproach
8. A test suite for the main usecases is expected using jest and following xunit testing framework rules and patterns
9. Only use unit tests to cover the domain logic. Each test must be isolated from the others, they must not share any data or state.
10. Always loop up to put the operations near the data.

Functional criteria:
1. As a user i can run either the stop watch or the countdown watch, also both can be run in paralel.
2. When a countdown timer finishes, display a notification and play an alert sound.
3. Offer the ability to create and manage multiple stopwatches or countdown timers simultaneously.
4. The diferents watches created should be disply in tabs like window over the timer display.
5. The UI will have the following buttons
    5.1 Bunton to stop/star
    5.2 Button to create a new stop or countdown watch
    5.3 Button to delete an existent stop or countdown watch
6. There should be a limmit of multiple stopwatches or countdown timers there can simultaneously exists.
7. If the limit defined for max stopwatches or countdown timers is reached out, then the new one should replace the oldest existing not running one.

# General criteria:
1. It has to be responsive
2. Avoid using rectangle angles for UI elements
3. Use colors productive prone
4. I expect an MVP that follow the given criterias, don't go beyond that. We will iterate.
5. Is inteded to be a practical web with just the strictly necessary information. Follow a minimalist style.
6. I have to be able to run the project in my local environment. So tell me how to run the application and how to run the tests.

# Context
1. all the code must be inside /stopwatch-FRM folder
2. You can use all @project

# Examples of expected output
1. You can visit this link to get ideas https://www.online-stopwatch.com/
2. Also you can use the stopwatch.png image lacated at res/stopwatch.png

Ask me all the extra information that you need before building it

# Explanation: 
I used a highly detailed prompt for GitHub Copilot aiming to use the Agent mode and:

1. Maximize efficiency with a "one-shot" MVP generation.
2. Ensure clarity and reduce AI misinterpretation.
3. Obtain a high-quality, well-structured codebase.
4. Get a complete, runnable starting point for iteration.

What likely went wrong, preventing a runnable application:
5.  The AI struggled with the complexity of integrating all architectural (MVC, SOLID), functional, and testing requirements simultaneously.
6.  Integration failures between generated HTML, CSS, and JavaScript components.
7. The "one-shot" approach for such a project typically needs more iterative guidance.
8. After a some interations the solution stoped getting better.
9. I can't run the proyect

---
# Second Attempt
---

# Role
You are an expert fullstack JS developer

# Goal
Create a webpage develop as a stopwatch and a countdown timer, following those acceptance criteria:
Technical critera:
1. Separate the html and javascript code into index.html and script.js
2. Use JS Vanilla
3. Apply the SOLID principles, separarating the logic in functions and commenting what they do
4. Implement all necesary logs in the console
5. Catch all possible exceptions
6. For CSS use tailwind 
7. Use a mobile firts aproach
8. A test suite for the main usecases is expected using jest and following xunit testing framework rules and patterns
9. Only use unit tests to cover the domain logic. Each test must be isolated from the others, they must not share any data or state.
10. Always loop up to put the operations near the data.

Functional criteria:
1. As a user i can run either the stop watch or the countdown watch, also both can be run in paralel.
2. When a countdown timer finishes, display a notification and play an alert sound.
3. Offer the ability to create and manage multiple stopwatches or countdown timers simultaneously.
4. The diferents watches created should be disply in tabs like window over the timer display.
5. The UI will have the following buttons
    5.1 Bunton to stop/star
    5.2 Button to create a new stop or countdown watch
    5.3 Button to delete an existent stop or countdown watch
6. There should be a limmit of multiple stopwatches or countdown timers there can simultaneously exists.
7. If the limit defined for max stopwatches or countdown timers is reached out, then the new one should replace the oldest existing not running one.

# General criteria:
1. It has to be responsive
2. Avoid using rectangle angles for UI elements
3. Use colors productive prone
4. I expect an MVP that follow the given criterias, don't go beyond that. We will iterate.
5. Is inteded to be a practical web with just the strictly necessary information. Follow a minimalist style.
6. I have to be able to run the project in my local environment. So tell me how to run the application and how to run the tests.

# Context
1. all the code must be inside /stopwatch-FRM folder
2. You can use all @project

# Examples of expected output in the UI
1. You can visit this link to get ideas https://www.online-stopwatch.com/
2. Also you can use the stopwatch.png image lacated at res/stopwatch.png

I expect you to give me the best aproach to do it using the agent monde
Ask me all the extra information that you need before building it

# Explanation: 
I used a highly detailed prompt for GitHub Copilot aiming to use the Ask mode and:

1. Maximize efficiency with a "one-shot" MVP generation.
2. Ensure clarity and reduce AI misinterpretation.
3. Obtain a high-quality, well-structured codebase.
4. Get a detailed plan

What likely went wrong:
5. The AI strugle with CSS styles
6. I get some basic tests but not enough
7. In the iterations the tests wheren't updated
8. As i relaxed the architectural requirements it wasn't easy for me to follow the code to review it