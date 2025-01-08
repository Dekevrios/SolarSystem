import * as THREE from './three js/build/three.module.js'
import {OrbitControls} from './three js/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from './three js/examples/jsm/loaders/GLTFLoader.js'

import {FontLoader} from './threejs/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from './threejs/examples/jsm/geometries/TextGeometry.js'


let scene, camera, renderer, control, spaceShip,  thirdPersonCamera, earthObj,sunObj,merObj,marsObj,spotlightTarget,spotLight,
venusObj,jupiterObj,satObj,saturnRingObj,uranusObj,neptuneObj,sateliteObj,uranusRingObj,BpkSatelite,BpkBumi,earthSystem, Uranus;

let BpkMars, BpkMercury, BpkVenus, BpkJupiter, saturnus, BpkSaturnus, BpkUranus, BpkNeptune 
let activeCamera;
let inThirdPersonMode = false; 

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let hoveredPlanet = null;

let textMesh = null


const colors = [
    0x00FFFF, 
    0x00FF00, 
    0xFFCC00, 
    0xE6E6FA, 
    0xFF69B4, 
    0xFF8C00, 
    0xFFB6C1, 
    0x00FFFF, 
    0x87CEEB, 
    0xA8FFB2,
    0xEE82EE, 
    0xADD8E6  
];

