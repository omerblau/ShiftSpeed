# SpeedShift: Video Playback Speed Controller

## Overview

SpeedShift is a Chrome extension that lets you control video playback speeds beyond the native limits. Developed during a study session with Panopto, it allows you to speed up videos more than the usual 2x limit—perfect for reviewing content quickly.

## My Journey

While preparing for a test using Panopto, I ran into a limitation: the video player only allowed speeds up to 2x. I needed a faster playback option, so I started experimenting in the Developer Tools. I discovered that by injecting a script, I could override the playback speed to whatever I needed.

I used this hack for a while, but it quickly became annoying to repeat the process every time. I wondered, "What if others faced this issue too?" I searched for an existing extension but found one that looked promising yet was clunky and required manual adjustments.

Believing I could create a smoother solution, I spent three days building SpeedShift. It was the first time I pushed my code to the real world—a fun and exciting experience. I hope this extension proves helpful to anyone needing more control over video playback.

## How It Works

SpeedShift uses Chrome's scripting API to inject a small script into web pages containing video elements. This script:

-   Adjusts the video’s playback rate beyond the default limits.
-   Listens for playback rate changes using event-driven updates, ensuring the extension's UI reflects the current speed instantly.
-   Provides an intuitive user interface with a sleek slider, number input, and preset options (e.g., .25x, .5x, 1x, 2x) for quick adjustments.

## Code and Structure

The project is organized into a few key directories and files:

-   **css/** – Contains the styles for the popup.
-   **js/** – Holds JavaScript files:
    -   `popup.js` manages the extension’s UI and interactions.
    -   `content.js` handles the injection of code into pages with video elements.
-   **manifest.json** – Configures the extension, including permissions and content scripts.
-   **popup.html** – The HTML file for the extension's user interface.

## Final Thoughts

SpeedShift was born out of a personal need and a desire to make video review more efficient. It’s a project that holds a special place in my journey as a developer—the first time I shared my work with the world. I hope you enjoy using SpeedShift and that it makes your video watching experience a little bit better.
