var x, y = null;
var d = document;
var b = $('body')[0];

function getCookie() {
  return d.cookie;
}

function isHasAcceptedPolicy() {
  return (null != getCookie().match(/acceptedPolicy=true/));
}

async function acceptPolicy() {
  var banner = $('#policy-banner')[0];
  banner.style.opacity = 0;
  writeCookie("acceptedPolicy", true);
  await sleep(1000);
  banner.style.display = "none";
}


function writeCookie(cookieName, cookieValue, ttl = 14) {
  var date = new Date();
  date.setTime(date.getTime() + ttl * 24 * 3600 * 1000);
  d.cookie = cookieName + "=" + cookieValue + "; expires=" + date.toUTCString() + "; " + "domain=" + window.location.hostname
+ "; path=/";
}


function toggleTheme() {
  if (!isHasAcceptedPolicy()) {
    return;
  }

  $('body').toggleClass('dark-theme').toggleClass('light-theme');
  writeCookie("darkTheme", $('body').hasClass('dark-theme'));
}


function toggleDyslexicFont() {
  if (!isHasAcceptedPolicy()) {
    return;
  }

  $('body').toggleClass('dyslexic');
  writeCookie("dyslexic", $('body').hasClass('dyslexic'));
}


function loadYouTube() {
  var videos = d.getElementsByClassName('youtube');
  for (var i = 0; i < videos.length; i++) {
    videos[i].innerHTML = d.getElementById(videos[i].getAttribute('data-videoid')).innerHTML;
  }
}

function restoreSettingsFromCookie() {
  if (!isHasAcceptedPolicy()) {
    var bannerClass = $('.policy-banner');
    for(var i = 0; i < bannerClass.length; i++)
      bannerClass[i].style.display = "block";
    return;
  }

  if (null != getCookie().match(/darkTheme=false/)) {
    $('#dark-mode').prop('checked', true);
    toggleTheme();
  }
  if (null != getCookie().match(/dyslexic=true/)) {
    $('#dyslexic').prop('checked', true);
    toggleDyslexicFont();
  }
  if (null != getCookie().match(/fontSize/)) zoom((getCookie().match(/(^| )fontSize=([^;]+)/))[2] - 12);
  acceptPolicy();
}

function g(evt) {
  return evt.touches;
}

function touchStart(evt) {
  const firstTouch = g(evt)[0];
  x = firstTouch.clientX;
  y = firstTouch.clientY;
};

function touchMove(evt) {
  if (null == x || null == y) {
    return;
  }

  var xu = evt.touches[0].clientX;
  var yu = evt.touches[0].clientY;

  var xd = x - xu;
  var yd = y - yu;

  if (Math.abs(xd) > 11 && Math.abs(xd) > 2 * Math.abs(yd)) {
    if (xd > 0) {
      loadPage("next");
    } else {
      loadPage("previous");
    }
  }

  x = null;
  y = null;
};

function loadPage(partId) {
  var href = $('#' + partId)[0].href;
  if ("" == href) return;

  window.location.href = href;
}

function zoom(points) {
  if (!isHasAcceptedPolicy()) {
    return;
  }

  var fontSize = (parseInt(b.style.fontSize, 10) || 12) + points;
  if (fontSize > 20) fontSize = 22;
  if (fontSize < 12) fontSize = 10;
  b.style.fontSize = fontSize + 'pt';
  writeCookie("fontSize", fontSize);
}


function clearCookies() {
  writeCookie("acceptedPolicy", '', -1);
  writeCookie("activateGoogleAnalytics", '', -1);
  writeCookie("fontSize", '', -1);
  writeCookie("darkTheme", '', -1);
  writeCookie("condensed", '', -1);
  writeCookie("dyslexic", '', -1);
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function setUpPageForUsers() {
  await sleep(200);
  var isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

  if (isMobile) {
    d.addEventListener('touchstart', touchStart, false);
    d.addEventListener('touchmove', touchMove, false);
    document.getElementById('mobile-top').scrollIntoView(true);
    toggleAllAccordions();
  }

  d.getElementsByTagName("html")[0].className = "animated";

  $('#dark-mode').change(toggleTheme);
  $('#dyslexic').change(toggleDyslexicFont);
}

function toggleAccordion(e) {
  e.classList.toggle("inactive");
  e.classList.toggle("active");
}


function toggleAllAccordions() {
  document
    .querySelectorAll('.inactive')
    .forEach(e => {
      toggleAccordion(e);
    });
}

restoreSettingsFromCookie();
setUpPageForUsers();
