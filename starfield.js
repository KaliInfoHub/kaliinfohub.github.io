
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Ensure canvas stays fixed to viewport
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '0';
canvas.style.pointerEvents = 'none';

// Track scroll position
let scrollX = 0;
let scrollY = 0;

// Create stars with an additional field for absolute position
let stars = Array.from({ length: 300 }, () => ({
  x: Math.random() * canvas.width - canvas.width / 2,
  y: Math.random() * canvas.height - canvas.height / 2,
  z: Math.random() * canvas.width,
  // Store the original absolute position
  absX: 0,
  absY: 0
}));

// Update scroll position on scroll event
window.addEventListener('scroll', () => {
  scrollX = window.scrollX;
  scrollY = window.scrollY;
});

// Handle window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function drawStarfield() {
  function animate() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ccff';

    for (let star of stars) {
      // Update star position based on z-movement
      star.z -= 2;
      if (star.z <= 0) {
        star.x = Math.random() * canvas.width - canvas.width / 2;
        star.y = Math.random() * canvas.height - canvas.height / 2;
        star.z = canvas.width;
      }

      const k = 128.0 / star.z;
      let x = star.x * k + canvas.width / 2;
      let y = star.y * k + canvas.height / 2;
      
      // Calculate absolute position
      star.absX = x + scrollX;
      star.absY = y + scrollY;
      
      // Calculate position relative to current viewport
      const visibleX = star.absX - scrollX;
      const visibleY = star.absY - scrollY;

      // Only draw stars within the current viewport
      if (visibleX >= 0 && visibleX <= canvas.width && visibleY >= 0 && visibleY <= canvas.height) {
        const size = (1 - star.z / canvas.width) * 2;
        ctx.beginPath();
        ctx.arc(visibleX, visibleY, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}



let effectType = localStorage.getItem("effectType") || "matrix";
document.getElementById("effectToggle").value = effectType;

let animationId;

// === Effect Functions === //

function drawMatrix() {
  const fontSize = 14;
  const columns = canvas.width / fontSize;
  const drops = Array(Math.floor(columns)).fill(1);

  function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = '01'[Math.floor(Math.random() * 2)];
      const rand = Math.random();
      ctx.fillStyle = rand < 0.85 ? '#888' : rand < 0.95 ? '#0f0' : '#00ccff';
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }

    animationId = requestAnimationFrame(animate);
  }
  animate();
}

function drawStarfield() {
  let stars = Array.from({ length: 300 }, () => ({
    x: Math.random() * canvas.width - canvas.width / 2,
    y: Math.random() * canvas.height - canvas.height / 2,
    z: Math.random() * canvas.width
  }));

  function animate() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ccff';

    for (let star of stars) {
      star.z -= 2;
      if (star.z <= 0) {
        star.x = Math.random() * canvas.width - canvas.width / 2;
        star.y = Math.random() * canvas.height - canvas.height / 2;
        star.z = canvas.width;
      }

      const k = 128.0 / star.z;
      const x = star.x * k + canvas.width / 2;
      const y = star.y * k + canvas.height / 2;

      if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        const size = (1 - star.z / canvas.width) * 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  animate();
}

function drawWarpSpeed() {
  let lines = Array.from({ length: 200 }, () => ({
    angle: Math.random() * 2 * Math.PI,
    radius: 0,
    speed: Math.random() * 5 + 2
  }));

  function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#00ccff';
    ctx.lineWidth = 1;

    for (let line of lines) {
      const startX = canvas.width / 2 + Math.cos(line.angle) * line.radius;
      const startY = canvas.height / 2 + Math.sin(line.angle) * line.radius;
      line.radius += line.speed;

      const endX = canvas.width / 2 + Math.cos(line.angle) * line.radius;
      const endY = canvas.height / 2 + Math.sin(line.angle) * line.radius;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      if (line.radius > canvas.width) {
        line.radius = 0;
        line.angle = Math.random() * 2 * Math.PI;
        line.speed = Math.random() * 5 + 2;
      }
    }

    animationId = requestAnimationFrame(animate);
  }
  animate();
}

function drawParticles() {
  let particles = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 1.5,
    vy: (Math.random() - 0.5) * 1.5
  }));

  function animate() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#00f7ff';
      ctx.fill();
    }

    animationId = requestAnimationFrame(animate);
  }
  animate();
}

function drawCircuitPulse() {
  const lines = [];

  for (let i = 0; i < 60; i++) {
    lines.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 100 + 50,
      dx: Math.random() < 0.5 ? 1 : 0,
      dy: Math.random() < 0.5 ? 1 : 0,
      offset: 0
    });
  }

  function animate() {
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#b0e0e6';

    lines.forEach(line => {
      let x = line.x;
      let y = line.y;

      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let i = 0; i < line.length; i++) {
        x += line.dx * 5;
        y += line.dy * 5;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      line.offset++;
      if (line.offset > 100) {
        line.x = Math.random() * canvas.width;
        line.y = Math.random() * canvas.height;
        line.offset = 0;
      }
    });

    animationId = requestAnimationFrame(animate);
  }

  animate();
}

// === Effect Switcher === //

function startEffect(type) {
  cancelAnimationFrame(animationId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  switch (type) {
    case "matrix": drawMatrix(); break;
    case "starfield": drawStarfield(); break;
    case "warp": drawWarpSpeed(); break;
    case "particles": drawParticles(); break;
    case "circuit": drawCircuitPulse(); break;
    default: drawMatrix(); break;
  }
}

document.getElementById("effectToggle").addEventListener("change", (e) => {
  effectType = e.target.value;
  localStorage.setItem("effectType", effectType);
  startEffect(effectType);
});

startEffect(effectType);