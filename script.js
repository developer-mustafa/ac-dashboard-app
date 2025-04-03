
// Bengali translations
const translations = {
    excellent: "চমৎকার",
    good: "ভাল",
    fair: "মোটামুটি",
    poor: "দুর্বল",
    notRated: "মূল্যায়ন করা হয়নি",
    model: "মডেল",
    iseer: "ISEER",
    modulation: "মডুলেশন",
    noise: "শব্দ",
    score: "স্কোর",
    load: "লোড করুন",
    delete: "মুছুন",
    noSavedModels: "কোন সংরক্ষিত মডেল পাওয়া যায়নি"
};

// Recommended models data
const recommendedModels = [
    {
        name: "ডাইকিন FTKM সিরিজ",
        iseer: 5.2,
        modulation: 10,
        noise: 21,
        score: 98
    },
    {
        name: "মিডিয়া পার্ল ইনভার্টার",
        iseer: 5.0,
        modulation: 10,
        noise: 19,
        score: 95
    },
    {
        name: "গ্রী ব্রিজ ইনভার্টার",
        iseer: 4.8,
        modulation: 15,
        noise: 22,
        score: 90
    }
];

// DOM elements
const analyzeBtn = document.getElementById('analyze-btn');
const saveBtn = document.getElementById('save-btn');
const loadBtn = document.getElementById('load-btn');
const resultsSection = document.getElementById('results-section');
const savedModelsSection = document.getElementById('saved-models-section');
const comparisonTable = document.getElementById('comparison-table');
const savedModelsList = document.getElementById('saved-models-list');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    populateComparisonTable();
    
    analyzeBtn.addEventListener('click', analyzePerformance);
    saveBtn.addEventListener('click', saveModel);
    loadBtn.addEventListener('click', showSavedModels);
});

