const db = require('../config/db.config.js');
const File = db.file; //  引入表模型
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const path = require('path');
const fs = require('fs');

//  添加文件，上传
exports.create = (req, res) => {
  let fileNameArr =req.files[0].originalname.split('.');
  let fileName = req.files[0].originalname;
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
          let params = {
            file_name: fileName,
            upload_time: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
            type: path.parse(req.files[0].originalname).ext,
            size: req.files[0].size,
            pathRoot:req.body.path
            // pathRoot:req.body.path,
          };
          File.create(params)
            .then(file => {
              if (file) {
                let msg = {
                  flag: 1,
                  msg: '文件上传成功!'
                };
                res.status(200).json(msg);
              } else {
                let msg = {
                  flag: 0,
                  msg: '文件上传失败,请稍后重新上传!'
                };
                res.status(500).json(msg);
              }
            })
            .catch(err => {
              res.status(500).json('Error->' + err);
            });
        }
      }
    );
  }

  fineSame(fileName);
  // req.files[0].originalname.split('???')[0];
  
};
// 可以移动的目录文件夹
exports.meum = (req, res) => {
  db.sequelize.query("select * from filelist where pathRoot like '/"+req.body.name+"%' and type='-'").then(file=>{
    res.status(200).json(file);
  });
};
// 移动文件和文件夹
exports.move = (req, res) => {
 //移动文件
  if(req.body.type!='-'){
    File.update(
      {
        pathRoot: req.body.moveTo
      },
      {
        where: {
          id:req.body.id
        }
      }
    ).then(() => {
      let msg = {
        flag: 1,
        msg: '修改成功!'
      };
      res.status(200).json(msg);
    });
 }else {//移动文件夹
  File.update(
    {
      pathRoot: req.body.moveTo
    },
    {
      where: {
        id:req.body.id
      }
    }
  ).then(() => {
    let oldfilePath=req.body.pathRoot+'/'+req.body.file_name;
    let newfilePath=req.body.moveTo+'/'+req.body.file_name;
    db.sequelize.query("UPDATE filelist SET pathRoot = replace(pathRoot,"+"'"+oldfilePath+"','"+newfilePath+"');");

    let msg = {
      flag: 1,
      msg: '修改成功!'
    };
    res.status(200).json(msg);
  });
 }
};
//  添加文件夹 ,没有做检测是否相同文件夹名
exports.addFolder = (req, res) => {
  let params = {
    file_name: req.body.folderName,
    upload_time: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
    type: '-',
    size: '-',
    pathRoot:req.body.path
    // pathRoot:req.body.path,
  };
  File.create(params)
    .then(file => {
      if (file) {
        let msg = {
          flag: 1,
          msg: '创建成功!'
        };
        res.status(200).json(msg);
      } else {
        let msg = {
          flag: 0,
          msg: '创建失败'
        };
        res.status(500).json(msg);
      }
    })
    .catch(err => {
      res.status(500).json('Error->' + err);
    });
};

//重命名文件或文件夹
exports.updateName = (req, res) => {
  let oldfilePath = '';//记录文件夹的路径
  let newfilePath = '';//记录文件夹的路径

  File.findOne({
    where: {
        id:req.body.id
    }
  }).then(file => {
    oldfilePath = file.pathRoot+'/'+file.file_name;//文件夹路径
    newfilePath = file.pathRoot+'/'+req.body.file_name;//文件夹路径
    if (file.type=='-') {
      File.update(
        {
          file_name: req.body.file_name
        },
        {
          where: {
            id:req.body.id
          }
        }
      ).then(() => {
        let msg = {
          flag: 1,
          msg: '修改成功!'
        };
        oldfilePath=oldfilePath.substr(1);
        newfilePath=newfilePath.substr(1);
        console.log(oldfilePath)
        console.log(newfilePath)
        //修改被重命名文件夹路径下的文件的路径
        db.sequelize.query("UPDATE filelist SET pathRoot = replace(pathRoot,"+"'"+oldfilePath+"','"+newfilePath+"');");
        res.status(200).json(msg);
       
      });
    } else {
      let oldPath = `${__dirname}/../test-file/${file.file_name}`;
      var number=1;
      
      let fineSame = function(fileName){
        let fileNameArr =fileName.split('.');
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
              File.update(
                {
                  file_name: fileName
                },
                {
                  where: {
                    id:req.body.id
                  }
                }
              ).then(() => {
                let msg = {
                  flag: 1,
                  msg: '修改成功!'
                };
                res.status(200).json(msg);
                let newPath =  `${__dirname}/../test-file/${fileName}`;
                fs.rename(oldPath, newPath, function(err) {
                  console.log(err);
                })
              });
            }
          }
        );
      }
      fineSame(req.body.file_name);
    }
  });
};
//  删除文件或者文件夹 (目前文件夹删了并没有删里面的文件，可以新建同名字找回原文件)
exports.delete = (req, res) => {
  const id = req.params.fileId;
  
  File.destroy({
    where: { id: id }
  })
    .then(_ => {
      if(req.params.type == '-'){
        res.status(200).json({
          flag: 1,
          msg: '删除成功!'
        });
        return;
      }
      //  从资源文件夹从删除
      let fileName = req.params.fileName;
      let path = `${__dirname}/../test-file/${fileName}`;
      fs.unlink(path, err => {
        if (err) {
          let msg = {
            flag: 0,
            msg: '删除失败!'
          };
          res.status(200).json(msg);
        } else {
          let msg = {
            flag: 1,
            msg: '删除成功!'
          };
          res.status(200).json(msg);
        }
      });
    })
    .catch(err => {
      res.status(500).json('Error=>', err);
    });
};

//  下载文件
exports.download = (req, res) => {
  //fileId在接口定义那里设定的
  let fileId = req.params.fileId;
  let fileName = req.params.fileName;
  File.findById(fileId).then(file => {
        let path = `${__dirname}/../test-file/${fileName}`;
        res.download(path, fileName);
  });
};

//  获取文件列表信息，将路径名输入数据库，
exports.findAll = (req, res) => {
  File.findAll({
    where: { pathRoot: req.body.pathRoot }
    // where: { uid: req.body.uid }
  })
    .then(file => {
      res.status(200).json(file);
    })
    .catch(err => {
      res.status(500).json('Error=>', err);
    });
};
