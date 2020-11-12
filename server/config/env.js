//  数据库连接参数
const env = {
  database: 'xiao',
  username: 'root',
  password: '123456',
  host: '106.15.199.210',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
module.exports = env;
