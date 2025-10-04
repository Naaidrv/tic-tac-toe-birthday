// ---- Animación de estrellas ----
const canvas = document.getElementById("stars")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})

const stars = []
for (let i = 0; i < 150; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5,
    alpha: Math.random(),
    speed: Math.random() * 0.05 + 0.02,
    twinkle: Math.random() * 0.05,
  })
}

let mouseX = 0,
  mouseY = 0

document.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2
  const cursorGlow = document.querySelector(".cursor-glow")
  cursorGlow.style.left = `${e.clientX}px`
  cursorGlow.style.top = `${e.clientY}px`
})

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  stars.forEach((star) => {
    ctx.beginPath()
    ctx.arc(star.x + mouseX * 20, star.y + mouseY * 20, star.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${star.alpha})`
    ctx.fill()
    star.y -= star.speed
    if (star.y < 0) {
      star.y = canvas.height
      star.x = Math.random() * canvas.width
    }
    star.alpha += star.twinkle * (Math.random() > 0.5 ? 1 : -1)
    if (star.alpha < 0) star.alpha = 0
    if (star.alpha > 1) star.alpha = 1
  })
  requestAnimationFrame(animateStars)
}
animateStars()

// ---- Typing effect ----
const words = ["mi amor! 💕", "mi bb! 🥰", "mi preciosa! 🥹"]
let i = 0,
  j = 0,
  currentWord = words[i],
  isDeleting = false
const typedElement = document.getElementById("typed")

function typeEffect() {
  if (isDeleting) typedElement.textContent = currentWord.substring(0, j--)
  else typedElement.textContent = currentWord.substring(0, j++)
  if (!isDeleting && j === currentWord.length + 1) {
    isDeleting = true
    setTimeout(typeEffect, 1200)
    return
  } else if (isDeleting && j === 0) {
    isDeleting = false
    i = (i + 1) % words.length
    currentWord = words[i]
  }
  setTimeout(typeEffect, isDeleting ? 80 : 150)
}
typeEffect()

// ---- Modales y bienvenida ----
const startBtn = document.getElementById("startBtn")
const rulesModal = document.getElementById("rulesModal")
const playBtn = document.getElementById("playBtn")
const gameContainer = document.getElementById("gameContainer")
const welcomeContainer = document.getElementById("welcomeContainer")
const showCardBtn = document.getElementById("showCardBtn")
const restartBtn = document.getElementById("restartBtn")
const cardModal = document.getElementById("cardModal")
const closeCard = document.getElementById("closeCard")

startBtn.addEventListener("click", () => (rulesModal.style.display = "flex"))

playBtn.addEventListener("click", () => {
  rulesModal.style.display = "none"
  welcomeContainer.style.display = "none" // Ocultar welcome
  gameContainer.classList.remove("hidden")
  resetGame()
})

/// ---- Tic-Tac-Toe ----
const board = document.getElementById("board")
const cells = Array.from(document.querySelectorAll(".cell"))
const currentPlayer = "X"
const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function checkWinner(player) {
  return winningCombos.some((combo) => {
    if (combo.every((i) => cells[i].textContent === player)) {
      combo.forEach((i) => cells[i].classList.add("victory")) // parpadeo neón
      return true
    }
    return false
  })
}

function computerMove() {
  // Bloquea jugador si puede ganar
  for (const combo of winningCombos) {
    const marks = combo.map((i) => cells[i].textContent)
    if (marks.filter((m) => "X" === m).length === 2 && marks.includes("")) {
      const emptyIndex = combo.find((i) => cells[i].textContent === "")
      cells[emptyIndex].textContent = "O"
      if (checkWinner("O")) return endGame("Computer Wins!")
      return
    }
  }
  // Gana si puede
  for (const combo of winningCombos) {
    const marks = combo.map((i) => cells[i].textContent)
    if (marks.filter((m) => "O" === m).length === 2 && marks.includes("")) {
      const emptyIndex = combo.find((i) => cells[i].textContent === "")
      cells[emptyIndex].textContent = "O"
      if (checkWinner("O")) return endGame("Computer Wins!")
      return
    }
  }
  // Aleatorio
  const emptyCells = cells.filter((c) => c.textContent === "")
  if (emptyCells.length === 0) return
  const move = emptyCells[Math.floor(Math.random() * emptyCells.length)]
  move.textContent = "O"
  if (checkWinner("O")) endGame("Computer Wins!")
}

// Terminar juego
function endGame(message) {
  cells.forEach((c) => (c.style.pointerEvents = "none")) // bloquear celdas
  if (message.includes("Computer") || message.includes("Draw")) {
    restartBtn.classList.remove("hidden") // botón visible si gana comp o empate
  } else {
    showCardBtn.classList.remove("hidden") // botón sorpresa si gana jugador
  }
}

// Revisar empate
function checkDraw() {
  if (cells.every((c) => c.textContent !== "") && !checkWinner("X") && !checkWinner("O")) {
    endGame("Draw!")
    alert("It's a draw! Try again 🌌")
  }
}

// Click en celdas
cells.forEach((cell) => {
  cell.addEventListener("click", () => {
    if (cell.textContent === "") {
      cell.textContent = currentPlayer
      if (checkWinner(currentPlayer)) {
        endGame("You Win!")
      } else {
        computerMove()
        checkDraw() // Revisar empate después del movimiento de la computadora
      }
    }
  })
})

// Reiniciar juego
function resetGame() {
  cells.forEach((c) => {
    c.textContent = ""
    c.style.pointerEvents = "auto"
    c.classList.remove("victory")
  })
  showCardBtn.classList.add("hidden")
  restartBtn.classList.add("hidden")
}

restartBtn.addEventListener("click", () => {
  resetGame()
})

// Mostrar cartita digital en nueva ventana
showCardBtn.addEventListener("click", () => {
  window.open("", "_blank", "width=400,height=500").document.write(`
    <html>
      <head>
        <title>Nunca olvides... 💌</title>
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
          body { 
            display:flex; 
            justify-content:center; 
            align-items:center; 
            height:100vh; 
            background: radial-gradient(circle at center, #001133, #000); 
            color:white; 
            font-family:'Be Vietnam Pro',sans-serif;
            text-align:center;
          }
          .card { 
            background: rgba(0,0,50,0.6); 
            padding: 30px; 
            border-radius: 20px; 
            box-shadow: 0 0 30px #3ba9ff;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Hooola preciosa</h1>
          <p>¡Felíz cumpleaños 🥳🎉! <br>
          Hoooy, es un día muy especial, pues llegaste a este mundo (quizás en contra de tu voluntad xd), pero te aseguro que has, eres y serás una bendición para todas las personas que te rodeamos... Asi que, mi preciosa, nunca, NUNCA dudes de tu valor, ni de quien eres, no dejes que nada, ni nadie te haga sentir menos.<br><br>
          Eres increíble y sé que hay días en los que cuesta creer eso y quisiera poder borrar esos días o que simplemente no pasarán, pero desafortunadamente hay cosas que tienes que atrevesar tu solita y yo, detesto eso. Te amo mucho, de eso nunca tengas duda, estoy muy orgullosa de tí, quizás es algo que no digo muchas veces en voz alta, pero
          quiero que sepas que si lo estoy, que veo como te levantas día con día, incluso en esos días donde no tienes ganas de nada y debo confesar que cuando te veo, recuerdo todo lo que hemos vivido, lo bueno, lo malo y siempre viene a mi cabeza esa imagen tuya, de niña, de esa sonrisa "picara" que siempre has tenido y no sabes cuand afortunada me siento y me doy
          cuenta que eres el bebé de alguien y ahora también eres mi bebé 🥹 y sé que no hay nada que no haría por tí. <br>

          Te amo mucho y perdoname, si hay días en los que no te lo he sabido demostrar, he dejado que otra cosas me hundan y te he arrastrado a algo que no deberías pasar... Ten por seguro que haré todo lo que esta en mis manos e incluso un poco más, para que eso no vuelva a suceder, gracias por dejarme estar en tu vida un año más, estoy ansiosa de saber que aventuras nos esperan,
          estoy andisosa de verte crecer y echarte porras, incluso en los días que te falte el aliento yo te lo daré, por favor nunca dudes de tí, porque eres más que increíble 🥹 y te puedo asegurar que todos los que estamos al rededor tuyo estamos orgullosos de quien eres, de lo que has logrado y te amamos más de lo que imaginas...
            <br><br>
          ¡Felíz cumpleaños, preciosa!
          </p>
        </div>
      </body>
    </html>
  `)
})
