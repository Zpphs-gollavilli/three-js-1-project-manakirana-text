import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { color } from 'framer-motion'

/**
 * Base
 */
// Debug
const gui = new GUI()

window.addEventListener("keydown", (event) => {
  if (event.key === "h") {
    if (gui._hidden) {
      gui.show()
    } else {
      gui.hide()
    }
  }
});

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/7.png')
const matcapTexture2 = textureLoader.load('/textures/matcaps/1.png')

/**
 * Fonts
 */
const fontLoader = new FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        const textGeometry = new TextGeometry(
            'Manakirana',
            {
                font: font,
                size: 0.5,
                depth: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometry.center()
         textGeometry.computeBoundingBox()
         textGeometry.translate(
            - (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x - 0.02) * 0.5,
            - (textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y - 0.02) * 0.5,
            - (textGeometry.boundingBox.max.z - textGeometry.boundingBox.min.z - 0.03) * 0.5
         )
        //  console.log(textGeometry.boundingBox)
        const textMaterial = new THREE.MeshBasicMaterial({color : "#228B22"})
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)
        textGeometry.center()  
        
        for(let i=0; i<300; i++){
            const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
            const donutMaterial = new THREE.MeshBasicMaterial({map : matcapTexture2})
            donutMaterial.color = new THREE.Color(0x90EE90)
            const donut = new THREE.Mesh(donutGeometry, donutMaterial)

            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const scale = Math.random()
            donut.scale.set(scale, scale, scale)

            scene.add(donut)
        }
    }
)

gui.hide()





// random cubes
function randomCube(){
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
    const cubeMaterial = new THREE.MeshBasicMaterial({map : matcapTexture})
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

    cube.position.x = (Math.random() - 0.5) * 10
    cube.position.y = (Math.random() - 0.5) * 10
    cube.position.z = (Math.random() - 0.5) * 10

    cube.rotation.x = Math.random() * Math.PI
    cube.rotation.y = Math.random() * Math.PI

    const scale = Math.random()
    cube.scale.set(scale, scale, scale)

    scene.add(cube)
}

for(let i=0; i<10; i++){
    randomCube()
}

// /**
//  * Object
//  */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)


// /**
//  * axis helper
//  */
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)


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