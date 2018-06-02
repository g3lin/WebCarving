const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
 
var bodyParser =    require("body-parser");
var multer  =   require('multer');

var app =   express();
app.use(bodyParser.json());

var fs = require('fs')


 // PARTIE DE GESTION D'ENREGISTREMENT SUR LE DISQUE
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname+'/user_uploads/temp');
    //console.log(file)
  },


  filename: function (req, file, callback) {
    //callback(null, Date.now() + '-' + file.originalname);
    callback(null, "orig");
    //console.log(file)
  }
});
 // fonction principale d'appel pour l'upload
var upload = multer({ storage : storage }).array('userPhoto',1);

//fonction de traitement du pipe des logs python
var uint8arrayToString = function(data){
    return String.fromCharCode.apply(null, data);
};
  
 
  
//PARTIE SERVEUR WEB EXPRESS 
app.get('/',function(req,res){
      res.sendFile(__dirname + "/public/index.html");
});

app.post('/api',function(req,res){
    // call the multer fonction
    fs.mkdirSync(__dirname+"/user_uploads/temp");
    fs.mkdirSync(__dirname+"/user_uploads/temp/gif");

    upload(req,res,function(err) {
        if(err) {
            // console.log(err)
            // console.log(req.body);
            // console.log(req.files);
            return res.end("Error uploading file.");
        }
        //console.log(res)
        console.log("File is uploaded to temp folder");
        //res.send("The file is uploaded !");
    
        var foldername = Date.now()
        fs.rename(__dirname+'/user_uploads/temp', __dirname+'/user_uploads/'+foldername, function (err) {
            if (err) throw err;
            console.log('file is moved');
       

            var pathSeam = __dirname+'/user_uploads/'+foldername;
            var modeSeam = req.body.modeSeam;
            var horizSeam = req.body.horizSeam;
            var vertiSeam = req.body.vertiSeam;
            
            console.log('Python exec is called')
            var spawn = require("child_process").spawn;
            var pythonProcess = spawn('python',[__dirname+"/python/PyCarving/main.py", pathSeam+'/orig' , modeSeam, horizSeam , vertiSeam], {cwd: pathSeam});

            //log python messages
            pythonProcess.stdout.on('data', (data) => {
                console.log(uint8arrayToString(data));
            });

            //log python errors
            pythonProcess.stderr.on('data', (data) => {
                // As said before, convert the Uint8Array to a readable string.
                console.log(uint8arrayToString(data));
            });

            //log exit and use it
            pythonProcess.on('exit', (code) => {
                console.log("Process quit with code : " + code);
                res.send( foldername+"/result.bmp");
            });
        });

        
    });
    
});

// POUR TOUS LES AUTRES FICHIERS REGARDER DANS CES REPERTOIRES
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'user_uploads')))



// LANCER LE SERVEUR NODE
app.listen(PORT,function(){
    console.log(`Listening on ${ PORT }`);
});