function init(){
    scene = new THREE.Scene();
    let fov = 75;
    let aspect = window.innerWidth/window.innerHeight;
    let near = 0.1
    let far = 10000;

    //Texture Loader
    let Sunloader = new THREE.TextureLoader().load('assets/textures/sun.jpg')
    let mercuryLoader = new THREE.TextureLoader().load('assets/textures/mercury.jpg')
    let venusLoader = new THREE.TextureLoader().load("assets/textures/venus.jpg")
    let earthLoader = new THREE.TextureLoader().load("assets/textures/earth.jpg")
    let marsLoader = new THREE.TextureLoader().load("assets/textures/mars.jpg")
    let jupiterLoader = new THREE.TextureLoader().load("assets/textures/jupiter.jpg")
    let saturnLoader = new THREE.TextureLoader().load("assets/textures/saturn.jpg")
    let saturnRingLoader = new THREE.TextureLoader().load("assets/textures/saturn_ring.png")
    let uranusLoader = new THREE.TextureLoader().load("assets/textures/uranus.jpg")
    let uranusRingLoader = new THREE.TextureLoader().load("assets/textures/uranus_ring.png")
    let neptuneLoader = new THREE.TextureLoader().load('assets/textures/neptune.jpg')

    // Kamera utama
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(640, 480, 240);
    camera.lookAt(640, 320, 0);
    
    // third person
    thirdPersonCamera = new THREE.PerspectiveCamera(90, aspect, near, far);

    // Set kamera aktif awal
    activeCamera = camera;

    renderer = new THREE.WebGLRenderer({antialias: true})
    renderer.setSize(window.innerWidth,window.innerHeight)
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    document.body.appendChild(renderer.domElement)


    control = new OrbitControls(camera, renderer.domElement)

    //light
    const pointLight = new THREE.PointLight(0xFFFFFF, 4, 12800)
    pointLight.position.set(640,320,0) 
    pointLight.castShadow = true;
    scene.add(pointLight)

    spotLight = new THREE.SpotLight(0xFFFFFF, 8, 8)
    spotLight.castShadow = false
    scene.add(spotLight)

    spotlightTarget = new THREE.Object3D();
    scene.add(spotlightTarget);
    spotLight.target = spotlightTarget;

    const roketLoader = new GLTFLoader();
    roketLoader.load("assets/model/spaceship/scene.gltf", function (gltf) {
        spaceShip = gltf.scene;
        spaceShip.position.set(420, 320, 60);

        // third person camera
        thirdPersonCamera.position.set(
            spaceShip.position.x - 30,
            spaceShip.position.y + 16,
            spaceShip.position.z - 30
        );
        thirdPersonCamera.lookAt(spaceShip.position);

        scene.add(spaceShip);
    });

    scene.background = new THREE.Color('white');


    //kata2
    // const fontLoader = new THREE.FontLoader();
    // fontLoader.load('Neoblock DEMO_Regular.json', (DemoFont) => {
    //     scene.add(textMesh)
    // });
    

    //objects
    const sun = new THREE.SphereGeometry(40)
    const sunMat = new THREE.MeshBasicMaterial({color: 0xFFFFFF, map : Sunloader})
    sunObj = new THREE.Mesh(sun,sunMat)
    sunObj.position.set(640,320,0)
    scene.add(sunObj);
    

    //planets
    const mercury = new THREE.SphereGeometry(3.2,100,100)
    const mercMat = new THREE.MeshStandardMaterial({color: 0xFFFFFF, map : mercuryLoader})
    merObj = new THREE.Mesh(mercury, mercMat)
    merObj.position.set(52,320,50)
    merObj.receiveShadow = true
    merObj.castShadow = true
    BpkMercury = new THREE.Object3D()
    BpkMercury.add(merObj)
    scene.add(BpkMercury)
    BpkMercury.position.set(640,0,0)

    const venus = new THREE.SphereGeometry(4.8)
    const venusMat = new THREE.MeshStandardMaterial({color: 0xFFFFFF, map : venusLoader})
    venusObj = new THREE.Mesh(venus, venusMat)
    venusObj.position.set(80,320,200)
    venusObj.receiveShadow = true
    // venusObj.castShadow = true
    BpkVenus = new THREE.Object3D()
    BpkVenus.add(venusObj)
    scene.add(BpkVenus)
    BpkVenus.position.set(640,0,0)

    

    const mars = new THREE.SphereGeometry(4)
    const marsMat = new THREE.MeshStandardMaterial({color: 0xFFFFFF, map: marsLoader})
    marsObj = new THREE.Mesh(mars, marsMat)
    marsObj.position.set(130,320,600)
    marsObj.receiveShadow = true
    
    BpkMars = new THREE.Object3D()
    BpkMars.add(marsObj)
    scene.add(BpkMars)
    BpkMars.position.set(640,0,0)


    const jupiter = new THREE.SphereGeometry(13)
    const jupiterMat = new THREE.MeshStandardMaterial({color: 0xFFFFFF, map: jupiterLoader})
    jupiterObj = new THREE.Mesh(jupiter, jupiterMat)
    jupiterObj.position.set(175,320,800)
    jupiterObj.receiveShadow = true
    BpkJupiter = new THREE.Object3D()
    BpkJupiter.add(jupiterObj)
    scene.add(BpkJupiter)
    BpkJupiter.position.set(640,0,0)

    const saturn = new THREE.SphereGeometry(10)
    const satMat = new THREE.MeshStandardMaterial({color: 0xFFFFFF, map: saturnLoader})
    satObj = new THREE.Mesh(saturn,satMat)
    satObj.position.set(240,320,1000)
    satObj.receiveShadow = true
    // scene.add(satObj)

    const saturnRing = new THREE.RingGeometry(16,32,64)
    const saturnRingMat = new THREE.MeshStandardMaterial({color: 0xFFFFFF, map: saturnRingLoader, side: THREE.DoubleSide})
    saturnRingObj = new THREE.Mesh(saturnRing, saturnRingMat)
    saturnRingObj.position.set(240,320,1000)
    saturnRingObj.rotation.y = 0.41;
    saturnRingObj.receiveShadow = true
    // scene.add(saturnRingObj)

    saturnus = new THREE.Group()
    saturnus.add(satObj)
    saturnus.add(saturnRingObj)
    // scene.add(saturnus)

    BpkSaturnus = new THREE.Object3D()
    BpkSaturnus.add(saturnus)
    scene.add(BpkSaturnus)
    BpkSaturnus.position.set(640,0,0)

    const uranus = new THREE.SphereGeometry(8)
    const uranusMat = new THREE.MeshStandardMaterial({color : 0xFFFFFF, map: uranusLoader})
    uranusObj = new THREE.Mesh(uranus, uranusMat)
    uranusObj.position.set(280,320,1200)
    uranusObj.receiveShadow = true
    // scene.add(uranusObj)
    
    const uranusRing = new THREE.RingGeometry(16,20,64)
    const uranusRingMat = new THREE.MeshStandardMaterial({color: 0xFFFFFF, map: uranusRingLoader,side: THREE.DoubleSide})
    uranusRingObj = new THREE.Mesh(uranusRing,uranusRingMat)
    uranusRingObj.position.set(280,320,1200)
    uranusRingObj.receiveShadow = true; 
    // uranusRingObj.rotation.x = Math.PI / 2
    // scene.add(uranusRingObj)
    Uranus = new THREE.Group()
    Uranus.add(uranusObj)
    Uranus.add(uranusRingObj)
    // scene.add(Uranus)

    BpkUranus = new THREE.Object3D()
    BpkUranus.add(Uranus)
    scene.add(BpkUranus)
    BpkUranus.position.set(640,0,0)

    const neptune = new THREE.SphereGeometry(6)
    const neptuneMat = new THREE.MeshStandardMaterial({color: 0xFFFFFF, map: neptuneLoader})
    neptuneObj = new THREE.Mesh(neptune,neptuneMat)
    neptuneObj.position.set(320,320,1400)
    neptuneObj.receiveShadow = true
    // scene.add(neptuneObj)
    BpkNeptune = new THREE.Object3D()
    BpkNeptune.add(neptuneObj)
    scene.add(BpkNeptune)
    BpkNeptune.position.set(640,0,0)

    const earth = new THREE.SphereGeometry(4.8)
    const earthMat = new THREE.MeshStandardMaterial({color: 0xFFFFFF, map: earthLoader})
    earthObj = new THREE.Mesh(earth, earthMat)
    earthObj.position.set(100,320,400)
    earthObj.receiveShadow = true;
    earthObj.castShadow = true;
    

    BpkBumi = new THREE.Object3D()
    BpkBumi.add(earthObj)
    // BpkBumi.add(BpkSatelite)
    scene.add(BpkBumi)
    BpkBumi.position.set(640,0,0)

    // satelite
    const satelite = new THREE.CylinderGeometry(1,0.5,0.4,8)
    const sateliteMat = new THREE.MeshStandardMaterial({color: 0xCCCCCC, metalness: 0.5, roughness: 0.5 })
    sateliteObj = new THREE.Mesh(satelite,sateliteMat)
    sateliteObj.position.set(98,0,0)
    sateliteObj.receiveShadow = true
    sateliteObj.castShadow = false;
    // scene.add(sateliteObj)
    sateliteObj.scale.set(2,2,2)
    
    
    BpkSatelite = new THREE.Object3D()
    BpkSatelite.add(sateliteObj)
    scene.add(BpkSatelite)
    BpkSatelite.position.set(0,0,0)
    earthObj.add(BpkSatelite)

    //nama planet
    merObj.name = "Mercury"; 
    venusObj.name = "Venus"; 
    earthObj.name = "Earth"; 
    marsObj.name = "Mars"; 
    jupiterObj.name = "Jupiter"; 
    satObj.name = "Saturnus"; 
    uranusObj.name = "Uranus"; 
    neptuneObj.name = "Neptunus"; 

    //SkyBox
    const skyBox = new THREE.CubeTextureLoader()
        const textureSky = skyBox.load([
            'assets/skybox/right.png',
            'assets/skybox/left.png',
            'assets/skybox/top.png',
            'assets/skybox/bottom.png',
            'assets/skybox/front.png',
            'assets/skybox/back.png'
        ])
        scene.background = textureSky

        window.addEventListener('mousemove', onMouseMove, false);
   
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects([merObj, venusObj, earthObj, marsObj, jupiterObj, satObj, uranusObj, neptuneObj]);

    if (intersects.length > 0) {
        if (hoveredPlanet !== intersects[0].object) {
            if (hoveredPlanet) {
                hoveredPlanet.material.color.set(hoveredPlanet.originalColor);
                
                if (textMesh) {
                    scene.remove(textMesh);
                    textMesh = null;
                }
            }

            hoveredPlanet = intersects[0].object;
            hoveredPlanet.originalColor = hoveredPlanet.material.color.getHex();
            
            // warna
            const randomIndex = Math.floor(Math.random() * colors.length);
            hoveredPlanet.material.color.set(colors[randomIndex]);

            
            // teks
            // const textGeometry = new THREE.TextGeometry(hoveredPlanet.name, {
            //     height: 2,
            //     size: 1,
            //     font: DemoFont,
            // });
            
            // const textMaterial = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
            // textMesh = new THREE.Mesh(textGeometry, textMaterial);
            // textMesh.position.copy(hoveredPlanet.position);
            // textMesh.position.y += 2; 
            // scene.add(textMesh);
        }
    } else {
        if (hoveredPlanet) {
            hoveredPlanet.material.color.set(hoveredPlanet.originalColor);
            hoveredPlanet = null;
            
            if (textMesh) {
                scene.remove(textMesh);
                textMesh = null;
            }
        }
    }
}

