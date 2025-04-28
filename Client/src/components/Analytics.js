import React, { useCallback, useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, LinearProgress, Grid } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useParams } from 'react-router-dom';
import Cookies from "js-cookie";
import NoScoresFound from "./NoScoresFound";

ChartJS.register(ArcElement, Tooltip, Legend);

const Analytics = () => {
    const { id } = useParams();
    const [testCasesPassed, setTestCasesPassed] = useState(0);
    const [totalTestCases, setTotalTestCases] = useState(0);
    const [timeTaken, setTimeTaken] = useState({});
    const [givenTime, setGivenTime] = useState(0); 
    const [numOfSubmissions, setNumOfSubmissions] = useState(0);
    const [noScores,setNoScores] = useState(false);


    const formatTime = (timeInSec) => {
        const min = Math.round(timeInSec / 60);
        const sec = timeInSec % 60;

        return {min,sec};
    }


    const getScores = useCallback( async() => {
        try {
            const uid = Cookies.get("uid");
            const token = Cookies.get("tokenUser");
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getuserScores/${id}?user_id=${uid}`,{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    "userAPIKEY":token
                  },
            });
            const parsed = await res.json();
            if(parsed.message !== "No Scores Found"){
                setTestCasesPassed(parsed.testCasesPassed);
                setTotalTestCases(parsed.totalTestCases);
                setTimeTaken(formatTime(parsed.timeTaken));
                setGivenTime(parsed.givenTime);
                setNumOfSubmissions(parsed.numOfSubmissions);
            }
            else{
                setNoScores(true);
            }
        }
        catch(err){
            console.error(err);
        }
    }, [id]);

    useEffect(() => {
        getScores();
    }, [getScores]);

    // Calculate pass rate
    const passRate = ((testCasesPassed / totalTestCases) * 100).toFixed(2);

    // Use givenTime for efficiency analysis
    const efficiency = (timeTaken.min + Math.round(timeTaken.sec / 60)) <= givenTime * 0.5
        ? 'Efficient' 
        : (timeTaken.min + Math.round(timeTaken.sec / 60)) <= givenTime * 0.7
        ? 'Average' 
        : 'Slow';

    const submissionEfficiency = numOfSubmissions <= 2 ? 'Efficient' : 'Inefficient';
    
    // Pass rate message
    const getPassRateMessage = () => {
        if (passRate === 100) return 'Perfect! All test cases passed.';
        if (passRate >= 75) return 'Great job! You passed most test cases.';
        if (passRate >= 50) return 'Decent, but review your solution to pass more test cases.';
        return 'You need to revisit your solution. Most test cases failed.';
    };

    // Pie chart data
    const pieChartData = {
        labels: ['Passed', 'Failed'],
        datasets: [
            {
                data: [testCasesPassed, totalTestCases - testCasesPassed],
                backgroundColor: ['#4caf50', '#f44336'],
                borderColor: ['#4caf50', '#f44336'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <Box sx={{ padding: 2, height: "90vh" }}>
            <Typography variant="h4" align="center" sx={{ marginBottom: 2 }}>
                Coding Exam Analytics
            </Typography>

            {
                !noScores ?
                
                <Grid container spacing={4}>
                <Grid item xs={12} sm={8}>
                    {/* Test Cases Results */}
                    <Card sx={{ marginBottom: 2 }}>
                        <CardContent>
                            <Typography variant="h6">Test Case Results</Typography>
                            <Typography variant="body1">{`Test Cases Passed: ${testCasesPassed} / ${totalTestCases}`}</Typography>
                            <Typography variant="body1">{`Pass Rate: ${passRate}%`}</Typography>
                            <LinearProgress variant="determinate" value={Math.floor(passRate)} sx={{ marginTop: 1 }} />
                            <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                                {getPassRateMessage()}
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Time Efficiency */}
                    <Card sx={{ marginBottom: 2 }}>
                        <CardContent>
                            <Typography variant="h6">Time Efficiency</Typography>
                            <Typography variant="body1">{`Time Taken: ${timeTaken.min} minutes ${timeTaken.sec} seconds`}</Typography>
                            <Typography variant="body1">{`Given Time: ${givenTime} minutes`}</Typography>
                            <Typography
                                variant="body1"
                                color={efficiency === 'Efficient' ? 'success.main' : efficiency === 'Average' ? 'warning.main' : 'error.main'}
                                >
                                {`Efficiency: ${efficiency}`}
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Submission Analysis */}
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Submission Analysis</Typography>
                            <Typography variant="body1">{`Number of Submissions: ${numOfSubmissions}`}</Typography>
                            <Typography variant="body1" color={submissionEfficiency === 'Efficient' ? 'success.main' : 'error.main'}>
                                {`Submission Efficiency: ${submissionEfficiency}`}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right Column for Pie Chart */}
                <Grid item xs={12} sm={4}>
                    <Card sx={{ marginBottom: 2 }}>
                        <CardContent>
                            <Typography variant="h6">Test Case Pass/Fail Breakdown</Typography>
                            <Pie data={pieChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            
            :
            <NoScoresFound />
        }
        </Box>
    );
};

export default Analytics;
