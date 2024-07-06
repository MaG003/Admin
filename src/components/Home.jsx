// src/components/Home.js
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Box, Typography, Paper, Card, CardContent } from '@mui/material';

const Home = () => {
  const { movieCount, visitorCount, setVisitorCount } = useContext(AppContext);

  useEffect(() => {
    setVisitorCount(visitorCount + 0);
  }, [setVisitorCount, visitorCount]);

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4, p: 3, bgcolor: 'background.paper', boxShadow: 1, borderRadius: 4 }}>
      <Typography variant="h4" gutterBottom>
        Trang chủ
      </Typography>
      <Typography variant="body1" gutterBottom>
        Chào mừng bạn đến với trang quản trị.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6">
              Số lượng người truy cập
            </Typography>
            <Typography variant="h4" color="primary">
              {visitorCount}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6">
              Số lượng phim được cập nhật
            </Typography>
            <Typography variant="h4" color="primary">
              {movieCount}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Home;
