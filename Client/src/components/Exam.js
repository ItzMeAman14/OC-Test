import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from "@mui/icons-material/Check";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useToast } from './context/ToastContext';

const Exam = () => {
  const navigate = useNavigate();
  const { showError } = useToast();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserExams();
  }, []);

  async function getUserExams() {
    try {
      const id = Cookies.get("uid");
      const token = Cookies.get("tokenUser");

      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/userExams/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          userAPIKEY: token,
        },
      });

      const data = await res.json();
      setExams(data);
    } catch (err) {
      console.error("Error fetching exams:", err);
    } finally {
      setLoading(false);
    }
  }


  const setUserExamPending = async (examId) => {
    try {
      const id = Cookies.get("uid");
      const token = Cookies.get("tokenUser");
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/userExamPending/${examId}?user_id=${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'userAPIKEY': token,
        }
      });
      const parsed = await res.json();
      if (res.ok) {
        navigate(`/exams/${examId}`)
      }
      else {
        showError("Some Error Occured")
      }
      setLoading(false);
    }
    catch (err) {
      console.error(err);
    }
  }

  return (
    <Box sx={{ minHeight: "90vh", bgcolor: "#f7f7f7", p: 4 }}>
      <Box sx={{ maxWidth: "1000px", mx: "auto" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
          Available Exams
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={6}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {exams.map((exam) => (
              <Grid item xs={12} md={6} key={exam._id}>
                <Card elevation={3}>
                  <CardHeader
                    title={
                      <Typography variant="h6" color="text.primary">
                        {exam.name}
                      </Typography>
                    }
                    sx={{ bgcolor: "#fafafa", borderBottom: "1px solid #eee" }}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Questions
                        </Typography>
                        <Typography color="text.primary">
                          {exam.questions.length}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Duration
                        </Typography>
                        <Typography color="text.primary">1 hour</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Total Marks
                        </Typography>
                        <Typography color="text.primary">
                          {exam.questions.length * 1000}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box display="flex" gap={2} mt={3}>
                      { exam.attempted === "true" || exam.attempted === "pending" ? (
                        <>
                          <Button
                            variant="outlined"
                            fullWidth
                            disabled
                            startIcon={<CheckIcon />}
                          >
                            Attempted
                          </Button>
                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<VisibilityIcon />}
                            onClick={() => navigate(`/score/${exam.exam_id}`)}
                          >
                            View Score
                          </Button>
                        </> ) :
                      // ) : exam.attempted === "pending" ? (
                      //   <Button
                      //     variant="outlined"
                      //     fullWidth
                      //     disabled
                      //     startIcon={<VisibilityIcon />}
                      //   >
                      //     Calculating Score
                      //   </Button>
                      // ) : (
                      (
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<PlayArrowIcon />}
                          onClick={() => setUserExamPending(exam.exam_id)}
                          sx={{
                            bgcolor: "grey.900",
                            color: "white",
                            "&:hover": {
                              bgcolor: "grey.800",
                            },
                          }}
                        >
                          Attempt
                        </Button>
                      ) }
                    </Box>

                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default Exam;
