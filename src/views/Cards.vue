<script setup lang="ts">
import { WebGLRenderer, PerspectiveCamera, DirectionalLight, Color, Scene, Clock, PointLight, Mesh, SphereGeometry, MeshBasicMaterial } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { onMounted } from "vue";

let camera;
let renderer;
let scene;
let loop;
let canvasWidth = window.innerWidth / 1.1
let canvasHeight = window.innerHeight / 1.5

function createRenderer() {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.physicallyCorrectLights = true;
  return renderer;
}

const setSize = (container, camera, renderer) => {
  camera.aspect = canvasWidth / canvasHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
};

class Resizer {
  constructor(container, camera, renderer) {
    setSize(container, camera, renderer);
    window.addEventListener('resize', () => {
      setSize(container, camera, renderer);
      this.onResize();
    });
  }
  onResize() {}
}

const clock = new Clock();

class Loop {
  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = [];
  }
  
  start() {
    this.renderer.setAnimationLoop(() => {
      this.tick();
      this.renderer.render(this.scene, this.camera);
    });
  }
  
  stop() {
    this.renderer.setAnimationLoop(null);
  }
  
  tick() {
    const delta = clock.getDelta();
    for (const object of this.updatables) {
      if (typeof object.tick === 'function') {
        object.tick(delta);
      }
    }
  }
}

function createCamera() {
  const camera = new PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 10);
  camera.tick = (delta) => {};
  return camera;
}

function createLights() {
  const directionalLightFront = new DirectionalLight(0xffffff, 1);
  directionalLightFront.position.set(0, 0, 5);

  return { directionalLightFront };
}

function createScene() {
  const scene = new Scene();
  scene.background = null;
  return scene;
}

class World {
  constructor(container) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);

    const { directionalLightFront } = createLights();
    loop.updatables.push(directionalLightFront);
    scene.add(directionalLightFront);

    const resizer = new Resizer(container, camera, renderer);
    resizer.onResize = () => {
      this.render();
    };

    this.loadModel();
  }

  loadModel() {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('draco/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      'card-pack.glb',
      (gltf) => {
        gltf.scene.scale.set(0.06, 0.06, 0.06);
        gltf.scene.tick = (delta) => {
          gltf.scene.rotation.y += delta;
        };
        loop.updatables.push(gltf.scene);
        scene.add(gltf.scene);
      },
      undefined,
      (error) => {
        console.error('An error happened', error);
      }
    );
  }

  render() {
    renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

function main() {
  const container = document.querySelector(".card-pack");
  const world = new World(container);
  world.start();
}

onMounted(() => {
  main();
});
</script>

<template>
  <div class="cards-wrapper flex flex-col justify-between h-[85vh]">
    <div class="card-pack flex flex-row items-center justify-center cursor-pointer mt-10"></div>
    <button class="btn btn-error sm:w-2/3 md:w-1/6 lg:1/8 mx-auto">Not yet available</button>
  </div>
</template>

<style scoped>
</style>
