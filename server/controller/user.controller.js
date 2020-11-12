const db = require('../config/db.config.js');
const User = db.user; //  引入表模型
const File = db.file; //  引入表模型
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
//  新增用户
exports.create = (req, res) => {
  if (req.body.username && req.body.password) {
    User.findOne({//这里检验账号是否有相同昵称
      where: {
          username:req.body.username
      }
    })
    .then(user => {
        if(!user){
          User.create(req.body)
          .then(user => {//sql数据创建成功返回的信息
            let msg = {};
            if (user) {
              // 创建账号成功，顺便新建账号文件夹
              let params = {
                file_name: req.body.name,
                upload_time: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
                type: '-',
                size: '-',
                pathRoot:''
              };
              File.create(params)
              msg = {
                flag: 1,
                msg: '新增账号成功!',
                uid: user.uid,
                username: user.username
              };
            } else {
              msg = {
                flag: 0,
                msg: '注册失败，请稍后注册'
              };
            }
            res.status(200).json(msg);
          })
          .catch(err => {
            res.status(500).json('Error -> ' + err);
          });
      } else {
        let msg = {
          flag: 0,
          msg: '已存在相同账户名'
          // msg: '用户名或者密码不能为空!'
        };
        res.status(200).json(msg);
      }
    })  
    .catch(err => {
      res.status(500).json('Error -> ' + err);
    });
};
};
//  验证用户名和密码
exports.validate = (req, res) => {
  if (req.body.username && req.body.password) {
    User.findOne({
      where: {
        [Op.and]: [
          {
            username: req.body.username
          },
          [
            {
              password: req.body.password
            }
          ]
        ]
      },
      attributes: ['uid', 'username','name']
    })
      .then(user => {
        let msg = {};
        if (user) {
          msg = {
            flag: 1,
            msg: '登陆成功!',
            uid: user.uid,
            username: user.name
          };
        } else {
          msg = {
            flag: 0,
            msg: '用户名或密码错误!'
          };
        }

        res.status(200).json(msg);
      })
      .catch(err => {
        res.status(500).json('Error -> ' + err);
      });
  } else {
    let msg = {
      flag: 0,
      msg: '用户名或者密码不能为空!'
    };
    res.status(200).json(msg);
  }
};

//  修改密码
exports.updatePassWord = (req, res) => {
  User.findOne({
    where: {
          uid: req.body.uid
    }
  }).then(user => {
    if (user) {
      User.update(
        {
          password: req.body.newPassword
        },
        {
          where: {
            uid: req.body.uid
          }
        }
      ).then(() => {
        let msg = {
          flag: 1,
          msg: '修改密码成功!'
        };
        res.status(200).json(msg);
      });
    } else {
      let msg = {
        flag: 0,
        msg: '密码不正确!'
      };
      res.status(200).json(msg);
    }
  });
};
