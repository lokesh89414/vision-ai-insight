/**
 * Vision AI Insight - Main JavaScript
 * Powers interactive features of the eye disease detection website
 * Includes CNN model integration for eye disease detection
 */

// DOM Elements
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

// ============= Navigation Menu Toggle =============
if (hamburger) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  document.querySelectorAll(".nav-item").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  }));
}

// ============= Stats Counter Animation =============
function animateCounter(elementId, targetValue, duration) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const startValue = 0;
  const increment = targetValue / (duration / 16); // 60 FPS
  
  let currentValue = startValue;
  const counter = setInterval(() => {
    currentValue += increment;
    
    if (currentValue >= targetValue) {
      currentValue = targetValue;
      clearInterval(counter);
    }
    
    if (elementId.includes("rate") || elementId.includes("accuracy")) {
      element.textContent = Math.round(currentValue) + "%";
    } else {
      element.textContent = Math.round(currentValue).toLocaleString();
    }
  }, 16);
}

// Animate stats when they come into view
const observerOptions = {
  threshold: 0.1
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Animate counters with random values
      animateCounter("analyzed-cases", 18452, 2000);
      animateCounter("detection-rate", 96, 2000);
      animateCounter("active-users", 2354, 2000);
      animateCounter("accuracy", 98, 2000);
      
      statsObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

const statsSection = document.querySelector(".stats");
if (statsSection) {
  statsObserver.observe(statsSection);
}

// ============= CNN Model Integration =============
// TensorFlow.js model for eye disease detection
let model = null;
let classLabels = ['Normal', 'Glaucoma', 'Diabetic Retinopathy', 'Cataract', 'AMD'];
let isModelLoaded = false;

// Load the CNN model
async function loadModel() {
  try {
    // Show model loading notification
    const notification = document.createElement('div');
    notification.className = 'model-loading-notification';
    notification.innerHTML = '<p>Loading AI model...</p><div class="loading-spinner"></div>';
    document.body.appendChild(notification);
    
    // Load the model (replace this URL with your actual model URL)
    model = await tf.loadLayersModel('model/eye_disease_model/model.json');
    isModelLoaded = true;
    
    console.log('CNN model loaded successfully');
    
    // Update UI to show model is ready
    notification.innerHTML = '<p>AI model loaded and ready!</p>';
    notification.classList.add('success');
    
    // Remove notification after a delay
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
    
    // Enable analyze button if a file is already selected
    const analyzeBtn = document.getElementById("analyzeBtn");
    if (analyzeBtn && imageSelected) {
      analyzeBtn.disabled = false;
    }
  } catch (error) {
    console.error('Failed to load CNN model:', error);
    
    // Show error notification
    const notification = document.createElement('div');
    notification.className = 'model-loading-notification error';
    notification.innerHTML = `<p>Failed to load AI model. Please check your connection and refresh.</p>`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 5000);
  }
}

// Process the image and make a prediction
async function predictDisease(imageElement) {
  if (!model) {
    console.error('Model not loaded yet');
    return null;
  }
  
  try {
    // Preprocess the image
    const tensor = preprocessImage(imageElement);
    
    // Make a prediction
    const predictions = await model.predict(tensor).data();
    
    // Convert to array and get the predicted class
    const results = Array.from(predictions);
    
    // Get results with class labels
    const resultWithLabels = results.map((probability, index) => {
      return {
        disease: classLabels[index],
        probability: probability * 100 // Convert to percentage
      };
    });
    
    // Sort by probability (highest first)
    resultWithLabels.sort((a, b) => b.probability - a.probability);
    
    return resultWithLabels;
  } catch (error) {
    console.error('Error during prediction:', error);
    return null;
  }
}

// Preprocess image to match the input expected by the model
function preprocessImage(imgElement) {
  // Create a tensor from the image
  const img = tf.browser.fromPixels(imgElement);
  
  // Resize to model's expected input dimensions (224x224 is common)
  const resized = tf.image.resizeBilinear(img, [224, 224]);
  
  // Normalize pixel values to 0-1
  const normalized = resized.div(tf.scalar(255));
  
  // Add batch dimension [1, 224, 224, 3]
  const batched = normalized.expandDims(0);
  
  return batched;
}

