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




setInterval(function() {
    resize_iframe();
}, 33)

document.write('<iframe src="index.html"  frameborder="2" width="100%" height id="iframe_23055ac9db72fbd93568702ba3765db5b4591" frameborder="0" width="100%" height=""></iframe>');

var iframe_height;

$(window).resize(function() {
    //resize_iframe();

});

$("document").ready(function() {
    //alert("ready");
    //resize_iframe();
});


function resize_iframe() {
    var new_height = $('iframe').contents().height();
    console.log("new_height:" + new_height+ ",  iframe_height: " + iframe_height)
    if(iframe_height != new_height){
    
    iframe_height = new_height;
}

    $("iframe").css("height", new_height + "px");
}
