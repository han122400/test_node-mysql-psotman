// Express 모듈 불러오기 (웹 서버 프레임워크)
const express = require('express')
// http 모듈 불러오기 (실제 사용 X, 참고용)
const http = require('http')
// mysql.js에서 만든 DB 연결 객체 불러오기
const db = require('./mysql') // 위에서 만든 mysql.js 불러오기
// 경로 조작을 위한 Node 내장 모듈 불러오기
const path = require('path') //경로 조작을 위한 Node 내장 모듈

// Express 애플리케이션 생성
const app = express()
// 사용할 포트 번호 지정
const port = 3000
// 외부 접속 허용을 위한 호스트 (실제 listen에는 사용 X)
const HOST = '0.0.0.0' // 외부 접속을 허용

// JSON 형태의 요청 바디를 파싱하는 미들웨어 등록
app.use(express.json()) // JSON 형태로 전달된 req.body를 파싱
// 현재 폴더를 정적 파일 제공 폴더로 지정
app.use(express.static(path.join(__dirname))) // 현재 폴더를 정적 폴더로 지정

// 루트 경로 접속 시 인사말 반환
app.get('/', (req, res) => {
  res.send('안녕하세요! Express.js 서버입니다.')
})

// GET /users : 모든 사용자 목록 조회
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      // DB 조회 실패 시 에러 로그 및 500 응답
      console.error('조회 실패:', err)
      return res.status(500).json({ message: '조회 실패' })
    }
    // 조회 성공 시 사용자 목록 반환
    res.status(200).json(results)
  })
})

// POST /users : 사용자 추가
app.post('/users', (req, res) => {
  // 요청 바디에서 id, password 추출
  const { id, password } = req.body
  // id 또는 password가 없으면 400 에러 반환
  if (!id || !password) {
    return res.status(400).json({ message: 'id와 password 필요' })
  }
  try {
    // users 테이블에 새 사용자 추가
    db.query(
      'INSERT INTO users (id, password) VALUES (?, ?)',
      [id, password],
      (err) => {
        if (err) {
          // DB 저장 실패 시 에러 로그 및 500 응답
          console.error('삽입 실패:', err)
          return res
            .status(500)
            .json({ message: 'DB 저장 실패', error: err.message })
        }
        // 저장 성공 시 201 응답
        res.status(201).json({ message: '사용자 추가 성공' })
      }
    )
  } catch (err) {
    // 예외 발생 시 에러 로그 및 500 응답
    console.error('삽입 실패(예외):', err)
    res.status(500).json({ message: 'DB 저장 실패', error: err.message })
  }
})

// 서버 실행 및 포트에서 대기
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
