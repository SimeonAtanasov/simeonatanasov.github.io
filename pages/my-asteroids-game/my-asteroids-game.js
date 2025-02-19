const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight




// Sound toggle flag
let soundOn = false;

// Select the sound toggle button
const soundToggleButton = document.getElementById('soundToggle');

// Add event listener for the sound toggle button
soundToggleButton.addEventListener('click', () => {
  soundOn = !soundOn; // Toggle the sound state
  soundToggleButton.textContent = `Sound: ${soundOn ? 'On' : 'Off'}`;
});

function playSound(src) {
  if (soundOn) {
    const sound = new Audio(src);
    sound.volume = 0.1; // Adjust volume if needed
    sound.play();
  }
}



let score = 0;
let highestScore = localStorage.getItem('highestScore') 
    ? parseInt(localStorage.getItem('highestScore')) 
    : 0; // Initialize highest score from localStorage

class Player {
  constructor({ position, velocity }) {
    this.position = position // {x, y}
    this.velocity = velocity
    this.rotation = 0
  }

  draw() {
    c.save()
    c.translate(this.position.x, this.position.y)
    c.rotate(this.rotation)
    c.translate(-this.position.x, -this.position.y)

    c.beginPath()
    c.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false)
    c.fillStyle = 'red'
    c.fill()
    c.closePath()

    // c.fillStyle = 'red'
    // c.fillRect(this.position.x, this.position.y, 100, 100)

    // c.beginPath()
    // c.moveTo(this.position.x + 30, this.position.y)
    // c.lineTo(this.position.x - 10, this.position.y - 10)
    // c.lineTo(this.position.x - 10, this.position.y + 10)
    // c.closePath()

    c.beginPath()
    // Draw the pointy head
    c.moveTo(this.position.x + 30, this.position.y);                  // Nose of the spaceship
    // Draw the left side
    c.lineTo(this.position.x - 10, this.position.y - 10);             // Left wing
    // Draw the bottom point
    c.lineTo(this.position.x - 7, this.position.y);                  // Bottom point
    // Draw the right side
    c.lineTo(this.position.x - 10, this.position.y + 10);             // Right wing
    // Close the path back to the head

    c.closePath()

    c.strokeStyle = 'white'
    c.stroke()
    c.restore()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
  getVertices() {
    const cos = Math.cos(this.rotation)
    const sin = Math.sin(this.rotation)

    return [
      {
        x: this.position.x + cos * 30 - sin * 0,
        y: this.position.y + sin * 30 + cos * 0,
      },
      {
        x: this.position.x + cos * -10 - sin * 10,
        y: this.position.y + sin * -10 + cos * 10,
      },
      {
        x: this.position.x + cos * -10 - sin * -10,
        y: this.position.y + sin * -10 + cos * -10,
      },
    ]
  }
}
class Projectile {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.radius = 5
    this.color = ['red', 'green', 'blue'][Math.floor(Math.random() * 3)]
  }

  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
    c.closePath()
    c.fillStyle = this.color  // Use the color property
    c.fill()
  }


  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

class Asteroid {
  constructor({ position, velocity, radius }) {
    this.position = position
    this.velocity = velocity
    this.radius = radius
  }

  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
    c.closePath()
    c.stroke.Style = 'white'
    c.stroke()
    c.fillStyle = 'purple'
    c.fill()
  }


  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}



const player = new Player({
  position: { x: canvas.width / 2, y: canvas.height / 2 },
  velocity: { x: 0, y: 0 },
})



const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  s: {
    pressed: false, // Add this for the "S" key
  }
}

const SPEED = 6
const ROTATIONAL_SPEED = 0.05
const FRICTION = 0.97
const FRICTIONTWO = 0.93
const PROJECTILE_SPEED = 5

const projectiles = []
const asteroids = []

const stars = [];
const numStars = 200; // Adjust the number of stars as needed

class Star {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 2; // Small radius for stars
    this.alpha = Math.random(); // Random brightness
    this.velocityY = Math.random() * 0.1 + 0.02; // Extra slow falling effect
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha; // Set the transparency
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = 'white';
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    this.y += this.velocityY; // Simulate falling
    if (this.y > canvas.height) {
      this.y = -this.radius; // Reset to the top
      this.x = Math.random() * canvas.width;
      this.alpha = Math.random(); // Randomize brightness again
    }
    this.draw();
  }
}


for (let i = 0; i < numStars; i++) {
  stars.push(new Star());
}


