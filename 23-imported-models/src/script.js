import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

//import the DRACOLoader and copy the draco folder from '/node_modules/three/examples/js/libs/draco' to the project static folder
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader' 

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas 
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

gltfLoader.load(
    // '/models/Duck/glTF/Duck.gltf', //DUCK Example
    // '/models/FlightHelmet/glTF/FlightHelmet.gltf', //HELMET Example
    // '/models/Duck/glTF-Draco/Duck.gltf', //DRACO Example
    '/models/Fox/glTF/Fox.gltf',
    (gltf) => {
        console.log('success')

        /* 
        // UNCOMENT BLOCK to load first Duck.gltf example
        scene.add(gltf.scene.children[0])
        */
       
        //IMPORTANTE! To add every child mesh you should while until there is no mesh inside the children array. Every time you use "scene.add()" you take one mesh from the array and reduce its lenght. That's why the for(child of gltf.scene.children) does not work.

        //2nd Option: use a while loop and add until the gltf.scene.child length is less then zero.
        /*
        while(gltf.scene.children.length){
            scene.add(gltf.scene.children[0])
        }
        */

        // 3rd OPTION: use the spread operator and copy gltf.scene.children to a constant and use the for loop into it.
        /*
        //UNCOMENT BLOCK TO LOAD THE HELMET
        const children = [...gltf.scene.children]
        for(const child of children){
            scene.add(child)
        }
        */

        // 4th OPTION: load the whole scene, it is faster coding, though you will need to load a full scene. USED IN THE DRACO EXAMPLE
        // scene.add(gltf.scene)

        //FOX Example
        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[0])

        //Uncomment to change in between the animations
        // const action = mixer.clipAction(gltf.animations[1])
        // const action = mixer.clipAction(gltf.animations[2])

        action.play()

        gltf.scene.scale.set(0.025, 0.025, 0.025)
        scene.add(gltf.scene)



    },
    (progress) =>{
        console.log('progress')
        console.log(progress)
    },
    (error) => {
        console.log('error')
        console.log(error)
    }
)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update mixer
    if(mixer !== null){
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()