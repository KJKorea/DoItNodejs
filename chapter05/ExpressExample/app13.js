var express = require('express'), 
    http = require('http'), 
    path = require('path');

var bodyParser = require('body-parser');
var expressErrorHandler = require('express-error-handler');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// load middleware for uploading file
var multer = require('multer');
var fs = require('fs');

var storage = multer.diskStorage({
  destination : function(req, file, cb) {
    cb(null, 'uploads');
  },
  filename : function(req, file, cb) {
    // console.log(file);
    file.uploadedFile = path.parse(file.originalname);
    // console.log(uploadedFile);
    cb(null, file.uploadedFile.name + '-' + Date.now() + file.uploadedFile.ext);
  }
});

var upload = multer({
  limits: {
    files: 10,
    fileSize: 1024 * 1024
  },
  storage: storage
});

var app = express();

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({
  secret: 'my key',
  resave: true,
  saveUninitialized: true
}));

// use multer middleware (not recommended)
// app.use(multer({
//   dest: 'uploads',
//   putSingleFilesInArray: true,
//   limits: {
//     files: 10,
//     fileSize: 1024 * 1024
//   },
//   rename: function(fieldname, filename) {
//     return filename + Date.now();
//   },
//   onFileUploadStart: function(file) {
//     console.log('start to upload file : %s', file.originalname);
//   },
//   onFileUploadComplete: function(file, req, res) {
//     console.log('complete to upload file : %s -> %s', file.fieldname, file.path);
//   },
//   onFileSizeLimit: function(file) {
//     console.log('exceed limited file size : %s', file.originalname);
//   }
// }).array());

app.post('/process/photo', upload.array('photo'), function(req, res) {
  console.log('called /process/photo - kj');

  var files = req.files;

  // set variable for saving infor for current file
  var originalname = '',
      name = '',
      mimetype = '',
      size = 0;
  if(Array.isArray(files)) { // something in array
    console.log('count of files in array : %d', files.length);
    for (var index = 0; index < files.length; index++) {
      originalname = files[index].originalname;
      name = files[index].filename;
      mimetype = files[index].mimetype;
      size = files[index].size;
    }
  } else { // empty in array 
    console.log('count of files : 1');
    originalname = files.originalname;
    name = files.filename;
    mimetype = files.mimetype;
    size = files.size;
  }

  console.log('information of current file : %s, %s, %s, %d', originalname, name, mimetype, size);

  // response to client
  res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
  res.write('<h3>success to upload file</h3>');
  res.write('<hr>');
  res.write('<p>original name of file  : ' + originalname + ' -> saved name of file : ' + name + '</p>');
  res.write('<p>MIME TYPE : ' + mimetype + '</p>');
  res.write('<p>size of file : ' + size + '</p>');
  res.end();

});

app.post('/process/photo-0', function(req, res) {
  console.log('called /process/photo');

  var files = req.files;

  // set variable for saving infor for current file
  var originalname = '',
      name = '',
      mimetype = '',
      size = 0;
  
  if(Array.isArray(files)) { // something in array
    console.log('count of files in array : %d', files.length);
    for (var index = 0; index < files.length; index++) {
      originalname = files[index].originalname;
      name = files[index].name;
      mimetype = files[index].mimetype;
      size = files[index].size;
    }
  } else { // empty in array 
    console.log('count of files : 1');
    console.log(files);
    originalname = files.originalname;
    name = files.name;
    mimetype = files.mimetype;
    size = files.size;
  }

  console.log('information of current file : %s, %s, %s, %d', originalname, name, mimetype, size);

  // response to client
  res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
  res.write('<h3>success to upload file</h3>');
  res.write('<hr>');
  res.write('<p>original name of file  : ' + originalname + ' -> saved name of file : ' + name + '</p>');
  res.write('<p>MIME TYPE : ' + mimetype + '</p>');
  res.write('<p>size of file : ' + size + '</p>');
  res.end();
});

app.get('/process/users/:id', function(req, res) {
  // get token
  var paramId = req.params.id;

  console.log('processed /process/users and token %s', paramId);

  res.writeHead(200, {'Contetn-Type':'text/html;charset=utf8'});
  res.write('<h1>Response from Express Server</h1>');
  res.write('<div><p>Param id : ' + paramId + '</p></div>');
  res.end();
});

// check cookie
app.get('/process/showCookie', function(req, res) {
  console.log('called /process/showCookie');

  res.send(req.cookies);
});

// check name of cookie
app.get('/process/setUserCookie', function(req, res) {
  console.log('called /process/setUserCookie');

  // set cookie
  res.cookie('user', {
    id: 'mike',
    name: 'girl',
    authorized: true
  }); 
  // res.cookie('user', 1);
  
  res.redirect('/process/showCookie');
});

app.get('/process/product', function(req, res) {
  console.log('called /process/product');

  if(req.session.user) {
    res.redirect('/public/product.html');
  } else {
    res.redirect('/public/login2.html');
  }
});

app.post('/process/login', function(req, res) {
  console.log('called /process/login');

  var paramId = req.body.id;
  var paramPassword = req.body.password;

  if(req.session.user) {
    // logged in
    console.log('already logged in and move product page');

    res.redirect('/public/product.html');
  } else {
    // save session
    req.session.user = {
      id: paramId,
      name: 'girl',
      authorized: true
    };

    res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Logged in successfully</h1>');
    res.write('<div><p>Param id: ' + paramId + '</p></div>');
    res.write('<div><p>Param password: ' +paramPassword + '</p></div>');
    res.write('<br><br><a href="/public/product.html">Move to product page</a>');
    res.end();
  }
});

app.get('/process/logout', function(req, res) {
  console.log('called /process/logout');

  if(req.session.user) {
    // logged in
    console.log('Logged out');

    req.session.destroy(function(err) {
      if(err) throw err;

      console.log('Destroyed session and logged out');
      res.redirect('/public/login2.html');
    });
  } else {
    // logged out
    console.log('Not logged in');

    res.redirect('/public/login2.html');
  }
});

var errorHandler = expressErrorHandler({
  static: {
    '404': './public/404.html'
  }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );

http.createServer(app).listen(3000, function() {
  console.log('Started Express Server with port 3000');
});