function render(){
    requestAnimationFrame(render);
    // earthObj.rotateY(0.0018);
    

    merObj.rotation.y += 0.0008;
    merObj.rotation.x += 0.0008;
    BpkMercury.rotateY(0.01)

    venusObj.rotation.y += 0.0008;
    venusObj.rotation.x += 0.0008;
    BpkVenus.rotateY(0.008)

    earthObj.rotation.y -= 0.0018;
    BpkBumi.rotateY(0.006)
    sateliteObj.rotation.y += 0.0008;
    sateliteObj.rotation.x += 0.0009
    BpkSatelite.rotateZ(0.01)

    marsObj.rotation.y += 0.0009;
    marsObj.rotation.x += 0.0009;
    BpkMars.rotateY(0.004)

    jupiterObj.rotation.y += 0.0008;
    jupiterObj.rotation.x += 0.0008;
    BpkJupiter.rotateY(0.002)

    satObj.rotation.y += 0.0008;
    saturnRingObj.rotation.z += 0.0008;
    BpkSaturnus.rotateY(0.0008)

    uranusRingObj.rotation.z += 0.0008;
    BpkUranus.rotateY(0.0006)

    neptuneObj.rotation.y += 0.0008;
    neptuneObj.rotation.x += 0.0008;
    BpkNeptune.rotateY(0.0004)

    updateSpotlight();

    if (spaceShip && inThirdPersonMode) {
        updateCamera3();
    }

    if (hoveredPlanet) {
        
        hoveredPlanet.rotation.y += 0.0002; 
    }

    renderer.render(scene, activeCamera);
    

}

