**Product Name:**  "PromptPal"

**1. Introduction**

This document outlines the requirements for a minimalist web-based teleprompter application. The app should prioritize simplicity, user-friendliness, and privacy. It will be built using HTML, CSS, and JavaScript.

**2. Target Audience**

Content creators (YouTubers, educators, presenters) who need a straightforward and privacy-focused tool for recording videos with scripted content.

**3.  Key Features**

* **Text Input:** A large, clear text area for users to paste or type their script.
* **Start/Pause:**  Buttons to start and pause the scrolling of the script.
* **Speed Control:** A slider or input field to adjust the scrolling speed.
* **Font Size Control:**  A slider or input field to adjust the font size of the script.
* **Fullscreen Mode:** An option to enter fullscreen mode for distraction-free prompting.
* **Optional Features (if desired):**
    * **Mirroring:** An option to mirror the text (useful for using a teleprompter with a beamsplitter).
    * **Color Customization:** Allow users to change the text and background colors for better readability.
    * **Keyboard Shortcuts:** Implement keyboard shortcuts for start/pause, speed control, and fullscreen.
    * **Save Script:**  Allow users to save their scripts locally in their browser.

**4. Design Considerations**

* **Minimalist Interface:** The design should be clean, uncluttered, and focused on readability. 
* **Responsive Design:** The app should work well on different screen sizes (desktops, laptops, tablets).
* **Accessibility:** Consider accessibility guidelines (e.g., sufficient color contrast, keyboard navigation) to make the app usable for everyone.

**5. Technical Requirements**

* **Front-end Technologies:** HTML, CSS, JavaScript
* **No Server-Side Components:** The app should be entirely client-side to ensure privacy. No data should be sent to a server.
* **Browser Compatibility:**  The app should work on modern web browsers (Chrome, Firefox, Safari, Edge).

**6. Privacy**

* **Data Storage:**  All script data should be stored locally in the user's browser (e.g., using LocalStorage or SessionStorage).
* **No Data Collection:** The app should not collect any user data or track user activity.

**7. Testing**

* **Usability Testing:** Conduct testing with target users to ensure the app is easy to use and meets their needs.
* **Cross-Browser Testing:** Test the app on different browsers and devices to ensure compatibility.

**8. Deployment**

* The app should be easily deployable to a web server or hosting platform (e.g., GitHub Pages, Netlify).