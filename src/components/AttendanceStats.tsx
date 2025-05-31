import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import WarningIcon from '@mui/icons-material/Warning';

interface Student {
  id: number;
  name: string;
  status: string;
  absenceReason?: string;
  otherReason?: string;
}

interface AttendanceStatsProps {
  attendanceData: Student[];
}

const COLORS = {
  present: '#4caf50',    // 緑
  absent: '#f44336',     // 赤
  publicAbsence: '#2196f3', // 青
  bereavement: '#9c27b0',  // 紫
  suspension: '#ff9800',   // オレンジ
  other: '#757575'        // グレー
};

const AttendanceStats: React.FC<AttendanceStatsProps> = ({ attendanceData }) => {
  // メモ化された統計データの計算
  const stats = useMemo(() => {
    const initialStats = {
      present: 0,
      absent: 0,
      publicAbsence: 0,
      bereavement: 0,
      suspension: 0,
      other: 0,
      noContact: [] as Student[]
    };

    return attendanceData.reduce((acc, student) => {
      switch (student.status) {
        case 'present':
          acc.present += 1;
          break;
        case 'absent':
          if (!student.absenceReason || student.absenceReason === '連絡なし') {
            acc.noContact.push(student);
          }
          acc.absent += 1;
          break;
        case 'other':
          switch (student.otherReason) {
            case '公欠':
              acc.publicAbsence += 1;
              break;
            case '忌引':
              acc.bereavement += 1;
              break;
            case '出停':
              acc.suspension += 1;
              break;
            default:
              acc.other += 1;
              break;
          }
          break;
        default:
          break;
      }
      return acc;
    }, { ...initialStats });
  }, [attendanceData]);

  // 円グラフのデータを作成（値が0の項目も含める）
  const pieData = [
    { name: '出席', value: stats.present, color: COLORS.present },
    { name: '欠席', value: stats.absent, color: COLORS.absent },
    { name: '公欠', value: stats.publicAbsence, color: COLORS.publicAbsence },
    { name: '忌引', value: stats.bereavement, color: COLORS.bereavement },
    { name: '出停', value: stats.suspension, color: COLORS.suspension },
    { name: 'それ以外', value: stats.other, color: COLORS.other }
  ];

  return (
    <Box sx={{ mt: 4 }}>
      {stats.noContact.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Alert 
            severity="error"
            variant="filled"
            sx={{ 
              mb: 2,
              '& .MuiAlert-message': {
                width: '100%'
              },
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': {
                  boxShadow: '0 0 0 0 rgba(244, 67, 54, 0.4)'
                },
                '70%': {
                  boxShadow: '0 0 0 10px rgba(244, 67, 54, 0)'
                },
                '100%': {
                  boxShadow: '0 0 0 0 rgba(244, 67, 54, 0)'
                }
              }
            }}
          >
            <AlertTitle sx={{ 
              fontWeight: 'bold',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <WarningIcon sx={{ fontSize: '1.5rem' }} />
              要確認！連絡なしの生徒 ({stats.noContact.length}名)
            </AlertTitle>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: '#fff',
                fontWeight: 500,
                mb: 2
              }}
            >
              この後すぐに確認してください！
            </Typography>
            <Paper 
              elevation={3}
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 2,
                p: 2
              }}
            >
              <List dense>
                {stats.noContact.map((student) => (
                  <ListItem 
                    key={student.id}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                      }
                    }}
                  >
                    <ListItemText 
                      primary={student.name}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: 600,
                          color: '#d32f2f',
                          fontSize: '1.1rem'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Alert>
        </Box>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom align="center" sx={{ mb: 3 }}>
          出欠状況集計
        </Typography>
        
        <Box sx={{ height: 400, width: '100%', mb: 3 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  value,
                  name
                }) => {
                  if (value === 0) return null;
                  const RADIAN = Math.PI / 180;
                  const radius = 25 + innerRadius + (outerRadius - innerRadius);
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#000"
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                    >
                      {`${name}: ${value}名`}
                    </text>
                  );
                }}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => {
                  const { payload } = entry as any;
                  return payload.value > 0 ? value : null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="textSecondary">
            総生徒数: {attendanceData.length}名
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default AttendanceStats; 