// mysql.js
const mysql = require('mysql2')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234', // 실제 비밀번호로 수정
  database: 'test', // 아까 만든 DB 이름
})

connection.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패:', err)
    return
  }
  console.log('✅ MySQL 연결 성공')
})

module.exports = connection
