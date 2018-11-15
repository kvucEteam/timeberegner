/*function listener(event) {
    document.getElementById('ost').style.height = event.data + "px";
    alert("listened to the fucker");
}
if (window.addEventListener) {
    addEventListener("message", listener, false);
} else {
    attachEvent("onmessage", listener);
}

var geckoFrameScrolling = 'auto';

//document.write('<iframe src="index.html"  id="ost" name="bookingframe" frameborder="0" width="100%" height="" scrolling="' + geckoFrameScrolling + '" ALLOWTRANSPARENCY="true"  ></iframe>');
alert("wrote the fucker");*/
  



document.write('<iframe src="https://vucdigital.dk/timeberegner/index.html" frameborder="0" width="100%" height id="udd_plan_iframe" title="Uddannelsesplan HF"></iframe>');



var iframe_height;


var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
  var eventer = window[eventMethod];
  var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

  eventer(messageEvent,function(e) {

    console.log("e.data: " + e.data);
    // If the message is a resize frame request
    if (e.data.indexOf('resize::') != -1) {
      var height = e.data.replace('resize::', '');
      document.getElementById('udd_plan_iframe').style.height = height+'px';
    }
  } ,false);