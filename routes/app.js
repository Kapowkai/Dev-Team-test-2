const express = require('express') // เรียกใช้ Express
const mysql = require('mysql') // เรียกใช้ mysql
var router = express.Router();

const db = mysql.createConnection({   // config ค่าการเชื่อมต่อฐานข้อมูล
    host     : 'postgres@localhost',
    user     : 'u_user',
    password : 'u_password',
    database : 'expressmysql'
})
// db.connect() // เชื่อมต่อฐานข้อมูล

const app = express() // สร้าง Object เก็บไว้ในตัวแปร app เพื่อนำไปใช้งาน

    router.get('/login', function(req, res){
     res.render('auth/login');
    });
// app.listen('3000',() => {     //
//     console.log('start port 3000')
// })

module.exports = router;