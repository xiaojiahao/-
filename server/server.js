const express = require('express');
const app = express();

const path = require('path');

const db = require('./config/db.config');
const File = db.file; //  引入表模型
const Sequelize = require('sequelize');


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cors = require('cors');
const corsOptions = {
  origin: 'http://106.15.199.210:8082',
  // origin: 'http://localhost:8080',
  optionSuccessStatus: 200
};
app.use(cors(corsOptions));//跨域

const morgan = require('morgan');
app.use(morgan('combined'));

const md5 = require('md5');

const multer = require('multer');


const storage = multer.diskStorage({
  destination(req, res, cb) {
    cb(null, './test-file');
  },
  filename(req, file, cb) {
    var number=1;
    let fineSame = function(fileName){
      File.findOne({//这里检测是否有相同文件
        where: {
          file_name:fileName
        }
      }).then(
        file=>{
          if(file){
            fileName= `${fileNameArr[0]}(${number}).${fileNameArr[1]}`;
            number++;
            fineSame(fileName);
          }else{
            cb(null, fileName);
          }
        }
      );
    }
    const fileNameArr = file.originalname.split('.');
    // const fileName = `${md5(fileNameArr[0])}.${fileNameArr[1]}`;
    let fileName = `${fileNameArr[0]}.${fileNameArr[1]}`;
    fineSame(fileName);
  }
});
app.use(multer({ storage }).any());


const cookie = require('cookie-parser');

/* db.sequelize.sync({ force: true }).then(() => {
  console.log('重建表');
}); */
require('./route/user.route')(app);
require('./route/file.route')(app);

//  创建服务器
let server = app.listen(process.env.PORT || 8081, () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log('服务器启动: http://%s:%s', host, port);
});
