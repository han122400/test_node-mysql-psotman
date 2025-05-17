const express = require('express')
const http = require('http')
const db = require('./mysql') // 위에서 만든 mysql.js 불러오기

const app = express()
const port = 3000
const HOST = '0.0.0.0' // 중요: 외부 접속을 허용

app.use(express.json()) // JSON 요청 본문을 파싱하기 위한 미들웨어

app.get('/', (req, res) => {
  res.send('안녕하세요! Express.js 서버입니다.')
})

app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('조회 실패:', err)
      return res.status(500).json({ message: '조회 실패' })
    }
    res.status(200).json(results)
  })
})

// 새 POST /users
app.post('/users', (req, res) => {
  const { id, password } = req.body
  if (!id || !password) {
    return res.status(400).json({ message: 'id와 password 필요' })
  }
  db.query(
    'INSERT INTO users (id, password) VALUES (?, ?)',
    [id, password],
    (err) => {
      if (err) {
        console.error('삽입 실패:', err)
        return res.status(500).json({ message: '삽입 실패' })
      }
      res.status(201).json({ message: '사용자 추가 성공' })
    }
  )
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
