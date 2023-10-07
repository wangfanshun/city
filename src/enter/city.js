import {loadFBX} from '@/utils/index.js'
import * as THREE from 'three'
import SurroundLine from '@/effect/surroundLine.js'
import Radar from '@/effect/radar.js'
import Wall from '@/effect/wall.js'
import Ball from '@/effect/ball.js'
import Fly from '@/effect/fly.js'
import Cone from '@/effect/cone.js'
import Text from '@/effect/font.js'
import Snow from '@/effect/snow.js'
import Background from '@/effect/background.js'
import tween, * as TWEEN from '@tweenjs/tween.js'
export default class City{
  constructor(scene,camera,controls){
    this.scene=scene
    this.camera=camera
    this.controls=controls
    this.cameraDir=new THREE.Vector3(1, 0, 1).applyQuaternion(this.camera.quaternion)
    this.cameraPositionTween = null
    this.cameraRotationTween = null
    this.height={
      value:5
    }
    this.time={
      value:0
    }
    this.top={
      value:0
    }
    this.flag=false
    this.loadCity()
    this.snow=null
  }
  loadCity(){
    loadFBX('/src/model/beijing.fbx').then((object)=>{
      object.traverse((child)=>{
        if(child.isMesh){
          new SurroundLine(this.scene,child,this.height,this.time)
        }
      })
      this.initEffect()
    })
  }
  initEffect(){
    new Background(this.scene, '../../src/assets/black-bg.png')
    this.addClick()
    new Radar(this.scene,this.time)
    new Wall(this.scene,this.time)
    new Fly(this.scene,this.time)
    new Ball(this.scene,this.time)
    new Cone(this.scene,this.height,this.top)
    new Text(this.scene,this.cameraDir)
    this.snow=new Snow(this.scene)
    this.initZoom()
  }
  initZoom(){
    const body=document.body
    body.onmousewheel=(event)=>{
      console.log(12314)
      const val=30
      // 获取到浏览器坐标
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      const standardVector=new THREE.Vector3(x,y,0.5)
      const worldVector=standardVector.unproject(this.camera)
      worldVector.sub(this.camera.position).normalize()
      if(event.wheelDelta>0){
        this.camera.position.x+=worldVector.x*val
        this.camera.position.y+=worldVector.y*val
        this.camera.position.z+=worldVector.z*val
        this.controls.target.x+=worldVector.x*val
        this.controls.target.y+=worldVector.y*val
        this.controls.target.z+=worldVector.z*val
      }else{
        this.camera.position.x-=worldVector.x*val
        this.camera.position.y-=worldVector.y*val
        this.camera.position.z-=worldVector.z*val
        this.controls.target.x-=worldVector.x*val
        this.controls.target.y-=worldVector.y*val
        this.controls.target.z-=worldVector.z*val
      }
    }
  }
  
  addClick(){
    let flag=true
    document.onmousedown=(event)=>{
      flag=true
    }
    document.onmousemove=(event)=>{
      flag=false
    }
    document.onmouseup=(event)=>{
      if(flag){     
        this.clickEvent(event)
      }
      // document.onmousemove=null
    }
  }
  clickEvent(event){
    // 获取到浏览器坐标
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    // 创建设备坐标（三维）
    const standardVector=new THREE.Vector3(x,y,0.5)
    // 转化为世界坐标(以为我们屏幕上的坐标系是相机矩阵和视图空间坐标计算结果，这里理想计算出X,Y在空间内的坐标)
    const worldVector=standardVector.unproject(this.camera)
    const ray = worldVector.sub(this.camera.position).normalize();
    const raycaster = new THREE.Raycaster(this.camera.position, ray);
    const intersects = raycaster.intersectObjects(this.scene.children, true);
    if(intersects.length){
      if(intersects[0].object.name==='background') return
      const DURATION=2000
      const RATE=5
      const point = intersects[0].point
      this.cameraPositionTween= new TWEEN.Tween(this.camera.position).to({
        x:point.x*RATE,
        y:point.y*RATE,
        z:point.z*RATE
      },DURATION).start()
      this.cameraRotationTween = new TWEEN.Tween(this.camera.rotation).to({
        x:this.camera.rotation.x,
        y:this.camera.rotation.y,
        z:this.camera.rotation.z
      },DURATION).start()
    }  
  }
  start(delta){
    this.snow&&this.snow.animation()
    this.time.value+=delta
    this.cameraDir.z+=0.1
    if(this.height.value>160){
      this.height.value=5
    }else{
      this.height.value+=0.4
    }
    if(this.top.value>15||this.top.value<0){
      this.flag=!this.flag
    }
    this.top.value+=this.flag?-0.2:0.2
    if(this.cameraPositionTween&&this.cameraRotationTween){
      this.cameraPositionTween.update()
      this.cameraRotationTween.update()
    }
  }
}