/* jshint indent: 2 */
//账号密码和名称
// CREATE TABLE IF NOT EXISTS `user`(
//   `uid` INT UNSIGNED AUTO_INCREMENT COMMENT '用户id',
//   `username` VARCHAR(20) NOT NULL COMMENT '用户名',
//   `password` VARCHAR(20) NOT NULL COMMENT '密码',
//   `name` VARCHAR(20) NOT NULL COMMENT '教师名称',
//   PRIMARY KEY ( `uid` )
// )ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '用户表';
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
      uid: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      password: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false
      }
    },
    {
        timestamps: false,
      tableName: 'user'
    },
  );
};
