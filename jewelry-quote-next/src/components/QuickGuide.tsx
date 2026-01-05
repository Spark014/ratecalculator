import React from 'react';

export const QuickGuide: React.FC = () => {
    return (
        <div className="card">
            <h2>Quick Guide</h2>
            <div className="small" style={{ lineHeight: 1.6 }}>
                <b>1) Treatment Multiplier:</b> For colored gems Heated/No Heat/Filled etc. (Adjust multipliers in catalog)<br />
                <b>2) Diamond Auto Price:</b> Simplified 4C table + Cut/Fluor multiplier (Replace with Rap/Own table)<br />
                <b>3) Side Stone Estimate:</b> Diameter(mm) interpolated from common "Round Diamond mm→ct" table; Replace with your own table for strict accuracy.
            </div>
        </div>
    );
};
