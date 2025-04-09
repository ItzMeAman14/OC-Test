
import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Avatar,
  Grid,
  Card,
  CardContent,
} from "@mui/material"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import PersonIcon from "@mui/icons-material/Person"
import { useLeaderBoard } from "./context/Leaderboard";
import Cookies from "js-cookie";

const LeaderBoard = (props) => {
  const { leaderboard, currentUser, setLeaderboard, setCurrentUser } = useLeaderBoard();

  const [topUsers,setTopUsers] = useState([]);

  useEffect(() => {
    const uid = Cookies.get("uid");

    leaderboard.sort((a,b) => b.score - a.score)

    const topusers = leaderboard.filter((user,index) => index < 3 )
    setTopUsers(topusers);
    setLeaderboard(leaderboard)

    let currentUserIndex = null;
      
    for(let i=0;i<leaderboard.length;i++){
      if(leaderboard[i].id === uid){
        currentUserIndex = i;
        break;
      }
    }
    const user = leaderboard.filter((user) => user.id === uid)
    const curUser = {...user[0],index:currentUserIndex}
    setCurrentUser(curUser);
    props.sendCurrentUserToParent(curUser);
    
  },[])

  const getMedalColor = (index) => {
    switch (index) {
      case 0:
        return "#FFD700" // Gold
      case 1:
        return "#C0C0C0" // Silver
      case 2:
        return "#CD7F32" // Bronze
      default:
        return null
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: "#f5f5f5" }}>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        { topUsers.slice(0, 3).map((user,index) => (
          <Grid item xs={12} md={4} key={user.id}>
            <Card
              sx={{
                position: "relative",
                overflow: "visible",
                height: "100%",
                backgroundColor:
                  index === 0
                    ? "rgba(255, 215, 0, 0.05)"
                    : index === 1
                      ? "rgba(192, 192, 192, 0.05)"
                      : "rgba(205, 127, 50, 0.05)",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -15,
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: getMedalColor(index),
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold", color: "#fff" }}>
                  {index + 1}
                </Typography>
              </Box>
              <CardContent sx={{ pt: 3, textAlign: "center" }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    margin: "0 auto 16px",
                    backgroundColor: "primary.main",
                  }}
                >
                  <PersonIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  {user.name}
                </Typography>
                <Typography variant="h4" sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}>
                  {user.score.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  null assessments completed
                </Typography>
                
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Leaderboard Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            <TableRow 
            sx={{
                backgroundColor: "rgba(25, 118, 210, 0.08)",
                }}>

              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    {(currentUser.index + 1) <= 3 ? (
                      <EmojiEventsIcon
                        sx={{
                          color: getMedalColor(currentUser.index),
                          mr: 1,
                          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
                        }}
                      />
                    ) : (
                      <Typography variant="body2" sx={{ minWidth: 24 }}>
                        {currentUser.index + 1}
                      </Typography>
                    )}
                  </Box>
              </TableCell>

              <TableCell>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        mr: 2,
                        backgroundColor: "primary.main",
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="body2">
                      {currentUser.name}
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{
                            ml: 1,
                            backgroundColor: "primary.main",
                            color: "white",
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                          }}
                        >
                          You
                        </Typography>
                    </Typography>
                  </Box>
              
              </TableCell>

              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {currentUser.score}
                </Typography>
              </TableCell>

            </TableRow>

            {leaderboard.map((user,index) => (
              
              user.id !== currentUser.id && (
              <TableRow
                key={user.id}
                sx={{
                  backgroundColor:  "inherit",
                }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {(index + 1) <= 3 ? (
                      <EmojiEventsIcon
                        sx={{
                          color: getMedalColor(index),
                          mr: 1,
                          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
                        }}
                      />
                    ) : (
                      <Typography variant="body2" sx={{ minWidth: 24 }}>
                        {index + 1}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        mr: 2,
                        backgroundColor: "primary.main",
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="body2">
                      {user.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {user.score}
                  </Typography>
                </TableCell>
                
              </TableRow>
              )
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </Container>
  )
}

export default LeaderBoard