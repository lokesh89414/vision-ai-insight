
/**
 * Vision AI Insight - Main JavaScript
 * Powers interactive features of the eye disease detection website
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

// ============= Prediction Page Functionality =============
document.addEventListener("DOMContentLoaded", () => {
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
          
          // Enable analyze button
          analyzeBtn.disabled = false;
        };
        reader.readAsDataURL(file);
      }
    }
    
    // Analyze button action
    analyzeBtn.addEventListener('click', startAnalysis);
  }
  
  function startAnalysis() {
    const analysisSection = document.getElementById("analysisSection");
    const loadingScreen = document.getElementById("loadingScreen");
    const resultsCard = document.getElementById("resultsCard");
    const progressBar = document.getElementById("progressBar");
    const analysisStep = document.getElementById("analysisStep");
    
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
        setTimeout(() => {
          // Hide loading, show results
          loadingScreen.style.display = 'none';
          resultsCard.style.display = 'block';
          
          // Initialize results chart
          initResultsChart();
        }, 500);
      }
    }, 50);
  }
  
  // Initialize results chart
  function initResultsChart() {
    const ctx = document.getElementById('resultsChart');
    if (!ctx) return;
    
    // Use Chart.js to create a chart
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Healthy', 'Glaucoma', 'Cataract', 'Diabetic Retinopathy', 'AMD'],
        datasets: [{
          label: 'Probability (%)',
          data: [95, 2, 1, 1, 1],
          backgroundColor: [
            '#34C759',
            '#FF3B30',
            '#FF9500',
            '#FF3B30',
            '#FF9500'
          ],
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
});
