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


  
 
  
//PARTIE SERVEUR WEB EXPRESS 
app.get('/',function(req,res){
      res.sendFile(__dirname + "/public/index.html");
});

app.post('/api',function(req,res){
    // call the multer fonction
    fs.mkdirSync("user_uploads/temp");

    upload(req,res,function(err) {
        if(err) {
            // console.log(err)
            // console.log(req.body);
            // console.log(req.files);
            return res.end("Error uploading file.");
        }
        console.log(res)

        res.end("File is uploaded");
    });
    var foldername = Date.now()
    fs.rename(__dirname+'user_uploads/temp', __dirname+'user_uploads/'+foldername, function (err) {
        if (err) throw err;
        console.log('renamed complete');
      });

    var pathSeam = __dirname+'user_uploads/'+foldername;
    var modeSeam = request.body.modeSeam;
    var horizSeam = 10;
    var vertiSeam = 10;

    var spawn = require("child_process").spawn;
    var pythonProcess = spawn('python',[__dirname+"python/PyCarving/main.py", pathSeam , modeSeam, horizSeam , vertiSeam], "cwd:" + pathseam);
    res.sendFile(__dirname + pathSeam+"/result.bmp");

    
});

// POUR TOUS LES AUTRES FICHIERS REGARDER DANS CES REPERTOIRES
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'user_uploads')))



// LANCER LE SERVEUR NODE
app.listen(PORT,function(){
    console.log(`Listening on ${ PORT }`);
});