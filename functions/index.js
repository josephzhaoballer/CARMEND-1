const functions = require('firebase-functions');
const firebase = require('firebase');
const cors = require('cors')({origin:true});
const Busboy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');
const gcconfig = {
    projectId :"carmend-52299",
    keyFilename:"carmend-52299-firebase-adminsdk-aq9t4-f05c1dffc2.json"
}

const {Storage} = require("@google-cloud/storage");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.receivedMedia = functions.storage.object().onFinalize(event=>{
    const storage = new Storage();
    const bucketName = 'carmend-52299.appspot.com';
    const filename = event.name;
    const options = {
        action: 'read',
        expires: '03-17-2049',
      };
      storage
      .bucket(bucketName)
      .file(filename)
      .getSignedUrl(options)
      .then(results => {
        const url = results[0];

        firebase.initializeApp(config);
        firebase.database().ref('/').set({
            url:url
        })
        console.log(url);
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
    return;
});
exports.uploadMedia = functions.https.onRequest((req, res) => {
    cors(req,res,()=>{
        if(req.method!=='POST'){
            return res.status(500).json({
                message: "not allowed"
            });
        }
        let uploadData = null;
        let filenameneeded = null
        const busboy = new Busboy({headers: req.headers});
        busboy.on('file',(fieldName,file,fileName,encoding,mimetype)=>{
            const filePath = path.join(os.tmpdir(),fileName);
            filenameneeded = fileName;
            uploadData = {file:filePath,type:mimetype};
            file.pipe(fs.createWriteStream(filePath));
        });
        busboy.on('finish',()=>{
            const storage = new Storage(gcconfig);
            const bucket = storage.bucket('carmend-52299.appspot.com')
            let url = null;
            const bucketName = 'carmend-52299.appspot.com';
            const options = {
                action: 'read',
                expires: '03-17-2049',
              };
            storage
            .bucket(bucketName)
            .file(filenameneeded)
            .getSignedUrl(options)
            .then(results => {
                 url = results[0];
                console.log(url);
            })
            .catch(err => {
            console.error('ERROR:', err);
            });
            bucket.upload(uploadData.file,{
                uploadType: 'media',
                metadata:{
                    metadata:{
                        contentType:uploadData.type
                    }
                }
            }).then(()=>{
                res.status(200).json({
                    message:"it worked",
                    url:url
                });
                
            }).catch((err)=>{
                res.status(500).json({
                    message: err
                });
            });
        });
        busboy.end(req.rawBody);
        
    });
});
    
