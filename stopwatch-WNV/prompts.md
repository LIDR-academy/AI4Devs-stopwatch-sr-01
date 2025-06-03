##Part 1 Prompt

Based on next prompt on markdown format provide the code of the app describe it

## 🧠 Prompt for Multi-Timer Countdown Web App with ES Modules, SOLID, TDD, Babel & Jest Setup, CSS Modules, and Responsive Design

### 👤 **Persona**
You are a senior full-stack JavaScript developer and software architect. You have expertise in:
- Modular web development using **ES Modules** (import/export)
- Clean code architecture (SOLID principles)
- **Test-Driven Development (TDD)** using **Jest**
- Styling with **CSS Modules**
- Mobile-first **responsive** and **accessible** frontend design
- Configuring build tools like **Babel** and **Jest** for modern JS development

---

### 📘 **Context**
We are building a stopwatch and countdown timer web application, similar to [Online Stopwatch](https://www.online-stopwatch.com/). You’ll start from minimal boilerplate (index.html, basic entry script.js) and evolve the app into a modular, testable, responsive system.

---

### 🥅 **Desired Outcome**

Build a robust, accessible web app with the following **functional and technical requirements**:

#### ✅ **Functionality**
- Support **multiple independent timers** (countdown & stopwatch modes)
- Ability to **start, pause, reset, delete** timers independently
- Show a **notification** and play an **audio alert** when a countdown ends

#### 🔧 **Technical Requirements**
- Use **ES Modules**: split code into separate modules and use import/export statements
- Follow **SOLID principles** in the app’s architecture
- Apply **TDD using Jest** with the following config:
  
  **babel.config.json**
  
json
  {
    "presets": ["@babel/preset-env"],
    "plugins": ["@babel/plugin-transform-modules-commonjs"]
  }


  **package.json excerpt**
  
json
  {
    "type": "module",
    "jest": {
      "testEnvironment": "node",
      "moduleFileExtensions": ["js", "json", "node"],
      "transform": {
        "^.+\\.js$": "babel-jest"
      }
    }
  }


- Write **unit tests** for timer logic, alert handling, and state control using **Jest**
- Structure JavaScript logic using **modular patterns**:
  - Timer.js (core logic)
  - TimerManager.js (collection control)
  - NotificationService.js, SoundService.js, etc.

#### 🎨 **Styling & UX**
- Use **CSS Modules** (*.module.css) for encapsulated component styling
- Follow **mobile-first responsive design**
- Ensure **accessibility**:
  - Semantic HTML
  - Keyboard operability
  - ARIA roles where appropriate

---

### ✍️ **Tone + Style**
- Professional, modular, testable code
- Minimal yet clear comments where logic may need clarification
- Emphasis on clean, maintainable structure

---

### 🔢 **# of Options**
Provide **1 complete implementation** that is production-quality and fully modular.

---

### 🧾 **Output Style**
Please provide your output in the following order:

1. **Architecture Overview**
   - Subtasks breakdown (per module/class/service)
   - How SOLID principles are applied
   - Explanation of test coverage strategy using TDD and Jest
   - CSS Module structure and organization
   - Overview of file structure using ES Modules

2. **HTML Code (index.html)**
   - Mobile-first layout with accessible markup

3. **JavaScript Modules**
   - Timer.js, TimerManager.js, NotificationService.js, main.js, etc.
   - Use ES Module syntax (import/export)
   - Clearly organized by responsibility (single-responsibility rule)

4. **CSS Module Files**
   - Example files like Timer.module.css, App.module.css
   - Responsive and accessible styling

5. **Test Files (Jest)**
   - timer.test.js, notification.test.js, etc.
   - Demonstrates TDD structure with meaningful unit tests

6. **Configuration Files**
   - babel.config.json
   - package.json (only relevant portions like Jest config)

7. **Usage & Testing Notes**
   - How to serve the app (e.g., with a local server)
   - How to run tests (npm test)
   - How to enable notifications and mock audio alerts for testing

---


##Part 2 Prompt

I see that the final result is not exactly what we expected. The app we are aiming for should be:

1. **It is not a countdown** – it should be a **stopwatch**, starting from zero and counting up, displaying seconds, minutes, and hours properly formatted.

2. **A valuable addition** would be the ability to choose between **stopwatch** and **countdown** modes.

3. **Update the tests** to ensure they work correctly after the changes.
