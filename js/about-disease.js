
document.addEventListener('DOMContentLoaded', function() {
    initAboutDiseasePage();
});

function initAboutDiseasePage() {
    // Filter buttons functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const diseaseCards = document.querySelectorAll('.disease-card');
    const diseaseDetail = document.getElementById('disease-detail');
    const backButton = document.querySelector('.back-button');
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // Disease data for the detailed view
    const diseaseData = {
        'glaucoma': {
            title: 'Glaucoma',
            image: 'images/glaucoma.jpg',
            overview: `<h4>What is Glaucoma?</h4>
                <p>Glaucoma is a group of eye conditions that damage the optic nerve, which is vital for good vision. This damage is often caused by abnormally high pressure in your eye. Glaucoma is one of the leading causes of blindness for people over the age of 60.</p>
                <p>It can occur at any age but is more common in older adults. Many forms of glaucoma have no warning signs, and the effect is so gradual that you may not notice a change in vision until the condition is at an advanced stage.</p>`,
            symptoms: `<h4>Common Symptoms</h4>
                <ul>
                    <li>Patchy blind spots in your side (peripheral) or central vision, frequently in both eyes</li>
                    <li>Tunnel vision in the advanced stages</li>
                    <li>Severe headache</li>
                    <li>Eye pain</li>
                    <li>Nausea and vomiting</li>
                    <li>Blurred vision</li>
                    <li>Halos around lights</li>
                    <li>Redness of the eye</li>
                </ul>`,
            causes: `<h4>What Causes Glaucoma?</h4>
                <p>Glaucoma is caused by damage to the optic nerve. As this nerve gradually deteriorates, blind spots develop in your visual field. For reasons that doctors don't fully understand, this nerve damage is usually related to increased pressure in the eye.</p>
                <p>Elevated eye pressure is due to a buildup of a fluid (aqueous humor) that flows throughout the inside of your eye. This internal fluid normally drains out through a tissue called the trabecular meshwork at the angle where the iris and cornea meet. When fluid is overproduced or the drainage system doesn't work properly, the fluid can't flow out at its normal rate and eye pressure increases.</p>`,
            treatment: `<h4>Treatment Options</h4>
                <p>Glaucoma damage is permanent — it cannot be reversed. But treatment and regular checkups can help slow or prevent vision loss, especially if the disease is caught in its early stages.</p>
                <p>Glaucoma is treated by lowering your eye pressure (intraocular pressure). Depending on your situation, your options may include:</p>
                <ul>
                    <li><strong>Eyedrops:</strong> These either reduce the production of fluid in your eye or increase its outflow.</li>
                    <li><strong>Oral medications:</strong> If eyedrops alone don't bring your eye pressure down to the desired level, your doctor may also prescribe an oral medication.</li>
                    <li><strong>Surgery and other therapies:</strong> These include laser therapy, filtering surgery, drainage tubes, or minimally invasive glaucoma surgery (MIGS).</li>
                </ul>`,
            prevention: `<h4>Prevention Strategies</h4>
                <p>These steps may help detect and manage glaucoma in its early stages:</p>
                <ul>
                    <li>Get regular comprehensive eye exams</li>
                    <li>Know your family's eye health history</li>
                    <li>Exercise safely</li>
                    <li>Take prescribed eyedrops regularly</li>
                    <li>Wear eye protection</li>
                    <li>Limit caffeine consumption</li>
                </ul>`
        },
        'diabetic-retinopathy': {
            title: 'Diabetic Retinopathy',
            image: 'images/diabetic-retinopathy.jpg',
            overview: `<h4>What is Diabetic Retinopathy?</h4>
                <p>Diabetic retinopathy is a diabetes complication that affects the eyes. It's caused by damage to the blood vessels of the light-sensitive tissue at the back of the eye (retina).</p>
                <p>Initially, diabetic retinopathy might cause no symptoms or only mild vision problems. But it can lead to blindness if left untreated.</p>`,
            symptoms: `<h4>Common Symptoms</h4>
                <ul>
                    <li>Spots or dark strings floating in your vision (floaters)</li>
                    <li>Blurred vision</li>
                    <li>Fluctuating vision</li>
                    <li>Dark or empty areas in your vision</li>
                    <li>Vision loss</li>
                    <li>Difficulty with color perception</li>
                </ul>`,
            causes: `<h4>What Causes Diabetic Retinopathy?</h4>
                <p>Over time, too much sugar in your blood can lead to the blockage of the tiny blood vessels that nourish the retina, cutting off its blood supply. As a result, the eye attempts to grow new blood vessels. But these new blood vessels don't develop properly and can leak easily.</p>
                <p>There are two types of diabetic retinopathy:</p>
                <ul>
                    <li><strong>Early diabetic retinopathy (nonproliferative):</strong> In this more common form, new blood vessels aren't growing. Instead, the walls of the blood vessels in your retina weaken and develop small bulges (microaneurysms), which may leak fluid and blood into the retina.</li>
                    <li><strong>Advanced diabetic retinopathy (proliferative):</strong> In this type, damaged blood vessels close off, causing the growth of new, abnormal blood vessels in the retina. These can leak into the clear, jelly-like substance that fills the center of your eye (vitreous).</li>
                </ul>`,
            treatment: `<h4>Treatment Options</h4>
                <p>Treatment depends on the type and severity of your condition:</p>
                <ul>
                    <li><strong>Early diabetic retinopathy:</strong> You might not need immediate treatment, but your eye doctor will closely monitor your eyes to determine when treatment should begin. Controlling blood sugar and blood pressure is important.</li>
                    <li><strong>Advanced diabetic retinopathy:</strong> Options include focal laser treatment, scatter laser treatment (panretinal photocoagulation), vitrectomy, or injections of medications into the eye.</li>
                </ul>`,
            prevention: `<h4>Prevention Strategies</h4>
                <p>You can reduce your risk of diabetic retinopathy by:</p>
                <ul>
                    <li>Managing diabetes through blood sugar control, blood pressure management, and cholesterol monitoring</li>
                    <li>Getting regular eye exams</li>
                    <li>Maintaining a healthy lifestyle with proper diet, exercise, and not smoking</li>
                    <li>Being aware of vision changes and seeking prompt care</li>
                </ul>`
        },
        'cataracts': {
            title: 'Cataracts',
            image: 'images/cataract.jpg',
            overview: `<h4>What are Cataracts?</h4>
                <p>A cataract is a clouding of the normally clear lens of your eye. For people who have cataracts, seeing through cloudy lenses is a bit like looking through a frosty or fogged-up window.</p>
                <p>Clouded vision caused by cataracts can make it more difficult to read, drive a car (especially at night) or see the expression on a friend's face.</p>`,
            symptoms: `<h4>Common Symptoms</h4>
                <ul>
                    <li>Clouded, blurred or dim vision</li>
                    <li>Increasing difficulty with vision at night</li>
                    <li>Sensitivity to light and glare</li>
                    <li>Need for brighter light for reading and other activities</li>
                    <li>Seeing "halos" around lights</li>
                    <li>Frequent changes in eyeglass or contact lens prescription</li>
                    <li>Fading or yellowing of colors</li>
                    <li>Double vision in a single eye</li>
                </ul>`,
            causes: `<h4>What Causes Cataracts?</h4>
                <p>Most cataracts develop when aging or injury changes the tissue that makes up your eye's lens. Some cataracts are related to inherited genetic disorders that cause other health problems and increase your risk of cataracts.</p>
                <p>Factors that increase your risk of cataracts include:</p>
                <ul>
                    <li>Increasing age</li>
                    <li>Diabetes</li>
                    <li>Excessive exposure to sunlight</li>
                    <li>Smoking</li>
                    <li>Obesity</li>
                    <li>High blood pressure</li>
                    <li>Previous eye injury or inflammation</li>
                    <li>Previous eye surgery</li>
                    <li>Prolonged use of corticosteroid medications</li>
                    <li>Drinking excessive amounts of alcohol</li>
                </ul>`,
            treatment: `<h4>Treatment Options</h4>
                <p>Treatment of cataracts involves:</p>
                <ul>
                    <li><strong>New eyeglasses:</strong> If a cataract is detected early, vision might be improved with new eyeglasses, brighter lighting, anti-glare sunglasses, or magnifying lenses.</li>
                    <li><strong>Surgery:</strong> If these measures don't help, surgery is the only effective treatment. Cataract surgery involves removing the clouded lens and replacing it with a clear artificial lens. This is generally a safe, effective procedure.</li>
                </ul>`,
            prevention: `<h4>Prevention Strategies</h4>
                <p>While not all cataracts can be prevented, strategies to reduce your risk include:</p>
                <ul>
                    <li>Having regular eye examinations</li>
                    <li>Quitting smoking</li>
                    <li>Managing other health problems, particularly diabetes</li>
                    <li>Wearing sunglasses that block ultraviolet B (UVB) rays</li>
                    <li>Maintaining a healthy diet rich in fruits and vegetables</li>
                    <li>Reducing alcohol consumption</li>
                </ul>`
        },
        'amd': {
            title: 'Age-Related Macular Degeneration',
            image: 'images/amd.jpg',
            overview: `<h4>What is Age-Related Macular Degeneration?</h4>
                <p>Age-related macular degeneration (AMD) is a common eye condition and a leading cause of vision loss among people age 50 and older. It causes damage to the macula, a small spot near the center of the retina and the part of the eye needed for sharp, central vision.</p>
                <p>AMD is a condition that affects the center of the retina, called the macula. The macula is responsible for central vision, which allows you to see fine details clearly.</p>`,
            symptoms: `<h4>Common Symptoms</h4>
                <ul>
                    <li>Blurred or distorted central vision</li>
                    <li>A blurred area near the center of vision</li>
                    <li>Increasing difficulty adapting to low light levels</li>
                    <li>Decreased intensity of colors</li>
                    <li>Difficulty recognizing faces</li>
                    <li>Need for increasingly bright light when reading or doing close work</li>
                    <li>Straight lines appearing wavy</li>
                    <li>Gradual increase in haziness of overall vision</li>
                </ul>`,
            causes: `<h4>What Causes AMD?</h4>
                <p>The exact cause of AMD is not known, but it is associated with the development of drusen, yellow deposits beneath the retina. It tends to run in families and may be affected by a combination of genetic and environmental factors, including:</p>
                <ul>
                    <li>Age (risk increases with age)</li>
                    <li>Family history and genetics</li>
                    <li>Race (more common in Caucasians)</li>
                    <li>Smoking</li>
                    <li>Obesity</li>
                    <li>Cardiovascular disease</li>
                    <li>High blood pressure</li>
                    <li>High cholesterol</li>
                </ul>`,
            treatment: `<h4>Treatment Options</h4>
                <p>Treatment depends on the stage and type of AMD:</p>
                <ul>
                    <li><strong>Early AMD:</strong> Currently, no treatment exists, but regular eye exams are important to monitor progression.</li>
                    <li><strong>Intermediate AMD:</strong> Nutritional supplements containing antioxidants, zinc, and other nutrients may help slow progression.</li>
                    <li><strong>Late AMD (Dry form):</strong> No treatment currently exists, although dietary supplements may still help.</li>
                    <li><strong>Late AMD (Wet form):</strong> Treatments include anti-VEGF drugs, photodynamic therapy, and laser surgery.</li>
                </ul>`,
            prevention: `<h4>Prevention Strategies</h4>
                <p>While there's no proven way to prevent AMD, these measures may help reduce your risk:</p>
                <ul>
                    <li>Regular eye exams</li>
                    <li>Quit smoking</li>
                    <li>Exercise regularly</li>
                    <li>Maintain normal blood pressure and cholesterol levels</li>
                    <li>Eat a nutritious diet rich in green leafy vegetables and fish</li>
                    <li>Protect your eyes from ultraviolet light</li>
                </ul>`
        },
        'dry-eye': {
            title: 'Dry Eye Syndrome',
            image: 'images/dry-eye.jpg',
            overview: `<h4>What is Dry Eye Syndrome?</h4>
                <p>Dry eye syndrome is a chronic condition that occurs when your eyes don't produce enough tears, or when your tears don't provide adequate lubrication for your eyes. Tears are necessary for maintaining the health of the front surface of the eye and for providing clear vision.</p>
                <p>This condition can make everyday activities like reading or using a computer uncomfortable or difficult.</p>`,
            symptoms: `<h4>Common Symptoms</h4>
                <ul>
                    <li>A stinging, burning or scratchy sensation in your eyes</li>
                    <li>Stringy mucus in or around your eyes</li>
                    <li>Sensitivity to light</li>
                    <li>Redness of the eye</li>
                    <li>A sensation of having something in your eyes</li>
                    <li>Difficulty wearing contact lenses</li>
                    <li>Difficulty with nighttime driving</li>
                    <li>Watery eyes, which is the body's response to the irritation of dry eyes</li>
                    <li>Blurred vision or eye fatigue</li>
                </ul>`,
            causes: `<h4>What Causes Dry Eye Syndrome?</h4>
                <p>Dry eyes can occur when tear production and drainage are not in balance. Tears are comprised of three layers: oil, water, and mucus. Problems with any of these layers can cause dry eye symptoms.</p>
                <p>Common causes include:</p>
                <ul>
                    <li>Age (dry eye is more common in people over 50)</li>
                    <li>Gender (women are more likely to develop dry eyes)</li>
                    <li>Medical conditions (diabetes, rheumatoid arthritis, lupus)</li>
                    <li>Medications (antihistamines, decongestants, antidepressants)</li>
                    <li>Environmental conditions (wind, smoke, dry air)</li>
                    <li>Extended screen time</li>
                    <li>Refractive eye surgeries</li>
                </ul>`,
            treatment: `<h4>Treatment Options</h4>
                <p>The treatment for dry eyes aims to restore or maintain the normal amount of tears in the eye to minimize dryness and related discomfort:</p>
                <ul>
                    <li><strong>Over-the-counter eyedrops:</strong> Artificial tears can help relieve mild dry eyes.</li>
                    <li><strong>Lifestyle changes:</strong> Avoiding air blowing in your eyes, adding moisture to the air, and taking breaks during tasks requiring visual concentration.</li>
                    <li><strong>Prescription medications:</strong> Drugs to reduce eyelid inflammation or stimulate tear production.</li>
                    <li><strong>Tear duct plugs:</strong> Small, biocompatible devices that can be inserted into tear ducts to block drainage.</li>
                    <li><strong>Special contact lenses:</strong> Scleral lenses or bandage lenses designed to protect the surface of your eye.</li>
                </ul>`,
            prevention: `<h4>Prevention Strategies</h4>
                <p>To help prevent dry eyes:</p>
                <ul>
                    <li>Avoid direct air on your eyes (like from car heaters, hair dryers, air conditioners)</li>
                    <li>Use a humidifier in winter or dry environments</li>
                    <li>Take breaks during prolonged screen time (follow the 20-20-20 rule)</li>
                    <li>Position your computer screen below eye level</li>
                    <li>Quit smoking and avoid smoke</li>
                    <li>Use artificial tears regularly if you're prone to dry eyes</li>
                    <li>Consider omega-3 fatty acid supplements</li>
                </ul>`
        },
        'retinal-detachment': {
            title: 'Retinal Detachment',
            image: 'images/retinal-detachment.jpg',
            overview: `<h4>What is Retinal Detachment?</h4>
                <p>Retinal detachment is a serious eye condition that occurs when the retina — the light-sensitive layer of tissue at the back of the eye — pulls away from its normal position. Retinal detachment separates the retinal cells from the layer of blood vessels that provides oxygen and nourishment.</p>
                <p>If left untreated, retinal detachment can cause permanent vision loss. It is a medical emergency that requires prompt attention.</p>`,
            symptoms: `<h4>Common Symptoms</h4>
                <ul>
                    <li>Sudden appearance of many floaters — tiny specks that seem to drift through your field of vision</li>
                    <li>Flashes of light in one or both eyes (photopsia)</li>
                    <li>Blurred vision</li>
                    <li>Gradually reduced peripheral (side) vision</li>
                    <li>A curtain-like shadow over your visual field</li>
                </ul>
                <p><strong>Note:</strong> Retinal detachment is painless, but warning signs almost always appear before it occurs or has advanced.</p>`,
            causes: `<h4>What Causes Retinal Detachment?</h4>
                <p>Retinal detachment can occur when:</p>
                <ul>
                    <li><strong>A hole or tear forms in the retina:</strong> This allows fluid to build up under the retina and separate it from the underlying tissues.</li>
                    <li><strong>Fluid accumulates beneath the retina:</strong> Without a hole or tear, fluid can build up and separate the retina from the back of the eye. This is often caused by inflammatory diseases or injury.</li>
                    <li><strong>Scarring or shrinkage of the vitreous:</strong> This can pull the retina toward the center of the eye, causing it to detach.</li>
                </ul>
                <p>Risk factors include:</p>
                <ul>
                    <li>Aging</li>
                    <li>Previous retinal detachment</li>
                    <li>Family history</li>
                    <li>Extreme nearsightedness</li>
                    <li>Previous eye surgery</li>
                    <li>Eye trauma</li>
                    <li>Certain eye disorders</li>
                </ul>`,
            treatment: `<h4>Treatment Options</h4>
                <p>Retinal detachment requires immediate medical attention. The type of surgery depends on the severity and location of the detachment:</p>
                <ul>
                    <li><strong>Photocoagulation:</strong> Laser surgery to seal retinal tears or holes.</li>
                    <li><strong>Cryopexy:</strong> A freezing probe is used to seal the retina around tears or holes.</li>
                    <li><strong>Scleral buckling:</strong> A flexible band is placed around the eye to counteract the force pulling the retina out of place.</li>
                    <li><strong>Pneumatic retinopexy:</strong> A gas bubble is injected into the eye to push the retina back into place.</li>
                    <li><strong>Vitrectomy:</strong> Removal of the vitreous gel and replacement with a gas bubble or silicone oil.</li>
                </ul>`,
            prevention: `<h4>Prevention Strategies</h4>
                <p>While not all retinal detachments can be prevented, these steps may help:</p>
                <ul>
                    <li>Regular comprehensive dilated eye exams, especially if you have risk factors</li>
                    <li>Prompt attention to flashes, floaters, or vision changes</li>
                    <li>Eye protection to prevent trauma</li>
                    <li>Careful management of diabetes</li>
                    <li>Prompt treatment of retinal tears or holes</li>
                </ul>`
        }
    };
    
    // Filter diseases
    if (filterButtons && filterButtons.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                // Filter the disease cards
                diseaseCards.forEach(card => {
                    const categories = card.getAttribute('data-category');
                    
                    if (filter === 'all' || categories.includes(filter)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Disease card "read more" buttons
    if (readMoreButtons && readMoreButtons.length) {
        readMoreButtons.forEach(button => {
            button.addEventListener('click', function() {
                const diseaseId = this.getAttribute('data-disease');
                
                if (diseaseData[diseaseId]) {
                    showDiseaseDetail(diseaseId);
                }
            });
        });
    }
    
    // Back button in disease detail
    if (backButton) {
        backButton.addEventListener('click', function() {
            diseaseDetail.hidden = true;
        });
    }
    
    // Tab functionality in disease detail
    if (tabButtons && tabButtons.length) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Remove active class from all tab buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked tab button
                this.classList.add('active');
                
                // Hide all tab content
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.hidden = true;
                });
                
                // Show selected tab content
                document.getElementById(`${tabId}-content`).hidden = false;
            });
        });
    }
    
    // Function to show disease detail
    function showDiseaseDetail(diseaseId) {
        const data = diseaseData[diseaseId];
        if (!data) return;
        
        // Set title and image
        document.getElementById('disease-title').textContent = data.title;
        document.getElementById('disease-detail-image').src = data.image;
        
        // Set tab content
        document.getElementById('overview-content').innerHTML = data.overview;
        document.getElementById('symptoms-content').innerHTML = data.symptoms;
        document.getElementById('causes-content').innerHTML = data.causes;
        document.getElementById('treatment-content').innerHTML = data.treatment;
        document.getElementById('prevention-content').innerHTML = data.prevention;
        
        // Reset active tab to overview
        tabButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-tab="overview"]').classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.hidden = true;
        });
        document.getElementById('overview-content').hidden = false;
        
        // Show the detail section
        diseaseDetail.hidden = false;
        
        // Scroll to the details section
        diseaseDetail.scrollIntoView({ behavior: 'smooth' });
        
        // Initialize 3D model placeholder effect
        initModelPlaceholder();
    }
    
    // Initialize model placeholder (simulates 3D model loading)
    function initModelPlaceholder() {
        const modelPlaceholder = document.querySelector('.model-placeholder');
        const modelControls = document.querySelector('.model-controls');
        
        if (modelPlaceholder) {
            // In a real implementation, this would load a 3D model
            // For the demo, we'll just show a delayed transition to hide the placeholder
            setTimeout(() => {
                modelPlaceholder.style.display = 'none';
                modelControls.style.display = 'flex';
                
                // Add a canvas/image as placeholder for 3D model
                const modelViewer = document.getElementById('model-viewer');
                
                if (modelViewer && !modelViewer.querySelector('img')) {
                    const img = document.createElement('img');
                    img.src = 'images/3d-eye-model.jpg'; // This would be a placeholder for the 3D model
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    modelViewer.appendChild(img);
                }
            }, 2000);
        }
    }
    
    // Model control buttons functionality (for demo)
    const rotateLeft = document.getElementById('rotate-left');
    const rotateRight = document.getElementById('rotate-right');
    const zoomIn = document.getElementById('zoom-in');
    const zoomOut = document.getElementById('zoom-out');
    
    if (rotateLeft) {
        rotateLeft.addEventListener('click', function() {
            // In a real implementation, this would rotate the 3D model
            alert('In a real implementation, this would rotate the 3D model left.');
        });
    }
    
    if (rotateRight) {
        rotateRight.addEventListener('click', function() {
            alert('In a real implementation, this would rotate the 3D model right.');
        });
    }
    
    if (zoomIn) {
        zoomIn.addEventListener('click', function() {
            alert('In a real implementation, this would zoom in on the 3D model.');
        });
    }
    
    if (zoomOut) {
        zoomOut.addEventListener('click', function() {
            alert('In a real implementation, this would zoom out from the 3D model.');
        });
    }
    
    // Animate timeline on scroll
    initTimelineAnimation();
}

function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineItems && 'IntersectionObserver' in window) {
        const options = {
            threshold: 0.3
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, options);
        
        // Set initial state and observe each item
        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = `opacity 0.5s, transform 0.5s ${index * 0.1}s`;
            observer.observe(item);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        timelineItems.forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        });
    }
}
