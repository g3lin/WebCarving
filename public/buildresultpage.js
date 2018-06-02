$(document).ready(function() {
    var urlParams = new URLSearchParams(window.location.search);
    var pageID = urlParams.get('id');


    document.getElementById("origimage").innerHTML += '<img src='+ pageID +'/orig />'; 
    document.getElementById("resultimage").innerHTML += '<img src='+ pageID +'/result.bmp />'; 
    document.getElementById("gifimage").innerHTML += ""; 

});