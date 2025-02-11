import React from 'react';
import '../css/Navbar.css';
import { Link } from 'react-router-dom';

function Navbar(props) {

  function toggleMode(){
    if( props.mode === ''){
      props.setMode('dark-mode');
      props.setModelogo('sun');
    } 
    else{
      props.setMode('');
      props.setModelogo('moon');
    }
  }

  return (
    <div>
        <nav className="navbar">
                <h3 className='mx-2'>AlComp</h3>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/exams">Exams</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li><button id="toggle-theme" onClick={toggleMode} className="theme-button"><i className={`fa-solid fa-${props.Modelogo}`}></i></button></li>
                </ul>
        </nav>
    </div>
  )
}

export default Navbar;
