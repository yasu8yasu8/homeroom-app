import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Collapse,
  Stack,
  styled
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

interface Student {
  id: number;
  name: string;
  status: string;
  absenceReason?: string;
  otherReason?: string;
  familyMember?: string;
  illnessType?: string;
}

interface OtherDetailsProps {
  attendanceData: Student[];
  onSubmit: (isComplete: boolean) => void;
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
    '&.name-cell': {
      fontWeight: 500,
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-select': {
    fontSize: '1.1rem',
    padding: '12px',
  },
  '& .MuiMenuItem-root': {
    fontSize: '1.1rem',
  },
}));

const OtherDetails: React.FC<OtherDetailsProps> = ({ attendanceData, onSubmit }) => {
  const [otherReasons, setOtherReasons] = useState<{ [key: number]: string }>({});
  const [familyMembers, setFamilyMembers] = useState<{ [key: number]: string }>({});
  const [illnessTypes, setIllnessTypes] = useState<{ [key: number]: string }>({});
  const [showDialog, setShowDialog] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [updatedAttendanceData, setUpdatedAttendanceData] = useState<Student[]>([]);

  // attendanceDataが変更されたときに状態を更新
  useEffect(() => {
    const initialOtherReasons: { [key: number]: string } = {};
    const initialFamilyMembers: { [key: number]: string } = {};
    const initialIllnessTypes: { [key: number]: string } = {};

    const updatedData = attendanceData.map(student => {
      if (student.status === 'other') {
        initialOtherReasons[student.id] = student.otherReason || '公欠';
        if (student.otherReason === '忌引') {
          initialFamilyMembers[student.id] = student.familyMember || '';
        }
        if (student.otherReason === '出停') {
          initialIllnessTypes[student.id] = student.illnessType || '';
        }
        return { ...student, otherReason: student.otherReason || '公欠' };
      }
      return student;
    });

    setOtherReasons(initialOtherReasons);
    setFamilyMembers(initialFamilyMembers);
    setIllnessTypes(initialIllnessTypes);
    setUpdatedAttendanceData(updatedData);
  }, [attendanceData]);

  const otherStudents = updatedAttendanceData.filter(student => student.status === 'other');

  const handleReasonChange = (studentId: number, reason: string) => {
    setOtherReasons(prev => ({
      ...prev,
      [studentId]: reason
    }));

    setUpdatedAttendanceData(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { 
              ...student, 
              otherReason: reason,
              familyMember: undefined,
              illnessType: undefined
            }
          : student
      )
    );

    if (reason !== '忌引') {
      setFamilyMembers(prev => {
        const { [studentId]: _, ...rest } = prev;
        return rest;
      });
    }
    if (reason !== '出停') {
      setIllnessTypes(prev => {
        const { [studentId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleFamilyMemberChange = (studentId: number, value: string) => {
    setFamilyMembers(prev => ({
      ...prev,
      [studentId]: value
    }));

    setUpdatedAttendanceData(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, familyMember: value }
          : student
      )
    );
  };

  const handleIllnessTypeChange = (studentId: number, value: string) => {
    setIllnessTypes(prev => ({
      ...prev,
      [studentId]: value
    }));

    setUpdatedAttendanceData(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, illnessType: value }
          : student
      )
    );
  };

  const handleSubmit = () => {
    const complete = otherStudents.every(student => {
      const reason = otherReasons[student.id];
      if (!reason) return false;
      
      if (reason === '忌引') {
        return !!familyMembers[student.id];
      }
      if (reason === '出停') {
        return !!illnessTypes[student.id];
      }
      return true;
    });

    setIsComplete(complete);
    setShowDialog(true);
    onSubmit(complete);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    if (isComplete) {
      onSubmit(true);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontSize: '1.3rem', fontWeight: 600, mb: 2 }}>
        その他の詳細
      </Typography>
      {otherStudents.length === 0 ? (
        <Paper sx={{ p: 3, backgroundColor: 'grey.100' }}>
          <Typography variant="h6" align="center" sx={{ color: 'text.secondary' }}>
            該当者はいません
          </Typography>
        </Paper>
      ) : (
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
                <StyledTableCell width="25%">名前</StyledTableCell>
                <StyledTableCell width="35%">理由</StyledTableCell>
                <StyledTableCell width="40%">詳細</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {otherStudents.map((student) => (
                <TableRow key={student.id}>
                  <StyledTableCell className="name-cell">
                    {student.name}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant={otherReasons[student.id] === '公欠' ? 'contained' : 'outlined'}
                        onClick={() => handleReasonChange(student.id, '公欠')}
                        color="primary"
                        sx={{
                          minWidth: '100px',
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                        }}
                      >
                        公欠
                      </Button>
                      <Button
                        variant={otherReasons[student.id] === '忌引' ? 'contained' : 'outlined'}
                        onClick={() => handleReasonChange(student.id, '忌引')}
                        color="secondary"
                        sx={{
                          minWidth: '100px',
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                        }}
                      >
                        忌引
                      </Button>
                      <Button
                        variant={otherReasons[student.id] === '出停' ? 'contained' : 'outlined'}
                        onClick={() => handleReasonChange(student.id, '出停')}
                        color="error"
                        sx={{
                          minWidth: '100px',
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                        }}
                      >
                        出停
                      </Button>
                      <Button
                        variant={otherReasons[student.id] === 'それ以外' ? 'contained' : 'outlined'}
                        onClick={() => handleReasonChange(student.id, 'それ以外')}
                        color="warning"
                        sx={{
                          minWidth: '100px',
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                        }}
                      >
                        それ以外
                      </Button>
                    </Stack>
                  </StyledTableCell>
                  <StyledTableCell>
                    {otherReasons[student.id] === '忌引' && (
                      <FormControl fullWidth>
                        <StyledSelect
                          value={familyMembers[student.id] || ''}
                          onChange={(e) => handleFamilyMemberChange(student.id, e.target.value as string)}
                          size="medium"
                        >
                          <MenuItem value="父親">父親</MenuItem>
                          <MenuItem value="母親">母親</MenuItem>
                          <MenuItem value="兄弟姉妹">兄弟姉妹</MenuItem>
                          <MenuItem value="祖父">祖父</MenuItem>
                          <MenuItem value="祖母">祖母</MenuItem>
                          <MenuItem value="義父">義父</MenuItem>
                          <MenuItem value="義母">義母</MenuItem>
                          <MenuItem value="その他">その他</MenuItem>
                        </StyledSelect>
                      </FormControl>
                    )}
                    {otherReasons[student.id] === '出停' && (
                      <FormControl fullWidth>
                        <StyledSelect
                          value={illnessTypes[student.id] || ''}
                          onChange={(e) => handleIllnessTypeChange(student.id, e.target.value as string)}
                          size="medium"
                        >
                          <MenuItem value="インフルエンザ">インフルエンザ</MenuItem>
                          <MenuItem value="コロナ">コロナ</MenuItem>
                          <MenuItem value="その他感染症">その他感染症</MenuItem>
                          <MenuItem value="その他">その他</MenuItem>
                        </StyledSelect>
                      </FormControl>
                    )}
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
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
          決定
        </Button>
      </Box>

      <Dialog
        open={showDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 320,
          }
        }}
      >
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 2,
            }}
          >
            {isComplete ? (
              <>
                <CheckCircleIcon
                  color="success"
                  sx={{ fontSize: 60, mb: 2 }}
                />
                <DialogContentText
                  sx={{
                    color: 'success.main',
                    fontSize: '1.2rem',
                    fontWeight: 500,
                    textAlign: 'center',
                  }}
                >
                  出欠が無事に取れました
                </DialogContentText>
              </>
            ) : (
              <>
                <ErrorIcon
                  color="error"
                  sx={{ fontSize: 60, mb: 2 }}
                />
                <DialogContentText
                  sx={{
                    color: 'error.main',
                    fontSize: '1.4rem',
                    fontWeight: 600,
                    textAlign: 'center',
                    mb: 1
                  }}
                >
                  ERROR！
                </DialogContentText>
                <DialogContentText
                  sx={{
                    color: 'error.main',
                    fontSize: '1.3rem',
                    fontWeight: 500,
                    textAlign: 'center',
                  }}
                >
                  入力できていないところがあります
                </DialogContentText>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            color={isComplete ? "success" : "error"}
            sx={{ 
              minWidth: 120,
              borderRadius: 2,
            }}
          >
            {isComplete ? "完了" : "確認"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OtherDetails; 