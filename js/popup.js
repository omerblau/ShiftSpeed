// Helper function to determine if a URL is restricted.
function isRestrictedUrl(url) {
    if (!url) return true;
    return (
        url.startsWith("chrome://") ||
        url.startsWith("chrome-extension://") ||
        url.includes("chrome.google.com/webstore")
    );
}

// Set the video playback speed in the active tab.
function setVideoSpeed(speed) {
    const video = document.querySelector("video");
    if (video) {
        video.playbackRate = speed;
        return `Playback speed set to ${speed}x`;
    }
    return "No video element found.";
}

let statusTimeout = null;
function updateStatus(msg) {
    const statusEl = document.getElementById("status");
    if (!statusEl) return;
    statusEl.textContent = msg;
    clearTimeout(statusTimeout);
    statusTimeout = setTimeout(() => (statusEl.textContent = ""), 3000);
}

const applySpeed = (speed) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (isRestrictedUrl(tab.url)) {
            updateStatus("Cannot change speed on this page.");
            return;
        }
        chrome.scripting.executeScript(
            {
                target: { tabId: tab.id },
                func: setVideoSpeed,
                args: [speed],
            },
            (results) => {
                if (chrome.runtime.lastError) {
                    updateStatus("Error: " + chrome.runtime.lastError.message);
                } else if (results && results[0].result) {
                    updateStatus(results[0].result);
                }
            }
        );
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const speedInput = document.getElementById("speedInput");
    const speedSlider = document.getElementById("speedSlider");
    const setSpeedButton = document.getElementById("setSpeed");
    const presets = document.querySelectorAll(".preset");

    let isSliderDragging = false;
    let isInputFocused = false;

    speedSlider.addEventListener("mousedown", () => (isSliderDragging = true));
    speedSlider.addEventListener("touchstart", () => (isSliderDragging = true));
    speedSlider.addEventListener("mouseup", () => (isSliderDragging = false));
    speedSlider.addEventListener("touchend", () => (isSliderDragging = false));

    speedInput.addEventListener("focus", () => (isInputFocused = true));
    speedInput.addEventListener("blur", () => (isInputFocused = false));

    // Fetch the current speed from the active tab if allowed.
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (isRestrictedUrl(tab.url)) {
            updateStatus("This page is not supported.");
            return;
        }
        chrome.scripting.executeScript(
            {
                target: { tabId: tab.id },
                func: () => {
                    const video = document.querySelector("video");
                    return video ? video.playbackRate : 1;
                },
            },
            (results) => {
                const currentSpeed = (results && results[0].result) || 1;
                document.getElementById("currentSpeed").textContent =
                    currentSpeed === 1 ? "1x" : `${currentSpeed}x`;
                if (!isSliderDragging) speedSlider.value = currentSpeed;
                if (!isInputFocused && !isSliderDragging)
                    speedInput.value = currentSpeed;
            }
        );
    });

    // Listen for rate changes from the content script.
    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.type === "RATE_CHANGE") {
            const currentRate = msg.playbackRate;
            document.getElementById("currentSpeed").textContent =
                currentRate === 1 ? "1x" : `${currentRate}x`;
            if (!isSliderDragging && !isInputFocused) {
                speedSlider.value = currentRate;
                speedInput.value = currentRate;
            }
        }
    });

    speedSlider.addEventListener("input", () => {
        if (!isInputFocused) speedInput.value = speedSlider.value;
    });

    speedSlider.addEventListener("change", () => {
        const speed = parseFloat(speedSlider.value);
        if (isNaN(speed) || speed <= 0) {
            updateStatus("Enter a valid positive number");
            return;
        }
        applySpeed(speed);
    });

    setSpeedButton.addEventListener("click", () => {
        const speed = parseFloat(speedInput.value);
        if (isNaN(speed) || speed <= 0) {
            updateStatus("Enter a valid positive number");
            return;
        }
        applySpeed(speed);
    });

    presets.forEach((button) => {
        button.addEventListener("click", () => {
            const presetSpeed = parseFloat(button.dataset.speed);
            speedInput.value = presetSpeed;
            speedSlider.value = presetSpeed;
            applySpeed(presetSpeed);
        });
    });
});
