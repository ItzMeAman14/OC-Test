import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ExamList = () => {
  const exams = [
    {
      title: "Mathematics Final",
      questions: 50,
      duration: "3 hours",
      totalMarks: 100,
      subject: "Mathematics",
    },
    {
      title: "Physics Mid-term",
      questions: 30,
      duration: "2 hours",
      totalMarks: 75,
      subject: "Physics",
    },
    {
      title: "Chemistry Lab Test",
      questions: 25,
      duration: "1.5 hours",
      totalMarks: 50,
      subject: "Chemistry",
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#1a1a1a",
        minHeight: "100vh",
        p: 4,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "stretch",
        gap: 3,
      }}
    >
      {exams.map((exam, index) => (
        <Card
          key={index}
          sx={{
            width: 400,
            height: 300,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#222222",
            color: "#ffffff",
            border: "1px solid #333333",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "pointer",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            },
          }}
        >
          <CardHeader
            title={
              <Typography variant="h6" color="#fff">
                {exam.title}
              </Typography>
            }
            subheader={
              <Typography variant="subtitle2" color="#888">
                {exam.subject}
              </Typography>
            }
          />
          <CardContent
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 1,
              color: "#aaadb0",
            }}
          >
            <Typography>Questions: {exam.questions}</Typography>
            <Typography>Duration: {exam.duration}</Typography>
            <Typography>Total Marks: {exam.totalMarks}</Typography>
          </CardContent>
          <CardActions
            sx={{
              borderTop: "1px solid #333333",
              padding: 2,
              mt: "auto",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              disabled
              sx={{
                backgroundColor: "#403E43",
                color: "#888888",
                opacity: 0.7,
                cursor: "not-allowed",
                "&:hover": { backgroundColor: "#403E43" },
              }}
            >
              Completed
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#403E43",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: 1,
                "&:hover": { backgroundColor: "#555" },
              }}
            >
              <VisibilityIcon sx={{ fontSize: 18 }} />
              View Score
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default ExamList;