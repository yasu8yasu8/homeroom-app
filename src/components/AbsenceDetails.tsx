import React, { useState } from 'react';
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
  styled,
  Button,
  Stack
} from '@mui/material';

interface Student {
  id: number;
  name: string;
  status: string;
  absenceReason?: string;
}

interface AbsenceDetailsProps {
  attendanceData: Student[];
}

// スタイル付きコンポーネントの定義
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: '1.2rem',
    fontWeight: 600,
    padding: '16px',
  },
  '&.MuiTableCell-body': {
    fontSize: '1.1rem',
    padding: '16px',
  },
}));

const AbsenceDetails: React.FC<AbsenceDetailsProps> = ({ attendanceData }) => {
  const [absenceReasons, setAbsenceReasons] = useState<{ [key: number]: string }>({});
  const absentStudents = attendanceData.filter(student => student.status === 'absent');

  const handleReasonChange = (studentId: number, reason: string) => {
    setAbsenceReasons(prev => ({
      ...prev,
      [studentId]: reason
    }));

    // 生徒の欠席理由を直接更新
    const student = attendanceData.find(s => s.id === studentId);
    if (student) {
      student.absenceReason = reason;
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ fontSize: '1.3rem', fontWeight: 600, mb: 2 }}>
        欠席理由の入力
      </Typography>
      {absentStudents.length === 0 ? (
        <Paper sx={{ p: 3, backgroundColor: 'grey.100' }}>
          <Typography variant="h6" align="center" sx={{ color: 'text.secondary' }}>
            該当者はいません
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell width="40%">名前</StyledTableCell>
                <StyledTableCell width="60%">欠席理由</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {absentStudents.map((student) => (
                <TableRow 
                  key={student.id}
                  sx={{
                    backgroundColor: absenceReasons[student.id] === '連絡なし' ? 'error.light' : 'inherit',
                    '&:hover': {
                      backgroundColor: absenceReasons[student.id] === '連絡なし' ? 'error.main' : 'action.hover',
                    }
                  }}
                >
                  <StyledTableCell sx={{ fontWeight: 500 }}>
                    {student.name}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant={absenceReasons[student.id] === '病気' ? 'contained' : 'outlined'}
                        onClick={() => handleReasonChange(student.id, '病気')}
                        color="warning"
                        sx={{
                          minWidth: '100px',
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                        }}
                      >
                        病気
                      </Button>
                      <Button
                        variant={absenceReasons[student.id] === '事故' ? 'contained' : 'outlined'}
                        onClick={() => handleReasonChange(student.id, '事故')}
                        color="secondary"
                        sx={{
                          minWidth: '100px',
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                        }}
                      >
                        事故
                      </Button>
                      <Button
                        variant={absenceReasons[student.id] === '連絡なし' ? 'contained' : 'outlined'}
                        onClick={() => handleReasonChange(student.id, '連絡なし')}
                        color="error"
                        sx={{
                          minWidth: '100px',
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                        }}
                      >
                        連絡なし
                      </Button>
                      <Button
                        variant={absenceReasons[student.id] === 'その他' ? 'contained' : 'outlined'}
                        onClick={() => handleReasonChange(student.id, 'その他')}
                        color="info"
                        sx={{
                          minWidth: '100px',
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                        }}
                      >
                        その他
                      </Button>
                    </Stack>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AbsenceDetails; 