function updateCamera3() {
    if (spaceShip) {
            const offset = new THREE.Vector3(0, 5, -10); 
            const direction = new THREE.Vector3();
            spaceShip.getWorldDirection(direction); 
    
            thirdPersonCamera.position.copy(spaceShip.position).add(offset.applyQuaternion(spaceShip.quaternion));
            thirdPersonCamera.lookAt(spaceShip.position); 
        }
}

function updateSpotlight() {
    if (spaceShip) {
        spotLight.position.set(spaceShip.position.x, spaceShip.position.y + 6, spaceShip.position.z);
        spotlightTarget.position.copy(spaceShip.position);
    }
}



function initEventHandler() {
    window.onkeydown = function (event) {
        const key = event.key;
        if (spaceShip) {
            const speed = 1; 
            switch (key) {
                case 'w': 
                    spaceShip.position.add(spaceShip.getWorldDirection(new THREE.Vector3()).multiplyScalar(speed));
                    break;
                case 's': 
                    spaceShip.position.add(spaceShip.getWorldDirection(new THREE.Vector3()).multiplyScalar(-speed));
                    break;
                case 'a': 
                    spaceShip.rotation.y += 0.1;
                    break;
                case 'd': 
                    spaceShip.rotation.y -= 0.1; 
                    break;
                case 'g': 
                    inThirdPersonMode = !inThirdPersonMode;
                    activeCamera = inThirdPersonMode ? thirdPersonCamera : camera;
                    break;
            }
        }
    };
}
window.onload = function(){
    init();
    render();
    initEventHandler()
}
window.onresize = function () {
    console.log("Resizing...");
    const aspect = window.innerWidth / window.innerHeight;

    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    thirdPersonCamera.aspect = aspect;
    thirdPersonCamera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
};

