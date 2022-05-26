import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Group } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()


// Scene
const scene = new THREE.Scene()


// fog
const fog = new THREE.Fog('#262837',1,15);
scene.fog = fog;
/**
 * Sizes
 */
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


// renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837');
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColor = textureLoader.load('textures/door/color.jpg');
const doorAlpha = textureLoader.load('textures/door/alpha.jpg');
const doorAmbientOcclusion = textureLoader.load('textures/door/ambientOcclusion.jpg');
const doorMetalness = textureLoader.load('textures/door/metalness.jpg');
const doorRoughness = textureLoader.load('textures/door/roughness.jpg');
const doorNormal = textureLoader.load('textures/door/normal.jpg');
const doorHeight = textureLoader.load('textures/door/height.jpg');

// brick texture
const brickColor = textureLoader.load('horrorBrick2.jpg')
const brickAmbientOcclusion = textureLoader.load('textures/bricks/ambientOcclusion.jpg')
const brickNormal = textureLoader.load('textures/bricks/normal.jpg')
const brickRoughness = textureLoader.load('textures/bricks/roughness.jpg')

const grassColor = textureLoader.load('grassTexture.jpg')
const grassAmbientOcclusion = textureLoader.load('textures/bricks/ambientOcclusion.jpg')
const grassNormal = textureLoader.load('textures/grass/normal.jpg')
const grassRoughness = textureLoader.load('textures/grass/roughness.jpg');

const roofTexture = textureLoader.load('horrorRoofTexture.jpg');
const graveTexture = textureLoader.load('gravesTexture.jpg');
const bushTexture = textureLoader.load('bushTexture.jpg')
bushTexture.repeat.set(5,5);
bushTexture.wrapS = THREE.RepeatWrapping;
bushTexture.wrapT = THREE.RepeatWrapping;

grassColor.repeat.set(8,8);
grassAmbientOcclusion.repeat.set(8,8);
grassNormal.repeat.set(8,8);
grassRoughness.repeat.set(8,8);

grassColor.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusion.wrapT = THREE.RepeatWrapping;
grassNormal.wrapT = THREE.RepeatWrapping;
grassRoughness.wrapT = THREE.RepeatWrapping;

grassColor.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusion.wrapS = THREE.RepeatWrapping;
grassNormal.wrapS = THREE.RepeatWrapping;
grassRoughness.wrapS = THREE.RepeatWrapping;



/**
 * House
 */

const house = new THREE.Group();
scene.add(house);

// walls of house
let wow = 4
let how = 3
let dow = 4

const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(wow,how,dow),
    new THREE.MeshStandardMaterial({
        map:brickColor,
    })
)
walls.geometry.setAttribute('uv2',new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2));
house.add(walls);

walls.position.y = how/2

// roof

const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5,1.5,4),
    new THREE.MeshStandardMaterial({map:roofTexture})
)
roof.position.y = how + 1.5/2
roof.rotation.y = Math.PI / 4
house.add(roof);

// door
const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2,2,100,100),
    new THREE.MeshStandardMaterial({
        map: doorColor,
        transparent:true,
        alphaMap: doorAlpha,
        aoMap: doorAmbientOcclusion,
        displacementMap: doorHeight,
        displacementScale:0.1,
        normalMap: doorNormal,
        metalnessMap: doorMetalness,
        roughnessMap: doorRoughness
    })
)
door.geometry.setAttribute('uv2',new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2));
door.position.y = 1
door.position.z = wow/2 + 0.01
house.add(door);

//Bush

const bushGeometry = new THREE.SphereBufferGeometry(0.6,10,10);
const bushMaterial = new THREE.MeshStandardMaterial({map:bushTexture});
{
const bush1 = new THREE.Mesh(bushGeometry,bushMaterial);
house.add(bush1);
bush1.position.z = wow/2 + 0.5
bush1.position.x = 1.25
bush1.position.y = 0.25

const bush2 = new THREE.Mesh(bushGeometry,bushMaterial);
house.add(bush2);
bush2.scale.set(0.5,0.5,0.5);
bush2.position.set(2,0.25,wow/2+0.5)

const bush3 = new THREE.Mesh(bushGeometry,bushMaterial);
house.add(bush3);
bush3.scale.set(0.8,0.8,0.8);
bush3.position.z = wow/2 + 0.5
bush3.position.x = -1
bush3.position.y = 0.25

const bush4 = new THREE.Mesh(bushGeometry,bushMaterial);
house.add(bush4);
bush4.scale.set(0.5,0.5,0.5);
bush4.position.set(-1.5,0.25,wow/2+0.5)
}

// graves
const grave = new THREE.Group();
scene.add(grave);

const graveGeometry = new THREE.BoxBufferGeometry(0.7,1,0.3);
const graveMaterial = new THREE.MeshStandardMaterial({map:graveTexture});

for(let i = 0; i< 50; i++){

    const angle = Math.random() * Math.PI * 2;
    const radius = 4 + Math.random() * 6;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    const graveMesh = new THREE.Mesh(graveGeometry,graveMaterial);
    graveMesh.position.set(x,0, z);

    graveMesh.rotation.y = (Math.random() - 0.5) * 0.4
    graveMesh.rotation.z = (Math.random() - 0.5) * 0.4
    graveMesh.castShadow = true;
    grave.add(graveMesh);
}

grave.position.y = 0.5;
// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColor,
        aoMap: grassAmbientOcclusion,
        normalMap: grassNormal,
        roughnessMap: grassRoughness
    })
)
floor.geometry.setAttribute('uv2',new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2));
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.125)
// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
// gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
// gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
// gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
// gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
moonLight.castShadow = true;
scene.add(moonLight)

// doorLight
const doorLight = new THREE.PointLight("#ff7d46",1,7)
doorLight.position.set(0,2.2,2.7);
doorLight.castShadow = true;
house.add(doorLight);


// ghosts
// better to use the point light for ghosts

const ghost1 = new THREE.PointLight('yellow',2,3);
ghost1.castShadow = true;
scene.add(ghost1);

const ghost2 = new THREE.PointLight('white',2,3);
ghost2.castShadow = true;
scene.add(ghost2);

const ghost3 = new THREE.PointLight('red',2,3);
ghost3.castShadow = true;
scene.add(ghost3);


const pointLightHelper = new THREE.PointLightHelper(ghost1,0xff000000)
scene.add(pointLightHelper);

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// shadows


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // we are not updating the walk moment of the ghosts
    // we alrealy have the elapsed time
    const ghost1degree = elapsedTime * 0.5;
    ghost1.position.x = Math.cos(ghost1degree) * 4;
    ghost1.position.z = Math.sin(ghost1degree) * 4;
    ghost1.position.y = Math.sin(ghost1degree * 3)

    const ghost2degree = elapsedTime * -0.5;
    ghost2.position.x = Math.cos(ghost2degree) * 5;
    ghost2.position.z = Math.sin(ghost2degree) * 5;
    ghost2.position.y = Math.sin(ghost2degree * 3)

    const ghost3degree = elapsedTime * 0.2;
    ghost3.position.x = Math.cos(ghost3degree) * (7+ Math.sin(elapsedTime * 0.3));
    ghost3.position.z = Math.sin(ghost3degree)* (7+ Math.sin(elapsedTime * 0.5)); ;
    ghost3.position.y = Math.sin(elapsedTime * 4)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()