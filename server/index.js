const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// データベース接続設定
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'homeroom_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 生徒データを取得するエンドポイント
app.get('/api/students/:className', (req, res) => {
  const { className } = req.params;
  
  pool.query(
    'SELECT * FROM students WHERE class_name = ?',
    [className],
    (error, results) => {
      if (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'データベースエラーが発生しました' });
        return;
      }
      res.json(results);
    }
  );
});

// 出席データを保存するエンドポイント
app.post('/api/attendance', (req, res) => {
  const { date, className, attendanceData } = req.body;
  
  // トランザクションを開始
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      res.status(500).json({ error: 'データベースエラーが発生しました' });
      return;
    }

    connection.beginTransaction(err => {
      if (err) {
        connection.release();
        console.error('Error beginning transaction:', err);
        res.status(500).json({ error: 'データベースエラーが発生しました' });
        return;
      }

      const insertPromises = attendanceData.map(student => {
        return new Promise((resolve, reject) => {
          const query = `
            INSERT INTO attendance 
            (date, student_id, status, reason, detail) 
            VALUES (?, ?, ?, ?, ?)
          `;
          
          connection.query(
            query,
            [date, student.id, student.status, student.reason || null, student.detail || null],
            (error) => {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            }
          );
        });
      });

      Promise.all(insertPromises)
        .then(() => {
          connection.commit(err => {
            if (err) {
              connection.rollback(() => {
                connection.release();
                console.error('Error committing transaction:', err);
                res.status(500).json({ error: 'データベースエラーが発生しました' });
              });
              return;
            }
            
            connection.release();
            res.json({ message: '出席データが正常に保存されました' });
          });
        })
        .catch(error => {
          connection.rollback(() => {
            connection.release();
            console.error('Error inserting attendance data:', error);
            res.status(500).json({ error: 'データベースエラーが発生しました' });
          });
        });
    });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 