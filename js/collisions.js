if (!document) {
    var THREE = require('three');
}

document.getElementById('info').innerHTML = "Local and Global vertices<br>Collision detection<br>BEHOLD THE EFFECTS OF ROUNDOFF ERROR"
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





//===================          C O D E    G O E S        H E R E        =======================
var gridHelper = new THREE.GridHelper(20, 20, 0xff0000, 0xffffff);
scene.add(gridHelper);
gridHelper.position.y += 0.01;

var geom = new THREE.CubeGeometry(2, 2, 2);
var mat = new THREE.MeshBasicMaterial({
    color: 0x54FF9F, //seagreen
    wireframe: true
})

var localCube = new THREE.Mesh(
    new THREE.CubeGeometry(2, 2, 2),
    new THREE.MeshBasicMaterial({
        color: 0xFFFFFFD,
        wireframe: true
    })
)
localCube.position.y = 1;

scene.add(localCube);

var cube = new THREE.Mesh(geom, mat);
cube.position.set(5, 10, 5);
scene.add(cube);
cube.collisionArrows = new THREE.Object3D();
cube.velocity = new THREE.Vector3(0, 0, 0);
cube.acceleration = new THREE.Vector3(0, -0.005, 0);
cube.accelerationArrow = new THREE.ArrowHelper(cube.acceleration.clone().normalize(), cube.position, cube.acceleration.length(), 0xff0000);
scene.add(cube.accelerationArrow);
cube.update = function(){
    cube.position.add(cube.velocity);
    cube.velocity.add(cube.acceleration);
}

//add lights and collidable mesh---------------------------------------------
var light = new THREE.PointLight(0xFFFFFF, 2, 200);
scene.add(light);
light.position.set(0, 50, 0);

var collidableMesh = new THREE.Object3D();
var planeMat = new THREE.MeshStandardMaterial({
    color: 0xAAAAAA,
    side: THREE.DoubleSide
})

var planeG = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), planeMat);
planeG.rotateX(Math.PI / 2);
planeG.material.roughness = 0.95;

collidableMesh.add(planeG);
scene.add(collidableMesh)
//----------------------------------------------------------------------




camera.lookAt(new THREE.Vector3(0, 0, 0));
t = 0;
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    //rotateCube();
    cube.update();
    if (!cube.collide && t < 10) {
        t++;
    }
    else {
        t = 0
        cube.collide = true;
    }

    updateCollisionRays();
}
renderer.render(scene, camera);//Render scene once to obtain accurate initialization
initializeCollisionArrows();

function initializeCollisionArrows() {
    for (var i = 0; i < cube.geometry.vertices.length; i++) {
        var localVertex = cube.geometry.vertices[i].clone();
        var globalVertex = localVertex.clone().applyMatrix4(cube.matrix);
        var directionVector = (new THREE.Vector3()).subVectors(globalVertex, cube.position)
        var ray = new THREE.Ray(cube.position, directionVector.clone().normalize());
        var arrow = new THREE.ArrowHelper(directionVector.clone().normalize(), cube.position, directionVector.length()*1.1);
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
        var ray = new THREE.Raycaster(cube.position, directionVector.clone().normalize())
        var x = collidableMesh.children;

        var collisionResults = ray.intersectObjects(collidableMesh.children);
        if (cube.collide && collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
            console.log('collision!');
            cube.velocity.multiplyScalar(-1);
            console.log(cube.velocity);
            cube.collide = false;
        } 
        cube.collisionArrows.children[i].position.set(p.x,p.y,p.z)
        cube.collisionArrows.children[i].setDirection(directionVector.normalize());
    }
}

function rotateCube() {
    cube.rotation.x += Math.PI / 100
    cube.rotation.y += Math.PI / 200
    cube.rotation.z += Math.PI / 300
}


animate();
