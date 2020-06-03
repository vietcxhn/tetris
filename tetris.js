document.addEventListener('DOMContentLoaded', () => {
  const playbox = document.querySelectorAll('.grid div')
  const scoredisplay = document.querySelector('.score')
  const leveldisplay = document.querySelector('.level')
	const nextblockbox = document.querySelectorAll('.nextblocbox div')
	const startButton = document.querySelector('.start')
  
  const obloc = [
    [0, 1, 10, 11],
    [0, 1, 10, 11],
    [0, 1, 10, 11],
    [0, 1, 10, 11]
  ]
  const lbloc = [
    [0, 10, 20, 21],
    [2, 10, 11, 12],
    [0, 1, 11, 21],
    [0, 1, 2, 10]
  ]
  const lInversebloc = [
    [1, 11, 21, 20],
    [0, 1, 2, 12],
    [0, 1, 10, 20],
    [0, 10, 11, 12]
  ]
  const tbloc = [
    [1, 10, 11, 12],
    [1, 10, 11, 21],
    [10, 11, 12, 21],
    [0, 10, 11, 20]
  ]
  const longbloc = [
    [0, 10, 20, 30],
    [20, 21, 22, 23],
    [0, 10, 20, 30],
    [20, 21, 22, 23]
  ]  
  const zbloc = [
    [0, 1, 11, 12],
    [1, 10, 11, 20],
    [0, 1, 11, 12],
    [1, 10, 11, 20]
  ]
  const zInversebloc = [
    [1, 2, 10, 11],
    [0, 10, 11, 21],
    [1, 2, 10, 11],
    [0, 10, 11, 21]
  ]
  const allbloc = [obloc, lbloc, lInversebloc, tbloc, longbloc, zbloc, zInversebloc]
  const defaultpos = 4
  let score = 0
  let scoremltple = 1
  let level = 0
  scoredisplay.innerText = score
  leveldisplay.innerText = level
  let blockcount = 1
  let random = Math.floor(Math.random() * allbloc.length)
  let nextRandom = Math.floor(Math.random() * allbloc.length)
  let currentpos = 4
  let currentrot = 0
  let speeddown = 1000
  let currentbloc = []
  let interval

  function startgame(){

    clearInterval(interval)
    currentpos = 4
    random = nextRandom
    nextRandom = Math.floor(Math.random() * allbloc.length)
    displaynextblock()
    currentbloc = allbloc[random][currentrot]
    draw()
    interval = setInterval(movedown, speeddown)

  }
  
  startButton.addEventListener('click', startgame)

  function movedown() {
    undraw()
    currentpos = currentpos + 10
    const isblocked = currentbloc.some(index => playbox[currentpos + index].classList.contains('settled') || playbox[currentpos + index ].classList.contains('floor'))
    if(isblocked) {
      settleblock()
      scoring()
      newblock()
      level_speed_scoremltple()
      displaynextblock()
      endgame()
    }
    draw()
  }

  function moveLeft() {
    undraw()
    const isAtLeftEdge = currentbloc.some(index => (currentpos + index) % 10 === 0)
    if (!isAtLeftEdge) currentpos -= 1
    if (currentbloc.some(index => playbox[currentpos + index].classList.contains('settled'))) {
      currentpos += 1
    }
    draw()
  }

  function moveRight() {
    undraw()
    const isAtRightEdge = currentbloc.some(index => (currentpos + index) % 10 === 9)
    if (!isAtRightEdge) currentpos += 1
    if (currentbloc.some(index => playbox[currentpos + index].classList.contains('settled'))) {
      currentpos -= 1
    }
    draw()
  }

  function rotate() {
    undraw()
    currentrot++
    if (currentrot === currentbloc.length) {
      currentrot = 0
    }
    currentbloc = allbloc[random][currentrot]
    draw()
  }
  
  function undraw() {
    currentbloc.forEach(index => 
      playbox[currentpos + index].classList.remove('bloc')
    )}

  function draw() {
    currentbloc.forEach(index =>
      playbox[currentpos + index].classList.add('bloc')
    )}
  
  
  function control(e) {
    if (e.keyCode === 39)
      moveRight()
    else if (e.keyCode === 38)
      rotate()
    else if (e.keyCode === 37)
      moveLeft()
    else if (e.keyCode === 40)
      movedown()
  }
  
  document.addEventListener('keydown', control)
  
  function settleblock(){
    currentpos -= 10
    currentbloc.forEach(index => playbox[index + currentpos].classList.add('settled'))
  }

  function newblock(){
    currentrot = 0
    random = nextRandom
    nextRandom = Math.floor(Math.random() * allbloc.length)
    currentbloc = allbloc[random][currentrot]
    currentpos = defaultpos
  }

  function level_speed_scoremltple(){
    blockcount++
    if(blockcount === 10){
      blockcount=1
      level++
      leveldisplay.textContent = level
      clearInterval(interval)
      speeddown = speeddown * 0.9
      interval = setInterval(movedown, speeddown)
    }
    if (level<=1) {scoremltple = 1}
    else if (level<=3) {scoremltple = 2}
    else if (level<=5) {scoremltple = 3}
    else if (level<=7) {scoremltple = 4}
    else {scoremltple = 5}
  }

  function endgame() {
    if (currentbloc.some(index => playbox[currentpos + index].classList.contains('settled'))) {
      scoredisplay.innerHTML = 'end'
      clearInterval(interval)
    }
  }

  function scoring(){
    let line = 0
    for (let i = 0; i < 200; i += 10) {
      const eachrow = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
      if(eachrow.every(index => playbox[index].classList.contains('settled'))){
        line++
        eachrow.forEach(index => playbox[index].classList.remove('settled'))

        for (let j = i -1; j > 0; j--) {
          if(playbox[j].classList.contains('settled')){
            playbox[j].classList.remove('settled')
            playbox[j + 10].classList.add('settled')
          }
          
        }
      }
    }
    if(line!==0){
      if(line===1) {score += 100*scoremltple}
      if(line===2) {score += 400*scoremltple}
      if(line===3) {score += 900*scoremltple}
      if(line===4) {score += 2000*scoremltple}
      scoredisplay.textContent = score
    }
  }
  
  const nextblock = [
    [0, 1, 6, 7],
    [0, 6, 12, 13],
    [1, 7, 13, 12],
    [1, 6, 7, 8],
    [1, 7, 13, 19],
    [0, 1, 7, 8],
    [1, 2, 6, 7]
  ]

  function displaynextblock() {
    nextblockbox.forEach(index => {
      index.classList.remove('bloc')
    })
    nextblock[nextRandom].forEach(index => {
      nextblockbox[7 + index].classList.add('bloc')
    })
  }
})