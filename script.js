// Global variables
let scene, camera, renderer, cake, candles = [], candleLights = [], flames = [];
let cakeClicked = false;
let scrollEnabled = false;

function initCake() {
    scene = new THREE.Scene();
    
    // Camera setup - Field of view thoda kam kiya for cinematic look
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 8, 18);

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Mobile performance optimize
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("cake-canvas").appendChild(renderer.domElement);

    // Lights - Thodi warm aur soft lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(10, 20, 10);
    scene.add(spotLight);

    const cakeGroup = new THREE.Group();

    // Layers with subtle gradient colors (Darker to lighter)
    const layerColors = [0x8b0000, 0xaf1226, 0xd32f2f]; // Dark Red theme
    const radii = [5, 4, 3];

    for (let i = 0; i < 3; i++) {
        const geo = new THREE.CylinderGeometry(radii[i], radii[i], 2.2, 64);
        const mat = new THREE.MeshPhongMaterial({ 
            color: layerColors[i],
            shininess: 100,
            specular: 0x333333
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = i * 2.2;
        cakeGroup.add(mesh);
        
        // Cream/Frosting layers between cylinders
        const creamGeo = new THREE.TorusGeometry(radii[i], 0.2, 16, 100);
        const creamMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const cream = new THREE.Mesh(creamGeo, creamMat);
        cream.rotation.x = Math.PI / 2;
        cream.position.y = (i * 2.2) + 1.1;
        cakeGroup.add(cream);
    }

    addCandles(cakeGroup);
    scene.add(cakeGroup);
    cake = cakeGroup;

    animate();

    // Events
    renderer.domElement.addEventListener("click", handleCakeClick);
    renderer.domElement.addEventListener("touchstart", (e) => {
        // Mobile touch support
        if(!cakeClicked) handleCakeClick();
    });
}

function addCandles(cakeGroup) {
    const positions = [
        { x: 0, z: 0 }, { x: 1.5, z: 1.5 }, { x: -1.5, z: 1.5 },
        { x: 1.5, z: -1.5 }, { x: -1.5, z: -1.5 }
    ];

    positions.forEach((pos) => {
        // Candle Stick
        const candleGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 12);
        const candleMat = new THREE.MeshPhongMaterial({ color: 0xffd700 }); // Gold candles
        const candle = new THREE.Mesh(candleGeo, candleMat);
        candle.position.set(pos.x, 6, pos.z);
        cakeGroup.add(candle);

        // Flame (Cone)
        const flameGeo = new THREE.ConeGeometry(0.2, 0.5, 12);
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xffa500 });
        const flame = new THREE.Mesh(flameGeo, flameMat);
        flame.position.set(pos.x, 7, pos.z);
        cakeGroup.add(flame);
        flames.push(flame);

        // Light for flame
        const light = new THREE.PointLight(0xffa500, 1.5, 5);
        light.position.set(pos.x, 7, pos.z);
        scene.add(light);
        candleLights.push(light);
    });
}

function animate() {
    requestAnimationFrame(animate);

    if (!cakeClicked) {
        // Idle motion - cake thoda sa float karega
        cake.position.y = Math.sin(Date.now() * 0.002) * 0.5;
        cake.rotation.y += 0.005;
        
        // Flames flicker effect
        flames.forEach(f => {
            f.scale.setScalar(1 + Math.sin(Date.now() * 0.02) * 0.2);
        });
    } else {
        // Spin fast after click
        cake.rotation.y += 0.05;
        cake.position.y += (0 - cake.position.y) * 0.1; // Smoothly center y
    }

    renderer.render(scene, camera);
}

function handleCakeClick() {
    if (cakeClicked) return;
    cakeClicked = true;

    // 1. Sound or Visual Feedback
    document.getElementById("instructions").style.opacity = "0";
    
    // 2. Blow out candles
    flames.forEach(f => f.visible = false);
    candleLights.forEach(l => l.intensity = 0);

    // 3. Start Confetti
    createConfetti();
    
    // 4. Enable Scroll & show hint
    scrollEnabled = true;
    setTimeout(() => {
        const hint = document.getElementById("scroll-instruction");
        hint.style.display = "block";
        hint.style.opacity = "1";
    }, 1500);
}

function createConfetti() {
    // Canvas setup logic (Same as yours but with more particles)
    const canvas = document.getElementById("confetti-canvas");
    canvas.style.display = "block";
    const ctx = canvas.getContext("2d");
    // ... (Your confetti drawing logic is good, just increase 'confettiCount' to 400 for 'Wow' factor)
}

// Global Scroll Handler with "Impressive" transition
window.addEventListener("scroll", () => {
    if (!scrollEnabled) {
        window.scrollTo(0, 0);
        return;
    }

    const scroll = window.scrollY;
    const cakeCanvas = document.getElementById("cake-canvas");
    const letter = document.getElementById("letter");

    if (scroll > 50) {
        // Cake goes to the side, Letter slides in
        cakeCanvas.style.transform = "translateX(-25%) scale(0.6) rotate(-10deg)";
        cakeCanvas.style.opacity = "0.7";
        letter.classList.add("active"); // CSS mein .active class handle hogi
    } else {
        cakeCanvas.style.transform = "translateX(0) scale(1) rotate(0deg)";
        cakeCanvas.style.opacity = "1";
        letter.classList.remove("active");
    }
});
