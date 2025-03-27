import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';
import _ from 'lodash';

const CytokineDashboard = () => {
    const [data, setData] = useState({});
    const [timepoints, setTimepoints] = useState([]);
    const [cytokines, setCytokines] = useState([]);
    const [functionalGroups, setFunctionalGroups] = useState({});
    const [selectedCytokine, setSelectedCytokine] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [logarithmic, setLogarithmic] = useState(false);

    // HC colors in blue shades
    const hcColors = useMemo(() => ['#003f5c', '#2f4b7c', '#665191', '#a05195'], []);

    // AD/MCI colors in orange/red shades
    const adColors = useMemo(() => ['#f95d6a', '#ff7c43', '#ffa600', '#ff4500'], []);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await window.fs.readFile('ADLPS Serum Raw and SelfNL Analysis');
            const text = new TextDecoder().decode(response);

            Papa.parse(text, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const parsedData = results.data;

                    // Extract timepoints and cytokines
                    const extractedTimepoints = [...new Set(parsedData.map(row => row.Timepoint))];

                    // Get cytokine names by filtering out non-cytokine columns
                    const nonCytokineColumns = ['PATIENT', 'Group', 'Timepoint'];
                    const extractedCytokines = Object.keys(parsedData[0])
                        .filter(key => !nonCytokineColumns.includes(key))
                        .map(key => key.trim());

                    // Sort timepoints properly
                    const sortedTimepoints = [...extractedTimepoints].sort((a, b) => a - b);

                    setTimepoints(sortedTimepoints);
                    setCytokines(extractedCytokines);
                    setData(parsedData);
                }
            });
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            {/* Your visualization code here */}
        </div>
    );
};

export default CytokineDashboard;
