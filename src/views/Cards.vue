<script setup lang="ts">
import { WebGLRenderer, PerspectiveCamera, DirectionalLight, Scene, Clock, Camera } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted, ref } from "vue";
import JSConfetti from "js-confetti";
import { useAPIStore } from "../stores/api"
import { useSessionStore } from "../stores/session";
import { Card } from "../types/Card"
const { client } = useAPIStore()
const sessionStore = useSessionStore()

let camera: Camera;
let renderer: WebGLRenderer;
let scene: Scene;
let loop: Loop;
let controls;
let canvasWidth = window.innerWidth / 1.1;
let canvasHeight = window.innerHeight / 1.5;
let confetti = new JSConfetti();
let rotationSpeed = 1;
let exponentialFactor = 1.05;
let shrinking = false;
let userInteracting = false;
const foundCard = ref({} as Card)
let isOpening = ref(false);

function createRenderer() {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(canvasWidth, canvasHeight);
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
  onResize() { }
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
  camera.tick = (delta) => { };
  return camera;
}

function createLights() {
  const directionalLightFront = new DirectionalLight(0xffffff, 1);
  directionalLightFront.position.set(0, 0, 5);

  const directionalLightBack = new DirectionalLight(0xffffff, 1);
  directionalLightBack.position.set(0, 0, -5);

  return { directionalLightFront, directionalLightBack };
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
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;

    controls.addEventListener('start', () => userInteracting = true);
    controls.addEventListener('end', () => {
      userInteracting = false;
    });

    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);

    const { directionalLightFront, directionalLightBack } = createLights();
    loop.updatables.push(directionalLightFront);
    loop.updatables.push(directionalLightBack);
    scene.add(directionalLightFront);
    scene.add(directionalLightBack);

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
          if (!userInteracting) {
            gltf.scene.rotation.y += delta * rotationSpeed;
          }
          if (rotationSpeed >= 2) {
            rotationSpeed *= exponentialFactor;
            if (rotationSpeed > 300) {
              shrinking = true;
            }
          }
          if (shrinking) {
            gltf.scene.scale.multiplyScalar(0.95);
            if (gltf.scene.scale.x < 0.001) {
              scene.remove(gltf.scene);
              loop.stop();
              document.querySelector('.card-pack').classList.add('hidden');
              showConfetti();
              document.querySelector('.card-wrapper').classList.remove('hidden');
              document.querySelector('.card-wrapper').classList.add('zoom-in');
              document.querySelector('.card-info').classList.remove('hidden');
              isOpening.value = false
            }
          }
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
  const container = document.querySelector(".card-pack")
  const world = new World(container);
  world.start();
}

async function openPack() {
  isOpening.value = true
  const response = await client.openPack()
  if (!response.ok) {
    return
  }
  sessionStore.session.money = sessionStore.session.money - 5
  foundCard.value = await response.json()
  document.querySelector('#openPack').classList.add('fade-out')
  document.querySelector('.card').classList.add(getRarityClass(foundCard.value.rarity))
  rotationSpeed = 2;
}

function getRarityClass(rarityId) {
  let rarityMap = {
    'Merdume': 'rarity-common',
    'Escrementale': 'rarity-rare',
    'Sensazianale': 'rarity-epic',
    'Caccasmagorico': 'rarity-legendary'
  }

  return rarityMap[rarityId]
}

async function reset() {
    document.querySelector('.card-info').classList.add('hidden')
    document.querySelector('body').style.overflowY = 'hidden'
    document.querySelector('.card').classList.add('slide-down')
    await new Promise(resolve => setTimeout(resolve, 1000))
    document.querySelector('.card').classList.remove('slide-down')
    document.querySelector('body').style.overflowY = 'auto'
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
    rotationSpeed = 1;
    shrinking = false;
    userInteracting = false;
    document.querySelector('.card-pack').classList.remove('hidden')
    document.querySelector('.card-wrapper').classList.add('hidden')
    document.querySelector('.card-wrapper').classList.remove('zoom-in')
    document.querySelector('#openPack').classList.remove('fade-out')
    document.querySelector('.card').classList.remove('rarity-common', 'rarity-rare', 'rarity-epic', 'rarity-legendary')
    document.querySelector('.card-pack').innerHTML = ''
    main()
}

function showConfetti() {
  confetti.addConfetti({
    emojis: ['💩', '🚽', '🧻'],
    emojiSize: 50,
  })
}

onMounted(() => {
  main();
});
</script>

<template>
  <div class="cards-wrapper flex flex-col justify-between h-[80vh]">
    <div class="card-pack flex flex-row items-center justify-center cursor-pointer mt-[5vh]"></div>
    <div class="card-wrapper flex justify-center items-center w-full mt-24 hidden">
      <div class="card lg:w-1/5 md:w-1/3 w-2/3 position-relative">
        <img class="rounded-lg bg-base-300" :src="foundCard.asset_url" @click="reset">
      </div>
    </div>
    <div class="card-info prose w-100 mx-auto text-center my-2 hidden">
      <h1 class="mb-1 mt-5">{{ foundCard.name }}</h1>
      <h2 class="mt-3 rarity">{{ foundCard.rarity}}</h2>
    </div>
    <button v-if="!sessionStore.session.id" class="btn btn-error w-2/3 sm:w-2/3 md:w-1/6 lg:w-1/8 mx-auto">Login required</button>
    <button v-if="sessionStore.session.money >= 5" id="openPack"
      :disabled="isOpening" class="btn btn-success w-2/3 sm:w-2/3 md:w-1/6 lg:w-1/8 mx-auto" @click="openPack">Open Pack (5 $💩)</button>
    <button v-if="sessionStore.session.money <= 5"
      class="btn btn-error w-2/3 sm:w-2/3 md:w-1/6 lg:w-1/8 mx-auto" @click="openPack">You can't buy this item (5
      $💩)</button>
  </div>
</template>

<style scoped>
.rarity-legendary {
  border: 8px solid #ffd600;
}

.rarity-epic {
  border: 8px solid #9500ff;
}

.rarity-rare {
  border: 8px solid #0068ff;
}

.rarity-common {
  border: 8px solid #808080;
}

.slide-down {
  animation: slide-down .5s ease-in-out forwards;
}

@keyframes slide-down {
  from {
    transform: translateY(0vh);
  }

  to {
    transform: translateY(100vh);
  }
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

@keyframes fade-out {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

.fade-out {
  animation: fade-out .5s linear forwards;
}

.card::before {
  content: "";
  display: block;
  padding-bottom: 141.67%;
  /* Aspect ratio 5:7 */
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
