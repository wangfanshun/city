
import * as THREE from 'three'
export default class Background{
  constructor(scene, url){
    this.url = url 
    this.scene=scene
    this.load()
  }
  load(){
    const loader = new THREE.TextureLoader()
    const geometry = new THREE.SphereGeometry(5000)
    const material = new THREE.MeshBasicMaterial({
      map: loader.load(this.url),
      side:THREE.DoubleSide
    })
    const background = new THREE.Mesh(geometry,material)
    background.position.copy({x:0,y:0,z:0})    
    background.name= 'background'
    this.scene.add(background)
  }
}