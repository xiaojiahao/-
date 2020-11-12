//  文件
module.exports = function(app) {
  const file = require('../controller/file.controller');

  //  新增文件
  app.post('/file/add', file.create);

  //  新增文件夹
  app.post('/file/addFolder', file.addFolder);

  //  修改文件（夹）名
  app.post('/file/updateName', file.updateName);

  //  查询目录
  app.post('/file/meum', file.meum);

  //  移动文件（夹）
  app.post('/file/move', file.move);

  //  删除文件
  app.delete('/file/delete/:fileName/:fileId/:type', file.delete);

  // 下载文件
  app.get('/file/download/:fileName/:fileId', file.download);

  // 获取文件信息列表
  app.post('/file/list', file.findAll);
};
