if (!Detector.webgl) Detector.addGetWebGLMessage();
var camera, controls, scene, renderer;
init();
// render(); // remove when using next line for animation loop (requestAnimationFrame)
animate();

function init() {

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);
	// scene.fog = new THREE.FogExp2(0x000000, 0.002);
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight - 20);
	document.body.appendChild(renderer.domElement);

	camera = createCamera();

	controls = createControls(camera, renderer);

	// skybox
	var skyBox = new THREE.BoxGeometry(5000, 5000, 5000);
	var skyBoxMaterial = new THREE.MeshBasicMaterial({
		map: getRandomStarField(75, 2048, 2048),
		side: THREE.BackSide
	});
	var sky = new THREE.Mesh(skyBox, skyBoxMaterial);
	scene.add(sky);


	// main object
	var material = new THREE.MeshBasicMaterial({
		map: noisePerlin(1024, Math.random(), Math.random(), Math.random(), 0.5 - Math.random() * 0.45, 0.5 + Math.random() * 0.45),
		color: 0xffffff,
		side: THREE.DoubleSide,
		transparent: true
	});

	var geometry = new THREE.PlaneGeometry(256, 256);
	var mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = Math.PI * 1.5;
	mesh.updateMatrix();
	mesh.matrixAutoUpdate = false;
	scene.add(mesh);


	// center
	var sphere = new THREE.SphereBufferGeometry(Math.random() * 5 + 5, 16, 8);
	var materiala = new THREE.MeshBasicMaterial({
		map: noisePerlin(128, 0, 0, 0, 0.1, 1),
		color: 0xffffff,
		side: THREE.DoubleSide,
		transparent: true
	});

	// //lights
	// var intensity = 256;
	// var distance = 256;
	// var decay = 0;

	// lightMain = new THREE.PointLight(0xffffff, intensity, distance, decay);
	// lightMain.add(new THREE.Mesh(sphere, materiala));
	// scene.add(lightMain);

	// lightCenter = new THREE.PointLight(0xff0000, 1, 0.1, 1);
	// scene.add(lightCenter);

	scene.add(new THREE.Mesh(sphere, materiala));

	window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / (window.innerHeight - 20);
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight - 20);
}

function animate() {
	requestAnimationFrame(animate);
	controls.update();
	render();
}

function render() {
	renderer.render(scene, camera);
}