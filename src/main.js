import * as THREE from 'three';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import gsap from 'gsap';

// Camera motion logic
const mainCamera = {
    fov: 85,
    pos: {
        x: -4.13,
        y: 2.41,
        z: 3.64
    }
}

const links  = document.querySelectorAll('a');
links.forEach((link, idx) => {
    link.addEventListener('click', (e) => {
        switch (idx) {
            case 1:
                // console.log('tapestry', camera.position);
                positionCamera(-3.77, 4.59, 2.63);

                break;
            case 2:
                // console.log('fireplace', camera.position);
                positionCamera(-1.55, 2.87, 3.12);

                break;
            case 3:
                // console.log('ceiling', camera.position);
                positionCamera(-5.49, 1.89, 1.15);

                break;
            case 4:
                // console.log('piano', camera.position);
                positionCamera(3.65, 4.02, -2.54);
                
                break;
                case 5:
                // console.log('museum', camera.position);
                    console.log(camera.position)
                    positionCamera(0.61, 2.54, -5.40);
                break;
            default:
                positionCamera(
                    mainCamera.pos.x, 
                    mainCamera.pos.y, 
                    mainCamera.pos.z
                );
        }
    });
});

const positionCamera = (x, y, z) => {
    gsap.to(camera.position, { 
        x, y, z,
        duration: 3
    });
}

// Gui init
const gui = new GUI();
gui.hide();

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
    mainCamera.fov,
    sizes.width / sizes.height,
    0.1,
    100
);

camera.position.set(mainCamera.pos.x, mainCamera.pos.y, mainCamera.pos.z);
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

// Animate
const animLoop = () => {
    controls.update();
    renderer.render(scene, camera);
}

// built-in vr loop
renderer.setAnimationLoop(animLoop);
animLoop();