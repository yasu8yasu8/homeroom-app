import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

interface ClassSelectionProps {
  selectedClass: string;
  onClassChange: (className: string) => void;
}

const classes = [
  '1年A組',
  '1年B組',
  '2年A組',
  '2年B組',
  '3年A組',
  '3年B組'
];

const ClassSelection: React.FC<ClassSelectionProps> = ({
  selectedClass,
  onClassChange
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <FormControl fullWidth>
        <InputLabel id="class-select-label">クラス</InputLabel>
        <Select
          labelId="class-select-label"
          id="class-select"
          value={selectedClass}
          label="クラス"
          onChange={(e) => onClassChange(e.target.value)}
        >
          {classes.map((className) => (
            <MenuItem key={className} value={className}>
              {className}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ClassSelection; 