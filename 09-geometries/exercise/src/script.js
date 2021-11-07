import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
//PART 1
// setting the last 5 attributes that defines the number of segments, which impacts in the number of triangles.
// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)



/*  
PART 2
creating my on triangle with with Float32Array that helps computer to calculate matrices
*/
const positionArray = new Float32Array([
    0, 0, 0,
    0, 1, 0,
    1, 0, 0
])
/*
// Second way of creating a Position Array
const positionArray = new Float32Array(9)

positionArray[0] = 0
positionArray[1] = 0
positionArray[2] = 0

positionArray[3] = 0
positionArray[4] = 1
positionArray[5] = 0

positionArray[6] = 1
positionArray[7] = 0
positionArray[8] = 0

*/
const positionsAttribute = new THREE.BufferAttribute(positionArray, 3)
const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', positionsAttribute)


const material = new THREE.MeshBasicMaterial({ 
    color: 0xff0000,

    // PART1
    // setting wireframe, to see the triangles
    wireframe: true
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
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

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()