import * as THREE from 'three'
// import { Math } from 'three';
export default class Snow {
  constructor(scene){
    this.scene=scene
    this.range=2000
    this.count=600
    this.speed=[]
    this.point=[]
    this.init()
    this.flag=1
  }
  init(){
    this.geometry =new THREE.BufferGeometry()
    for(let i=0;i<this.count;i++){
      const p={}
      p.position= new THREE.Vector3(
        Math.random()*this.range-this.range/2,
        Math.random()*this.range,
        Math.random()*this.range-this.range/2
      )
      this.point.push(p.position)
      this.speed.push({
        x:Math.random()-0.5,
        y:Math.random()+0.4,
        z:Math.random()-0.5
      })
    }
    this.geometry.setFromPoints(this.point)
    const materials = new THREE.PointsMaterial({
      map: new THREE.TextureLoader().load('../../src/assets/snow.png'),
      size:20,
      opacity:0.8,
      transparent:true,
      depthTest:false
    })
    const sonwEffect=new THREE.Points(this.geometry,materials)
    this.scene.add(sonwEffect)
  }
  animation(){
    this.flag=this.flag*-1
    this.point=this.point.map((p,index)=>{
      let y
      if(p.y<0){
        y=this.range
      }else{
        y=p.y
      }
      return new THREE.Vector3(p.x+this.speed[index].x*this.flag*Math.random(),y-this.speed[index].y,p.z+this.speed[index].z*this.flag*Math.random())
    })
    this.geometry.setFromPoints(this.point)
  }
}