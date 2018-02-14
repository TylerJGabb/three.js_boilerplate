if (!document) {
    var THREE = require('three');
}

document.getElementById('info').innerHTML = "Local and Global vertices<br>Collision detection"
document.title = "Collision Detection"

//NOTHING ABOVE THIS LINE IS ESSENTIAL ------------------------------------

var renderer = new THREE.WebGLRenderer();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.01, 1000);
camera.position.set(-0.01, 15, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera);//You don't need to know anything about this;
controls.enablePan = false; //stops you from being able to change position of camera


var geom = new THREE.CubeGeometry(2, 2, 2);
var mat = new THREE.MeshBasicMaterial({
    color: 0x54FF9F, //seagreen
    wireframe: true
})

var gridHelper = new THREE.GridHelper(20, 20, 0xff0000, 0xffffff);
scene.add(gridHelper);

var cube = new THREE.Mesh(geom, mat);
cube.position.set(5, 0, 4);
cube.rotateY(Math.PI / 10);
scene.add(cube);
cube.collisionArrows = new THREE.Object3D();

var localCube = new THREE.Mesh(
    new THREE.CubeGeometry(2,2,2),
    new THREE.MeshBasicMaterial({
        color: 0xFFFFFFD,
        wireframe: true
    }))
scene.add(localCube);

camera.lookAt(new THREE.Vector3(0, 0, 0));
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    rotateCube();
    updateCollisionRays();
}
initializeCollisionRays();
animate();

function initializeCollisionRays() {
    for (var i = 0; i < cube.geometry.vertices.length; i++) {
        var localVertex = cube.geometry.vertices[i].clone();
        var globalVertex = localVertex.clone().applyMatrix4(cube.matrix);
        var directionVector = (new THREE.Vector3()).subVectors(globalVertex, cube.position)
        var ray = new THREE.Ray(cube.position, directionVector.clone().normalize());
        var arrow = new THREE.ArrowHelper(directionVector.clone().normalize(), cube.position, 5);
        arrow.dire
        cube.collisionArrows.add(arrow);
    }
    scene.add(cube.collisionArrows);
}

function updateCollisionRays() {
    var p = cube.position;
    for (var i = 0; i < cube.geometry.vertices.length; i++) {
        var localVertex = cube.geometry.vertices[i].clone();
        var globalVertex = localVertex.clone().applyMatrix4(cube.matrix);
        var directionVector = (new THREE.Vector3()).subVectors(globalVertex, cube.position)
        cube.collisionArrows.children[i].position.set(p.x,p.y,p.z)
        cube.collisionArrows.children[i].setDirection(directionVector.normalize());
    }
}

function rotateCube() {
    cube.rotation.x += Math.PI / 100
    cube.rotation.y += Math.PI / 200
    cube.rotation.z += Math.PI / 300
}


