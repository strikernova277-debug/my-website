// 1. Guaranteed Auto-Play Mechanism (PC + Mobile)
const audio = document.getElementById('bdaySong');
const musicBtn = document.getElementById('musicBtn');
const welcomeOverlay = document.getElementById('welcomeOverlay');

// Try automatic play on load
window.addEventListener('DOMContentLoaded', () => {
  const promise = audio.play();
  if (promise !== undefined) {
    promise.then(() => {
      welcomeOverlay.classList.add('hidden');
      musicBtn.innerText = '⏸️ Pause Song';
    }).catch(() => {
      // Browser requires tap interaction (handled by welcome overlay)
    });
  }
});

function startExperience() {
  welcomeOverlay.classList.add('hidden');
  playAudio();
  launchCelebration();
}

function playAudio() {
  audio.play().then(() => {
    musicBtn.innerText = '⏸️ Pause Song';
  }).catch((err) => {
    console.log("Audio unlock error:", err);
  });
}

function toggleAudio() {
  if (audio.paused) {
    playAudio();
  } else {
    audio.pause();
    musicBtn.innerText = '▶️ Play Song';
  }
}

// Global Touch/Click fallback
['click', 'touchstart', 'pointerdown'].forEach(evt => {
  window.addEventListener(evt, () => {
    if (audio.paused) playAudio();
  }, { once: true });
});

// 2. Photo Slideshow
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let slideInterval = null;

function showSlide(index) {
  slides.forEach((s, i) => s.classList.toggle('active', i === index));
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
  currentSlide = index;
}

function nextSlide() {
  const next = (currentSlide + 1) % slides.length;
  showSlide(next);
}

function startSlideShow() {
  slideInterval = setInterval(nextSlide, 3200);
}

function manualNextPhoto() {
  clearInterval(slideInterval);
  nextSlide();
  startSlideShow();
}

startSlideShow();

// 3. Cake Candle Blow & Celebration
const flames = document.querySelectorAll('.flame');
const cakeSection = document.getElementById('cakeSection');
let candlesLit = true;

cakeSection.addEventListener('click', () => {
  if (audio.paused) playAudio();

  if (candlesLit) {
    flames.forEach(f => f.classList.add('blown-out'));
    candlesLit = false;
    launchCelebration();

    setTimeout(() => {
      flames.forEach(f => f.classList.remove('blown-out'));
      candlesLit = true;
    }, 5000);
  } else {
    flames.forEach(f => f.classList.remove('blown-out'));
    candlesLit = true;
  }
});

// 4. Multi-angle Confetti Popper
function launchCelebration() {
  if (audio.paused) playAudio();

  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.7 }
  });

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });
  }, 250);
}

// 5. Modal Popup Controls
function openSurpriseLetter() {
  document.getElementById('wishModal').classList.add('active');
  launchCelebration();
}

function closeSurpriseLetter() {
  document.getElementById('wishModal').classList.remove('active');
}

// 6. Fully Responsive Canvas Tree & Hearts (PC + Mobile Scaling)
const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');

let width, height;
const dpr = window.devicePixelRatio || 1;

function resizeCanvas() {
  const stage = canvas.parentElement;
  width = stage.clientWidth;
  height = stage.clientHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);
}

resizeCanvas();
window.addEventListener('resize', () => {
  resizeCanvas();
  initBlossoms();
});

const heartColors = [
  '#ff4d79', '#ff7096', '#ff85a1', '#fbb1bd', 
  '#ff99c8', '#fec5bb', '#fcd5ce', '#ffd166', '#ffa69e', '#f72585'
];

function isInsideHeart(px, py, cx, cy, scale) {
  const x = (px - cx) / scale;
  const y = -(py - cy) / scale;
  const a = (x * 0.08) ** 2 + (y * 0.08) ** 2 - 1;
  return (a * a * a - (x * 0.08) ** 2 * (y * 0.08) ** 3) <= 0;
}

