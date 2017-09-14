var btn = document.createElement('button');
btn.onclick = function(){
  chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
    console.log(response.farewell);
  });
}

btn.textContent = 'Save';



chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var video  = document.querySelector('video');
    console.log(video,request.func);
    if(request.func == 'save' && typeof video !== 'undefined' && video !== null){
      console.log(video.currentTime);
      var label = request.label !== '' && typeof request.label !== 'undefined' ? request.label : document.title;
      console.log(label);
      saveVideo(video,label);
      // return true;
    }else{
      console.log('There is no video');
    }
    if(request.func == 'open'){
      console.log(request.url);
      var vd = document.querySelector('video');
      console.log(vd,request.time);
      vd.currentTime = request.time;      
    }
    if(request.func == 'openW'){
      location.href = request.url;
    }
  });

function saveVideo(video,label){
  
  chrome.runtime.sendMessage({func: "saved",time:video.currentTime,url:location.href,label:label}, function(response) {
    console.log(response);
    return true;
  });
 /*  chrome.storage.sync.get({videos:[]},(vids)=>{
    var videos = vids.videos;
    console.log(vids,typeof videos);
    videos[location.href]=video.currentTime;
    chrome.storage.sync.set({videos:videos},(res)=>console.log(res));
    
  }); */
  
  /* var videos = typeof syncStorage.videos == 'undefined' || !Array.isArray(localStorage.videos)?[]:localStorage.videos;
  if(typeof video !== 'undefined'){
    videos.push({url:location.href,time:video.currentTime});
    localStorage.setItem('videos',JSON.stringify(videos));
  } */
}


