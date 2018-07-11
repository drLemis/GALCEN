function createControls(camera, renderer) {
	// controls
	var controls = new THREE.OrbitControls(camera, renderer.domElement);
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

	return controls;
};

function createCamera() {
	var camera = new THREE.PerspectiveCamera(60, window.innerWidth / (window.innerHeight - 20), 1, 6000);
	camera.position.set(400, 200, 0);

	return camera;
};

function noisePerlin(size, rMod, gMod, bMod, inThr, outThr) {
	var canvas = document.createElement('CANVAS');
	canvas.width = canvas.height = size;

	var ctx = canvas.getContext('2d');

	var image = ctx.createImageData(canvas.width, canvas.height);
	var data = image.data;

	noise.seed(Math.random());

	for (var x = 0; x < canvas.width; x++) {
		for (var y = 0; y < canvas.height; y++) {
			var value = Math.abs(noise.perlin2(x / 100, y / 100));
			value *= 256;
			var cell = (x + y * canvas.width) * 4;
			data[cell] = value * rMod;
			data[cell + 1] = value * gMod;
			data[cell + 2] = value * bMod;

			// alpha based on thresholds
			var distance = Math.hypot(x - size / 2, y - size / 2) / (size / 2);
			if (distance <= inThr) {
				distance = 0;
			} else if (distance >= outThr) {
				distance = 1;
			} else {
				distance = (distance - inThr) * (1 / (outThr - inThr));
			}

			data[cell + 3] = 255 * (1 - distance); // alpha.
		}
	}

	ctx.fillColor = 'black';
	ctx.fillRect(0, 0, size, size);
	ctx.putImageData(image, 0, 0);

	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	return texture;
}

