const express = require('express')
const app = express()
const port = 3001
const reload = require('reload')
const fileUpload = require('express-fileupload')
const fs = require('fs');

var fileNames = [];

app.use(fileUpload())
app.set('port', process.env.PORT || 3001)

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

app.get('/file', function(req, res) {
    if(fileNames.length === 0) {
        var files = fs.readdirSync('./public/');
        fileNames = files;
    }
        
    res.send({
        files: fileNames
    });
});

reload(app);

app.listen(port, () => console.log('Example app listening on port ' + port + '!'))