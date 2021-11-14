import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { TextureLoader } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Axes helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/7.png')

/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font)=>{
        const textGeometry = new THREE.TextGeometry(
            'Tjenaa!!',
            {
                font: font,
                size: 0.5,
                height:0.2,
                curveSegments: 5,
                bevelEnabled:true,
                bevelThickness:0.03,
                bevelSize: 0.02,
                bevelOffset:0,
                bevelSegments:4
            }
        )
        
        //MANUALLY CENTER THE TEXT GEOMETRY

        // textGeometry.computeBoundingBox()
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
        //     - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
        //     - (textGeometry.boundingBox.max.z - 0.03) * 0.5,
        // )
        
        //CENTER GEOMETRY USING BUILD IN FUNCTION
        textGeometry.center()

        const textMaterial = new THREE.MeshMatcapMaterial()
        textMaterial.matcap = matcapTexture
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)

        console.time('donuts')


        //CREATING GEOMETRY AND MATERIAL FOR 1000 donuts. We do not have to create geometry and material in the for loop, it is not optmized
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
        const donutMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture})


        for(let i = 0; i< 1000; i++){
            const donut = new THREE.Mesh(donutGeometry, donutMaterial)
            
            donut.position.x = (Math.random() - 0.5) * 20
            donut.position.y = (Math.random() - 0.5) * 20
            donut.position.z = (Math.random() - 0.5) * 20

            donut.rotation.x =  Math.random() * Math.PI
            donut.rotation.y =  Math.random() * Math.PI

            const scale = Math.random()
            donut.scale.set(scale,scale,scale)

            scene.add(donut)
        }

        console.timeEnd('donuts')

    }
)



/**
 * Object
 */


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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
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