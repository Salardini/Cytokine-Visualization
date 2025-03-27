<HTML>
  <Script>
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
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
  const hcColors = ['#003f5c', '#2f4b7c', '#665191', '#a05195'];
  
  // AD/MCI colors in orange/red shades
  const adColors = ['#f95d6a', '#ff7c43', '#ffa600', '#ff4500'];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await window.fs.readFile('ADLPS Serum Raw and SelfNL Analysis N7 666.csv');
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
            const sortedTimepoints = [...extractedTimepoints].sort((a, b) => {
              return a - b;
            });
            
            // Define functional groups based on the actual column names in the CSV
            const cytokineFunctionalGroups = {
              "Growth Factors": [
                "EGF (12)", "FGF-2 (13)", "TGF-a (15)", "G-CSF (18)", "GM-CSF (20)", 
                "PDGF-AA (34)", "PDGF-BB (36)", "VEGF-A (78)", "TPO (36)", "LIF (34)", "SCF (38)"
              ],
              "Pro-inflammatory": [
                "IFNa2 (22)", "IFNy (25)", "IL-1a (44)", "IL-1B (46)", "IL-2 (48)", "IL-6 (57)", 
                "IL-8 (63)", "IL-12P40 (29)", "IL-12P70 (33)", "IL-17A (39)", "IL-18 (66)", 
                "IL-20 (51)", "IL-21 (52)", "TNFa (75)", "TNFB (76)", "GRO alpha (26)"
              ],
              "Anti-inflammatory": [
                "IL-1RA (42)", "IL-4 (53)", "IL-10 (27)", "IL-13 (35)"
              ],
              "Chemokines": [
                "Eotaxin (12)", "Eotaxin-1 (14)", "Eotaxin-3 (30)", "Fractalkine (21)", 
                "IP-10 (65)", "MCP-1 (67)", "MCP-2 (13)", "MCP-3 (28)", "MCP-4 (18)",
                "MDC (30)", "MIP-1a (72)", "MIP-1B (73)", "MIP-1d (76)", "RANTES (74)", 
                "BCA-1 (15)", "I-309 (19)", "TARC (26)", "6CKine (28)", "CTACK (62)",
                "SDF-1a+B (64)", "ENA-78 (66)"
              ],
              "T Cell / Immune Regulation": [
                "IL-3 (51)", "IL-5 (55)", "IL-7 (61)", "IL-9 (45)", "IL-15 (37)", 
                "IL-16 (21)", "IL-23 (54)", "IL-28A (77)", "IL-33 (45)", "sCD40L (38)", 
                "TRAIL (56)", "TSLP (43)", "Flt-3L (19)"
              ]
            };
            
            // Format data for each cytokine
            const formattedData = {};
            extractedCytokines.forEach(cytokine => {
              formattedData[cytokine] = formatBarChartData(parsedData, cytokine, sortedTimepoints);
            });
            
            setTimepoints(sortedTimepoints);
            setCytokines(extractedCytokines);
            setData(formattedData);
            setFunctionalGroups(cytokineFunctionalGroups);
            
            // Set IL-6 as default if available, otherwise use another important cytokine
            const defaultCytokines = ["IL-6 (57)", "TNFa (75)", "IL-10 (27)"];
            const firstAvailable = defaultCytokines.find(c => extractedCytokines.includes(c)) || extractedCytokines[0];
            setSelectedCytokine(firstAvailable);
            
            setLoading(false);
          },
          error: (error) => {
            setError(`Error parsing CSV: ${error.message}`);
            setLoading(false);
          }
        });
      } catch (error) {
        setError(`Error reading file: ${error.message}`);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Format data for bar chart with all timepoints - average values by group and timepoint
  function formatBarChartData(data, cytokineColumn, timepoints) {
    const result = [];
    
    timepoints.forEach(timepoint => {
      const barData = {
        timepoint: `Hr${timepoint}`,
      };
      
      // Get all HC rows for this timepoint
      const hcRows = data.filter(r => r.Timepoint === timepoint && r.Group === 'HC');
      if (hcRows.length > 0) {
        // Calculate average
        const values = hcRows.map(row => row[cytokineColumn]).filter(val => val !== null && val !== undefined);
        barData['HC'] = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : null;
      }
      
      // Get all AD/MCI rows for this timepoint
      const adMciRows = data.filter(r => r.Timepoint === timepoint && r.Group === 'AD/MCI');
      if (adMciRows.length > 0) {
        // Calculate average
        const values = adMciRows.map(row => row[cytokineColumn]).filter(val => val !== null && val !== undefined);
        barData['AD/MCI'] = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : null;
      }
      
      result.push(barData);
    });
    
    return result;
  }
  
  // Get cytokines for the selected functional category, filtered by search term
  const getFilteredCytokines = () => {
    let filteredList = [];
    
    if (selectedCategory === 'All') {
      filteredList = cytokines;
    } else {
      // Get cytokines from the selected category
      filteredList = functionalGroups[selectedCategory] || [];
      
      // Filter to only include cytokines that exist in our dataset
      filteredList = filteredList.filter(c => cytokines.includes(c));
    }
    
    // Apply search term filter if one exists
    if (searchTerm.trim() !== '') {
      filteredList = filteredList.filter(c => 
        c.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filteredList;
  };
  
  // Handle cytokine selection
  const handleCytokineSelect = (cytokine) => {
    setSelectedCytokine(cytokine);
  };
  
  // Get shortened name for display
  const getShortCytokineName = (fullName) => {
    // Extract the cytokine name without the number in parentheses
    const match = fullName.match(/^([^(]+)/);
    return match ? match[1].trim() : fullName;
  };
  
  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded text-sm">
          <p className="font-bold text-base">{`Timepoint: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value !== null ? entry.value.toFixed(2) : 'N/A'} pg/mL`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Get category for a specific cytokine
  const getCytokineCategory = (cytokine) => {
    for (const [category, cytokineList] of Object.entries(functionalGroups)) {
      if (cytokineList.includes(cytokine)) {
        return category;
      }
    }
    return "Uncategorized";
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading cytokine data...</div>;
  }
  
  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Alzheimer's Disease Cytokine Profile Dashboard</h1>
      
      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label className="block mb-2 font-medium">Cytokine Category:</label>
          <select 
            className="border rounded p-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {Object.keys(functionalGroups).map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Search Cytokine:</label>
          <input
            type="text"
            className="border rounded p-2"
            placeholder="e.g., IL-6, TNFa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Y-Axis Scale:</label>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="logarithmic-scale"
              checked={logarithmic}
              onChange={() => setLogarithmic(!logarithmic)}
              className="mr-2"
            />
            <label htmlFor="logarithmic-scale">Logarithmic</label>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Select Cytokine:</h2>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border rounded">
          {getFilteredCytokines().map((cytokine) => (
            <button
              key={cytokine}
              className={`px-3 py-2 rounded ${
                selectedCytokine === cytokine 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={() => handleCytokineSelect(cytokine)}
              title={`Category: ${getCytokineCategory(cytokine)}`}
            >
              {getShortCytokineName(cytokine)}
            </button>
          ))}
        </div>
        
        {getFilteredCytokines().length === 0 && (
          <div className="text-yellow-600 p-2 mt-2">
            No cytokines match your search criteria. Try a different search term or category.
          </div>
        )}
      </div>
      
      {selectedCytokine && data[selectedCytokine] && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">
            {getShortCytokineName(selectedCytokine)} Levels
            <span className="text-gray-500 text-sm ml-2">
              Category: {getCytokineCategory(selectedCytokine)}
            </span>
          </h2>
          
          <div className="bg-white p-4 rounded shadow-sm border border-gray-200" style={{ height: '500px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data[selectedCytokine]}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timepoint"
                  label={{ value: 'Time Points', position: 'bottom', offset: 0 }}
                />
                <YAxis 
                  scale={logarithmic ? 'log' : 'auto'}
                  domain={logarithmic ? ['auto', 'auto'] : [0, 'auto']}
                  label={{ value: 'Concentration (pg/mL)', angle: -90, position: 'left' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" />
                
                {/* HC bars with blue color */}
                <Bar dataKey="HC" name="Healthy Control" fill={hcColors[0]} />
                
                {/* AD/MCI bars with orange/red color */}
                <Bar dataKey="AD/MCI" name="AD/MCI" fill={adColors[0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <h2 className="text-lg font-semibold mb-2">About This Visualization</h2>
        <p>
          This dashboard displays cytokine profiles comparing levels between healthy controls (HC) 
          and Alzheimer's Disease/Mild Cognitive Impairment (AD/MCI) patients across four time points (0, 1, 3, and 5 hours).
        </p>
        <p className="mt-2">
          <strong>Data Source:</strong> ADLPS Serum Raw and SelfNL Analysis dataset with {timepoints.length} timepoints and {Object.keys(functionalGroups).length} cytokine categories.
        </p>
        <p className="mt-2">
          <strong>Key Observations:</strong> Pro-inflammatory cytokines like IL-6 and TNFα show different patterns between HC and AD/MCI groups,
          with HC showing sharper increases at hour 1-3 and AD/MCI showing more gradual changes.
        </p>
      </div>
    </div>
  );
};

export default CytokineDashboard;
</Script>
  </HTML>
