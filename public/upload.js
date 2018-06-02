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

                while(!fileexist){
                    setTimeout(function () {
                        if (UrlExists(response+"/result.bmp")){
                            fileexist = true;
                        }
                      }, 5000);
                        
                }
                $("#status").empty().text('Fichier traité, redirection ...');
                window.location.replace("result?id="+response);
           }
   });
   return false;
   });    
});

function UrlExists(url)
{
    var img = new Image();
    img.src = url;
    return img.height != 0;
}