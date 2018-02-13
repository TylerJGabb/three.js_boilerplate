if (!document) {
    var THREE = require('three');
}


//Set Title
var titleMsg = "Minimalistic shadow demo<br>By Tyler Gabb"
document.getElementById('info').innerHTML = titleMsg

var renderer = new THREE.WebGLRenderer({
    antialias : true //SET THIS FOR SMOOTH SHADING
})

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.01, 1000);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var controls = new THREE.OrbitControls(camera);
controls.enablePan = false;//stops movability of camera with controls


//Add a plane to see the shadow effect 
var planeGeom = new THREE.PlaneGeometry(100, 100);
var planeMat = new THREE.MeshStandardMaterial({
    color: 0xAAAAAA,
    side: THREE.DoubleSide,
    roughness : 1
});
var plane = new THREE.Mesh(planeGeom, planeMat);
plane.rotateX(Math.PI / 2);//rotate the plane
plane.position.y -= 10;//and move it down so its not intersecting the cube
scene.add(plane);


//Add a cube
var geom = new THREE.CubeGeometry(5, 5, 5);
var mat = new THREE.MeshStandardMaterial({//Note the material here. Responsive to lighting
    color: 0x54FF9F //seagreen
})
var cube = new THREE.Mesh(geom, mat);
scene.add(cube);

//Add some lights
var ambient = new THREE.AmbientLight(0x404040, 2);//soft white light

var light = new THREE.SpotLight(0xFFFFFF, 2, 300);
light.angle = Math.PI / 10; //focus
light.penumbra = 0.5; //edge softness
light.position.y = 30;

var spotLightHelper = new THREE.SpotLightHelper(light);

scene.add(ambient);
scene.add(light);
scene.add(spotLightHelper);

//Now we turn on the options which allow for shadows;
renderer.shadowMapEnabled = true;//THIS IS NECESSARY TO SEE CASTED SHADOWS
renderer.shadowMapType = THREE.PCFSoftShadowMap; //ALSO A NECESITY FOR SMOOTH SHADOWS (i.e. not grainy)
light.shadowMapHeight = 1024; //increase resolution of casted shadows
light.shadowMapWidth = 1024; // ^^^^^^        ^^^      ^^^^^^^
light.target = cube;

//the last step is to set shadow receiving and casting properties of objects in scene
plane.receiveShadow = true;
cube.castShadow = true;
light.castShadow = true;

var delta = 0;
camera.position.set(75, 40, 70);
camera.lookAt(new THREE.Vector3(0, 0, 0));
function animate() {
    light.position.x = 40 * Math.sin(delta);
    light.position.z = 40 * Math.cos(delta);
    delta += 0.01;
    spotLightHelper.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    
}
animate();








var toggleWire = document.createElement('button');
toggleWire.innerHTML = "Wireframe Toggle"
toggleWire.style.fontSize = "20px"
toggleWire.style.position = 'absolute';
toggleWire.style.width = '200px';
toggleWire.style.height = '100px';
toggleWire.style.textAlign = 'center';
toggleWire.style.color = "#FFFFFF";
toggleWire.style.backgroundColor = "#404040";
toggleWire.style.zIndex = 2;
toggleWire.style.fontFamily = 'Courier New';
toggleWire.style.top = '0px'
toggleWire.style.borderRadius = '30px'
toggleWire.addEventListener('click', function(e) {
    cube.material.wireframe = !cube.material.wireframe;

})
document.body.appendChild(toggleWire);
