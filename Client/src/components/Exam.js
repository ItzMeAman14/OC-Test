import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, CardContent, Typography, CircularProgress, Grid, Button } from '@mui/material';

function Exam() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getExams();
  }, []);

  async function getExams() {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:7123/getAllExams');
      const data = await res.json();
      setLoading(false);
      setData(data);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f4f6f8' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Exams Page
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
            <CircularProgress size={60} color="primary" />
          </Box>
        ) : (
          data &&
          data.map((exam) => (
            <Grid item key={exam._id} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  boxShadow: 3,
                  borderRadius: 2,
                  '&:hover': {
                    boxShadow: 6, 
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    paddingBottom: '16px', // Ensures space at the bottom of the card
                  }}
                >
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {exam.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ marginBottom: 2 }}>
                    Time to attempt the exam is 2 hours. If you open any extra tabs or try to cheat, the test will automatically submit.
                  </Typography>

                  {/* Aligning the Button to the Bottom */}
                  <Box sx={{ marginTop: 'auto' }}>
                    {/* Buttons */}
                    {exam.attempted ? (
                      <Box display="flex" justifyContent="space-between">
                        <Button variant="contained" color="primary" disabled>
                          Attempted
                        </Button>
                        <Link to={`/score/${exam._id}`}>
                          <Button variant="contained" color="primary">
                            View Score
                          </Button>
                        </Link>
                      </Box>
                    ) : (
                      <Link to={`/exams/${exam._id}`} style={{ textDecoration: 'none' }}>
                        <Button variant="contained" color="primary" fullWidth>
                          Attempt
                        </Button>
                      </Link>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}

export default Exam;
