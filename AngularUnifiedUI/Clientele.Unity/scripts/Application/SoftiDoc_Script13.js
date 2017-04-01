setTimeout(function () {
    var a = document.createElement("script");
    var b = document.getElementsByTagName("script")[0];
    a.src = document.location.protocol + "//script.crazyegg.com/pages/scripts/0017/4836.js?" + Math.floor(new Date().getTime() / 3600000);
    a.async = true; a.type = "text/javascript"; b.parentNode.insertBefore(a, b)
}, 1);

// Redirect notice
jQuery(function () {
    if (window.location.search.substr(1) === "rd=arx") {
        jQuery(".main.new-header").prepend("<div class=\"redirect-notice\" style=\"background: #ccc;\"><div class=\"container\" style=\"padding: 15px 0 15px 0;\"><div class=\"col-xs-10 col-sm-11\"><p style=\"margin: 0;font-size: 14px;\color;#D0D0D0;\">You’ve been redirected here from arx.com. ARX (Algorithmic Research, Ltd.) was acquired by DocuSign in May 2015. For more information about CoSign, visit the <a href=\"https:\/\/www.docusign.com\/products\/signature-appliance\">DocuSign Signature Appliance<\/a> page. For support questions, visit the <a href=\"https:\/\/support.docusign.com\/en\/knowledgeSearch?by=product&product=arx_cosign&topic=all\">DocuSign Support Center<\/a>.<\/p><\/div><div class=\"close col-xs-2 col-sm-1\"><div style=\"float: right;\"><p><a href=\"#\"><svg xmlns=\"http:\/\/www.w3.org\/2000\/svg\" xmlns:xlink=\"http:\/\/www.w3.org\/1999\/xlink\" version=\"1.1\" x=\"0px\" y=\"0px\" width=\"15px\" height=\"15px\" color=\"#fff\" viewBox=\"0 0 357 357\" style=\"enable-background:new 0 0 357 357;\" xml:space=\"preserve\"><g><polygon points=\"357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3     214.2,178.5   \"\/><\/g><\/svg><\/a><\/p><\/div><\/div><\/div><\/div>").slideDown("normal");
    }
    jQuery(".close").click(function (e) {
        e.preventDefault();
        jQuery(".redirect-notice").slideUp("normal", function () { jQuery(this).remove(); });
    });
});


(function () {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

var signature = document.getElementById('signature').cloneNode(true);
var framesArray = [25, 10, 45, 10, 45];
var startDelays = [0, 700, 1200, 2130, 2600];
var paths = jQuery(".stroke");
var handle = 0;

var draw = function () {
    jQuery.each(paths, function (j, path) {
        var animationFrameLength = framesArray[j];
        var currentFrame = 0;
        setTimeout(function renderFrame() {
            var progress = (currentFrame / animationFrameLength);
            currentFrame++;
            if (progress > 1) {
            } else {
                path.style.strokeDasharray = path.getTotalLength() + " " + path.getTotalLength();
                path.style.strokeDashoffset = (Math.floor(path.getTotalLength() * (1 - progress)));
                path.style.display = "block";
                handle = window.requestAnimationFrame(renderFrame);
            }
        }, startDelays[j]);
    });
};
jQuery(document).bind("scroll", function () {
    if (jQuery(window).scrollTop() >= 350) {
        draw();
        jQuery(document).unbind("scroll");
    }
});



0
