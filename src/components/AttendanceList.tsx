import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  styled
} from '@mui/material';

interface Student {
  id: number;
  name: string;
  status: string;
  absenceReason?: string;
}

interface AttendanceListProps {
  className: string;
  onSave: (students: Student[]) => void;
  isSaved?: boolean;  // 追加：保存済みかどうかを示すプロパティ
  onEdit?: () => void;  // 追加：修正ボタンのハンドラー
}

// スタイル付きコンポーネントの定義
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&.noContact': {
    backgroundColor: theme.palette.error.light,
    '&:hover': {
      backgroundColor: theme.palette.error.light,
    },
  },
  '& .MuiTableCell-root': {
    padding: '16px 8px',
    '&.name-cell': {
      fontSize: '1.1rem',
      fontWeight: 500,
    },
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: '1.1rem',
    fontWeight: 600,
  },
}));

// クラスごとの生徒データ
const classStudents: { [key: string]: string[] } = {
  '1年A組': [
    '佐藤太郎', '鈴木花子', '高橋一郎', '田中美咲', '伊藤健一',
    '渡辺優子', '山本和也', '中村愛', '小林翔太', '加藤萌',
    '吉田龍也', '山田優花', '佐々木翔', '山口真由', '松本光',
    '井上智子', '木村大輔', '林美優', '斎藤健太', '清水彩花'
  ],
  '1年B組': [
    '中野陽子', '藤田雄太', '阿部真琴', '近藤拓海', '石井美咲',
    '村上大地', '遠藤さくら', '青木翔太', '坂本美優', '内田健',
    '原田光', '宮崎愛', '酒井翔太', '上田優花', '森田大輔',
    '小川真由', '中島健太', '岡田彩花', '前田陽太', '久保田萌'
  ],
  '2年A組': [
    '渡部健太', '野村美咲', '工藤大輔', '大野愛子', '菊地翔太',
    '佐野優花', '杉本龍一', '金子美優', '松田健一', '池田桜',
    '橋本拓海', '山下愛美', '石川大地', '中山萌花', '西田一郎',
    '本田真由', '福田翔太', '三浦彩花', '藤井健太', '岩崎美咲'
  ],
  '2年B組': [
    '長谷川翔', '武田優奈', '小島健太', '宮本さくら', '市川大輔',
    '白石美優', '浅野拓海', '吉川愛子', '今井陽太', '関口萌',
    '坂口健一', '大塚花子', '荒木翔太', '竹内美咲', '野口智也',
    '平野愛美', '遠山健太', '水野優花', '柴田大輔', '横山美優'
  ],
  '3年A組': [
    '北村拓海', '安田美咲', '森本健太', '内山さくら', '飯田大輔',
    '星野愛子', '黒田翔太', '土井優花', '松井陽太', '小松萌',
    '浜田健一', '三宅美優', '大西翔平', '沢田愛美', '桜井智也',
    '江口真由', '望月健太', '片山彩花', '川口大輔', '西川美咲'
  ],
  '3年B組': [
    '河野翔太', '武田優奈', '小島健太', '宮本さくら', '市川大輔',
    '白石美優', '浅野拓海', '吉川愛子', '今井陽太', '関口萌',
    '谷口健太', '篠原優花', '岸本大地', '堀江愛美', '中西智也',
    '菅原真由', '大石健太', '宮田彩花', '新井大輔', '千葉美優'
  ]
};

// 生徒データの生成関数
const generateStudents = (className: string): Student[] => {
  const names = classStudents[className] || [];
  return names.map((name, index) => ({
    id: index + 1,
    name: name,
    status: 'present',
    absenceReason: undefined
  }));
};

const AttendanceList: React.FC<AttendanceListProps> = ({ 
  className, 
  onSave, 
  isSaved = false,
  onEdit 
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [displayStudents, setDisplayStudents] = useState<Student[]>([]); // 追加：表示用の状態

  useEffect(() => {
    const initialStudents = generateStudents(className);
    setStudents(initialStudents);
    setDisplayStudents(initialStudents);
  }, [className]);

  const handleStatusChange = (studentId: number, newStatus: string) => {
    if (isSaved) return;

    const updatedStudents = students.map(student =>
      student.id === studentId
        ? {
            ...student,
            status: newStatus,
            absenceReason: newStatus === 'absent' ? '連絡なし' : undefined
          }
        : student
    );

    setStudents(updatedStudents);
    setDisplayStudents(updatedStudents);
  };

  const handleSave = () => {
    setDisplayStudents([...students]); // 表示用の状態を更新
    onSave(students);
  };

  // 追加：修正ボタンのハンドラー
  const handleEdit = () => {
    setStudents([...displayStudents]); // 表示状態を内部データにコピー
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <Box 
      sx={{ 
        width: '100%', 
        mb: 3,
        position: 'relative',
        '&::after': isSaved ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          pointerEvents: 'none',
        } : {}
      }}
    >
      <Typography variant="h6" gutterBottom>
        {className} 出欠確認
      </Typography>
      <TableContainer 
        component={Paper}
        sx={{
          '& .MuiTable-root': {
            borderCollapse: 'separate',
            borderSpacing: '0 4px',
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell width="15%">出席番号</StyledTableCell>
              <StyledTableCell width="35%">名前</StyledTableCell>
              <StyledTableCell width="50%">出欠状況</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayStudents.map((student) => (
              <StyledTableRow 
                key={student.id}
                className={student.status === 'absent' && student.absenceReason === '連絡なし' ? 'noContact' : ''}
              >
                <TableCell align="center" sx={{ fontSize: '1.1rem' }}>
                  {student.id}
                </TableCell>
                <TableCell className="name-cell">
                  {student.name}
                </TableCell>
                <TableCell>
                  <Stack 
                    direction="row" 
                    spacing={2}
                    justifyContent="center"
                  >
                    <Button
                      variant={student.status === 'present' ? 'contained' : 'outlined'}
                      onClick={() => handleStatusChange(student.id, 'present')}
                      size="large"
                      color="success"
                      disabled={isSaved}
                      sx={{
                        minWidth: '100px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                      }}
                    >
                      出席
                    </Button>
                    <Button
                      variant={student.status === 'absent' ? 'contained' : 'outlined'}
                      onClick={() => handleStatusChange(student.id, 'absent')}
                      size="large"
                      color={student.status === 'absent' && student.absenceReason === '連絡なし' ? 'error' : 'primary'}
                      disabled={isSaved}
                      sx={{
                        minWidth: '100px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                      }}
                    >
                      欠席
                    </Button>
                    <Button
                      variant={student.status === 'other' ? 'contained' : 'outlined'}
                      onClick={() => handleStatusChange(student.id, 'other')}
                      size="large"
                      color="warning"
                      disabled={isSaved}
                      sx={{
                        minWidth: '300px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        ...(student.status === 'other' && {
                          backgroundColor: 'warning.main',
                          '&:hover': {
                            backgroundColor: 'warning.dark',
                          },
                        }),
                      }}
                    >
                      その他（公欠・忌引・出停・それ以外）
                    </Button>
                  </Stack>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={isSaved}
          sx={{ 
            minWidth: 200,
            py: 1.5,
            fontSize: '1.1rem',
            boxShadow: 4,
            '&:hover': {
              boxShadow: 6,
            },
          }}
        >
          保存
        </Button>
        {isSaved && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleEdit}
            sx={{ 
              minWidth: 200,
              py: 1.5,
              fontSize: '1.1rem',
              boxShadow: 4,
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            修正
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default AttendanceList; 