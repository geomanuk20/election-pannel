import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE = '/api';

const Admin = () => {
    const [districts, setDistricts] = useState([]);
    const [newDistrict, setNewDistrict] = useState({ name: '', englishName: '', lead: 'NONE' });
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [headerText, setHeaderText] = useState('മണ്ഡലം');
    const [rotateTime, setRotateTime] = useState(20);
    const [previewPage, setPreviewPage] = useState(0);

    const fetchDistricts = async () => {
        try {
            const res = await axios.get(`${API_BASE}/districts`);
            setDistricts(res.data);
            
            const headerRes = await axios.get(`${API_BASE}/data`);
            if (headerRes.data) {
                if (headerRes.data.columnHeader) setHeaderText(headerRes.data.columnHeader);
                if (headerRes.data.rotateTime) setRotateTime(headerRes.data.rotateTime);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load data from server.');
        }
    };

    useEffect(() => {
        fetchDistricts();
    }, []);

    const handleDistrictChange = async (id, field, value) => {
        try {
            await axios.patch(`${API_BASE}/districts/${id}`, { [field]: value });
            await fetchDistricts();
            setMessage('Update saved!');
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            console.error('Update district error:', err);
            setError('Failed to update district.');
        }
    };

    const handleAddDistrict = async (e) => {
        e.preventDefault();
        if (!newDistrict.name) {
            setError('Please enter a district name.');
            return;
        }
        try {
            await axios.post(`${API_BASE}/districts`, newDistrict);
            setNewDistrict({ name: '', englishName: '', lead: 'NONE' });
            await fetchDistricts();
            setMessage('District added successfully!');
            setError('');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Add district error:', err);
            setError('Failed to add district.');
        }
    };

    const handleDeleteDistrict = async (id) => {
        if (!window.confirm('Are you sure you want to delete this district?')) return;
        try {
            await axios.delete(`${API_BASE}/districts/${id}`);
            await fetchDistricts();
            setMessage('District deleted!');
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            console.error('Delete district error:', err);
            setError('Failed to delete district.');
        }
    };

    const handleConfigUpdate = async () => {
        try {
            await axios.post(`${API_BASE}/config`, { 
                columnHeader: headerText,
                rotateTime: parseInt(rotateTime) || 20
            });
            setMessage('Settings updated successfully!');
            setError('');
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            console.error('Config update error:', err);
            setError('Failed to update settings.');
        }
    };

    // Pagination Logic for Preview
    const totalPages = Math.ceil(districts.length / 20 || 1);
    const startIdx = previewPage * 20;
    const currentDistricts = districts.slice(startIdx, startIdx + 20);
    const leftCol = currentDistricts.slice(0, 10);
    const rightCol = currentDistricts.slice(10, 20);

    return (
        <div className="admin-container" style={{maxWidth: '950px'}}>
            <h1 className="admin-title">Admin Panel</h1>
            <div style={{textAlign: 'center', marginBottom: '20px'}}>
                <Link to="/" className="btn btn-secondary" style={{display: 'inline-block', width: 'auto'}}>View Public Scoreboard</Link>
            </div>

            {/* Status Messages */}
            {message && <div style={{background: '#d4edda', color: '#155724', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center'}}>{message}</div>}
            {error && <div style={{background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center'}}>{error}</div>}

            {/* Header & Rotation Settings */}
            <div className="district-admin-item" style={{background: '#f0f4f8', padding: '20px', borderRadius: '12px', border: '1px solid #dee2e6', display: 'flex', flexDirection: 'column', gap: '20px'}}>
                <div style={{display: 'flex', gap: '20px', width: '100%'}}>
                    <div style={{flex: 2}}>
                        <label style={{marginBottom: '10px', display: 'block', fontWeight: 'bold'}}>Column Header (Title)</label>
                        <input 
                            type="text" 
                            value={headerText}
                            onChange={(e) => setHeaderText(e.target.value)}
                            style={{width: '100%'}}
                        />
                    </div>
                    <div style={{flex: 1}}>
                        <label style={{marginBottom: '10px', display: 'block', fontWeight: 'bold'}}>Rotation (Seconds)</label>
                        <input 
                            type="number" 
                            value={rotateTime}
                            onChange={(e) => setRotateTime(e.target.value)}
                            style={{width: '100%'}}
                        />
                    </div>
                </div>
                <button onClick={handleConfigUpdate} className="btn btn-primary" style={{width: '100%'}}>Save All Settings</button>
            </div>

            <hr style={{margin: '40px 0'}} />

            {/* Add New District */}
            <h2 className="admin-title" style={{fontSize: '1.8rem'}}>Add New Place</h2>
            <form onSubmit={handleAddDistrict} style={{background: '#eef2f7', padding: '20px', borderRadius: '12px', marginBottom: '40px', border: '1px solid #ced4da'}}>
                <div style={{marginBottom: '15px', display: 'flex', gap: '15px'}}>
                    <div style={{flex: 1}}>
                        <label style={{fontWeight: 'bold', display: 'block', marginBottom: '8px'}}>Malayalam Name</label>
                        <input 
                            type="text" 
                            placeholder="ഉദാ: തിരുവനന്തപുരം" 
                            value={newDistrict.name}
                            onChange={(e) => setNewDistrict({...newDistrict, name: e.target.value})}
                            style={{width: '100%', padding: '12px', fontSize: '1.2rem'}}
                        />
                    </div>
                    <div style={{flex: 1}}>
                        <label style={{fontWeight: 'bold', display: 'block', marginBottom: '8px'}}>English Name (for Search)</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Trivandrum" 
                            value={newDistrict.englishName}
                            onChange={(e) => setNewDistrict({...newDistrict, englishName: e.target.value})}
                            style={{width: '100%', padding: '12px', fontSize: '1.2rem'}}
                        />
                    </div>
                </div>
                <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                    <div style={{flex: 1}}>
                        <label style={{fontWeight: 'bold', display: 'block', marginBottom: '8px'}}>Select Lead Party</label>
                        <select 
                            className="select-lead"
                            value={newDistrict.lead}
                            onChange={(e) => setNewDistrict({...newDistrict, lead: e.target.value})}
                            style={{width: '100%', padding: '12px', height: '50px'}}
                        >
                            <option value="NONE">None</option>
                            <option value="LDF">LDF</option>
                            <option value="UDF">UDF</option>
                            <option value="NDA">NDA</option>
                            <option value="OTH">OTH</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{flex: 1, marginTop: '30px', height: '50px', padding: 0}}>Add Place</button>
                </div>
            </form>

            {/* List and Search */}
            <h2 className="admin-title" style={{fontSize: '1.8rem', textAlign: 'left'}}>Existing Districts</h2>
            <div style={{marginBottom: '20px'}}>
                <input 
                    type="text" 
                    placeholder="🔍 Search districts/constituencies..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd'}}
                />
            </div>

            <div className="district-list" style={{maxHeight: '400px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '8px', background: '#fff'}}>
                {districts.filter(d => 
                    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    (d.englishName && d.englishName.toLowerCase().includes(searchTerm.toLowerCase()))
                ).length === 0 ? 
                    <p style={{textAlign: 'center', color: '#666'}}>No districts found.</p> : 
                    districts
                        .filter(d => 
                            d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (d.englishName && d.englishName.toLowerCase().includes(searchTerm.toLowerCase()))
                        )
                        .map((district) => (
                            <div key={district._id} className="district-admin-item" style={{
                                background: '#fff', 
                                borderBottom: '1px solid #f0f0f0', 
                                margin: 0, 
                                borderRadius: 0, 
                                padding: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                {/* LEFT: Name Section */}
                                <div style={{flex: 2, minWidth: '200px'}}>
                                    <div style={{fontWeight: 'bold', fontSize: '1.1rem'}}>{district.name}</div>
                                    <div style={{fontSize: '0.8rem', color: '#888'}}>{district.englishName || 'No english name'}</div>
                                </div>

                                {/* CENTER: Dropdown Section */}
                                <div style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
                                    <select 
                                        className="select-lead"
                                        value={district.lead}
                                        onChange={(e) => handleDistrictChange(district._id, 'lead', e.target.value)}
                                        style={{padding: '8px 12px', width: '120px', fontSize: '1rem'}}
                                    >
                                        <option value="NONE">None</option>
                                        <option value="LDF">LDF</option>
                                        <option value="UDF">UDF</option>
                                        <option value="NDA">NDA</option>
                                        <option value="OTH">OTH</option>
                                    </select>
                                </div>

                                {/* RIGHT: Delete Section */}
                                <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end'}}>
                                    <button 
                                        onClick={() => handleDeleteDistrict(district._id)}
                                        className="btn-delete"
                                        style={{padding: '8px 20px'}}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                }
            </div>

            {/* LIVE PREVIEW SECTION */}
            <div style={{marginTop: '60px', borderTop: '4px solid #5d6d2b', paddingTop: '30px'}}>
                <h2 className="admin-title" style={{fontSize: '1.8rem', color: '#5d6d2b'}}>Live Scoreboard Preview</h2>
                <div style={{display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center', marginBottom: '20px'}}>
                    <button 
                        className="btn btn-secondary" 
                        style={{width: 'auto', margin: 0}}
                        onClick={() => setPreviewPage(prev => Math.max(0, prev - 1))}
                        disabled={previewPage === 0}
                    >
                        ← Previous Page
                    </button>
                    <span style={{fontWeight: 'bold', fontSize: '1.2rem'}}>PAGE {previewPage + 1} OF {totalPages}</span>
                    <button 
                        className="btn btn-secondary" 
                        style={{width: 'auto', margin: 0}}
                        onClick={() => setPreviewPage(prev => Math.min(totalPages - 1, prev + 1))}
                        disabled={previewPage >= totalPages - 1}
                    >
                        Next Page →
                    </button>
                </div>
                
                <div className="district-grid-wrapper" style={{transform: 'scale(0.9)', transformOrigin: 'top center'}}>
                    <div className="district-grid">
                        <div className="column-container">
                            <div className="column-header">{headerText}</div>
                            {leftCol.map((district) => (
                                <div key={district._id} className="district-item">
                                    <div className="district-name">{district.name}</div>
                                    <div className={`party-lead-box bg-${district.lead.toLowerCase()}`}>
                                        {district.lead}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="column-container">
                            <div className="column-header">{headerText}</div>
                            {rightCol.map((district) => (
                                <div key={district._id} className="district-item">
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
        </div>
    );
};

export default Admin;
