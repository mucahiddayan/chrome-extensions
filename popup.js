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
  chrome.extension.getBackgroundPage().console.log(label);
  sende({func:'save',label:label});
} 

function loadContent(){
  chrome.storage.sync.get({videos:[]},(vids)=>{
    render(vids.videos);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
      var vi  = vids.videos.filter((e)=>e[tabs[0].url]);
      document.getElementById('label').value = vi[0][tabs[0].url].label;
    });
    
    [].map.call(document.querySelectorAll('.video-title'),(a)=>{
      a.addEventListener('click',(e)=>{
        // sende({func:'open',url:e.target.id,time:e.target.dataset.time});
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
          var url = tabs[0].url;
          if(url == e.target.id){
            sende({func:'open',url:e.target.id,time:e.target.dataset.time});
          }else{
            sende({func:'openW',url:e.target.id,time:e.target.dataset.time});
            /* chrome.windows.create({'url': e.target.id, 'type': 'popup',width:500,height:500}, function(window) {
              chrome.extension.getBackgroundPage().console.log(window);
            }); */
          }          
        });
        
      });
    });
    chrome.extension.getBackgroundPage().console.log(vids);
  });
}

function render(videos){
  var container = document.getElementById('videos');
  chrome.extension.getBackgroundPage().console.log(videos);
  var content   = extractAndWrapVideos(videos);
  container.innerHTML = content;
}

function extractAndWrapVideos(videos){
  var container = '<div class="videos-wrapper"><ul>';
  for(i in videos){
    for (a in videos[i]){
      container += '<li class ="video">';
      container += `<div class ="video-title" data-time="${videos[i][a].time}" id="${a}">${videos[i][a].label}</div>`;
      container += '</li>';
    }
  }
  
  container += '</ul></div>'; // ends wrapper
  return container;
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
    // chrome.extension.getBackgroundPage().console.log(this.value);
  });
  
  loadContent();
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var video  = document.querySelector('video');
    chrome.extension.getBackgroundPage().console.log(request.time);
    if(request.func == 'saved'){
      chrome.extension.getBackgroundPage().console.log(request);
      save(request);
    }
  });
  
  function save(request){
    chrome.storage.sync.get({videos:[]},(vids)=>{
      var videos = vids.videos;
      var index = videos.findIndex(e=>e[request.url]);
      if(index > -1){
        videos[index] = {[request.url]:{time:request.time,label:request.label}};        
      }else{
        videos.push({[request.url]:{time:request.time,label:request.label}});
      }      
      chrome.storage.sync.set({videos:videos},()=>{});
      chrome.extension.getBackgroundPage().console.log(vids,videos);
    });
  }