function drawHeart(x, y, size, color, alpha = 1, rotation = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;

  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(0, topCurveHeight);
  ctx.bezierCurveTo(-size / 2, -size / 2, -size, size / 3, 0, size);
  ctx.bezierCurveTo(size, size / 3, size / 2, -size / 2, 0, topCurveHeight);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

const blossomCount = 450;
const blossoms = [];

function initBlossoms() {
  blossoms.length = 0;
  const cx = width / 2;
  const cy = height * 0.35;
  // Dynamic scaling for mobile vs PC
  const scale = width < 420 ? 5.8 : 7.6;

  while (blossoms.length < blossomCount) {
    const rx = cx + (Math.random() - 0.5) * (width * 0.72);
    const ry = cy + (Math.random() - 0.5) * (height * 0.52);
    
    if (isInsideHeart(rx, ry, cx, cy, scale)) {
      blossoms.push({
        x: rx,
        y: ry,
        size: 0,
        targetSize: Math.random() * 6.5 + 4,
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
        rotation: (Math.random() - 0.5) * 0.85,
        delay: Math.random() * 95,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayOffset: Math.random() * Math.PI * 2
      });
    }
  }
}

initBlossoms();

const floatingHearts = Array.from({ length: 22 }, () => ({
  x: Math.random() * 300,
  y: Math.random() * 200,
  size: Math.random() * 4.5 + 2.5,
  color: heartColors[Math.floor(Math.random() * heartColors.length)],
  vy: -(Math.random() * 0.35 + 0.18),
  vx: (Math.random() - 0.5) * 0.25,
  alpha: Math.random() * 0.5 + 0.3,
  rotation: Math.random() * Math.PI
}));

function drawTree() {
  const cx = width / 2;
  const trunkBaseY = height - 50;
  const forkY = height * 0.45;

  ctx.save();
  ctx.strokeStyle = '#4e2a28';
  ctx.lineCap = 'round';

  // Dynamic trunk
  ctx.lineWidth = width < 420 ? 6.5 : 8;
  ctx.beginPath();
  ctx.moveTo(cx, trunkBaseY);
  ctx.quadraticCurveTo(cx - 2, (trunkBaseY + forkY) / 2, cx, forkY);
  ctx.stroke();

  // Branch framework
  ctx.lineWidth = width < 420 ? 2.8 : 3.4;
  
  // Left branch
  ctx.beginPath();
  ctx.moveTo(cx, forkY);
  ctx.bezierCurveTo(cx - 30, forkY - 28, cx - 75, forkY - 58, cx - 65, forkY - 92);
  ctx.bezierCurveTo(cx - 60, forkY - 118, cx - 20, forkY - 122, cx, forkY - 92);
  ctx.stroke();

  // Right branch
  ctx.beginPath();
  ctx.moveTo(cx, forkY);
  ctx.bezierCurveTo(cx + 30, forkY - 28, cx + 75, forkY - 58, cx + 65, forkY - 92);
  ctx.bezierCurveTo(cx + 60, forkY - 118, cx + 20, forkY - 122, cx, forkY - 92);
  ctx.stroke();

  ctx.restore();
}

let frame = 0;
function animate() {
  ctx.clearRect(0, 0, width, height);
  drawTree();

  blossoms.forEach(b => {
    if (frame > b.delay && b.size < b.targetSize) {
      b.size += (b.targetSize - b.size) * 0.045;
    }
    if (b.size > 0.5) {
      const sway = Math.sin(frame * b.swaySpeed + b.swayOffset) * 0.08;
      drawHeart(b.x, b.y, b.size, b.color, 0.92, b.rotation + sway);
    }
  });

  const cx = width / 2;
  floatingHearts.forEach(p => {
    p.y += p.vy;
    p.x += p.vx + Math.sin(frame * 0.02) * 0.2;
    p.rotation += 0.01;

    if (p.y < 20) {
      p.y = height * 0.55;
      p.x = cx + (Math.random() - 0.5) * (width * 0.65);
    }
    drawHeart(p.x, p.y, p.size, p.color, p.alpha, p.rotation);
  });

  frame++;
  requestAnimationFrame(animate);
}

animate();