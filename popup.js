// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function sende(obj){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {        
    chrome.tabs.sendMessage(tabs[0].id, obj, function(response) {});
    return true;
  });
}

function saveVideo(){
  var label = document.getElementById('label').value;
  sende({func:'save',label:label});
} 

function loadContent(){
  chrome.storage.sync.get({videos:[]},(vids)=>{
    render(vids.videos);
    // chrome.extension.getBackgroundPage().console.log(vids);
  });
}

function render(videos){
  var con = document.getElementById('videos');
  chrome.extension.getBackgroundPage().console.log(videos);

}

function deleteAll(){
  chrome.storage.sync.remove('videos',()=>{});
}


document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('save').addEventListener('click',function(){
    saveVideo();    
  })
  
  document.getElementById('load').addEventListener('click',function(){
    loadContent();
  });
  
  document.getElementById('delete').addEventListener('click',function(){
    deleteAll();
  });
  
  document.getElementById('label').addEventListener('blur',function(){
    chrome.extension.getBackgroundPage().console.log(this.value);
  });
  
  
  loadContent();
  
  
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var video  = document.querySelector('video');
    chrome.extension.getBackgroundPage().console.log(request.time);
    if(request.func == 'saved'){
      chrome.extension.getBackgroundPage().console.log(request);
      chrome.storage.sync.get({videos:[]},(vids)=>{
        var videos = vids.videos;
        videos[request.url] = {time:request.time,label:request.label};
        chrome.storage.sync.set({videos:videos},(vids)=>{});
        chrome.extension.getBackgroundPage().console.log(vids);
      });
    }
  });