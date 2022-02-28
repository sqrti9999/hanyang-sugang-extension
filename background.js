// Debug
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request.status);
    sendResponse();
  }
);

// TODO: Attach handler on every refresh
