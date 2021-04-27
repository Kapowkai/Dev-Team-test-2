let express = require('express');// เรียกใช้ Express
let router = express.Router();
var bodyParser = require('body-parser')
let ejs = require('ejs'),users = ['geddy', 'neil', 'alex'];
var data =[];
var jsonParser =bodyParser.json();
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'u_user',
    host: 'localhost',
    database: 'app_database',
    password: 'u_password',
    port: 5432,
})
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
const getDatas = (request, response) => {
    pool.query('SELECT * FROM "book";', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
        console.log(results.rows)
    })
}
const getDatabyID = (request, response) => {
    pool.query('SELECT * FROM "book" WHERE book.id = '+request+';', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
        console.log(results.rows)
    })
}

const CreateData = (request,response)=>{
    var sql = "INSERT INTO book (\"book_name\",\"author\",\"page\",\"price\") VALUES ('test book', 'test author', 450,299);";
    console.log(request.body)
    if(request.body)
        {

            var Bnv = request.body.book_name;
            var Authv = request.body.author;
            var Pagv = request.body.page;
            var PriV = request.body.price;
            sql = `INSERT INTO book (\"book_name\",\"author\",\"page\",\"price\") VALUES ( '${Bnv}' , '${Authv}' , ${Pagv} ,${PriV} );`;
            console.log(sql)
        }

    pool.query(sql, function (err, result) {
        if (err) throw err;
        console.log(" record inserted");
    });
}

const UpdateData = (request,id,response)=>{
    var sql = "UPDATE book SET book_name = 'Test update' WHERE id = "+id+";";
    if(request.body)
    {
        console.log(request.body)
        var Bnv = request.body.book_name;
        var Authv = request.body.author;
        var Pagv = request.body.page;
        var PriV = request.body.price;
        sql = `UPDATE book SET book_name = '${Bnv}', "author" = '${Authv}', "price" = ${Pagv}, "page" = ${PriV} WHERE id = ${id};`;
        console.log(sql)
    }
    pool.query(sql, function (err, result) {
        if (err) throw err;
        console.log(" record(s) updated");
    });
}

const DeleteData = (request,response)=>{
    var sql = "DELETE FROM book  WHERE book.id = "+request+";";
    pool.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
    });
}

router.get('/login', function(req, res){
    res.render('auth/login');
});

router.get('/data', function(req, res){
    getDatas(1,res);
    //res.status().json({message:'เอาออกเรียบร้อย'});
});

router.get('/data/:id', function(req, res){
    //console.log(req.params.id);
    getDatabyID(req.params.id,res);
    //res.render('auth/login');
});

router.post('/create-data',jsonParser, function(req, res){
    console.log(req.body)
    CreateData(req,res);
    res.status(200).json({message:'บันถึกเรียบร้อย'});
    res.render('auth/home');
});

router.put('/updata-data/:id', function(req, res){
    //console.log(req.params.id);
    UpdateData(req,req.params.id,res);
    res.status(200).json({message:'update เรียบร้อย'});
});
router.get('/updata-data/:id', function(req, res){
    //console.log(req.params.id);
    UpdateData(req,req.params.id,res);
    res.status(200).json({message:'update เรียบร้อย'});
    res.render('auth/home');
});
router.get('/delete-data/:id', function(req, res){
    DeleteData(req.params.id,res);
    res.status(200).json({message:'ลบเรียบร้อย'});
    res.render('auth/home');
});
router.delete('/delete-data/:id', function(req, res){
    DeleteData(req.params.id,res);
    res.status(200).json({message:'ลบเรียบร้อย'});
});

module.exports = router;