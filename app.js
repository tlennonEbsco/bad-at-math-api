const express = require('express')
const app = express()
const port = 3001
const fileUpload = require('express-fileupload')
const fs = require('fs');
const path = require('path');
let morgan = require('morgan');

app.use(fileUpload())
app.use(morgan(':method :url :status ~:res[content-length] bytes - :response-time ms'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => res.send({message: 'Hello World!'}));

app.post('/upload', (req, res) => {
    if(!req.files) {
        return res.status(400).send('No files were uploaded.')
    }
    //In Express 4, req.files is no longer available on the req object by default. To access uploaded files on the req.files object, use multipart-handling middleware like busboy, multer, formidable, multiparty, connect-multiparty, or pez.
    
    let sampleFile = req.files.sampleFile;

    sampleFile.mv('./public/' + sampleFile.name, err => {
        if(err)
            return res.status(500).send(err);
            
        res.send('File uploaded!');
    })
}); 

app.get('/file/:name', function(req, res) {
    res.download('./public/' + req.params.name);
});

let extFilter = ['.gitignore', ''];

function filterByExtension(element) {
    var extName = path.extname(element);
    // console.log(element);
    // console.log(path.extname(element));
    return extFilter.indexOf(extName) == -1 ? true : false;
}

app.get('/file', function(req, res) {
    var files = fs.readdirSync('./public/');
    const result = files.filter(file => filterByExtension(file));
    fileNames = result;
        
    res.send({
        files: fileNames
    });
});

app.listen(port, () => console.log('"Bad At Math API" listening on port ' + port + '!'))