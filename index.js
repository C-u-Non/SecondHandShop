var express = require('express'); //import thư viện express
var app = express(); //khởi tạo đối tượng app

app.set('view engine', 'ejs');  //set view engine to ejs
app.set("views", 'views');  //set views to component
// app.use(express.static("public"));  //set static path to public folder
app.use('/public', express.static('public'));
app.listen(3000); //start listening on port 3000


app.get("/", function (req, res) { //get request "/" from server
    res.render('index');
});