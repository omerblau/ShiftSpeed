(() => {
    const attachListener = (video) => {
        video.addEventListener("ratechange", () => {
            chrome.runtime.sendMessage({
                type: "RATE_CHANGE",
                playbackRate: video.playbackRate,
            });
        });
    };

    let video = document.querySelector("video");
    if (video) {
        attachListener(video);
    } else {
        const observer = new MutationObserver(() => {
            video = document.querySelector("video");
            if (video) {
                attachListener(video);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
