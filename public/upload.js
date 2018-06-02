$(document).ready(function() {
    $('#uploadForm').submit(function() {
       $("#status").empty().text("Fichier en cours de téléchargement, veuillez patienter ...");
       $(this).ajaxSubmit({
           error: function(xhr) {
                status('Error: ' + xhr.status);
           },
           success: function(response) {
                //console.log(response)
                $("#status").empty().text('Fichier téléchargé par le serveur, traitement en cours');
                var fileexist = false;
                //console.log(response+"/result.bmp")

                WaitForExist(response)
                        
                
                
           }
   });
   return false;
   });    
});

function WaitForExist(response)
{
    var url = response+"/result.bmp"
    var image = new Image();
    image.src = url;

    image.onload = function() {
        // image exists and is loaded
        $("#status").empty().text('Fichier traité, redirection ...');
        window.location.replace("result?id="+response);
    }
    image.onerror = function() {
        // image did not load
        console.log('waiting')
        setTimeout(function(){WaitForExist(response)},1000);
        
       
    }

    
}
