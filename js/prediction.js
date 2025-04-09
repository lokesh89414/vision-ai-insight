
document.addEventListener('DOMContentLoaded', function() {
    initPredictionPage();
});

function initPredictionPage() {
    // Initialize the upload area and file input
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const cameraBtn = document.getElementById('camera-btn');
    const cameraFeed = document.getElementById('camera-feed');
    const cameraCanvas = document.getElementById('camera-canvas');
    
    // Initialize chatbot
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const minimizeChatbot = document.getElementById('minimize-chatbot');
    const sendMessageBtn = document.getElementById('send-message-btn');
    const chatbotInput = document.getElementById('chatbot-input-field');
    const chatbotMessages = document.getElementById('chatbot-messages');
    
    // Modal elements
    const emailModal = document.getElementById('email-modal');
    const emailForm = document.getElementById('email-form');
    const emailDoctorBtn = document.getElementById('email-doctor-btn');
    const closeModal = document.querySelector('.close-modal');
    
    // Result action buttons
    const downloadReportBtn = document.getElementById('download-report-btn');
    const startOverBtn = document.getElementById('start-over-btn');
    
    // Model and analysis elements
    const modelStatus = document.querySelector('.model-status');
    const modelStatusText = document.getElementById('model-status-text');
    const analysisContainer = document.getElementById('analysis-container');
    const analysisProgress = document.getElementById('analysis-progress');
    const analysisResults = document.getElementById('analysis-results');
    const progressBar = document.getElementById('analysis-progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const previewImage = document.getElementById('preview-image');
    const confidenceFill = document.getElementById('confidence-fill');
    const confidencePercentage = document.getElementById('confidence-percentage');
    
    // Initialize TensorFlow model
    let model = null;
    let isModelReady = false;
    
    // Load TensorFlow.js model
    async function loadModel() {
        try {
            modelStatusText.textContent = 'Initializing...';
            
            // Update progress during model loading
            let loadingProgress = 0;
            const progressInterval = setInterval(() => {
                loadingProgress += Math.random() * 5;
                if (loadingProgress > 95) {
                    loadingProgress = 95;
                    clearInterval(progressInterval);
                }
                modelStatusText.textContent = `${Math.round(loadingProgress)}%`;
            }, 200);
            
            // Try to load model (this is a placeholder for actual model loading)
            try {
                // In a real implementation, you would use tf.loadLayersModel() or tf.loadGraphModel()
                // The path should point to your model files (model.json)
                // model = await tf.loadLayersModel('model/model.json');
                
                // Mock model loading with a delay for demonstration
                await new Promise(resolve => setTimeout(resolve, 3000));
                
                // Clear the interval and set to 100%
                clearInterval(progressInterval);
                modelStatusText.textContent = '100%';
                
                // Hide the loading message after a brief pause
                setTimeout(() => {
                    modelStatus.style.display = 'none';
                    isModelReady = true;
                }, 500);
                
            } catch (error) {
                clearInterval(progressInterval);
                modelStatusText.textContent = 'Failed to load model';
                console.error('Error loading model:', error);
                alert('Error loading the AI model. Please try again later.');
            }
        } catch (error) {
            console.error('Error initializing TensorFlow:', error);
            modelStatusText.textContent = 'Error initializing';
            alert('Could not initialize the AI engine. Please try again later.');
        }
    }
    
    // Start loading the model
    loadModel();
    
    // Upload area event listeners
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
        
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                handleFileUpload(e.dataTransfer.files[0]);
            }
        });
        
        fileInput.addEventListener('change', function() {
            if (this.files.length) {
                handleFileUpload(this.files[0]);
            }
        });
    }
    
    // Camera button event listener
    if (cameraBtn) {
        cameraBtn.addEventListener('click', function() {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                // Toggle camera on/off
                if (cameraFeed.hidden) {
                    startCamera();
                } else {
                    stopCamera();
                }
            } else {
                alert('Sorry, your browser does not support camera access.');
            }
        });
    }
    
    // Start camera
    function startCamera() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                cameraFeed.srcObject = stream;
                cameraFeed.hidden = false;
                cameraBtn.innerHTML = '<i class="fas fa-camera"></i> Take Photo';
                
                // Add a second click handler for taking the picture
                cameraBtn.removeEventListener('click', startCamera);
                cameraBtn.addEventListener('click', takePicture);
            })
            .catch(function(error) {
                console.error('Error accessing camera:', error);
                alert('Could not access the camera. Please check your permissions.');
            });
    }
    
    // Stop camera
    function stopCamera() {
        if (cameraFeed.srcObject) {
            const tracks = cameraFeed.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            cameraFeed.srcObject = null;
            cameraFeed.hidden = true;
            cameraBtn.innerHTML = '<i class="fas fa-camera"></i> Take a Photo';
            
            // Reset click handler
            cameraBtn.removeEventListener('click', takePicture);
            cameraBtn.addEventListener('click', startCamera);
        }
    }
    
    // Take a picture from camera
    function takePicture() {
        // Get the canvas context
        const context = cameraCanvas.getContext('2d');
        
        // Set canvas dimensions to match video
        cameraCanvas.width = cameraFeed.videoWidth;
        cameraCanvas.height = cameraFeed.videoHeight;
        
        // Draw the current video frame to the canvas
        context.drawImage(cameraFeed, 0, 0, cameraCanvas.width, cameraCanvas.height);
        
        // Convert canvas to blob
        cameraCanvas.toBlob(function(blob) {
            // Create a File object from the blob
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            
            // Process the file as if it was uploaded
            handleFileUpload(file);
            
            // Stop the camera after taking the photo
            stopCamera();
        }, 'image/jpeg', 0.95);
    }
    
    // Handle the uploaded file
    function handleFileUpload(file) {
        // Check if model is ready
        if (!isModelReady) {
            alert('Please wait for the AI model to finish loading.');
            return;
        }
        
        // Check file type
        if (!file.type.match('image.*')) {
            alert('Please upload an image file (JPG, PNG or JPEG).');
            return;
        }
        
        // Check file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            alert('Please upload an image smaller than 10MB.');
            return;
        }
        
        // Show the analysis container and hide upload area
        analysisContainer.hidden = false;
        uploadArea.style.display = 'none';
        document.querySelector('.or-divider').style.display = 'none';
        document.querySelector('.camera-capture').style.display = 'none';
        
        // Show the preview image
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
        
        // Start the analysis
        startAnalysis(file);
    }
    
    // Analyze the image
    function startAnalysis(file) {
        // Show progress elements
        analysisProgress.hidden = false;
        analysisResults.hidden = true;
        
        // Simulate progress animation
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 5;
            if (progress > 100) {
                progress = 100;
                clearInterval(progressInterval);
                
                // Show results after analysis completion
                setTimeout(() => {
                    analysisProgress.hidden = true;
                    showResults();
                }, 500);
            }
            
            progressBar.style.width = `${progress}%`;
            progressPercentage.textContent = `${Math.round(progress)}%`;
        }, 100);
        
        // In a real implementation, here's where you'd process the image with TensorFlow
        // Example (commented out as we're using a mock implementation):
        /*
        const img = new Image();
        img.onload = async function() {
            const tensor = tf.browser.fromPixels(img)
                .resizeNearestNeighbor([224, 224])
                .toFloat()
                .expandDims();
                
            const prediction = await model.predict(tensor).data();
            processResults(prediction);
            
            // Clean up
            tensor.dispose();
        };
        img.src = URL.createObjectURL(file);
        */
    }
    
    // Show the analysis results
    function showResults() {
        analysisResults.hidden = false;
        
        // Get all elements that need to be updated
        const primaryCondition = document.querySelector('#primary-condition .condition-name');
        const primaryProbability = document.querySelector('#primary-condition .condition-probability');
        const secondaryConditionsList = document.querySelector('#secondary-conditions .conditions-list');
        const recommendationsContent = document.querySelector('#recommendations .recommendation-content');
        
        // Mock results data (in a real app, this would come from the model prediction)
        const results = {
            primary: {
                condition: 'Diabetic Retinopathy',
                probability: 0.87
            },
            secondary: [
                { condition: 'Glaucoma', probability: 0.12 },
                { condition: 'Cataract', probability: 0.08 },
                { condition: 'AMD', probability: 0.03 }
            ],
            recommendations: [
                { type: 'consult', text: 'Consult an ophthalmologist within 2 weeks.' },
                { type: 'monitor', text: 'Monitor blood sugar levels daily.' },
                { type: 'lifestyle', text: 'Maintain a healthy diet low in sugar and refined carbs.' },
                { type: 'followup', text: 'Schedule a follow-up scan in 3 months.' }
            ],
            confidenceScore: 0.87
        };
        
        // Set the confidence score
        confidenceFill.style.width = `${results.confidenceScore * 100}%`;
        confidencePercentage.textContent = `${Math.round(results.confidenceScore * 100)}%`;
        
        // Set primary condition
        primaryCondition.textContent = results.primary.condition;
        primaryProbability.textContent = `${Math.round(results.primary.probability * 100)}%`;
        
        // Set secondary conditions
        secondaryConditionsList.innerHTML = '';
        results.secondary.forEach(condition => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${condition.condition}</span>
                <span>${Math.round(condition.probability * 100)}%</span>
            `;
            secondaryConditionsList.appendChild(li);
        });
        
        // Set recommendations
        recommendationsContent.innerHTML = '';
        results.recommendations.forEach(rec => {
            const div = document.createElement('div');
            div.className = 'recommendation-item';
            
            let icon = 'fa-info-circle';
            if (rec.type === 'consult') icon = 'fa-user-md';
            else if (rec.type === 'monitor') icon = 'fa-chart-line';
            else if (rec.type === 'lifestyle') icon = 'fa-apple-alt';
            else if (rec.type === 'followup') icon = 'fa-calendar-check';
            
            div.innerHTML = `
                <span class="recommendation-icon"><i class="fas ${icon}"></i></span>
                <span>${rec.text}</span>
            `;
            recommendationsContent.appendChild(div);
        });
        
        // Animate elements in
        setTimeout(() => {
            analysisResults.style.opacity = '1';
        }, 100);
    }
    
    // Chatbot events
    if (chatbotToggle && chatbotContainer) {
        chatbotToggle.addEventListener('click', function() {
            chatbotContainer.classList.add('active');
        });
        
        minimizeChatbot.addEventListener('click', function() {
            chatbotContainer.classList.remove('active');
        });
        
        // Send message in chatbot
        sendMessageBtn.addEventListener('click', sendChatbotMessage);
        
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatbotMessage();
            }
        });
    }
    
    function sendChatbotMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            // Add user message to chat
            addChatMessage(message, 'user');
            
            // Clear input
            chatbotInput.value = '';
            
            // Process the message and respond (with a small delay for realism)
            setTimeout(() => {
                const botResponse = getChatbotResponse(message);
                addChatMessage(botResponse, 'bot');
            }, 800);
        }
    }
    
    function addChatMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        
        const icon = document.createElement('i');
        icon.className = sender === 'bot' ? 'fas fa-robot' : 'fas fa-user';
        
        avatar.appendChild(icon);
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = `<p>${text}</p>`;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        chatbotMessages.appendChild(messageDiv);
        
        // Scroll to the latest message
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    function getChatbotResponse(message) {
        // Simple pattern matching for demo purposes
        // In a real application, this would use more sophisticated NLP
        message = message.toLowerCase();
        
        if (message.includes('diabetic retinopathy') || message.includes('diabetes')) {
            return "Diabetic retinopathy is an eye condition resulting from diabetes. It occurs when high blood sugar damages blood vessels in the retina. Early detection and treatment are crucial to prevent vision loss.";
        } else if (message.includes('glaucoma')) {
            return "Glaucoma is a group of eye conditions that damage the optic nerve. It's typically caused by abnormally high pressure in your eye and can lead to vision loss if not treated early.";
        } else if (message.includes('cataract')) {
            return "Cataracts cause clouding of the eye's lens, leading to blurry vision. They develop slowly and are common as people age. Surgery to replace the lens is highly effective.";
        } else if (message.includes('amd') || message.includes('macular degeneration')) {
            return "Age-related macular degeneration (AMD) affects the macula, the central part of the retina. It causes blurred central vision and is a leading cause of vision loss in older adults.";
        } else if (message.includes('treatment') || message.includes('cure')) {
            return "Treatment options vary depending on the specific eye condition. They may include medication, laser therapy, injections, or surgery. Early diagnosis significantly improves treatment outcomes.";
        } else if (message.includes('prevent') || message.includes('prevention')) {
            return "Preventive measures include regular eye exams, controlling diabetes and blood pressure, not smoking, maintaining a healthy weight, eating nutritious foods rich in antioxidants, and protecting your eyes from the sun.";
        } else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello! I'm your AI assistant. How can I help you with understanding your eye health today?";
        } else if (message.includes('thank')) {
            return "You're welcome! If you have any other questions about eye health, I'm here to help.";
        } else if (message.includes('accuracy') || message.includes('reliable')) {
            return "Our AI model has been trained on millions of eye images and achieves over 95% accuracy in detecting common eye conditions. However, it's always important to confirm any diagnosis with a healthcare professional.";
        } else {
            return "I'm not sure I understand that completely. Could you ask about a specific eye condition like diabetic retinopathy, glaucoma, cataracts, or age-related macular degeneration? Or perhaps you'd like to know about treatment options or prevention measures?";
        }
    }
    
    // Email modal events
    if (emailDoctorBtn && emailModal) {
        emailDoctorBtn.addEventListener('click', function() {
            emailModal.classList.add('active');
        });
        
        closeModal.addEventListener('click', function() {
            emailModal.classList.remove('active');
        });
        
        // Close modal when clicking outside content
        emailModal.addEventListener('click', function(e) {
            if (e.target === emailModal) {
                emailModal.classList.remove('active');
            }
        });
        
        // Handle email form submission
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const doctorEmail = document.getElementById('doctor-email').value;
            const name = document.getElementById('your-name').value;
            
            // In a real app, this would send the data to a server
            // For the demo, we'll just show a success message
            alert(`Report would be sent to Dr. ${doctorEmail} from ${name}. This is a demo functionality.`);
            
            // Reset form and close modal
            emailForm.reset();
            emailModal.classList.remove('active');
        });
    }
    
    // Download report functionality
    if (downloadReportBtn) {
        downloadReportBtn.addEventListener('click', function() {
            alert('In a real application, this would generate and download a PDF report with detailed analysis results and recommendations.');
        });
    }
    
    // Start over button
    if (startOverBtn) {
        startOverBtn.addEventListener('click', function() {
            // Reset UI
            analysisContainer.hidden = true;
            uploadArea.style.display = 'block';
            document.querySelector('.or-divider').style.display = 'block';
            document.querySelector('.camera-capture').style.display = 'block';
            
            // Reset file input
            fileInput.value = '';
        });
    }
}
