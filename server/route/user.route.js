//  用户
module.exports = function(app) {
  const user = require('../controller/user.controller');

  //  新增用户
  app.post('/user/create', user.create);

  //  根据用户名和密码查询用户
  app.post('/user/validate', user.validate);

  //  修改密码
  app.post('/user/updatePassWord', user.updatePassWord);
};