const intervalId = window.setInterval(() => {
  const index = Math.floor(Math.random() * 4)
  let x, y
  let vx, vy
  let radius = 50 * Math.random() + 10

  switch (index) {
    case 0: // left side of the screen
      x = 0 - radius
      y = Math.random() * canvas.height
      vx = 1
      vy = 0
      break
    case 1: // bottom side of the screen
      x = Math.random() * canvas.width
      y = canvas.height + radius
      vx = 0
      vy = -1
      break
    case 2: // right side of the screen
      x = canvas.width + radius
      y = Math.random() * canvas.height
      vx = -1
      vy = 0
      break
    case 3: // top side of the screen
      x = Math.random() * canvas.width
      y = 0 - radius
      vx = 0
      vy = 1
      break
  }

  asteroids.push(
    new Asteroid({
      position: {
        x: x,
        y: y,
      },
      velocity: {
        x: vx,
        y: vy,
      },
      radius
    })
  )
  // console.log(asteroids)
}, 1000)// 3000 milliseconds

function circleCollision(circle1, circle2) {
  const xDifference = circle2.position.x - circle1.position.x
  const yDifference = circle2.position.y - circle1.position.y

  const distance = Math.sqrt(
    xDifference * xDifference + yDifference * yDifference
  )

  if (distance <= circle1.radius + circle2.radius) {
    return true
  }
  return false
}

function circleTriangleCollision(circle, triangle) {
  // Check if the circle is colliding with any of the triangle's edges
  for (let i = 0; i < 3; i++) {
    let start = triangle[i]
    let end = triangle[(i + 1) % 3]

    let dx = end.x - start.x
    let dy = end.y - start.y
    let length = Math.sqrt(dx * dx + dy * dy)

    let dot =
      ((circle.position.x - start.x) * dx +
        (circle.position.y - start.y) * dy) /
      Math.pow(length, 2)

    let closestX = start.x + dot * dx
    let closestY = start.y + dot * dy

    if (!isPointOnLineSegment(closestX, closestY, start, end)) {
      closestX = closestX < start.x ? start.x : end.x
      closestY = closestY < start.y ? start.y : end.y
    }

    dx = closestX - circle.position.x
    dy = closestY - circle.position.y

    let distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= circle.radius) {
      return true
    }
  }

  // No collision
  return false
}

function isPointOnLineSegment(x, y, start, end) {
  return (
    x >= Math.min(start.x, end.x) &&
    x <= Math.max(start.x, end.x) &&
    y >= Math.min(start.y, end.y) &&
    y <= Math.max(start.y, end.y)
  )
}


