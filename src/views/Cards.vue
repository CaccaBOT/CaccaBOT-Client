<script setup lang="ts">
import { WebGLRenderer, PerspectiveCamera, DirectionalLight, Scene, Clock } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { onMounted } from "vue";
import JSConfetti from "js-confetti";
import noPfp from "../assets/no_pfp.webp"

let camera;
let renderer;
let scene;
let loop;
let canvasWidth = window.innerWidth / 1.1;
let canvasHeight = window.innerHeight / 1.5;
let confetti = new JSConfetti();
let rotationSpeed = 1;
let exponentialFactor = 1.05;
let shrinking = false;

function createRenderer()
{
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.physicallyCorrectLights = true;
  return renderer;
}

const setSize = (container, camera, renderer) =>
{
  camera.aspect = canvasWidth / canvasHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
};

class Resizer
{
  constructor(container, camera, renderer)
  {
    setSize(container, camera, renderer);
    window.addEventListener('resize', () =>
    {
      setSize(container, camera, renderer);
      this.onResize();
    });
  }
  onResize() { }
}

const clock = new Clock();

class Loop
{
  constructor(camera, scene, renderer)
  {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = [];
  }

  start()
  {
    this.renderer.setAnimationLoop(() =>
    {
      this.tick();
      this.renderer.render(this.scene, this.camera);
    });
  }

  stop()
  {
    this.renderer.setAnimationLoop(null);
  }

  tick()
  {
    const delta = clock.getDelta();
    for (const object of this.updatables)
    {
      if (typeof object.tick === 'function')
      {
        object.tick(delta);
      }
    }
  }
}

function createCamera()
{
  const camera = new PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 10);
  camera.tick = (delta) => { };
  return camera;
}

function createLights()
{
  const directionalLightFront = new DirectionalLight(0xffffff, 1);
  directionalLightFront.position.set(0, 0, 5);

  return { directionalLightFront };
}

function createScene()
{
  const scene = new Scene();
  scene.background = null;
  return scene;
}

class World
{
  constructor(container)
  {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);

    const { directionalLightFront } = createLights();
    loop.updatables.push(directionalLightFront);
    scene.add(directionalLightFront);

    const resizer = new Resizer(container, camera, renderer);
    resizer.onResize = () =>
    {
      this.render();
    };

    this.loadModel();
  }

  loadModel()
  {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('draco/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      'card-pack.glb',
      (gltf) =>
      {
        gltf.scene.scale.set(0.06, 0.06, 0.06);
        gltf.scene.tick = (delta) =>
        {
          gltf.scene.rotation.y += delta * rotationSpeed;
          if (rotationSpeed >= 2)
          {
            rotationSpeed *= exponentialFactor;
            if (rotationSpeed > 300)
            {
              shrinking = true
            }
          }
          if (shrinking)
          {
            gltf.scene.scale.multiplyScalar(0.95);
            if (gltf.scene.scale.x < 0.001)
            {
              scene.remove(gltf.scene);
              loop.stop();
              document.querySelector('.card-pack').classList.add('hidden')
              showConfetti();
              document.querySelector('.card-wrapper').classList.remove('hidden')
              document.querySelector('.card-wrapper').classList.add('zoom-in')
            }
          }
        };
        loop.updatables.push(gltf.scene);
        scene.add(gltf.scene);
      },
      undefined,
      (error) =>
      {
        console.error('An error happened', error);
      }
    );
  }

  render()
  {
    renderer.render(scene, camera);
  }

  start()
  {
    loop.start();
  }

  stop()
  {
    loop.stop();
  }
}

function main()
{
  const container = document.querySelector(".card-pack");
  const world = new World(container);
  world.start();
}

function openPack()
{
  rotationSpeed = 2;
}

function showConfetti()
{
  confetti.addConfetti({
    emojis: ['💩'],
    emojiSize: 50,
  });
}

onMounted(() =>
{
  main();
});
</script>

<template>
  <div class="cards-wrapper flex flex-col justify-between h-[80vh]">
    <div class="card-pack flex flex-row items-center justify-center cursor-pointer mt-[5vh]"></div>
    <div class="card-wrapper flex justify-center items-center w-full mt-24 hidden">
      <div class="card lg:w-1/5 md:w-1/3 w-2/3 position-relative">
        <img class="rounded-lg bg-base-300 glint-legendary" :src="noPfp">
      </div>
    </div>
    <button class="btn btn-success w-2/3 sm:w-2/3 md:w-1/6 lg:w-1/8 mx-auto" @click="openPack">Open Pack</button>
  </div>
</template>

<style scoped>
.glint-legendary {
  animation: glint 2s infinite alternate, pulse 2s infinite alternate;
  border: 5px solid gold;
  color: gold;
}

.glint-epic {
  animation: glint 2s infinite alternate, pulse 2s infinite alternate;
  border: 5px solid purple;
  color: purple;
}

.glint-rare {
  animation: glint 2s infinite alternate, pulse 2s infinite alternate;
  border: 5px solid blue;
  color: blue;
}

.glint-common {
  animation: glint 2s infinite alternate, pulse 2s infinite alternate;
  border: 5px solid gray;
  color: gray;
}

@keyframes glint {
  0% {
    box-shadow: 0 0 3px 2px rgba(255, 255, 255, 0.5), 0 0 5px 3px;
  }

  50% {
    box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.5), 0 0 10px 5px;
  }

  100% {
    box-shadow: 0 0 3px 2px rgba(255, 255, 255, 0.5), 0 0 5px 3px;
  }
}

@keyframes pulse {

  0%,
  100% {
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 10px currentColor);
  }

  50% {
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 20px currentColor);
  }
}

@keyframes zoom-in {
  0% {
    transform: scale(0);
  }
  
  80% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

.card::before {
  content: "";
  display: block;
  padding-bottom: 141.67%; /* Aspect ratio 5:7 */
}

.card img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.zoom-in {
  animation: zoom-in 1s forwards ease-out;
}

</style>
