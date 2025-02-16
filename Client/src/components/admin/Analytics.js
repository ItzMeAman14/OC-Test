import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Card, CardContent, LinearProgress, Grid } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const Analytics = () => {
    const testCasesPassed = 8;
    const totalTestCases = 10; // Total of 10 test cases
    const timeTaken = 15; // Time taken in minutes
    const avgTime = 12; // Expected average time in minutes
    const numOfSubmissions = 3; // Number of submissions made

    const passRate = ((testCasesPassed / totalTestCases) * 100).toFixed(2);
    const efficiency = timeTaken <= avgTime ? 'Efficient' : timeTaken <= avgTime * 1.5 ? 'Average' : 'Slow';
    const submissionEfficiency = numOfSubmissions <= 2 ? 'Efficient' : 'Inefficient';

    const getPassRateMessage = () => {
        if (passRate === 100) return 'Perfect! All test cases passed.';
        if (passRate >= 75) return 'Great job! You passed most test cases.';
        if (passRate >= 50) return 'Decent, but review your solution to pass more test cases.';
        return 'You need to revisit your solution. Most test cases failed.';
    };

    // Dummy data for the pie chart
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
        <Box sx={{ padding: 2, height:"89vh" }}>
            <Typography variant="h4" align="center" sx={{ marginBottom: 2 }}>
                Coding Exam Analytics
            </Typography>

            {/* Grid Layout: Left for Analysis, Right for Pie Chart */}
            <Grid container spacing={4}>
                {/* Left Column for Analysis */}
                <Grid item xs={12} sm={8}>
                    {/* Test Case Results */}
                    <Card sx={{ marginBottom: 2 }}>
                        <CardContent>
                            <Typography variant="h6">Test Case Results</Typography>
                            <Typography variant="body1">{`Test Cases Passed: ${testCasesPassed} / ${totalTestCases}`}</Typography>
                            <Typography variant="body1">{`Pass Rate: ${passRate}%`}</Typography>
                            <LinearProgress variant="determinate" value={passRate} sx={{ marginTop: 1 }} />
                            <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                                {getPassRateMessage()}
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Time Efficiency */}
                    <Card sx={{ marginBottom: 2 }}>
                        <CardContent>
                            <Typography variant="h6">Time Efficiency</Typography>
                            <Typography variant="body1">{`Time Taken: ${timeTaken} minutes`}</Typography>
                            <Typography variant="body1">{`Expected Time: ${avgTime} minutes`}</Typography>
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
        </Box>
    );
};

Analytics.propTypes = {
    testCasesPassed: PropTypes.number.isRequired,
    totalTestCases: PropTypes.number.isRequired,
    timeTaken: PropTypes.number.isRequired,
    avgTime: PropTypes.number.isRequired,
    numOfSubmissions: PropTypes.number.isRequired,
};

export default Analytics;
