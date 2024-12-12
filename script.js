// Initialize managers
const parameterManager = new ParameterManager();
const mappingManager = new MappingManager(parameterManager);

// Make managers globally available
window.parameterManager = parameterManager;
window.mappingManager = mappingManager;

// Setup import/export functionality
document.getElementById('importBtn')?.addEventListener('click', () => {
    document.getElementById('importInput')?.click();
});

document.getElementById('importInput')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const configuration = JSON.parse(event.target.result);
                parameterManager.loadParameters(configuration.parameters);
                mappingManager.loadMappings(configuration.mappings);
                showNotification('Configuration imported successfully');
            } catch (error) {
                showNotification('Failed to parse configuration file', 'error');
            }
            e.target.value = ''; // Reset file input
        };
        reader.onerror = () => {
            showNotification('Failed to read configuration file', 'error');
            e.target.value = ''; // Reset file input
        };
        reader.readAsText(file);
    }
});

document.getElementById('saveBtn')?.addEventListener('click', () => {
    const defaultName = `lookup-config-${new Date().toISOString().split('T')[0]}.json`;
    
    promptForFilename(defaultName, (filename) => {
        const configuration = {
            parameters: parameterManager.getParameters(),
            mappings: mappingManager.getMappings(),
            version: '1.0.0',
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(configuration, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.endsWith('.json') ? filename : `${filename}.json`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('Configuration saved successfully');
    });
});

// Setup download CSV functionality
document.getElementById('downloadBtn')?.addEventListener('click', () => {
    const parameters = parameterManager.getParameters();
    if (parameters.length === 0) return;

    const parameterValues = parameters.map(p => p.values);
    const combinations = generateCombinations(parameterValues);

    // Create parameter index mapping for validation
    const parameterIndexes = {};
    parameters.forEach((param, index) => {
        parameterIndexes[param.id] = index;
    });

    // Filter combinations based on mapping rules
    const validCombinations = mappingManager 
        ? combinations.filter(combination => 
            mappingManager.validateCombination(combination, parameterIndexes))
        : combinations;

    // Generate CSV content
    const headers = ['Description', ...parameters.map(p => `${p.name}##${p.type}##${p.unit}`)];
    const rows = validCombinations.map((combination, index) => 
        [`Row_${index + 1}`, ...combination]
    );
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');

    // Download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lookup-table-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});