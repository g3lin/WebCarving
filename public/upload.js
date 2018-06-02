$(document).ready(function() {
    $('#uploadForm').submit(function() {
       $("#status").empty().text("Fichier en cours de traitement, veuillez patienter ...");
       $(this).ajaxSubmit({
           error: function(xhr) {
                status('Error: ' + xhr.status);
           },
           success: function(response) {
                //console.log(response)
                $("#status").empty().text('Fichier traité et téléchargé');
                window.location.replace(response)
           }
   });
   return false;
   });    
});