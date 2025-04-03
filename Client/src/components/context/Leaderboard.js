import React, { createContext, useState, useEffect , useContext } from 'react';
import Cookies from "js-cookie";

const LeaderBoardContext = createContext();


export const useLeaderBoard = () => {
    return useContext(LeaderBoardContext);
};


export const LeaderboardProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});
    const [leaderboard, setLeaderboard] = useState([{
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

    const addLeaderBoardUsers = (user) => {
        const newUser = [...leaderboard,user];
        setLeaderboard(newUser);
    }

    const alignUsers = () => {
        setLeaderboard((prevArray) => {
            prevArray.sort((a,b) => b.score - a.score )
        })
    }

    const updateScore = (id,newScore) => {
        setLeaderboard((prevArray) => {
            prevArray.map((user) => {
                return user.id === id ? { ...user,score:newScore } : user
            })
        })
    }

    useEffect(() => {
      const uid = Cookies.get("uid");
      let currentUserIndex = null;
      
      for(let i=0;i<leaderboard.length;i++){
        if(leaderboard[i].id === 5){
          currentUserIndex = i;
          break;
        }
      }
      const user = leaderboard.filter((user) => user.id === 5) // Here replace 2 with uid
      const curUser = {...user[0],index:currentUserIndex}
      setCurrentUser(curUser);
    },[currentUser.id])

    return (
        <LeaderBoardContext.Provider value={{ leaderboard, addLeaderBoardUsers, alignUsers, updateScore, currentUser }}>
            {children}
        </LeaderBoardContext.Provider>
    );
};
