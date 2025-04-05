"use client"

import { useState } from "react"
import {
  Box,
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
import { ExpandMore as ExpandMoreIcon, Search as SearchIcon } from "@mui/icons-material"

// Mock data for exams and user scores
const mockExams = [
  {
    id: 1,
    name: "Data Structures Exam",
    users: [
      { id: 101, email: "john@example.com", score: 85, status: "true" },
      { id: 102, email: "jane@example.com", score: 92, status: "true" },
      { id: 103, email: "robert@example.com", score: 78, status: "true" },
      { id: 104, email: "emily@example.com", score: 0, status: "pending" },
      { id: 105, email: "michael@example.com", score: 0, status: "false" },
    ],
  },
  {
    id: 2,
    name: "Algorithms Exam",
    users: [
      { id: 201, email: "john@example.com", score: 76, status: "true" },
      { id: 202, email: "jane@example.com", score: 88, status: "true" },
      { id: 203, email: "sarah@example.com", score: 0, status: "pending" },
      { id: 204, email: "david@example.com", score: 0, status: "false" },
      { id: 205, email: "lisa@example.com", score: 0, status: "false" },
      { id: 206, email: "thomas@example.com", score: 0, status: "pending" },
    ],
  },
  {
    id: 3,
    name: "Database Systems Exam",
    users: [
      { id: 301, email: "john@example.com", score: 90, status: "true" },
      { id: 302, email: "robert@example.com", score: 82, status: "true" },
      { id: 303, email: "emily@example.com", score: 0, status: "pending" },
      { id: 304, email: "michael@example.com", score: 0, status: "false" },
      { id: 305, email: "sarah@example.com", score: 0, status: "false" },
      { id: 306, email: "alex@example.com", score: 55, status: "true" },
      { id: 307, email: "patricia@example.com", score: 42, status: "true" },
      { id: 308, email: "james@example.com", score: 35, status: "true" },
    ],
  },
]

export default function UserScores() {
  const [searchTerm, setSearchTerm] = useState("")
  // Store filters for each exam separately
  const [filters, setFilters] = useState(
    mockExams.reduce((acc, exam) => {
      acc[exam.id] = { status: "all", score: "all" }
      return acc
    }, {}),
  )

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
      if (user.status !== "true") return true

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

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, color: "#333333" }}>
        User Scores
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, color: "#555555" }}>
        Total Exams: {mockExams.length}
      </Typography>

      {mockExams.map((exam) => (
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
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
              <Table>
                <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", color: "#333333" }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#333333" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#333333" }}>Score</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#333333" }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredUsers(exam.users, exam.id).map((user) => (
                    <TableRow key={user.id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}>
                      <TableCell sx={{ color: "#333333" }}>{user.id}</TableCell>
                      <TableCell sx={{ color: "#333333" }}>{user.email}</TableCell>
                      <TableCell sx={{ color: "#333333" }}>{user.status === "true" ? `${user.score}%` : "-"}</TableCell>
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
