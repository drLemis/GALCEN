if (!Detector.webgl) Detector.addGetWebGLMessage();
var camera, controls, scene, renderer;
init();
//render(); // remove when using next line for animation loop (requestAnimationFrame)
animate();

function init() {
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);
	// scene.fog = new THREE.FogExp2(0x000000, 0.002);
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight-20);
	document.body.appendChild(renderer.domElement);
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / (window.innerHeight -20), 1, 6000);
	camera.position.set(400, 200, 0);

	// controls
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.dampingFactor = 0.1;
	controls.screenSpacePanning = false;
	controls.minDistance = 100;
	controls.maxDistance = 500;
	// controls.maxPolarAngle = Math.PI / Math.E * (Math.PI / Math.E); //here be math jokes
	controls.minPolarAngle = Math.PI * 0.25;
	controls.maxPolarAngle = Math.PI * 0.75;
	controls.autoRotate = true;
	controls.autoRotateSpeed = -0.1;
	controls.enablePan = false;
	controls.rotateSpeed = 0.2;
	controls.enableDamping = true;
	
	// skybox
	var skyBox = new THREE.BoxGeometry(5000, 5000, 5000);
	var skyBoxMaterial = new THREE.MeshBasicMaterial({
		map: getRandomStarField(600, 2048, 2048),
		side: THREE.BackSide
	});
	var sky = new THREE.Mesh(skyBox, skyBoxMaterial);
	scene.add(sky);

	// main object
	var textureLoader = new THREE.TextureLoader()
	textureLoader.setCrossOrigin("use-credentials");

	var texture = new textureLoader.load("img/galaxy.png");
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

	var material = new THREE.MeshPhongMaterial({
		map: texture,
		color: 0xffffff,
		side: THREE.DoubleSide,
		transparent: true
	});

	var geometry = new THREE.CircleGeometry(256, 8);
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.x = 0;
	mesh.position.y = 0;
	mesh.position.z = 0;
	mesh.rotation.x = Math.PI * 1.5;
	mesh.updateMatrix();
	mesh.matrixAutoUpdate = false;
	scene.add(mesh);

	// lights
	var light = new THREE.AmbientLight(0xffffff);
	scene.add(light);
	
	window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / (window.innerHeight-20);
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight-20);
}

function animate() {
	requestAnimationFrame(animate);
	controls.update();
	render();
}

function render() {
	renderer.render(scene, camera);
}