import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CytokineDashboard = () => {
  const [selectedCytokine, setSelectedCytokine] = useState('IL-6 (57)');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [logarithmic, setLogarithmic] = useState(false);
  
  // HC colors in blue shades
  const hcColors = ['#003f5c', '#2f4b7c', '#665191', '#a05195'];
  
  // AD/MCI colors in orange/red shades
  const adColors = ['#f95d6a', '#ff7c43', '#ffa600', '#ff4500'];
  
  // Full list of all cytokines in the dataset
  const allCytokines = [
    "IL-6 (57)", "TNFa (75)", "IL-10 (27)", "IL-1B (46)", "MCP-1 (67)",
    "IL-8 (63)", "IL-4 (53)", "IL-2 (48)", "IFNy (25)", "VEGF-A (78)",
    "Eotaxin-1 (14)", "MIP-1B (73)", "EGF (12)", "PDGF-AA (34)", 
    "PDGF-BB (36)", "IL-7 (61)", "IL-15 (37)", "IL-18 (66)", "IL-1RA (42)",
    "IP-10 (65)", "GM-CSF (20)", "IL-17A (39)", "MCP-2 (13)", "Eotaxin (12)",
    "sCD40L (38)"
  ];
  
  // Complete preprocessed data from the CSV
  // Format: { cytokine: [{ timepoint, HC, AD/MCI }, ...]}
  const completeData = {
    // Pro-inflammatory cytokines
    "IL-6 (57)": [
      { timepoint: 'Hr0', HC: 0.2225, 'AD/MCI': 7.63333 },
      { timepoint: 'Hr1', HC: 9.555, 'AD/MCI': 7.53333 },
      { timepoint: 'Hr3', HC: 14.54, 'AD/MCI': 11.38 },
      { timepoint: 'Hr5', HC: 3.44, 'AD/MCI': 13.245 }
    ],
    "TNFa (75)": [
      { timepoint: 'Hr0', HC: 8.9675, 'AD/MCI': 20.18 },
      { timepoint: 'Hr1', HC: 80.3325, 'AD/MCI': 23.3333 },
      { timepoint: 'Hr3', HC: 62.75, 'AD/MCI': 37.6233 },
      { timepoint: 'Hr5', HC: 23.14, 'AD/MCI': 24.32 }
    ],
    "IL-1B (46)": [
      { timepoint: 'Hr0', HC: 0.25, 'AD/MCI': 0 },
      { timepoint: 'Hr1', HC: 22.2, 'AD/MCI': 0 },
      { timepoint: 'Hr3', HC: 18.115, 'AD/MCI': 0 },
      { timepoint: 'Hr5', HC: 4.295, 'AD/MCI': 0 }
    ],
    "IL-8 (63)": [
      { timepoint: 'Hr0', HC: 4.77, 'AD/MCI': 0.4033 },
      { timepoint: 'Hr1', HC: 7.78, 'AD/MCI': 1.8067 },
      { timepoint: 'Hr3', HC: 3.69, 'AD/MCI': 0.9433 },
      { timepoint: 'Hr5', HC: 1.6225, 'AD/MCI': 0.5 }
    ],
    "IL-2 (48)": [
      { timepoint: 'Hr0', HC: 0.335, 'AD/MCI': 0 },
      { timepoint: 'Hr1', HC: 4.7075, 'AD/MCI': 0 },
      { timepoint: 'Hr3', HC: 1.9725, 'AD/MCI': 0 },
      { timepoint: 'Hr5', HC: 0.86, 'AD/MCI': 0 }
    ],
    "IFNy (25)": [
      { timepoint: 'Hr0', HC: 0.55, 'AD/MCI': 0 },
      { timepoint: 'Hr1', HC: 6.5925, 'AD/MCI': 0 },
      { timepoint: 'Hr3', HC: 3.2225, 'AD/MCI': 0 },
      { timepoint: 'Hr5', HC: 1.495, 'AD/MCI': 0 }
    ],
    
    // Anti-inflammatory cytokines
    "IL-10 (27)": [
      { timepoint: 'Hr0', HC: 1.315, 'AD/MCI': 4.0767 },
      { timepoint: 'Hr1', HC: 30.625, 'AD/MCI': 3 },
      { timepoint: 'Hr3', HC: 24.5475, 'AD/MCI': 7.2433 },
      { timepoint: 'Hr5', HC: 3.29, 'AD/MCI': 4.53 }
    ],
    "IL-4 (53)": [
      { timepoint: 'Hr0', HC: 4.085, 'AD/MCI': 4.4933 },
      { timepoint: 'Hr1', HC: 52.3225, 'AD/MCI': 8.1433 },
      { timepoint: 'Hr3', HC: 37.328, 'AD/MCI': 9.12 },
      { timepoint: 'Hr5', HC: 19.06, 'AD/MCI': 9.24 }
    ],
    
    // Chemokines
    "MCP-1 (67)": [
      { timepoint: 'Hr0', HC: 243.595, 'AD/MCI': 222.477 },
      { timepoint: 'Hr1', HC: 317.505, 'AD/MCI': 238.873 },
      { timepoint: 'Hr3', HC: 317.515, 'AD/MCI': 243.23 },
      { timepoint: 'Hr5', HC: 290.03, 'AD/MCI': 230.14 }
    ],
    "VEGF-A (78)": [
      { timepoint: 'Hr0', HC: 0.9625, 'AD/MCI': 0 },
      { timepoint: 'Hr1', HC: 4.1175, 'AD/MCI': 0 },
      { timepoint: 'Hr3', HC: 2.01, 'AD/MCI': 0 },
      { timepoint: 'Hr5', HC: 0.7775, 'AD/MCI': 0 }
    ],
    "Eotaxin-1 (14)": [
      { timepoint: 'Hr0', HC: 82.26, 'AD/MCI': 121.3767 },
      { timepoint: 'Hr1', HC: 94.7325, 'AD/MCI': 139.48333 },
      { timepoint: 'Hr3', HC: 93.36, 'AD/MCI': 145.58333 },
      { timepoint: 'Hr5', HC: 71.2775, 'AD/MCI': 134.13 }
    ],
    "MIP-1B (73)": [
      { timepoint: 'Hr0', HC: 8.145, 'AD/MCI': 0 },
      { timepoint: 'Hr1', HC: 25.69, 'AD/MCI': 1.7 },
      { timepoint: 'Hr3', HC: 12.705, 'AD/MCI': 0 },
      { timepoint: 'Hr5', HC: 6.28, 'AD/MCI': 0 }
    ],
    
    // Growth Factors
    "EGF (12)": [
      { timepoint: 'Hr0', HC: 1.13, 'AD/MCI': 0 },
      { timepoint: 'Hr1', HC: 26.12, 'AD/MCI': 0 },
      { timepoint: 'Hr3', HC: 13.84, 'AD/MCI': 0 },
      { timepoint: 'Hr5', HC: 7.205, 'AD/MCI': 0 }
    ],
    "PDGF-AA (34)": [
      { timepoint: 'Hr0', HC: 351.795, 'AD/MCI': 272.89 },
      { timepoint: 'Hr1', HC: 543.415, 'AD/MCI': 283.78 },
      { timepoint: 'Hr3', HC: 482.4125, 'AD/MCI': 280.6767 },
      { timepoint: 'Hr5', HC: 444.18, 'AD/MCI': 267.705 }
    ],
    "PDGF-BB (36)": [
      { timepoint: 'Hr0', HC: 9369.8325, 'AD/MCI': 6342.84333 },
      { timepoint: 'Hr1', HC: 11161.0675, 'AD/MCI': 6519.89 },
      { timepoint: 'Hr3', HC: 9872.7425, 'AD/MCI': 6489.47333 },
      { timepoint: 'Hr5', HC: 8660.695, 'AD/MCI': 6337.465 }
    ],
    
    // T Cell Related
    "IL-7 (61)": [
      { timepoint: 'Hr0', HC: 1.935, 'AD/MCI': 0.1333 },
      { timepoint: 'Hr1', HC: 6.05, 'AD/MCI': 0 },
      { timepoint: 'Hr3', HC: 3.6025, 'AD/MCI': 0.55 },
      { timepoint: 'Hr5', HC: 1.4525, 'AD/MCI': 0.5 }
    ],
    "IL-15 (37)": [
      { timepoint: 'Hr0', HC: 0.5, 'AD/MCI': 0 },
      { timepoint: 'Hr1', HC: 5.345, 'AD/MCI': 0 },
      { timepoint: 'Hr3', HC: 3.205, 'AD/MCI': 0 },
      { timepoint: 'Hr5', HC: 1.495, 'AD/MCI': 0 }
    ],
    
    // Additional Cytokines
    "IL-18 (66)": [
      { timepoint: 'Hr0', HC: 34.705, 'AD/MCI': 41.4467 },
      { timepoint: 'Hr1', HC: 69.2925, 'AD/MCI': 46.1567 },
      { timepoint: 'Hr3', HC: 64.7825, 'AD/MCI': 48.4867 },
      { timepoint: 'Hr5', HC: 48.0175, 'AD/MCI': 48.165 }
    ],
    "IL-1RA (42)": [
      { timepoint: 'Hr0', HC: 8.3425, 'AD/MCI': 20.5567 },
      { timepoint: 'Hr1', HC: 121.095, 'AD/MCI': 64.03 },
      { timepoint: 'Hr3', HC: 150.885, 'AD/MCI': 87.95 },
      { timepoint: 'Hr5', HC: 55.8055, 'AD/MCI': 44.98 }
    ],
    "IP-10 (65)": [
      { timepoint: 'Hr0', HC: 119.9325, 'AD/MCI': 111.79 },
      { timepoint: 'Hr1', HC: 136.735, 'AD/MCI': 132.39 },
      { timepoint: 'Hr3', HC: 129.1675, 'AD/MCI': 137.5 },
      { timepoint: 'Hr5', HC: 109.845, 'AD/MCI': 117.01 }
    ],
    "GM-CSF (20)": [
      { timepoint: 'Hr0', HC: 2.0025, 'AD/MCI': 0.4467 },
      { timepoint: 'Hr1', HC: 9.6775, 'AD/MCI': 0.33 },
      { timepoint: 'Hr3', HC: 3.2625, 'AD/MCI': 0.3767 },
      { timepoint: 'Hr5', HC: 1.87, 'AD/MCI': 0.29 }
    ],
    "IL-17A (39)": [
      { timepoint: 'Hr0', HC: 0.225, 'AD/MCI': 0 },
      { timepoint: 'Hr1', HC: 1.7, 'AD/MCI': 0 },
      { timepoint: 'Hr3', HC: 0.66, 'AD/MCI': 0 },
      { timepoint: 'Hr5', HC: 0.47, 'AD/MCI': 0 }
    ],
    "MCP-2 (13)": [
      { timepoint: 'Hr0', HC: 26.265, 'AD/MCI': 21.8267 },
      { timepoint: 'Hr1', HC: 23.4175, 'AD/MCI': 14.8167 },
      { timepoint: 'Hr3', HC: 29.6875, 'AD/MCI': 14.48 },
      { timepoint: 'Hr5', HC: 19.9425, 'AD/MCI': 11.69 }
    ],
    "Eotaxin (12)": [
      { timepoint: 'Hr0', HC: 491.81, 'AD/MCI': 273.04 },
      { timepoint: 'Hr1', HC: 518.0125, 'AD/MCI': 344.4067 },
      { timepoint: 'Hr3', HC: 450.18, 'AD/MCI': 362.05 },
      { timepoint: 'Hr5', HC: 391.075, 'AD/MCI': 358.145 }
    ],
    "sCD40L (38)": [
      { timepoint: 'Hr0', HC: 957.3975, 'AD/MCI': 691.81 },
      { timepoint: 'Hr1', HC: 4509.2825, 'AD/MCI': 1185.4267 },
      { timepoint: 'Hr3', HC: 3334.4625, 'AD/MCI': 1204.2767 },
      { timepoint: 'Hr5', HC: 1933.7275, 'AD/MCI': 1151.705 }
    ]
  };
  
  // Define functional groups
  const functionalGroups = {
    "Growth Factors": [
      "EGF (12)", "FGF-2 (13)", "TGF-a (15)", "G-CSF (18)", "GM-CSF (20)", 
      "PDGF-AA (34)", "PDGF-BB (36)", "VEGF-A (78)", "TPO (36)", "LIF (34)"
    ],
    "Pro-inflammatory": [
      "IFNa2 (22)", "IFNy (25)", "IL-1a (44)", "IL-1B (46)", "IL-2 (48)", "IL-6 (57)", 
      "IL-8 (63)", "IL-12P40 (29)", "IL-12P70 (33)", "IL-17A (39)", "IL-18 (66)", 
      "TNFa (75)"
    ],
    "Anti-inflammatory": [
      "IL-1RA (42)", "IL-4 (53)", "IL-10 (27)", "IL-13 (35)"
    ],
    "Chemokines": [
      "Eotaxin (12)", "Eotaxin-1 (14)", "MCP-1 (67)", "MCP-2 (13)", 
      "MIP-1a (72)", "MIP-1B (73)", "IP-10 (65)"
    ],
    "T Cell / Immune Regulation": [
      "IL-3 (51)", "IL-5 (55)", "IL-7 (61)", "IL-9 (45)", "IL-15 (37)", 
      "sCD40L (38)"
    ]
  };
  
  // Get cytokines for the selected functional category, filtered by search term
  const getFilteredCytokines = () => {
    let filteredList = [];
    
    if (selectedCategory === 'All') {
      filteredList = allCytokines;
    } else {
      filteredList = functionalGroups[selectedCategory] || [];
      // Filter to only include cytokines that exist in our data
      filteredList = filteredList.filter(c => allCytokines.includes(c));
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
  
  // Get category for a specific cytokine
  const getCytokineCategory = (cytokine) => {
    for (const [category, cytokineList] of Object.entries(functionalGroups)) {
      if (cytokineList.includes(cytokine)) {
        return category;
      }
    }
    return "Uncategorized";
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
  
  // Calculate statistics safely with null-checking
  const calculateHCAverage = (data) => {
    const validData = data.filter(item => item.HC !== null && item.HC !== undefined);
    if (validData.length === 0) return "N/A";
    return (validData.reduce((sum, item) => sum + item.HC, 0) / validData.length).toFixed(2);
  };
  
  const calculateHCMax = (data) => {
    const validData = data.filter(item => item.HC !== null && item.HC !== undefined);
    if (validData.length === 0) return "N/A";
    return Math.max(...validData.map(item => item.HC)).toFixed(2);
  };
  
  const calculateADMCIAverage = (data) => {
    const validData = data.filter(item => item['AD/MCI'] !== null && item['AD/MCI'] !== undefined);
    if (validData.length === 0) return "N/A";
    return (validData.reduce((sum, item) => sum + item['AD/MCI'], 0) / validData.length).toFixed(2);
  };
  
  const calculateADMCIMax = (data) => {
    const validData = data.filter(item => item['AD/MCI'] !== null && item['AD/MCI'] !== undefined);
    if (validData.length === 0) return "N/A";
    return Math.max(...validData.map(item => item['AD/MCI'])).toFixed(2);
  };
  
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
      
      {selectedCytokine && completeData[selectedCytokine] && (
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
                data={completeData[selectedCytokine]}
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
          
          {/* Additional stats for the selected cytokine */}
          <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
            <h3 className="font-medium mb-1">Statistical Summary:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <span className="font-medium">HC Average:</span> {calculateHCAverage(completeData[selectedCytokine])} pg/mL
                </p>
                <p>
                  <span className="font-medium">HC Max:</span> {calculateHCMax(completeData[selectedCytokine])} pg/mL
                </p>
              </div>
              <div>
                <p>
                  <span className="font-medium">AD/MCI Average:</span> {calculateADMCIAverage(completeData[selectedCytokine])} pg/mL
                </p>
                <p>
                  <span className="font-medium">AD/MCI Max:</span> {calculateADMCIMax(completeData[selectedCytokine])} pg/mL
                </p>
              </div>
            </div>
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
          <strong>Data Source:</strong> ADLPS Serum Raw and SelfNL Analysis dataset with 4 timepoints and multiple cytokines
          organized into 5 functional categories.
        </p>
        <p className="mt-2">
          <strong>Key Observations:</strong>
        </p>
        <ul className="list-disc pl-5 mt-1">
          <li>Pro-inflammatory cytokines (IL-6, TNFα) show different patterns in HC vs. AD/MCI</li>
          <li>HC subjects show sharper increases at hours 1-3 followed by decreases at hour 5</li>
          <li>AD/MCI patients show more gradual or sustained elevations</li>
          <li>Anti-inflammatory cytokines like IL-10 show strong spikes in HC but not in AD/MCI</li>
          <li>Chemokines such as MCP-1 remain relatively stable across timepoints in both groups</li>
        </ul>
        <p className="mt-2">
          <strong>Important cytokines in Alzheimer's disease:</strong>
        </p>
        <ul className="list-disc pl-5 mt-1">
          <li><strong>IL-6:</strong> Pro-inflammatory cytokine that may contribute to neuroinflammation</li>
          <li><strong>TNFα:</strong> Key inflammatory mediator with elevated levels in AD patients</li>
          <li><strong>IL-10:</strong> Anti-inflammatory cytokine that may have protective effects</li>
          <li><strong>IL-1β:</strong> Pro-inflammatory cytokine implicated in neurodegeneration</li>
          <li><strong>MCP-1:</strong> Chemokine involved in microglia activation and recruitment</li>
        </ul>
      </div>
    </div>
  );
};

export default CytokineDashboard;