// Load model when the DOM is loaded
let imageSelected = false;
document.addEventListener("DOMContentLoaded", () => {
  // Load TensorFlow.js script dynamically
  const tfScript = document.createElement('script');
  tfScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.18.0/dist/tf.min.js';
  tfScript.onload = () => {
    console.log('TensorFlow.js loaded');
    // Load our model after TF.js is ready
    loadModel();
  };
  document.body.appendChild(tfScript);
  
  // File Upload Handling
  const dropArea = document.getElementById("drop-area");
  const fileInput = document.getElementById("fileInput");
  const fileInfo = document.getElementById("fileInfo");
  const imagePreview = document.getElementById("imagePreview");
  const previewImage = document.getElementById("previewImage");
  const analyzeBtn = document.getElementById("analyzeBtn");
  
  // Initialize only if elements exist (prediction page)
  if (dropArea && fileInput) {
    // Drag & Drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
      dropArea.classList.add('dragover');
    }
    
    function unhighlight() {
      dropArea.classList.remove('dragover');
    }
    
    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = dt.files;
      handleFiles(files);
    }
    
    // Handle file selection via input
    fileInput.addEventListener('change', function() {
      handleFiles(this.files);
    });
    
    function handleFiles(files) {
      if (files.length > 0) {
        const file = files[0];
        
        // Check if file is an image
        if (!file.type.match('image.*')) {
          fileInfo.textContent = 'Please select an image file (JPG, PNG).';
          fileInfo.style.color = 'red';
          return;
        }
        
        // Check file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          fileInfo.textContent = 'File too large. Please select an image under 5MB.';
          fileInfo.style.color = 'red';
          return;
        }
        
        // Display file info
        fileInfo.textContent = `Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        fileInfo.style.color = 'var(--primary-dark)';
        
        // Preview image
        const reader = new FileReader();
        reader.onload = function(e) {
          previewImage.src = e.target.result;
          imagePreview.style.display = 'block';
          
          // Enable analyze button if model is loaded
          if (isModelLoaded) {
            analyzeBtn.disabled = false;
          }
          imageSelected = true;
        };
        reader.readAsDataURL(file);
      }
    }
    
    // Analyze button action
    analyzeBtn.addEventListener('click', startAnalysis);
  }
});

async function startAnalysis() {
  if (!isModelLoaded) {
    alert("Please wait for the AI model to load completely.");
    return;
  }
  
  const analysisSection = document.getElementById("analysisSection");
  const loadingScreen = document.getElementById("loadingScreen");
  const resultsCard = document.getElementById("resultsCard");
  const progressBar = document.getElementById("progressBar");
  const analysisStep = document.getElementById("analysisStep");
  const previewImage = document.getElementById("previewImage");
  
  // Show analysis section and loading screen
  analysisSection.style.display = 'block';
  loadingScreen.style.display = 'block';
  resultsCard.style.display = 'none';
  
  // Animate progress bar
  let progress = 0;
  const steps = [
    "Initializing AI model...",
    "Preprocessing image...",
    "Analyzing retinal features...",
    "Detecting potential anomalies...",
    "Comparing with database...",
    "Generating diagnostic report..."
  ];
  
  const progressInterval = setInterval(() => {
    progress += 1;
    progressBar.style.width = `${progress}%`;
    
    // Update analysis step text
    const stepIndex = Math.floor((progress / 100) * steps.length);
    if (stepIndex < steps.length) {
      analysisStep.textContent = steps[stepIndex];
    }
    
    if (progress >= 100) {
      clearInterval(progressInterval);
      
      // Process the image with our CNN model
      if (previewImage && previewImage.complete) {
        analyzeDiseaseWithCNN(previewImage);
      }
    }
  }, 50);
}

async function analyzeDiseaseWithCNN(imageElement) {
  try {
    // Get predictions from the CNN model
    const predictions = await predictDisease(imageElement);
    
    if (!predictions || predictions.length === 0) {
      showError("Could not analyze image. Please try again.");
      return;
    }
    
    // Hide loading, show results
    const loadingScreen = document.getElementById("loadingScreen");
    const resultsCard = document.getElementById("resultsCard");
    
    loadingScreen.style.display = 'none';
    resultsCard.style.display = 'block';
    
    // Update the UI with the predictions
    updateResultsUI(predictions);
    
  } catch (error) {
    console.error("Error during disease analysis:", error);
    showError("An error occurred during analysis. Please try again.");
  }
}

function updateResultsUI(predictions) {
  // Get the top prediction
  const topPrediction = predictions[0];
  
  // Update diagnosis result
  const diagnosisResult = document.getElementById("diagnosisResult");
  if (diagnosisResult) {
    diagnosisResult.innerHTML = `Detected: <span>${topPrediction.disease}</span>`;
    
    // Change color based on condition
    if (topPrediction.disease === 'Normal') {
      diagnosisResult.querySelector('span').style.color = 'var(--success)';
    } else {
      diagnosisResult.querySelector('span').style.color = 'var(--warning)';
    }
  }
  
  // Update confidence score
  const confidenceFill = document.getElementById("confidenceFill");
  const confidenceValue = document.getElementById("confidenceValue");
  
  if (confidenceFill && confidenceValue) {
    const confidence = topPrediction.probability.toFixed(1);
    confidenceFill.style.width = `${confidence}%`;
    confidenceValue.textContent = `${confidence}%`;
  }
  
  // Update recommendations
  const primaryRecommendation = document.getElementById("primaryRecommendation");
  if (primaryRecommendation) {
    if (topPrediction.disease === 'Normal') {
      primaryRecommendation.textContent = "No immediate action required. Schedule regular check-up.";
    } else {
      primaryRecommendation.textContent = `Possible ${topPrediction.disease} detected. Consult an ophthalmologist soon.`;
    }
  }
  
  // Update chart with all predictions
  initResultsChart(predictions);
}

function initResultsChart(predictions) {
  const ctx = document.getElementById('resultsChart');
  if (!ctx) return;
  
  // Extract data from predictions
  const labels = predictions.map(p => p.disease);
  const data = predictions.map(p => p.probability);
  const colors = predictions.map(p => {
    if (p.disease === 'Normal') return '#34C759';
    return p.probability > 50 ? '#FF3B30' : '#FF9500';
  });
  
  // Use Chart.js to create a chart
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Probability (%)',
        data: data,
        backgroundColor: colors,
        borderWidth: 0,
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

function showError(message) {
  const loadingScreen = document.getElementById("loadingScreen");
  if (loadingScreen) {
    loadingScreen.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${message}</p>
        <button id="tryAgainBtn" class="action-button secondary">Try Again</button>
      </div>
    `;
    
    // Add event listener to the try again button
    const tryAgainBtn = document.getElementById("tryAgainBtn");
    if (tryAgainBtn) {
      tryAgainBtn.addEventListener('click', () => {
        const analysisSection = document.getElementById("analysisSection");
        if (analysisSection) {
          analysisSection.style.display = 'none';
        }
      });
    }
  }
}

