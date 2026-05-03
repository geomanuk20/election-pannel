import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = '/api';

const Scoreboard = () => {
    const [districts, setDistricts] = useState([]);
    const [headerText, setHeaderText] = useState('മണ്ഡലം');
    const [rotateTime, setRotateTime] = useState(20);
    const [currentPage, setCurrentPage] = useState(0);
    const ITEMS_PER_PAGE = 20;

    const fetchData = async () => {
        try {
            const districtsRes = await axios.get(`${API_BASE}/districts`);
            setDistricts(districtsRes.data);
            
            const headerRes = await axios.get(`${API_BASE}/data`);
            if (headerRes.data) {
                if (headerRes.data.columnHeader) setHeaderText(headerRes.data.columnHeader);
                if (headerRes.data.rotateTime) setRotateTime(headerRes.data.rotateTime);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    useEffect(() => {
        fetchData();
        const pollInterval = setInterval(fetchData, 3000);
        return () => clearInterval(pollInterval);
    }, []);

    useEffect(() => {
        // Page cycling timer using dynamic rotateTime
        const intervalMs = (rotateTime || 20) * 1000;
        const pageInterval = setInterval(() => {
            if (districts.length > ITEMS_PER_PAGE) {
                setCurrentPage(prev => (prev + 1) % Math.ceil(districts.length / ITEMS_PER_PAGE));
            }
        }, intervalMs);

        return () => clearInterval(pageInterval);
    }, [districts.length, rotateTime]);

    // Calculate current slice of 20 districts
    const startIdx = currentPage * ITEMS_PER_PAGE;
    const currentDistricts = districts.slice(startIdx, startIdx + ITEMS_PER_PAGE);
    
    // Split the 20 districts into two columns of 10
    const leftColumn = currentDistricts.slice(0, 10);
    const rightColumn = currentDistricts.slice(10, 20);
    const totalPages = Math.ceil(districts.length / ITEMS_PER_PAGE);

    return (
        <div className="container" key={currentPage}>
            <div className="district-grid-wrapper reveal-container">
                <div className="district-grid">
                    {/* Left Column */}
                    <div className="column-container">
                        <div className="column-header">{headerText}</div>
                        {leftColumn.map((district) => (
                            <div key={district._id} className="district-item reveal-item">
                                <div className="district-name">{district.name}</div>
                                <div className={`party-lead-box bg-${district.lead.toLowerCase()}`}>
                                    {district.lead}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column */}
                    <div className="column-container">
                        <div className="column-header">{headerText}</div>
                        {rightColumn.map((district) => (
                            <div key={district._id} className="district-item reveal-item">
                                <div className="district-name">{district.name}</div>
                                <div className={`party-lead-box bg-${district.lead.toLowerCase()}`}>
                                    {district.lead}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scoreboard;
