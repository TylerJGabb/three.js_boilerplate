if (!document) {
    var THREE = require('three');
}

//NOTHING ABOVE THIS LINE IS ESSENTIAL ------------------------------------

var renderer = new THREE.WebGLRenderer();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.01, 1000);
camera.position.set(10, 5, 10);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera);//You don't need to know anything about this;
controls.enablePan = false; //stops you from being able to change position of camera


var geom = new THREE.CubeGeometry(5, 5, 5);
var mat = new THREE.MeshBasicMaterial({
    color: 0x54FF9F, //seagreen
    wireframe: true
})
var cube = new THREE.Mesh(geom, mat);
scene.add(cube);

camera.lookAt(new THREE.Vector3(0, 0, 0));
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

