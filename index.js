var bodyParser = require('body-parser')
var express = require('express'); //import thư viện express
var app = express(); //khởi tạo đối tượng app
var db = require('./Models/db'); // gọi db
app.set('view engine', 'ejs');  //set view engine to ejs
app.set("views", 'views');  //set views to component
app.use(express.static("public"));  //set static path to public folder
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

var server = require('http').Server(app);
var io = require('socket.io')(server);

var chatPersionId = '';

//multer
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()  + "-" + file.originalname)
    }
});  
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/jpg" || file.mimetype=="image/png"|| file.mimetype=="image/bmp"){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("anh");


server.listen(3000, () => {
    console.log('listening on port 3000');
}); //start listening on port 3000


io.on('connection', function (socket) {
    console.log(socket.id + ' connected');// alert connection

    // socket.on('sendMsg', function (data) {
    //     console.log(data);
    // });

    socket.on('sendID', function (data) { //nhan id tu client
        chatPersionId = data;
        console.log(`chat persion id: ${data} `);
    });

    // cấu hình gửi tin nhắn cho client

    // kiem tra ngat ket noi
    socket.on('disconnect', function () { //alert disconnect
        console.log(socket.id + ' disconnected');
    });
});

function makecode(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

app.get("/", function (req, res) { //===============================================get request "/" from server
    let listProduct = [];
    let sql = 'SELECT * FROM `product` LIMIT 25';
    db.query(sql, function (err, data) {
        data.forEach(function (item) {
            listProduct.push(item);
        });
        // listProduct.forEach(function (item) {
        //     console.log(item.id);
        // });

        if (err) {
            res.json({ 'kq': 0 });
        } else {
            res.render('index', { listProduct: listProduct });
        }
    });


});

app.get("/login", function (req, res) { //==========================================trả về form Đăng nhập
    res.render('login');
})

app.post("/login", function (req, res) { //=======================kiểm tra đăng nhập
    let user = req.body.user;
    let pwd = req.body.pwd;

    let sql = `select count(*) as req from user where user_name='${user}' and pwd='${pwd}'`;


    db.query(sql, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            // console.log(data[0].req);
            if (data[0].req == 1) {
                token = makecode(200);
                let setToken = `update user set token='${token}' WHERE user_name='${user}'`;
                db.query(setToken);
                res.json({ 'stt': 1, 'token': token });
            } else {
                res.json({ 'stt': 0 });
            }
        }
    });

});



app.get("/chat", function (req, res) {//============================================chat
    res.render('chat');
})

app.get("/p", function (req, res) {//================================================product detail
    res.render('productDetail');
});

app.get("/profile", function (req, res) {
    res.render('profile');
});

app.get("/addProduct", function (req, res) {
    res.render('addProduct');
});

app.post("/addProduct", function (req, res) {

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          console.log("A Multer error occurred when uploading."); 
        } else if (err) {
          console.log("An unknown error occurred when uploading." + err);
        }else{
            let sql=`INSERT INTO product(name,img,detail,userID,cost) VALUES('${req.body.tensanpham}','${req.file.filename}','${req.body.motasanpham}','${req.body.user}','${req.body.giaban}')`;
            // console.log(req.file.filename);
            db.query(sql, function (err, data){
                if(err){

                }else{
                    res.render('profile');
                }
            })
        }

    });
})