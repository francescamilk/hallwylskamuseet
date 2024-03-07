import * as THREE from 'three';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';

// Gui init
const gui = new GUI();

// Canvas
const canvas = document.querySelector('#webgl');

// Scene
const scene = new THREE.Scene();

// Window
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// handle resize callback
window.addEventListener('resize', () => {
    // update sizes
    sizes.width  = window.innerWidth;
    sizes.height = window.innerHeight;

    // update camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

// Camera
const camera = new THREE.PerspectiveCamera(
    85,
    sizes.width / sizes.height,
    0.1,
    100
);

camera.position.set(-4.13, 2.41, 3.64);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({ 
    canvas,
    precision: 'mediump'  
});

renderer.setSize(sizes.width, sizes.height);
// vivid colors
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;

// Model load
const loader = new GLTFLoader();

loader.load('/model/swedish-royal/scene.gltf', (gltf) => {
    const model = gltf.scene;

    // add dark layer
    model.traverse((child) => {
        if (child.isMesh) {
            child.material.color.set(0xafafaf);
        }
    });

    scene.add(model);
});

// &plug gui
gui
    .add(camera, 'fov')
    .min(10).max(150).step(0.1)
    .name('Camera field of view')
    .onChange(() => {
        camera.updateProjectionMatrix();
    });

gui
    .add(camera.position, 'x')
    .min(-10).max(10).step(0.01)
    .name('Camera position x');

gui
    .add(camera.position, 'y')
    .min(-10).max(10).step(0.01)
    .name('Camera position y');

gui
    .add(camera.position, 'z')
    .min(-10).max(10).step(0.01)
    .name('Camera position z');

gui
    .add(renderer, 'toneMappingExposure')
    .min(0.1).max(2).step(0.01)
    .name('Tone exposure');

// Animate
const animLoop = () => {
    controls.update();
    renderer.render(scene, camera);
}

// built-in vr loop
renderer.setAnimationLoop(animLoop);
animLoop();