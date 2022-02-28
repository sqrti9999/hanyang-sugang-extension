/*
  NOTE: Extensions might only support `euc-kr`?
*/

// When the button is clicked, inject hoverHandler into current page
addHandler.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Inject stylesheet
  chrome.scripting.insertCSS({
    target: {tabId: tab.id},
    files: ["./tooltip/tooltip.css"]
  });


  // Inject function
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["./tooltip/tooltip.js"],
  });
});
