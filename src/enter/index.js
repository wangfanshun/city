import * as THREE from 'three'
import '../base/index.css'
import City from './city'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
export const initCity=()=>{
  const canvas= document.getElementById('webgl')
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,40000)
  camera.position.set(1000,500,200)
  scene.add(camera)

  //添加环境光
  scene.add(new THREE.AmbientLight(0xadadad))
  //添加平行光(模拟太阳)
  const directLight = new THREE.DirectionalLight(0xffffff, 0.5 )
  scene.add(directLight)
  const controls = new OrbitControls( camera,canvas);  
  const city = new City(scene,camera,controls)
  const render = new THREE.WebGLRenderer({canvas})
  render.setClearColor(new THREE.Color( 0x000000 ))
  render.setSize(window.innerWidth,window.innerHeight)
  render.setPixelRatio(window.devicePixelRatio)
  controls.enableDamping=true
  controls.maxDistance=20000
  controls.minDistance=100
  controls.enablePan=true
  const clock = new THREE.Clock();
  function start(){
    city.start(clock.getDelta())
    controls.update();
    render.render(scene,camera)
    requestAnimationFrame(start)
  }
  start()
  window.addEventListener('resize',()=>{
    camera.aspect=window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
    render.setSize(window.innerWidth,window.innerHeight)
    render.setPixelRatio(window.devicePixelRatio)
  })
}