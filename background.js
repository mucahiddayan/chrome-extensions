chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      var video  = document.querySelector('video');
      chrome.extension.getBackgroundPage().console.log(request.time);
      if(request.func == 'saved'){
        chrome.extension.getBackgroundPage().console.log(request);
      }
    });