// Populate the comparison table with recommended models
function populateComparisonTable() {
    comparisonTable.innerHTML = '';
    
    recommendedModels.forEach(model => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td class="model-name">${model.name}</td>
            <td>${model.iseer}</td>
            <td>${model.modulation}%</td>
            <td>${model.noise} dB</td>
            <td>${model.score}%</td>
        `;
        
        comparisonTable.appendChild(row);
    });
}

// Analyze the AC performance
function analyzePerformance() {
    // Get input values
    const modelName = document.getElementById('model-name').value || "অজানা মডেল";
    const iseer = parseFloat(document.getElementById('iseer').value) || 0;
    const modulation = parseInt(document.getElementById('modulation').value) || 30;
    const noise = parseInt(document.getElementById('noise').value) || 40;
    const humidity = parseInt(document.getElementById('humidity').value) || 20;
    const warranty = parseInt(document.getElementById('warranty').value) || 1;
    
    // Calculate scores
    const iseerScore = calculateIseerScore(iseer);
    const tempScore = 100; // Assuming ±0.5°C for inverter AC
    const compressorScore = calculateModulationScore(modulation);
    const noiseScore = calculateNoiseScore(noise);
    const humidityScore = humidity;
    const warrantyScore = calculateWarrantyScore(warranty);
    
    // Calculate overall score (weighted average)
    const overallScore = Math.round(
        (iseerScore * 0.25) + 
        (tempScore * 0.25) + 
        (compressorScore * 0.15) + 
        (noiseScore * 0.15) + 
        (humidityScore * 0.1) +
        (warrantyScore * 0.1)
    );
    
    // Update UI
    updateScore('iseer', iseerScore);
    updateScore('temp', tempScore);
    updateScore('compressor', compressorScore);
    updateScore('noise', noiseScore);
    updateScore('humidity', humidityScore);
    updateScore('warranty', warrantyScore);
    updateOverallScore(overallScore);
    
    // Show results section
    resultsSection.classList.remove('hidden');
    savedModelsSection.classList.add('hidden');
    
    // Return the analysis data
    return {
        modelName,
        iseer,
        modulation,
        noise,
        humidity,
        warranty,
        iseerScore,
        tempScore,
        compressorScore,
        noiseScore,
        humidityScore,
        warrantyScore,
        overallScore,
        timestamp: new Date().toISOString()
    };
}

// Calculate ISEER score
function calculateIseerScore(iseer) {
    if (iseer >= 5.0) return 100;
    if (iseer >= 4.5) return 80;
    if (iseer >= 4.0) return 60;
    return 40;
}

// Calculate modulation score
function calculateModulationScore(modulation) {
    if (modulation <= 10) return 100;
    if (modulation <= 20) return 75;
    if (modulation <= 30) return 50;
    return 30;
}

// Calculate noise score
function calculateNoiseScore(noise) {
    if (noise <= 25) return 100;
    if (noise <= 35) return 80;
    if (noise <= 45) return 40;
    return 20;
}

// Calculate warranty score
function calculateWarrantyScore(warranty) {
    if (warranty >= 10) return 100;
    if (warranty >= 5) return 80;
    if (warranty >= 3) return 60;
    return 40;
}

// Update individual score display
function updateScore(id, score) {
    const scoreElement = document.getElementById(`${id}-score`);
    const fillElement = document.getElementById(`${id}-fill`);
    const statusElement = document.getElementById(`${id}-status`);
    
    if (scoreElement) scoreElement.textContent = `${score}%`;
    if (fillElement) fillElement.style.width = `${score}%`;
    
    if (statusElement) {
        const status = getStatus(score);
        const statusText = translations[status.toLowerCase()] || status;
        
        statusElement.innerHTML = `
            <div class="status-dot ${status.toLowerCase()}"></div>
            <span>${statusText}</span>
        `;
    }
}

// Update overall score display
function updateOverallScore(score) {
    const overallScoreElement = document.getElementById('overall-score');
    const overallStatusElement = document.getElementById('overall-status');
    const scoreCircle = document.getElementById('overall-score-circle');
    
    overallScoreElement.textContent = `${score}%`;
    
    const status = getStatus(score);
    const statusText = translations[status.toLowerCase()] || status;
    
    // Update status
    overallStatusElement.innerHTML = `
        <div class="status-dot ${status.toLowerCase()}"></div>
        <span>${statusText}</span>
    `;
    
    // Update score circle
    scoreCircle.className = `score-circle score-${status.toLowerCase()}`;
    scoreCircle.style.color = getStatusColor(status);
}

// Get status based on score
function getStatus(score) {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
}

// Get status color
function getStatusColor(status) {
    switch(status.toLowerCase()) {
        case 'excellent': return 'var(--success)';
        case 'good': return 'var(--warning)';
        case 'fair': return 'var(--warning)';
        case 'poor': return 'var(--danger)';
        default: return 'var(--text-light)';
    }
}

// Save model to local storage
function saveModel() {
    const analysisData = analyzePerformance();
    
    // Get existing saved models or initialize empty array
    const savedModels = JSON.parse(localStorage.getItem('savedACModels')) || [];
    
    // Add new model
    savedModels.push(analysisData);
    
    // Save back to local storage
    localStorage.setItem('savedACModels', JSON.stringify(savedModels));
    
    // Show success message
    alert(`${analysisData.modelName} সফলভাবে সংরক্ষণ করা হয়েছে!`);
}

// Show saved models
function showSavedModels() {
    resultsSection.classList.add('hidden');
    savedModelsSection.classList.remove('hidden');
    
    // Get saved models from local storage
    const savedModels = JSON.parse(localStorage.getItem('savedACModels')) || [];
    
    // Clear existing list
    savedModelsList.innerHTML = '';
    
    if (savedModels.length === 0) {
        savedModelsList.innerHTML =` <p style="text-align: center; color: var(--text-muted);">${translations.noSavedModels}</p>`;
        return;
    }
    
    // Add each saved model to the list
    savedModels.forEach((model, index) => {
        const modelCard = document.createElement('div');
        modelCard.className = 'saved-model-card';
        
        modelCard.innerHTML = `
            <div class="saved-model-info">
                <div class="saved-model-name">${model.modelName}</div>
                <div class="saved-model-score">সর্বোচ্চ স্কোর: ${model.overallScore}%</div>
            </div>
            <div class="saved-model-actions">
                <button class="action-btn btn-primary" onclick="loadModel(${index})">
                    <i class="fas fa-eye"></i> ${translations.load}
                </button>
                <button class="action-btn btn-secondary" onclick="deleteModel(${index})">
                    <i class="fas fa-trash"></i> ${translations.delete}
                </button>
            </div>
        `;
        
        savedModelsList.appendChild(modelCard);
    });
}

// Load a saved model
function loadModel(index) {
    const savedModels = JSON.parse(localStorage.getItem('savedACModels')) || [];
    
    if (index >= 0 && index < savedModels.length) {
        const model = savedModels[index];
        
        // Fill the form with saved data
        document.getElementById('model-name').value = model.modelName;
        document.getElementById('iseer').value = model.iseer;
        document.getElementById('modulation').value = model.modulation;
        document.getElementById('noise').value = model.noise;
        document.getElementById('humidity').value = model.humidityScore;
        document.getElementById('warranty').value = model.warranty;
        
        // Analyze the loaded data
        analyzePerformance();
    }
}

// Delete a saved model
function deleteModel(index) {
    const savedModels = JSON.parse(localStorage.getItem('savedACModels')) || [];
    
    if (index >= 0 && index < savedModels.length) {
        if (confirm(`আপনি কি "${savedModels[index].modelName}" মডেলটি মুছতে চান?`)) {
            savedModels.splice(index, 1);
            localStorage.setItem('savedACModels', JSON.stringify(savedModels));
            showSavedModels();
        }
    }
}





// Make functions available globally
window.loadModel = loadModel;
window.deleteModel = deleteModel;
