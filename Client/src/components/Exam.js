import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Loader from './Loader';

function Exam() {
  const [Data, setData] = useState(null);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    getExams();
  }, []);

  async function getExams(){
    try{

      setloading(true);
      const res = await fetch('http://localhost:7123/getAllExams')
      const data = await res.json();
      setloading(false);
      setData(data);
    }
    catch(err){
      console.error(err);
    }
  }
  return (
    <div>
      <h1>Exams Page</h1>
      <div className="row">
        { loading && <Loader/>}
        {Data && Data.map(exam => (
          <div className="col-md-3 mb-4" key={exam._id} style={{"marginLeft":"100px"}}>
            <div className="card" style={{ "width": "18rem" }}>
              <div className="card-body">
                <h5 className="card-title">{exam.name}</h5>
                <p className="card-text">Time to attempt the exam is 2 hours and if open any extra tab or try to cheat then the test will automatically submit.</p>
                <Link to={`/exams/${exam._id}`} className="card-link">Attempt</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Exam;
