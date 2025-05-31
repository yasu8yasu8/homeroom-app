const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ''
});

// データベースの作成
connection.query(
  'CREATE DATABASE IF NOT EXISTS homeroom_db',
  (err) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    
    console.log('Database created successfully');
    
    // データベースを使用
    connection.query('USE homeroom_db', (err) => {
      if (err) {
        console.error('Error using database:', err);
        return;
      }
      
      // 生徒テーブルの作成
      const createStudentsTable = `
        CREATE TABLE IF NOT EXISTS students (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          class_name VARCHAR(50) NOT NULL
        )
      `;
      
      connection.query(createStudentsTable, (err) => {
        if (err) {
          console.error('Error creating students table:', err);
          return;
        }
        console.log('Students table created successfully');
        
        // 出席テーブルの作成
        const createAttendanceTable = `
          CREATE TABLE IF NOT EXISTS attendance (
            id INT AUTO_INCREMENT PRIMARY KEY,
            date DATE NOT NULL,
            student_id INT NOT NULL,
            status VARCHAR(20) NOT NULL,
            reason VARCHAR(50),
            detail VARCHAR(50),
            FOREIGN KEY (student_id) REFERENCES students(id)
          )
        `;
        
        connection.query(createAttendanceTable, (err) => {
          if (err) {
            console.error('Error creating attendance table:', err);
            return;
          }
          console.log('Attendance table created successfully');
          
          // サンプルデータの挿入
          const classes = [
            '1年A組', '1年B組', '2年A組', '2年B組', '3年A組', '3年B組'
          ];
          
          const sampleNames = [
            '佐藤', '鈴木', '高橋', '田中', '伊藤',
            '渡辺', '山本', '中村', '小林', '加藤',
            '吉田', '山田', '佐々木', '山口', '松本',
            '井上', '木村', '林', '斎藤', '清水'
          ];
          
          const firstNames = [
            '太郎', '花子', '一郎', '美咲', '健一',
            '優子', '和也', '愛', '翔太', '萌',
            '龍也', '優花', '翔', '真由', '光',
            '智子', '大輔', '美優', '健太', '彩花'
          ];
          
          // 各クラスに20人の生徒を追加
          classes.forEach(className => {
            for (let i = 0; i < 20; i++) {
              const lastName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
              const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
              const fullName = lastName + firstName;
              
              connection.query(
                'INSERT INTO students (name, class_name) VALUES (?, ?)',
                [fullName, className],
                (err) => {
                  if (err) {
                    console.error(`Error inserting student ${fullName}:`, err);
                  }
                }
              );
            }
          });
          
          console.log('Sample data inserted successfully');
          connection.end();
        });
      });
    });
  }
); 