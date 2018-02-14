if (!document) {
    var THREE = require('three');
}

//Set Title
var titleMsg = "Helpers demo<br>By Tyler Gabb"
document.getElementById('info').innerHTML = titleMsg

//NOTHING ABOVE THIS LINE IS ESSENTIAL ------------------------------------

var renderer = new THREE.WebGLRenderer();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.01, 1000);
camera.position.set(30, 15, 30);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera);//You don't need to know anything about this;
controls.enablePan = false; //stops you from being able to change position of camera

//=============== C O D E     G O E S      H E R E=======================

var axisHelper = new THREE.AxisHelper(10);
scene.add(axisHelper);

var gridHelper = new THREE.GridHelper(10, 10);
gridHelper.position.y = -0.01; //prevents fighting for rendering between axishelper and gridhelper
scene.add(gridHelper);

var cube = new THREE.Mesh(
    new THREE.CubeGeometry(4, 4, 4),
    new THREE.MeshStandardMaterial({
        color: 0x54FF9F
    })
)
scene.add(cube);

var light = new THREE.PointLight(0xFFFFFF, 2, 200);
var lightHelper = new THREE.PointLightHelper(light);

light.position.set(11,11,20);
scene.add(light);
scene.add(lightHelper);


//=======================================================================

camera.lookAt(new THREE.Vector3(0, 0, 0));
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();