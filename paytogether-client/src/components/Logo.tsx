import React from 'react';
import { Box } from '@mui/material';

interface LogoProps {
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ size = 90 }) => {
  const circleSize = (size * 70) / 90;

  return (
    <Box sx={{ width: size, height: size, position: 'relative', mx: 'auto' }}>
      <Box sx={{
        width: circleSize,
        height: circleSize,
        borderRadius: '50%',
        bgcolor: '#8B9D83',
        position: 'absolute',
        left: 0,
        top: size * 0.11
      }} />
      <Box sx={{
        width: circleSize,
        height: circleSize,
        borderRadius: '50%',
        bgcolor: '#B8A9D4',
        position: 'absolute',
        right: 0,
        top: 0
      }} />
    </Box>
  );
};

export default Logo;