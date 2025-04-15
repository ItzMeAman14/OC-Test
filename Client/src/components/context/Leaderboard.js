import React, { createContext, useState , useContext } from 'react'

const LeaderBoardContext = createContext();

export const useLeaderBoard = () => {
    return useContext(LeaderBoardContext);
};

export const LeaderboardProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});
    const [leaderboard, setLeaderboard] = useState([]);


    const calculateScore = (totalTestCases,totalTimeInMs,totalSubmission,testCasesPassed,timeTakenInMs,totalSubmissionDone) => {

      // Adjust Weights Accordingly for priority
      const W1 = 1
      const W2 = 1.001
      const W3 = 1

      const Score = ((testCasesPassed/totalTestCases) * W1) + (((totalTimeInMs - timeTakenInMs)/totalTimeInMs) * W2) +
      ((totalSubmission/totalSubmissionDone)* W3)

      const finalScore = (Score/3) * 100
      return finalScore
    }

    return (
        <LeaderBoardContext.Provider value={{ leaderboard, currentUser, calculateScore, setLeaderboard, setCurrentUser }}>
            {children}
        </LeaderBoardContext.Provider>
    );
};
