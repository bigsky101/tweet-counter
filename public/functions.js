document.querySelector("#submit").addEventListener("click", sendRequest);
document.querySelector("#input").addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
        sendRequest();
    }
});

window.setTimeout(countRequests, 60000)
countRequests();

function sendRequest() {
  var u = document.querySelector("#user").value;
  var s = document.querySelector("#startdate").value;
  var e = document.querySelector("#enddate").value;
  
  if (u.length < 1 || s.length < 5 || e.length < 5) return;
  
  var url ="/count-tweets?user=" + u + "&start=" + s + "&end=" + e;
  
  // console.log(url);
  
  httpGetAsync(url, x => {
    x = JSON.parse(x);
    console.log("Data received: " + JSON.stringify(x));
    var display = document.querySelectorAll("[id^=display-]");
    
    for (var d = 0; d < display.length; d++) {
      display[d].innerHTML = x[display[d].id.split("-")[1]];
    }
    
    countRequests(); 
    
  });
  
}

function countRequests() {
  var d = document.querySelector("#display-requests");
  d.classList = "hidden";
  var url = "/get-requests";
  
  httpGetAsync(url, x => {
    console.log("Got " + x + " requests.")
    d.innerHTML = Math.round(x / 15) / 100 + "%";
    d.classList = "";
  });
}

function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      console.log("executing callback with data: " + xmlHttp.responseText);
      callback(xmlHttp.responseText);
    }
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous 
  xmlHttp.send(null);
}