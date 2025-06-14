import React, { useState } from 'react';
import { Container, Typography, Box, ThemeProvider, createTheme, Paper } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ja';
import TeacherSelection from './components/TeacherSelection';
import ClassSelection from './components/ClassSelection';
import AttendanceList from './components/AttendanceList';
import AbsenceDetails from './components/AbsenceDetails';
import OtherDetails from './components/OtherDetails';
import AttendanceStats from './components/AttendanceStats';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h3: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h6: {
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

interface Student {
  id: number;
  name: string;
  status: string;
  absenceReason?: string;
  otherReason?: string;
  familyMember?: string;
  illnessType?: string;
}

function App() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [showAttendanceList, setShowAttendanceList] = useState(false);
  const [attendanceData, setAttendanceData] = useState<Student[]>([]);
  const [savedAttendance, setSavedAttendance] = useState(false);
  const [isAttendanceSaved, setIsAttendanceSaved] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const handleTeacherChange = (teacher: string) => {
    setSelectedTeacher(teacher);
    setSelectedClass('');
    setShowAttendanceList(false);
    setSavedAttendance(false);
    setAttendanceData([]);
    setIsAttendanceSaved(false);
    setShowStats(false);
  };

  const handleClassChange = (className: string) => {
    setSelectedClass(className);
    setShowAttendanceList(true);
    setSavedAttendance(false);
    setAttendanceData([]);
    setIsAttendanceSaved(false);
    setShowStats(false);
  };

  const handleSaveAttendance = (students: Student[]) => {
    const updatedStudents = students.map(newStudent => {
      const existingStudent = attendanceData.find(s => s.id === newStudent.id);
      if (existingStudent && newStudent.status === 'other') {
        return {
          ...newStudent,
          otherReason: existingStudent.otherReason,
          familyMember: existingStudent.familyMember,
          illnessType: existingStudent.illnessType
        };
      }
      return newStudent;
    });

    setAttendanceData(updatedStudents);
    setSavedAttendance(true);
    setIsAttendanceSaved(true);
    setShowStats(false);
  };

  const handleEditAttendance = () => {
    setIsAttendanceSaved(false);
    setShowStats(false);
  };

  const handleFinalSubmit = (isComplete: boolean) => {
    if (isComplete) {
      setShowStats(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
        <Box sx={{ 
          minHeight: '100vh',
          backgroundColor: 'background.default',
          py: 4
        }}>
          <Container maxWidth="lg">
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                mb: 4,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                color: 'white'
              }}
            >
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                align="center"
                sx={{ 
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                Home Roomアプリ
              </Typography>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ mb: 3 }}>
                <DatePicker
                  label="日付を選択"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  format="YYYY年MM月DD日"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        '& .MuiInputLabel-root': {
                          fontSize: '1.1rem',
                        },
                        '& .MuiInputBase-input': {
                          fontSize: '1.1rem',
                          py: 1.5,
                        },
                      },
                    },
                  }}
                />
              </Box>

              <TeacherSelection 
                selectedTeacher={selectedTeacher} 
                onTeacherChange={handleTeacherChange} 
              />
              
              {selectedTeacher && (
                <ClassSelection 
                  selectedClass={selectedClass} 
                  onClassChange={handleClassChange} 
                />
              )}
            </Paper>
            
            {showAttendanceList && (
              <AttendanceList 
                className={selectedClass} 
                onSave={handleSaveAttendance}
                isSaved={isAttendanceSaved}
                onEdit={handleEditAttendance}
              />
            )}
            
            {savedAttendance && (
              <Paper sx={{ p: 3, mt: 3 }}>
                <AbsenceDetails 
                  attendanceData={attendanceData} 
                />
                <OtherDetails 
                  attendanceData={attendanceData}
                  onSubmit={handleFinalSubmit}
                />
                {showStats && (
                  <Box sx={{ mt: 3 }}>
                    <AttendanceStats attendanceData={attendanceData} />
                  </Box>
                )}
              </Paper>
            )}
          </Container>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
