import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loader from './Loader';
import '../css/Examdetail.css';

function ExamDetail() {
  const [data, setdata] = useState(null);
  const [loading,setloading] = useState(false);
  const [ques, setques] = useState(null);
  const { id } = useParams();
  const getInfo = async () => {
    setloading(true);
    try{
      const res = await fetch('http://localhost:7123/getExam', {
        method:"POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
          id:id
        })
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const parseData = await res.json();
      setdata(parseData);
    }
    catch(err){
      console.log("Error fetching data: "+err);
    }
    finally{
      setloading(false);
    }
  }
  
  const filterQues = (idtoFilter) => {
    let question = data[0].questions.filter(ques => ques.id===idtoFilter);
    setques(question);
    console.log(ques);
  }


  useEffect(() => {
    getInfo();
  }, [id]);

  return (
    <div>
      {/* <button onClick={getInfo}>Get Data</button> */}
      {loading && <Loader/>}
      <div className='sidebar'>
        <div className="container text-center">
          <div className='row row-cols-3'>
          {data && data[0].questions.map((ques,index) => {
             return (
                  <button className='col sidebar-button' key={ques.id} onClick={() => {filterQues(ques.id)}}>{index+1}</button>
             )
            })}
            </div>
        </div>
      </div>

          
      <div>
        {ques && 
        <p key={ques.id}>{JSON.stringify(ques)}</p>
        }
      </div>
    </div>
  );
}

export default ExamDetail;
