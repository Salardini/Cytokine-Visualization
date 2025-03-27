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
  // Format: { cytokine: [{ timepoint, HC, 'AD/MCI' }, ...]}
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
  const handleC
