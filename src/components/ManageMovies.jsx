import React, { useState, useContext, useEffect } from 'react';
import { TextField, Button, Typography, Box, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, TablePagination, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AppContext } from '../context/AppContext';

const URL_BASE = 'http://localhost:5000';

const ManageMovies = () => {
  const [urlApi, setUrlApi] = useState('');
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [notification, setNotification] = useState(null);
  const { setMovieCount } = useContext(AppContext);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      console.log('Đang lấy danh sách phim từ máy chủ...');
      const response = await fetch(`${URL_BASE}/api/movies/list`);
      if (!response.ok) {
        throw new Error('Lỗi khi lấy dữ liệu từ máy chủ');
      }
      const moviesData = await response.json();
      console.log('Dữ liệu phim đã được lấy:', moviesData);
      setMovies(moviesData);
      setMovieCount(moviesData.length);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phim:', error);
    }
  };

  const handleUrlInputChange = (event) => {
    setUrlApi(event.target.value);
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(urlApi);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const newMovie = {
        movie_id: data.movie._id,
        movie_api_url: urlApi,
        movie_name: data.movie.name,
        movie_origin_name: data.movie.origin_name,
        movie_country: data.movie.country[0]?.name || '',
        movie_category: data.movie.category[0]?.name || ''
      };

      const postResponse = await fetch(`${URL_BASE}/api/movies/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMovie)
      });

      if (!postResponse.ok) {
        throw new Error('Failed to save the movie to the database');
      }

      const result = await postResponse.json();
      console.log(`Added movie with ID: ${result.movieId}`);

      const updatedMovies = [...movies, { ...newMovie, movie_id: result.movieId }];
      setMovies(updatedMovies);
      setUrlApi('');
      setMovieCount(updatedMovies.length);
      setNotification(`Movie added successfully with ID: ${result.movieId}`);
    } catch (error) {
      console.error('Error fetching data:', error);
      setNotification('Error adding movie.');
    }
  };

  const handleDelete = async (movie_id) => {
    try {
      const response = await fetch(`${URL_BASE}/api/movies/delete/${movie_id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete the movie');
      }
      // Xóa phim khỏi danh sách movies trên giao diện người dùng
      const updatedMovies = movies.filter(movie => movie.movie_id !== movie_id);
      setMovies(updatedMovies);
      setMovieCount(updatedMovies.length);
      setNotification(`Deleted movie with ID: ${movie_id}`);
    } catch (error) {
      console.error('Error deleting movie:', error);
      setNotification('Error deleting movie.');
    }
  };

  const handleReload = (movie_id) => {
    console.log(`Reload movie with ID: ${movie_id}`);
  };

  const handleView = (movie_id) => {
    console.log(`View movie with ID: ${movie_id}`);
  };

  const handleReset = () => {
    // Gọi lại API để lấy danh sách phim mới nhất
    fetchMovies();
    // Đặt lại các trạng thái khác về giá trị mặc định
    setUrlApi('');
    setSearchQuery('');
    setPage(0);
    setRowsPerPage(20);
    setNotification(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredMovies = movies.filter(movie =>
    movie.movie_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.movie_origin_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.movie_country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.movie_category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 4, p: 3, bgcolor: 'background.paper', boxShadow: 1, borderRadius: 4 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý phim
      </Typography>
      <Typography variant="body1" gutterBottom>
        Đây là trang quản lý phim.
      </Typography>

      <form onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <TextField
          label="URL API phim"
          fullWidth
          value={urlApi}
          onChange={handleUrlInputChange}
          variant="outlined"
          margin="normal"
          placeholder="Nhập URL API phim..."
          sx={{ flex: '1 1 auto', mr: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disableElevation
          sx={{ flex: '0 0 auto' }}
        >
          Thêm phim
        </Button>
      </form>

      {notification && (
        <Alert severity="success" onClose={() => setNotification(null)} sx={{ my: 2 }}>
          {notification}
        </Alert>
      )}

      <TextField
        label="Tìm kiếm phim"
        fullWidth
        value={searchQuery}
        onChange={handleSearchQueryChange}
        variant="outlined"
        margin="normal"
        placeholder="Nhập tên phim, tên gốc, quốc gia hoặc thể loại..."
        sx={{ my: 2 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <IconButton onClick={handleReset} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      <Box sx={{ mt: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Movie ID(DB)</TableCell>
                <TableCell>Movie API URL</TableCell>
                <TableCell>Movie Name</TableCell>
                <TableCell>Movie Origin Name</TableCell>
                <TableCell>Movie Country</TableCell>
                <TableCell>Movie Category</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMovies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((movie, index) => (
                <TableRow key={movie._id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{movie._id}</TableCell>
                  <TableCell>{movie.movie_api_url}</TableCell>
                  <TableCell>{movie.movie_name}</TableCell>
                  <TableCell>{movie.movie_origin_name}</TableCell>
                  <TableCell>{movie.movie_country}</TableCell>
                  <TableCell>{movie.movie_category}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleView(movie.movie_id)} color="primary">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleReload(movie.movie_id)} color="secondary">
                      <RefreshIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(movie._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={filteredMovies.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
};

export default ManageMovies;
