<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, Ref, watch } from 'vue';
import { WebGLRenderer, PerspectiveCamera, Scene, DirectionalLight, Clock } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import JSConfetti from 'js-confetti';

const canvas = ref<HTMLDivElement | null>(null);
let camera: PerspectiveCamera;
let renderer: WebGLRenderer;
let scene: Scene;
let loop: Loop;
let controls: OrbitControls;
const clock = new Clock();
let confetti = new JSConfetti()
let rotationSpeed = 1;
let exponentialFactor = 1.05;
let shrinking = false;
let userInteracting = false;
let width = window.innerWidth / 3;
let height = window.innerHeight * 0.7;

function updateDimensions() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Set dimensions based on screen size
  if (screenWidth >= 1200) {
    // Large screens
    width = screenWidth / 3;
    height = screenHeight * 0.7;
  } else if (screenWidth >= 768) {
    // Medium screens
    width = screenWidth / 2;
    height = screenHeight * 0.6;
  } else {
    // Small screens
    width = screenWidth;
    height = screenHeight * 0.5;
  }
}

class Loop {
  updatables: any[];

  constructor(camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer) {
    this.updatables = [];
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
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
      if (typeof object.tick === 'function') object.tick(delta);
    }
  }
}

function createRenderer() {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  return renderer;
}

function createCamera() {
  const aspectRatio = width / height;
  const camera = new PerspectiveCamera(35, aspectRatio, 0.1, 100);
  camera.position.set(0, 0, 10);
  return camera;
}

function createScene() {
  return new Scene();
}

function createLights(scene: Scene) {
  const light1 = new DirectionalLight(0xffffff, 0.5);
  light1.position.set(0, 2, 5);
  scene.add(light1);

  const light2 = new DirectionalLight(0xffffff, 0.5);
  light2.position.set(0, 2, -5);
  scene.add(light2);

  const light3 = new DirectionalLight(0xffffff, 0.5);
  light3.position.set(5, 2, 0);
  scene.add(light3);

  const light4 = new DirectionalLight(0xffffff, 0.5);
  light4.position.set(-5, 2, 0);
  scene.add(light4);
}

function loadModel(scene: Scene) {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('draco/');
  loader.setDRACOLoader(dracoLoader);

  loader.load('card-pack.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.06, 0.06, 0.06);
    model.tick = (delta: number) => {
      if (!userInteracting) {
        model.rotation.y += delta * rotationSpeed;
      }

      if (rotationSpeed >= 2) {
        rotationSpeed *= exponentialFactor;
        if (rotationSpeed > 300) {
          shrinking = true;
        }
      }

      if (shrinking) {
        model.scale.multiplyScalar(0.95);
        if (model.scale.x < 0.001) {
          scene.remove(model);
          loop.stop();
          document.querySelector(".card-pack").classList.add("hidden")
          document.querySelector(".card-wrapper").classList.remove("hidden")
          document.querySelector(".card-wrapper").classList.add("zoom-in")
          document.querySelector(".card-info").classList.remove("hidden")
          showConfetti()
        }
      }
    };
    loop.updatables.push(model);
    scene.add(model);
  });
}

function onWindowResize() {
  updateDimensions(); 
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  
  renderer.setSize(width, height);
}

function open() {
  rotationSpeed = 2;
}

async function reset() {
  document.querySelector(".card-info").classList.add("hidden");
  document.querySelector("body").style.overflowY = "hidden";
  document.querySelector(".card").classList.add("slide-down");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  document.querySelector(".card").classList.remove("slide-down");
  document.querySelector("body").style.overflowY = "auto";
  document.querySelector(".card-pack").classList.remove("hidden");
  document.querySelector(".card-wrapper").classList.add("hidden");
  document.querySelector(".card-wrapper").classList.remove("zoom-in");
  document.querySelector("#openPack").classList.remove("fade-out");
  document.querySelector(".card").classList.remove("rarity-common", "rarity-rare", "rarity-epic", "rarity-legendary");
}

function showConfetti() {
  confetti.addConfetti({
    emojis: ["💩", "🚽", "🧻"],
    emojiSize: 50,
  })
}

onMounted(() => {
  updateDimensions();
  const container = canvas.value;
  if (!container) return;

  camera = createCamera();
  scene = createScene();
  renderer = createRenderer();
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;

  controls.addEventListener('start', () => {
    userInteracting = true;
  });

  controls.addEventListener('end', () => {
    userInteracting = false;
  });

  loop = new Loop(camera, scene, renderer);
  container.appendChild(renderer.domElement);

  createLights(scene);
  loadModel(scene);
  loop.start();

  window.addEventListener('resize', onWindowResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize);
});

defineExpose({
  open,
  reset,
});
</script>

<template>
  <div ref="canvas" class="three-canvas"></div>
</template>

<style scoped>
</style>
