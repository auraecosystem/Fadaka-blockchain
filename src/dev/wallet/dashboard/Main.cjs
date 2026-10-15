import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";

// Scene
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x05060a, 50, 200);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 40, 120);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Light
const light = new THREE.PointLight(0x00ffcc, 2);
light.position.set(50, 50, 50);
scene.add(light);

// Helper function to create nodes
function createNode(name, color, position) {
  const geometry = new THREE.BoxGeometry(20, 10, 10);
  const material = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.3
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.userData = { name };

  scene.add(mesh);
  return mesh;
}

// ===== WEB4 ARCHITECTURE NODES =====

// Identity Layer (.p12)
const identity = createNode("Identity Layer (.p12)", 0x00ffcc, [0, 60, 0]);

// FastAPI KMS Server
const kms = createNode("FastAPI KMS Server", 0xffcc00, [0, 30, 0]);

// Wallet Layer
const wallet = createNode("Wallet Layer", 0x00aaff, [-40, 0, 0]);

// Node Layer
const node = createNode("Node Layer", 0xff0066, [40, 0, 0]);

// P2P Blockchain Layer
const p2p = createNode("P2P Blockchain", 0x9900ff, [0, -40, 0]);

// Connections (lines)
function connect(a, b) {
  const material = new THREE.LineBasicMaterial({ color: 0x00ffcc });
  const points = [];
  points.push(a.position);
  points.push(b.position);

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  scene.add(line);
}

connect(identity, kms);
connect(kms, wallet);
connect(kms, node);
connect(wallet, p2p);
connect(node, p2p);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  scene.rotation.y += 0.002;

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