// ============= Chatbot Functionality =============
const chatbotHeader = document.getElementById('chatbotHeader');
const chatbotBody = document.getElementById('chatbotBody');
const chatToggleIcon = document.getElementById('chatToggleIcon');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const micButton = document.getElementById('micButton');

// Initialize only if elements exist
if (chatbotHeader) {
  // Toggle chatbot
  let chatOpen = true;
  
  chatbotHeader.addEventListener('click', () => {
    chatOpen = !chatOpen;
    
    if (chatOpen) {
      chatbotBody.classList.remove('collapsed');
      chatbotBody.style.height = '400px';
      chatToggleIcon.classList.remove('fa-chevron-up');
      chatToggleIcon.classList.add('fa-chevron-down');
    } else {
      chatbotBody.classList.add('collapsed');
      chatbotBody.style.height = '0';
      chatToggleIcon.classList.remove('fa-chevron-down');
      chatToggleIcon.classList.add('fa-chevron-up');
    }
  });
  
  // Send message function
  function sendMessage() {
    const message = chatInput.value.trim();
    if (message === '') return;
    
    // Add user message
    addMessage(message, true);
    chatInput.value = '';
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const responses = [
        "I'm analyzing your question about eye health...",
        "Based on the information provided, this appears to be a normal scan. However, I recommend regular check-ups with your ophthalmologist.",
        "Regular eye exams are crucial for early detection of eye conditions like glaucoma and diabetic retinopathy.",
        "If you're experiencing blurred vision, light sensitivity, or eye pain, I recommend consulting with an eye specialist as soon as possible.",
        "The AI analysis is meant to be a preliminary screening tool and not a replacement for professional medical advice.",
        "Would you like to learn more about preventive measures for maintaining good eye health?",
        "I can help you understand your diagnosis results or provide general information about common eye conditions."
      ];
      
      // Get a random response
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse, false);
    }, 1000);
  }
  
  // Add message to chat
  function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    
    const avatar = document.createElement('i');
    avatar.className = isUser ? 'fas fa-user' : 'fas fa-robot';
    avatarDiv.appendChild(avatar);
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const contentP = document.createElement('p');
    contentP.textContent = text;
    contentDiv.appendChild(contentP);
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Event listeners
  if (sendMessageBtn) {
    sendMessageBtn.addEventListener('click', sendMessage);
  }
  
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }
  
  // Microphone button (speech recognition) - if supported
  if (micButton) {
    micButton.addEventListener('click', () => {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'en-US';
        recognition.start();
        
        micButton.classList.add('active');
        micButton.innerHTML = '<i class="fas fa-microphone-alt"></i>';
        
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          chatInput.value = transcript;
        };
        
        recognition.onend = () => {
          micButton.classList.remove('active');
          micButton.innerHTML = '<i class="fas fa-microphone"></i>';
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          micButton.classList.remove('active');
          micButton.innerHTML = '<i class="fas fa-microphone"></i>';
        };
      } else {
        alert('Speech recognition is not supported in your browser.');
      }
    });
  }
}

