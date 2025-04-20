import { useState, useEffect } from "react"
import {
  Box,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Grid,
} from "@mui/material"
import { ExpandMore as ExpandMoreIcon, Search as SearchIcon, Description } from "@mui/icons-material"
import Cookies from "js-cookie";
import * as XLSX from "xlsx";
import NoScoresFound from "../NoScoresFound";

export default function UserScores() {
  const [searchTerm, setSearchTerm] = useState("")
  const [examScores, setExamScores ] = useState([]);
  
  const [filters, setFilters] = useState()

  const handleStatusFilterChange = (examId, value) => {
    setFilters({
      ...filters,
      [examId]: { ...filters[examId], status: value },
    })
  }

  const handleScoreFilterChange = (examId, value) => {
    setFilters({
      ...filters,
      [examId]: { ...filters[examId], score: value },
    })
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "true":
        return { text: "Completed", color: "#333333" }
      case "false":
        return { text: "Not Started", color: "#777777" }
      case "pending":
        return { text: "In Progress", color: "#555555" }
      default:
        return { text: "Unknown", color: "#999999" }
    }
  }

  const filterUsersByStatus = (users, examId) => {
    const statusFilter = filters[examId].status
    if (statusFilter === "all") {
      return users
    }
    return users.filter((user) => user.status === statusFilter)
  }

  const filterUsersByScore = (users, examId) => {
    const scoreFilter = filters[examId].score
    if (scoreFilter === "all") {
      return users
    }

    return users.filter((user) => {
      // Only filter users who have completed the exam

      switch (scoreFilter) {
        case "excellent":
          return user.score >= 80
        case "good":
          return user.score >= 60 && user.score < 80
        case "average":
          return user.score >= 40 && user.score < 60
        case "poor":
          return user.score < 40
        default:
          return true
      }
    })
  }

  const filterUsersBySearch = (users) => {
    if (!searchTerm) {
      return users
    }
    return users.filter((user) => user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  const getFilteredUsers = (users, examId) => {
    let filteredUsers = filterUsersByStatus(users, examId)
    filteredUsers = filterUsersByScore(filteredUsers, examId)
    return filterUsersBySearch(filteredUsers)
  }


  const scoreFormatInPercentage = (score, id) => {
    const examData = examScores.filter((exam) => exam.id === id)

    let percentage = ((score * 100)/examData[0].totalScore);
    return parseFloat(percentage.toFixed(2));
  }


  const exportToExcel = (id) => {

    const wb = XLSX.utils.book_new();

    const examData = examScores.filter((exam) => exam.id === id)

    examData.forEach(exam => {
      const usersData = exam.users.map(user => [
        user.email,
        user.score,
        user.status
      ]);

      const headers = ["Email", "Score", "Status"];
      const data = [headers, ...usersData];

      const ws = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, exam.name);
    });

    XLSX.writeFile(wb, 'CCL_ExamSheet.xlsx');

  }

  const getAllUsersScore = async () => {
      try{
        const token = Cookies.get("tokenAdmin")
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getFormattedScoreForAdmin`,{
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "userAPIKEY": token
          }
        })

        const parsed = await res.json();
        if(parsed.length !== 0){

          setFilters(
            
            parsed.reduce((acc, exam) => {
              acc[exam.id] = { status: "all", score: "all" }
              return acc
            }, {}),
          )
          
          setExamScores(parsed);
        }
      }
      catch(err){
        console.error(err);
      }
  }

  useEffect(() => {
    getAllUsersScore()
  },[])

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, color: "#333333" }}>
        User Scores
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, color: "#555555" }}>
        Total Exams: {examScores.length}
      </Typography>
      {
        examScores.length === 0
        ? 
        <NoScoresFound /> 
        :
      
        examScores.map((exam) => (
        <Accordion
          key={exam.id}
          sx={{
            mb: 2,
            backgroundColor: "#f8f8f8",
            border: "1px solid #e0e0e0",
            "& .MuiAccordionSummary-root": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#555555" }} />}>
            <Typography sx={{ color: "#333333", fontWeight: "medium" }}>{exam.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Search by email..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "#555555" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#e0e0e0",
                        },
                        "&:hover fieldset": {
                          borderColor: "#aaaaaa",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#555555",
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel id={`status-filter-label-${exam.id}`} sx={{ color: "#555555" }}>
                      Filter by Status
                    </InputLabel>
                    <Select
                      labelId={`status-filter-label-${exam.id}`}
                      value={filters[exam.id].status}
                      label="Filter by Status"
                      onChange={(e) => handleStatusFilterChange(exam.id, e.target.value)}
                      sx={{
                        color: "#333333",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#e0e0e0",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#aaaaaa",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#555555",
                        },
                      }}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="true">Completed</MenuItem>
                      <MenuItem value="false">Not Started</MenuItem>
                      <MenuItem value="pending">In Progress</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel id={`score-filter-label-${exam.id}`} sx={{ color: "#555555" }}>
                      Filter by Score
                    </InputLabel>
                    <Select
                      labelId={`score-filter-label-${exam.id}`}
                      value={filters[exam.id].score}
                      label="Filter by Score"
                      onChange={(e) => handleScoreFilterChange(exam.id, e.target.value)}
                      sx={{
                        color: "#333333",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#e0e0e0",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#aaaaaa",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#555555",
                        },
                      }}
                    >
                      <MenuItem value="all">All Scores</MenuItem>
                      <MenuItem value="excellent">80-100% (Excellent)</MenuItem>
                      <MenuItem value="good">60-79% (Good)</MenuItem>
                      <MenuItem value="average">40-59% (Average)</MenuItem>
                      <MenuItem value="poor">Below 40% (Poor)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Typography variant="subtitle2" sx={{ mb: 1, color: "#555555" }}>
                Showing {getFilteredUsers(exam.users, exam.id).length} of {exam.users.length} users
              </Typography>

              <Button
                sx={{ backgroundColor: "#18a300", color: "white" }}
                startIcon={<Description />} start
                onClick={() => exportToExcel(exam.id)}
              >
                Export as Excel
              </Button>
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
              <Table>
                <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", color: "#333333" }}>S.No.</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#333333" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#333333" }}>Score</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#333333" }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredUsers(exam.users, exam.id).map((user, index) => (
                    <TableRow key={user.id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}>
                      <TableCell sx={{ color: "#333333" }}>{index + 1}</TableCell>
                      <TableCell sx={{ color: "#333333" }}>{user.email}</TableCell>
                      <TableCell sx={{ color: "#333333" }}>{user.status === "true" ? `${scoreFormatInPercentage(user.score,exam.id)}%` : "-"}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color: getStatusLabel(user.status).color,
                            fontWeight: user.status === "true" ? "bold" : "normal",
                          }}
                        >
                          {getStatusLabel(user.status).text}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  {getFilteredUsers(exam.users, exam.id).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ color: "#777777" }}>
                        No users match the current filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}