function animate() {
  const animationId = window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)

  player.update()

  // Draw stars
  stars.forEach((star) => star.update());

  // Display the score
  c.font = '30px Arial'
  c.fillStyle = 'white'
  c.fillText('Score: ' + score, 20, 40)

  // Display the highest score
  c.fillText('Highest Score: ' + highestScore, 20, 80);


  // Draw the control guides
  c.font = '20px Arial';
  c.fillStyle = 'white';
  c.fillText('Controls:', 20, canvas.height - 160);
  c.fillText('W - Forward', 20, canvas.height - 130);
  c.fillText('A - Rotate Left', 20, canvas.height - 100);
  c.fillText('D - Rotate Right', 20, canvas.height - 70);
  c.fillText('S - Decelerate', 20, canvas.height - 40);
  c.fillText('Space - Shoot', 20, canvas.height - 10);
  

  for (let j = projectiles.length - 1; j >= 0; j--) {
    const projectile = projectiles[j]
    projectile.update()


    // garbage collection for projectiles
    if (
      projectile.position.x + projectile.radius < 0 ||
      projectile.position.x - projectile.radius > canvas.width ||
      projectile.position.y - projectile.radius > canvas.height ||
      projectile.position.y + projectile.radius < 0
    ) {
      projectiles.splice(j, 1)
    }
  }

  // asteroid management
  for (let i = asteroids.length - 1; i >= 0; i--) {
    const asteroid = asteroids[i]
    asteroid.update()

    if (circleTriangleCollision(asteroid, player.getVertices())) {
      console.log('GAME OVER')
      window.cancelAnimationFrame(animationId)
      clearInterval(intervalId)

      // Check and update the highest score
      if (score > highestScore) {
        highestScore = score;
        localStorage.setItem('highestScore', highestScore); // Save to localStorage
      }
        // Show the restart button
      const restartButton = document.getElementById('restartButton');
      restartButton.style.display = 'block';

      restartButton.textContent = 'Restart Game - Score: ' + score;
    }

    // garbage collection for asteroids
    if (
      asteroid.position.x + asteroid.radius < 0 ||
      asteroid.position.x - asteroid.radius > canvas.width ||
      asteroid.position.y - asteroid.radius > canvas.height ||
      asteroid.position.y + asteroid.radius < 0
    ) {
      asteroids.splice(i, 1)
    }
    // projectiles
    for (let j = projectiles.length - 1; j >= 0; j--) {
      const projectile = projectiles[j]

      if (circleCollision(asteroid, projectile)) {
        asteroids.splice(i, 1)
        projectiles.splice(j, 1)
        score += 10 // Increment score when an asteroid is destroyedaw
        playSound('pages/my-asteroids-game/sounds/meteorite_sfx-76195.mp3');
        //   // Play explosion sound
        // const explosionSound = new Audio('pages/my-asteroids-game/sounds/meteorite_sfx-76195.mp3');
        // explosionSound.volume = 0.1; // Adjust volume as needed
        // explosionSound.play();
      }
    }
  }

  function circleTriangleCollision(circle, triangle) {
  // Check if the circle is colliding with any of the triangle's edges
  for (let i = 0; i < 3; i++) {
    let start = triangle[i]
    let end = triangle[(i + 1) % 3]

    let dx = end.x - start.x
    let dy = end.y - start.y
    let length = Math.sqrt(dx * dx + dy * dy)

    let dot =
      ((circle.position.x - start.x) * dx +
        (circle.position.y - start.y) * dy) /
      Math.pow(length, 2)

    let closestX = start.x + dot * dx
    let closestY = start.y + dot * dy

    if (!isPointOnLineSegment(closestX, closestY, start, end)) {
      closestX = closestX < start.x ? start.x : end.x
      closestY = closestY < start.y ? start.y : end.y
    }

    dx = closestX - circle.position.x
    dy = closestY - circle.position.y

    let distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= circle.radius) {
      return true
    }
  }

  // No collision
  return false
}

function isPointOnLineSegment(x, y, start, end) {
  return (
    x >= Math.min(start.x, end.x) &&
    x <= Math.max(start.x, end.x) &&
    y >= Math.min(start.y, end.y) &&
    y <= Math.max(start.y, end.y)
  )
}


if (keys.w.pressed) {
  // Move forward if "W" is pressed
  player.velocity.x = Math.cos(player.rotation) * SPEED
  player.velocity.y = Math.sin(player.rotation) * SPEED
} else if (keys.s.pressed) {
  // Apply friction if "S" is pressed
  player.velocity.x *= FRICTIONTWO 
  player.velocity.y *= FRICTIONTWO
} else {
  // Apply friction if neither "W" nor "S" is pressed
  player.velocity.x *= FRICTION
  player.velocity.y *= FRICTION
}

  if (keys.d.pressed) player.rotation += ROTATIONAL_SPEED
  else if (keys.a.pressed) player.rotation -= ROTATIONAL_SPEED


}


// console.log(player)

animate()

window.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyW':
      keys.w.pressed = true
      break
    case 'KeyA':
      keys.a.pressed = true
      break
    case 'KeyD':
      keys.d.pressed = true
      break
    case 'KeyS': // Add this case
      keys.s.pressed = true
      break
    case 'Space':
      event.preventDefault(); // Prevent the page from scrolling
      // // Play shoot sound effect
      // const shootSound = new Audio('pages/my-asteroids-game/sounds/blaster-103340.mp3');
      // shootSound.volume = 0.1;  // Reduce volume to 20%
      // shootSound.play(); // Play the sound
      playSound('pages/my-asteroids-game/sounds/blaster-103340.mp3');



      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + Math.cos(player.rotation) * 30,
            y: player.position.y + Math.sin(player.rotation) * 30,
          },
          velocity: {
            x: Math.cos(player.rotation) * PROJECTILE_SPEED,
            y: Math.sin(player.rotation) * PROJECTILE_SPEED,
          },
        })
      )
      // console.log(projectiles)
      break
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyW':
      keys.w.pressed = false
      break
    case 'KeyA':
      keys.a.pressed = false
      break
    case 'KeyD':
      keys.d.pressed = false
      break
    case 'KeyS': // Add this case
      keys.s.pressed = false
      break
  }
})


// Event listener for the restart button
document.getElementById('restartButton').addEventListener('click', () => {
  // Reload the page (simple approach)
  location.reload();
});