window.initThreeJS = function (canvasId, glbPath) {
    if (typeof THREE === 'undefined') {
        console.error("Three.js is not loaded.");
        return;
    }

    var canvas = document.getElementById(canvasId);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Add directional light
    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    // Load the .glb model
    var loader = new THREE.GLTFLoader();
    loader.load(glbPath, function (gltf) {
        var model = gltf.scene;
        scene.add(model);

        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);

        // Initial camera position
        camera.position.z = 10;

        // Set up scroll tracking
        var scrollPercent = 0;

        // Listen for mousewheel or scroll events to update the camera position
        window.addEventListener('wheel', function (event) {
            scrollPercent += event.deltaY * 0.001;  // Adjust the multiplier for speed
            scrollPercent = Math.min(Math.max(scrollPercent, 0), 1);  // Keep between 0 and 1
        });

        // Animation loop with scroll-based camera movement
        function animate() {
            requestAnimationFrame(animate);

            // Move the camera along the Z-axis based on scroll percentage
            camera.position.z = 10 - scrollPercent * 8;  // Adjust the numbers for movement range

            // Trigger transition when camera reaches a certain Z position
            if (scrollPercent >= 1) {
                document.getElementById('3d-container').style.transition = 'opacity 1s';
                document.getElementById('3d-container').style.opacity = '0';
                setTimeout(function () {
                    document.getElementById('3d-container').style.display = 'none';
                    document.getElementById('main-content').style.display = 'block';  // Show main content
                }, 1000);
            }

            renderer.render(scene, camera);
        }

        animate();
    });
};

window.initScrollTransition = function () {
    window.addEventListener('scroll', function () {
        const scrollPosition = window.scrollY; // How much the user has scrolled
        const windowHeight = window.innerHeight;

        // Debugging: Log scroll position to check if it's firing
        console.log('Scroll position:', scrollPosition);

        // When the user scrolls past half the window height, trigger the transition
        if (scrollPosition > windowHeight * 0.5) {
            console.log('Triggering transition...'); // Debugging: Log when transition is triggered

            document.getElementById('3d-container').style.transition = 'opacity 1s';
            document.getElementById('3d-container').style.opacity = '0';

            // After the fade-out transition, hide the 3D scene and show the main content
            setTimeout(function () {
                document.getElementById('3d-container').style.display = 'none';
                document.getElementById('main-content').style.display = 'block'; // Show the main site
            }, 1000);
        }
    });
};

