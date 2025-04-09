import React, { createContext, useState , useContext } from 'react';

const LeaderBoardContext = createContext();


export const useLeaderBoard = () => {
    return useContext(LeaderBoardContext);
};


export const LeaderboardProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});
    const [leaderboard, setLeaderboard] = useState([
      {
        id: 1,
        name: "Alex Johnson",
        score: 9850
      },
      {
        id: 2,
        name: "Maria Garcia",
        score: 9720
      },
      {
        id: 3,
        name: "David Kim",
        score: 9650
      },
      {
        id: 4,
        name: "Sarah Williams",
        score: 9540
      },
      {
        id: 5,
        name: "James Chen",
        score: 9480
      },
      {
        id: 6,
        name: "Emily Davis",
        score: 9350
      },
      {
        id: 7,
        name: "Michael Brown",
        score: 9240
      },
      {
        id: 8,
        name: "Jessica Lee",
        score: 9180
      },
      {
        id: 9,
        name: "Robert Wilson",
        score: 9050
      },
      {
        id: 10,
        name: "Lisa Martinez",
        score: 8970
      },
      // Bottom users
      {
        id: 11,
        name: "Current User",
        score: 5240
      },
      {
        id: 12,
        name: "Thomas Clark",
        score: 4980
      },
      {
        id: 13,
        name: "Olivia White",
        score: 4820
      },
      {
        id: 14,
        name: "Daniel Taylor",
        score: 4650
      },
      {
        id: 15,
        name: "Sophia Adams",
        score: 4520
      }]);


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

    const updateScore = (id,newScore) => {
      setLeaderboard((prevLeaderboard) =>
        prevLeaderboard.map((user) =>
          user.id === id ? { ...user, score: newScore } : user
        )
      )
    }

    return (
        <LeaderBoardContext.Provider value={{ leaderboard, updateScore, currentUser, calculateScore, setLeaderboard, setCurrentUser }}>
            {children}
        </LeaderBoardContext.Provider>
    );
};
