
/**
 * Vision AI Insight - 3D Eye Model Visualization
 * Powers the interactive 3D eye model on the About Disease page
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('eyeModelCanvas');
  
  // Only initialize if the eye model canvas exists (About Disease page)
  if (!canvas) return;

  // Set up the Three.js scene
  let scene, camera, renderer;
  let eyeModel, rotationSpeed = 0.005;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  
  // Eye parts and their descriptions for interactive learning
  const eyeParts = [
    { name: 'Cornea', description: 'The clear front surface of the eye that helps focus light.' },
    { name: 'Iris', description: 'The colored part of the eye that controls the size of the pupil.' },
    { name: 'Pupil', description: 'The opening in the center of the iris that allows light to enter the eye.' },
    { name: 'Lens', description: 'A flexible structure that changes shape to focus light onto the retina.' },
    { name: 'Retina', description: 'The light-sensitive tissue at the back of the eye.' },
    { name: 'Optic Nerve', description: 'Carries visual information from the retina to the brain.' },
    { name: 'Macula', description: 'The central part of the retina responsible for detailed central vision.' }
  ];

  init();
  animate();

  function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xD8E1E9); // Light blue background
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create a basic eye model
    createEyeModel();
    
    // Add event listeners for interaction
    canvas.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    window.addEventListener('resize', onWindowResize);
    
    // Add control button functionality
    document.getElementById('rotateLeft').addEventListener('click', () => {
      eyeModel.rotation.y -= 0.5;
    });
    
    document.getElementById('resetView').addEventListener('click', resetView);
    
    document.getElementById('rotateRight').addEventListener('click', () => {
      eyeModel.rotation.y += 0.5;
    });
  }
  
  function createEyeModel() {
    // Create eye group
    eyeModel = new THREE.Group();
    
    // Create eyeball (white of the eye)
    const eyeballGeometry = new THREE.SphereGeometry(2, 32, 32);
    const eyeballMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      specular: 0x333333,
      shininess: 30,
      transparent: true,
      opacity: 0.9
    });
    const eyeball = new THREE.Mesh(eyeballGeometry, eyeballMaterial);
    eyeModel.add(eyeball);
    
    // Create iris
    const irisGeometry = new THREE.CircleGeometry(0.8, 32);
    const irisMaterial = new THREE.MeshPhongMaterial({ color: 0x3E92CC });
    const iris = new THREE.Mesh(irisGeometry, irisMaterial);
    iris.position.z = 1.99; // Position just in front of the eyeball
    eyeModel.add(iris);
    
    // Create pupil
    const pupilGeometry = new THREE.CircleGeometry(0.3, 32);
    const pupilMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    pupil.position.z = 2; // Position just in front of the iris
    eyeModel.add(pupil);
    
    // Create cornea (transparent dome)
    const corneaGeometry = new THREE.SphereGeometry(2.05, 32, 32, 0, Math.PI * 2, 0, Math.PI / 4);
    const corneaMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide
    });
    const cornea = new THREE.Mesh(corneaGeometry, corneaMaterial);
    cornea.rotation.x = Math.PI;
    cornea.position.z = 0.9;
    eyeModel.add(cornea);
    
    // Create optic nerve
    const opticNerveGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 32);
    const opticNerveMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
    const opticNerve = new THREE.Mesh(opticNerveGeometry, opticNerveMaterial);
    opticNerve.position.z = -2;
    opticNerve.rotation.x = Math.PI / 2;
    eyeModel.add(opticNerve);
    
    // Create retina (inner back surface)
    const retinaGeometry = new THREE.SphereGeometry(1.9, 32, 32);
    const retinaMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFF5252, 
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.5
    });
    const retina = new THREE.Mesh(retinaGeometry, retinaMaterial);
    eyeModel.add(retina);
    
    // Create lens
    const lensGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const lensMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xA0E5FF, 
      transparent: true, 
      opacity: 0.7
    });
    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    lens.position.z = 1.4;
    eyeModel.add(lens);
    
    // Create macula (small spot on retina)
    const maculaGeometry = new THREE.CircleGeometry(0.4, 32);
    const maculaMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFFD700, 
      side: THREE.DoubleSide
    });
    const macula = new THREE.Mesh(maculaGeometry, maculaMaterial);
    macula.position.z = -1.89; // Just inside the retina
    eyeModel.add(macula);
    
    // Add eye model to scene
    scene.add(eyeModel);
    
    // Add click detection for eye parts
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    canvas.addEventListener('click', (event) => {
      // Calculate mouse position
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;
      
      // Set raycaster
      raycaster.setFromCamera(mouse, camera);
      
      // Check for intersections
      const intersects = raycaster.intersectObjects(eyeModel.children);
      
      if (intersects.length > 0) {
        const eyePart = intersects[0].object;
        let partInfo = "This is part of the eye.";
        
        // Identify the clicked part based on position and material
        if (eyePart.geometry instanceof THREE.SphereGeometry) {
          if (eyePart.material.opacity === 0.9) {
            partInfo = getPartDescription('Sclera');
          } else if (eyePart.material.side === THREE.BackSide) {
            partInfo = getPartDescription('Retina');
          } else if (eyePart.position.z === 1.4) {
            partInfo = getPartDescription('Lens');
          } else {
            partInfo = getPartDescription('Cornea');
          }
        } else if (eyePart.geometry instanceof THREE.CircleGeometry) {
          if (eyePart.material.color.getHex() === 0x3E92CC) {
            partInfo = getPartDescription('Iris');
          } else if (eyePart.material.color.getHex() === 0x000000) {
            partInfo = getPartDescription('Pupil');
          } else if (eyePart.material.color.getHex() === 0xFFD700) {
            partInfo = getPartDescription('Macula');
          }
        } else if (eyePart.geometry instanceof THREE.CylinderGeometry) {
          partInfo = getPartDescription('Optic Nerve');
        }
        
        // Display info
        document.getElementById('eyePartDescription').textContent = partInfo;
      }
    });
  }
  
  function getPartDescription(partName) {
    const part = eyeParts.find(p => p.name.toLowerCase() === partName.toLowerCase());
    if (part) {
      return `${part.name}: ${part.description}`;
    }
    return `${partName}: Part of the eye structure.`;
  }
  
  function animate() {
    requestAnimationFrame(animate);
    
    // Add subtle rotation if not being dragged
    if (!isDragging) {
      eyeModel.rotation.y += rotationSpeed;
    }
    
    renderer.render(scene, camera);
  }
  
  function onMouseDown(event) {
    isDragging = true;
    
    const rect = canvas.getBoundingClientRect();
    previousMousePosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }
  
  function onMouseMove(event) {
    if (!isDragging) return;
    
    const rect = canvas.getBoundingClientRect();
    const currentMousePosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    
    const deltaMove = {
      x: currentMousePosition.x - previousMousePosition.x,
      y: currentMousePosition.y - previousMousePosition.y
    };
    
    eyeModel.rotation.y += deltaMove.x * 0.01;
    eyeModel.rotation.x += deltaMove.y * 0.01;
    
    previousMousePosition = currentMousePosition;
  }
  
  function onMouseUp() {
    isDragging = false;
  }
  
  function resetView() {
    eyeModel.rotation.set(0, 0, 0);
    document.getElementById('eyePartDescription').textContent = "Click on different parts of the eye to learn more";
  }
  
  function onWindowResize() {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  }
});