// ============= Share Modal Functionality =============
const shareResultBtn = document.getElementById('shareResultBtn');
const shareModal = document.getElementById('shareModal');
const closeModal = document.querySelector('.close-modal');
const copyLinkBtn = document.getElementById('copyLinkBtn');

if (shareResultBtn && shareModal) {
  shareResultBtn.addEventListener('click', () => {
    shareModal.classList.add('show');
  });
  
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      shareModal.classList.remove('show');
    });
  }
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === shareModal) {
      shareModal.classList.remove('show');
    }
  });
  
  // Copy link functionality
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      const linkInput = document.getElementById('shareLink');
      linkInput.select();
      document.execCommand('copy');
      
      // Change button text temporarily
      const originalText = copyLinkBtn.innerHTML;
      copyLinkBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      setTimeout(() => {
        copyLinkBtn.innerHTML = originalText;
      }, 2000);
    });
  }
}

// New Analysis button
const newAnalysisBtn = document.getElementById('newAnalysisBtn');
if (newAnalysisBtn) {
  newAnalysisBtn.addEventListener('click', () => {
    const analysisSection = document.getElementById('analysisSection');
    if (analysisSection) {
      analysisSection.style.display = 'none';
    }
    
    // Reset file input and preview
    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    if (fileInput) fileInput.value = '';
    if (imagePreview) imagePreview.style.display = 'none';
    if (analyzeBtn) analyzeBtn.disabled = true;
    
    // Reset file info
    const fileInfo = document.getElementById('fileInfo');
    if (fileInfo) {
      fileInfo.textContent = 'Accepted formats: JPG, PNG (Max: 5MB)';
      fileInfo.style.color = 'var(--gray)';
    }
    
    // Scroll to top of upload section
    const uploadSection = document.querySelector('.upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// Download Report button
const downloadReportBtn = document.getElementById('downloadReportBtn');
if (downloadReportBtn) {
  downloadReportBtn.addEventListener('click', () => {
    alert('Report download functionality will be implemented in the production version.');
  });
}

// ============= About Disease Page Functionality =============
// Disease tabs
const tabButtons = document.querySelectorAll('.tab-button');
if (tabButtons.length > 0) {
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and content
      tabButtons.forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.disease-tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Show corresponding content
      const disease = button.getAttribute('data-disease');
      document.getElementById(`${disease}-content`).classList.add('active');
    });
  });
}
