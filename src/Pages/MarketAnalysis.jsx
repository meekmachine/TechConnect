import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts';

// Job Market Demand Data
const jobDemandData = [
    { month: 'Jan', openings: 5000, applications: 10000 },
    { month: 'Feb', openings: 5200, applications: 11000 },
    { month: 'Mar', openings: 5300, applications: 11500 },
    { month: 'Apr', openings: 5400, applications: 12000 },
    { month: 'May', openings: 5500, applications: 12500 },
];

// Skills in Demand Data
const skillsData = [
    { skill: 'Data Analysis', demand: 85 },
    { skill: 'Cloud Computing', demand: 90 },
    { skill: 'AI & Machine Learning', demand: 95 },
    { skill: 'Cybersecurity', demand: 80 },
    { skill: 'Project Management', demand: 75 },
];

const MarketAnalysis = () => {
    return (
        <div style={{ textAlign: 'center', margin: '20px' }}>
            <h1>Market Analysis</h1>

            {/* Job Market Demand Line Chart */}
            <div style={{ marginBottom: '50px' }}>
                <h2>Job Market Demand (Applications vs Openings)</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={jobDemandData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="openings" stroke="#8884d8" strokeWidth={2} />
                        <Line type="monotone" dataKey="applications" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Skills in Demand Bar Chart */}
            <div>
                <h2>Skills in Demand</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={skillsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="skill" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="demand" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MarketAnalysis;
