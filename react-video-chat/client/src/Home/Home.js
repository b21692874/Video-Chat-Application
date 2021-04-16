import React from 'react'
import './Home.css'
import {Link} from 'react-router-dom';

function Home() {
    return (
        <div className="container">
            <Link to="/musteri">
                <button className="start-button">Görüşme Başlat</button>    
            </Link>
        </div>
    )
}

export default Home
