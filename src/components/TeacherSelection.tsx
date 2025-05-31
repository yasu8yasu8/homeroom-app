import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

interface TeacherSelectionProps {
  selectedTeacher: string;
  onTeacherChange: (teacher: string) => void;
}

const teachers = [
  '田中先生',
  '齋藤先生',
  '土田先生',
  '中村先生',
  '川名先生',
  '小林先生'
];

const TeacherSelection: React.FC<TeacherSelectionProps> = ({
  selectedTeacher,
  onTeacherChange
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <FormControl fullWidth>
        <InputLabel id="teacher-select-label">担任の先生</InputLabel>
        <Select
          labelId="teacher-select-label"
          id="teacher-select"
          value={selectedTeacher}
          label="担任の先生"
          onChange={(e) => onTeacherChange(e.target.value)}
        >
          {teachers.map((teacher) => (
            <MenuItem key={teacher} value={teacher}>
              {teacher}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default TeacherSelection; 