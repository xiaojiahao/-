/* jshint indent: 2 */
// CREATE TABLE `filelist`
//     -> (
//     -> id int(10) AUTO_INCREMENT COMMENT '文件id',
//     -> file_name varchar(200) NOT NULL COMMENT '文件名称',
//     -> upload_time DateTime NOT NULL COMMENT '上传时间',
//     -> type varchar(20) NOT NULL COMMENT '文件类型',
//     ->     size varchar(20) NOT NULL COMMENT '文件大小',
//     ->     pathRoot varchar(20) NOT NULL COMMENT '文件路径',
//     -> PRIMARY KEY (id)
//     -> )ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '上传文件表';
module.exports = function(sequelize, DataTypes) {
    return sequelize.define(
      'filelist',
      {
        id: {
          type: DataTypes.INTEGER(10),
          primaryKey: true,
          autoIncrement: true
        },
        file_name: {
          type: DataTypes.STRING(200),
          allowNull: false
        },
        upload_time: {
          type: DataTypes.DATE,
          allowNull: false
        },
        type: {
          type: DataTypes.STRING(20),
          allowNull: false
        },
        size: {
          type: DataTypes.STRING(20),
          allowNull: false
        },
        pathRoot: {
          type: DataTypes.STRING(20),
          allowNull: false
        },
      },
      {
        timestamps: false,
        tableName: 'filelist'
      }
    );
  };
  