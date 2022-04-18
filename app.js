document.addEventListener('DOMContentLoaded', () =>{

    let lastY = 1;
    document.addEventListener("touchmove", function (event) {
        let lastS = document.documentElement.scrollTop;
        if(lastS === 0 && (lastY-event.touches[0].clientY)<0 && event.cancelable){
            event.preventDefault();
            event.stopPropagation();
        }
        lastY = event.touches[0].clientY;
    },{passive: false});

    // window.addEventListener(
    //     "touchmove",
    //     function(event) {
    //         if (event.scale !== 1) {
    //             event.preventDefault();
    //         }
    //     },
    //     { passive: false }
    // );



    const grid = document.querySelector('.grid')
    const popup = document.querySelector('.popup')
    const popupText = document.querySelector('.popup__text')
    const popupImg = document.querySelector('.popup__img')
    const btnPopupClose = document.querySelector('.close__btn')
    let width
    let height
    let squares = []
    let score = 0
    const scoreDisplay = document.getElementById('score')
    const timeDisplay = document.getElementById('timer')
    const timeBoard = document.querySelector('.timer__board')
    const movesBoard = document.querySelector('.moves__board')
    const movesDisplay = document.getElementById('moves')
    const statistics = document.querySelector('.statistics')
    const context = document.querySelector('.context')
    const restartBtn = document.querySelector('.context__btn--restart')
    const mapBtn = document.querySelector('.context__btn--map')
    const aimDisplay = document.querySelector('#score__aim')
    const contextTitle = document.querySelector('.context__title')
    const destroyed = document.querySelector('.destroyed')
    const imgItem = document.querySelector('.img__items-box')
    const scoreImg = document.querySelector('.score__img')
    const scoreImgAim = document.querySelector('.score__item')
    const scoreAim = document.querySelector('.score__item-aim')
    const mixUpBtn = document.querySelector('.mix-up')
    const surrenderBtn = document.querySelector('.surrender')
    const menuButtons = document.querySelector('.menu__btn-box')
    let killer = 0
    let killerGlobal = 0
    let isBay = false
    let isDron = false
    const levelOne = document.createElement('button')
    const levelTwo = document.createElement('button')
    const levelThree = document.createElement('button')
    const levelFour = document.createElement('button')
    const levelFive = document.createElement('button')
    const map = document.querySelector('.map')
    levelOne.classList.add('level__one')
    levelOne.textContent = '1'
    levelTwo.classList.add('level__two')
    levelTwo.textContent = '2'
    levelThree.classList.add('level__three')
    levelThree.textContent = '3'
    levelFour.classList.add('level__four')
    levelFour.textContent = '4'
    levelFive.classList.add('level__five')
    levelFive.textContent = '5'
    createLevel(levelOne)
    createLevel(levelTwo)
    createLevel(levelThree)
    createLevel(levelFour)
    createLevel(levelFive)
    levelOne.style.display = "block"
    let timerId
    let timerIdDecrease = null
    let currentTime
    let currentLevel = 1
    let currentLevelUnlock = 1
    let aim
    let tankCounter = 0
    let helicopterCounter = 0
    let planeCounter = 0
    let rocketCounter = 0
    let hailCounter = 0
    let howitzerCounter = 0
    let tankAim = 0
    let borderedCounter = 0
    let borderedAll = 0
    let squaresDisabled = []
    let unDisabledSquares = []
    let isPlaying = false
    let isMoves = false
    let isTime = false
    let currentMoves = 0
    let currentTanks = 0
    let currentHelicopters = 0
    let currentRockets = 0
    let currentHails = 0
    let currentHowitzers = 0
    let currentPlanes = 0
    let currentBay = 0
    let currentDron = 0
    let detect
    let leftPosition
    let topPosition
    const mobileCursor = document.createElement('div')
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        detect = true
        mobileCursor.classList.add('mobile__cursor')
        mobileCursor.style.opacity = '0'
        grid.appendChild(mobileCursor)
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            let now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
    else {
        mobileCursor.style.display = 'none'
        detect = false
    }


    const militaryEquipment = [
        'plane',
        'tank',
        'hail',
        'helicopter',
        'rocket',
        'howitzer'
    ]


    function timeLevel(){
        isMoves = false
        isTime = true
        timeBoard.style.display = 'flex'
        movesBoard.style.display = 'none'
        timeDisplay.textContent = currentTime + 'c'
        mixUpBtn.textContent = 'Перемішати(коштує 20 секунд)'
    }
    function timeMoveLvl() {
        isTime = true
        timeBoard.style.display = 'flex'
        timeDisplay.textContent = currentTime + 'c'
        isMoves = true
        movesBoard.style.display = 'flex'
        movesDisplay.textContent = currentMoves
        mixUpBtn.textContent = 'Перемішати(коштує 20 секунд та 5 ходів)'
    }

    function moveLevel(){
        isMoves = true
        isTime = false
        timeBoard.style.display = 'none'
        movesBoard.style.display = 'flex'
        movesDisplay.textContent = currentMoves
        mixUpBtn.textContent = 'Перемішати(коштує 5 ходів)'
    }

    function getNull(){
        tankCounter = 0
        helicopterCounter = 0
        planeCounter = 0
        rocketCounter = 0
        hailCounter = 0
        howitzerCounter = 0
        score = 0
        borderedCounter = 0
        tankAim = 0
        borderedAll = 0
        currentMoves = 0
        squareIdBeingDragged = null
        squareIdBeingReplaced = null
        classBeingDragged = null
        classBeingReplaced = null
        isPlaying = false
        grid.classList.add('inactive')
    }


    function createLevel(level){
        level.classList.add('level')
        level.style.display = "none"
        // level.style.display = "block"
        map.appendChild(level)
    }


    levelOne.addEventListener('click', levelOneStart)
    levelTwo.addEventListener('click', levelTwoStart)
    levelThree.addEventListener('click', levelThreeStart)
    levelFour.addEventListener('click', levelFourStart)
    levelFive.addEventListener('click', levelFiveStart)




    function deleteOthers(){
        map.style.display = 'none'
        score = 0
        context.style.display = 'none'
        statistics.style.display = 'flex'
        scoreDisplay.textContent = 0
        scoreImgAim.style.color = "#000"
        aimDisplay.textContent = aim
        for (let i = 0; i < squares.length; i++){
            squares[i].remove()
        }
        for (let i = 0; i < unDisabledSquares.length; i++){
            unDisabledSquares[i].remove()
        }
        squares = []
        unDisabledSquares = []
    }
    function levelOneStart() {
        width = 8
        height = 8
        currentTime = 250
        timeLevel()
        aim = 20
        deleteOthers()
        currentLevel = 1
        imgItem.style.display = "none"
        setTimeout(startGame, 10)
    }
    function levelTwoStart() {
        width = 10
        height = 8
        currentTime = 220
        timeLevel()
        aim = 20
        deleteOthers()
        tankAim = 5
        currentLevel = 2
        imgItem.style.display = "flex"
        scoreImg.classList.add('tank')
        scoreImgAim.textContent = tankCounter
        scoreAim.textContent = tankAim
        setTimeout(startGame, 10)
    }
    function levelThreeStart() {
        width = 8
        height = 10
        currentTime = 150
        timeLevel()
        aim = 200
        currentLevel = 3
        deleteOthers()
        borderedLevel()
        setTimeout(startGame, 10)
        setTimeout(createBordered, 20)
    }
    function levelFourStart(){
        height = 9
        width = 9
        currentMoves = 10
        aim = 160
        moveLevel()
        currentLevel = 4
        deleteOthers()
        borderedLevel()
        squaresDisabled = [0,1,2,3,5,6,7,8,9,10,11,15,16,17,18,19,25,26,27,35,45,53,54,55,61,62,63,64,65,69,70,71,72,73,74,75,77,78,79,80]
        setTimeout(startGame, 10)
        setTimeout(disabledSquares, 20)
        setTimeout(createBordered, 30)
    }

    function levelFiveStart() {
        height = 9
        width = 11
        currentMoves = 10
        currentTime = 150
        aim = 130
        timeMoveLvl()
        currentLevel = 5
        deleteOthers()
        borderedLevel()
        squaresDisabled = [0,1,2,3,4,6,7,8,9,10,11,12,13,14,15,17,18,19,20,21,22,23,24,25,26,28,29,30,31,32,55,65,66,67, 75,76,77,78,79,85,86,87,88,89,90,91,95,96,97,98]
        startGame()
        disabledSquares()
        createBordered()
    }

    function disabledSquares(){
        for (let i = 0; i < squares.length; i++){
            if (squaresDisabled.includes(i)){
                squares[i].setAttribute('data-disabled', 'true')
            }
        }
    }




    function borderedLevel(){
        imgItem.style.display = "flex"
        scoreImg.classList.remove('tank')
        scoreImg.classList.add('bordered')
        scoreImgAim.textContent = borderedCounter
    }

    function createBordered(){
        for (let i = 0; i < squares.length; i++){
            if (!squares[i].hasAttribute('data-disabled')){
                borderedAll++
                squares[i].setAttribute('data-bordered', true)
            }
        }
        scoreAim.textContent = borderedAll
    }

    // const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55]
    // if (notValid.includes(i)) continue



    function startGame() {
        grid.style.height = height * 80 + 'px'
        grid.style.width = width * 80 + 'px'
        menuButtons.style.width = width * 80 + 'px'
        grid.style.display = 'flex'
        menuButtons.style.display = 'flex'
        grid.classList.add('inactive')
        mixUpBtn.setAttribute('disabled', 'disabled')
        timeDisplay.style.color = "#000"
        scoreDisplay.style.color = "#000"
        movesDisplay.style.color = '#000'
        createBoard()
        timerId = setInterval(checking, 100)
    }

    function createBoard() {
        for (let i = 0; i < width * height; i++){
            const square = document.createElement('div')
            square.setAttribute('id', i)
            let randomMilitary = Math.floor(Math.random() * militaryEquipment.length)
            square.classList.add(militaryEquipment[randomMilitary])
            if (!squaresDisabled.includes(i)){
                square.setAttribute('draggable', true)
                unDisabledSquares.push(square)
            }
            grid.appendChild(square)
            squares.push(square)
        }
        unDisabledSquares.forEach(square => square.addEventListener('dragstart', dragStart))
        unDisabledSquares.forEach(square => square.addEventListener('dragend', dragEnd))
        unDisabledSquares.forEach(square => square.addEventListener('dragover', dragOver))
        unDisabledSquares.forEach(square => square.addEventListener('dragenter', dragEnter))
        unDisabledSquares.forEach(square => square.addEventListener('dragleave', dragLeave))
        unDisabledSquares.forEach(square => square.addEventListener('drop', dragDrop))
        unDisabledSquares.forEach(square => square.addEventListener('click', ()=>{
           if (squareIdBeingDragged === null){
               if (killerGlobal === 0){
                   classBeingDragged = square.className
                   squareIdBeingDragged = parseInt(square.id)
                   killer = 0
               }
               else{
                   squareIdBeingReplaced = null
                   squareIdBeingDragged = null
                   classBeingReplaced = null
                   classBeingDragged = null
               }

           }
           else if (squareIdBeingDragged !== null){
               squareIdBeingReplaced = parseInt(square.id)
               if (squareIdBeingReplaced === squareIdBeingDragged){
                   squareIdBeingReplaced = null
                   squareIdBeingDragged = null
                   classBeingReplaced = null
                   classBeingDragged = null
               }
               else if (squareIdBeingReplaced !== squareIdBeingDragged){
                   classBeingReplaced = square.className

                   square.className = classBeingDragged
                   squares[squareIdBeingDragged].className = classBeingReplaced
                   dragEnd()
                   setTimeout(()=> {
                       if (killer === 0){
                           square.className = classBeingReplaced
                           squares[squareIdBeingDragged].className = classBeingDragged
                           if (isMoves === true){
                               currentMoves++
                           }
                       }
                       squareIdBeingDragged = null
                       squareIdBeingReplaced = null
                       classBeingReplaced = null
                       classBeingDragged = null
                   }, 151)
               }
           }
        }))


        if (detect === true){
            unDisabledSquares.forEach(square => square.addEventListener('touchstart',    function touchStart(){
                if (killerGlobal === 0){
                    classBeingDragged = square.className
                    squareIdBeingDragged = parseInt(square.id)
                    killer = 0
                }
                else{
                    squareIdBeingReplaced = null
                    squareIdBeingDragged = null
                    classBeingReplaced = null
                    classBeingDragged = null
                }
            }))
            unDisabledSquares.forEach(square => square.addEventListener('touchmove',    function touchStart(ev){
                let touchLocation = ev.targetTouches[0];
                leftPosition = touchLocation.pageX - 10-10
                topPosition = touchLocation.pageY - 92 - 5
                mobileCursor.style.left = leftPosition + 'px'
                mobileCursor.style.top = topPosition + 'px'
            }))


            unDisabledSquares.forEach(square => square.addEventListener('touchend', function touchEnd(){
                if (squareIdBeingDragged !== null) {
                    let currentPosition = 0
                    for (let i = 0; i < topPosition - 80; i += 80) {
                        currentPosition += width
                    }
                    for (let i = 0; i < leftPosition - 80; i += 80) {
                        currentPosition++
                    }
                    squareIdBeingReplaced = currentPosition
                    if (squareIdBeingReplaced === squareIdBeingDragged) {
                        squareIdBeingReplaced = null
                        squareIdBeingDragged = null
                        classBeingReplaced = null
                        classBeingDragged = null
                    } else {
                        classBeingReplaced = squares[squareIdBeingReplaced].className
                        squares[squareIdBeingReplaced].className = classBeingDragged
                        squares[squareIdBeingDragged].className = classBeingReplaced
                        dragEnd()
                        setTimeout(() => {
                            console.log(killer)
                            if (killer === 0) {
                                squares[squareIdBeingReplaced].className = classBeingReplaced
                                squares[squareIdBeingDragged].className = classBeingDragged
                                if (isMoves === true) {
                                    currentMoves++
                                }
                            }
                            squareIdBeingDragged = null
                            squareIdBeingReplaced = null
                            classBeingReplaced = null
                            classBeingDragged = null
                        }, 151)
                    }
                }
            }))

        }
    }






    surrenderBtn.addEventListener('click', function () {
        if (timerId !== null){
            clearInterval(timerId)
            timerId = null
        }
        if (timerIdDecrease !== null){
            clearInterval(timerIdDecrease)
            timerIdDecrease = null
        }
        getNull()
        mapExit()
    })


    mixUpBtn.addEventListener('click', function () {
        if (timerId === null){
            clearInterval(timerIdDecrease)
            timerIdDecrease = null
            for (let i = 0; i < unDisabledSquares.length; i++){
                unDisabledSquares[i].className = ''
            }
            for (let i = 0; i < currentHelicopters; i++){
                let change = Math.floor(Math.random() * unDisabledSquares.length)
                if (unDisabledSquares[change].className === ''){
                    unDisabledSquares[change].className = 'helicopter'
                }
                else{
                    i--
                }
            }
            for (let i = 0; i < currentHails; i++){
                let change = Math.floor(Math.random() * unDisabledSquares.length)
                if (unDisabledSquares[change].className === ''){
                    unDisabledSquares[change].className = 'hail'
                }
                else{
                    i--
                }
            }
            for (let i = 0; i < currentHowitzers; i++){
                let change = Math.floor(Math.random() * unDisabledSquares.length)
                if (unDisabledSquares[change].className === ''){
                    unDisabledSquares[change].className = 'howitzer'
                }
                else{
                    i--
                }
            }
            for (let i = 0; i < currentTanks; i++){
                let change = Math.floor(Math.random() * unDisabledSquares.length)
                if (unDisabledSquares[change].className === ''){
                    unDisabledSquares[change].className = 'tank'
                }
                else{
                    i--
                }
            }
            for (let i = 0; i < currentRockets; i++){
                let change = Math.floor(Math.random() * unDisabledSquares.length)
                if (unDisabledSquares[change].className === ''){
                    unDisabledSquares[change].className = 'rocket'
                }
                else{
                    i--
                }
            }
            for (let i = 0; i < currentPlanes; i++){
                let change = Math.floor(Math.random() * unDisabledSquares.length)
                if (unDisabledSquares[change].className === ''){
                    unDisabledSquares[change].className = 'plane'
                }
                else{
                    i--
                }
            }
            for (let i = 0; i < currentBay; i++){
                let change = Math.floor(Math.random() * unDisabledSquares.length)
                if (unDisabledSquares[change].className === ''){
                    unDisabledSquares[change].className = 'bayraktar'
                }
                else{
                    i--
                }
            }
            for (let i = 0; i < currentDron; i++){
                let change = Math.floor(Math.random() * unDisabledSquares.length)
                if (unDisabledSquares[change].className === ''){
                    unDisabledSquares[change].className = 'dron'
                }
                else{
                    i--
                }
            }
            if (isMoves === true && isTime === false){
                if (currentMoves < 5){
                    currentMoves = 1
                }
                else{
                    currentMoves -= 4
                }
                movesDisplay.textContent = (currentMoves - 1)
                moveDecrease()

            }
            else if (isMoves === false && isTime === true){
                currentTime -= 20
                timeDisplay.textContent = currentTime + 'c'
                if (currentTime < 20){
                    currentTime = 1
                }
                else{
                    currentTime -= 20
                }
                timeDisplay.textContent = currentTime + 'c'
            }
            else  if (isMoves === true && isTime === true){
                if (currentMoves < 5){
                    currentMoves = 1
                }
                else{
                    currentMoves -= 4
                }
                movesDisplay.textContent = (currentMoves - 1)
                moveDecrease()
                if (currentTime < 20){
                    currentTime = 0
                }
                else{
                    currentTime -= 20
                }
                timeDisplay.textContent = currentTime + 'c'
            }
            setTimeout(()=>{
                timerId = setInterval(checking, 100)
                if (timerIdDecrease === null && isTime === true){
                    timerIdDecrease = setInterval(timeDecrease, 1000)
                }
                mixUpBtn.setAttribute('disabled', 'disabled')
                setTimeout(()=>   mixUpBtn.removeAttribute('disabled'), 2000)
            }, 100)
        }
    })

    let classBeingDragged
    let classBeingReplaced
    let squareIdBeingDragged = null
    let squareIdBeingReplaced = null




    function dragStart() {
        if (killerGlobal === 0){
            classBeingDragged = this.className
            squareIdBeingDragged = parseInt(this.id)
            killer = 0
        }
        else{
            squareIdBeingReplaced = null
            squareIdBeingDragged = null
        }
    }

    function dragOver(e) {
        e.preventDefault()
    }
    function dragEnter(e) {
        e.preventDefault()
    }
    function dragLeave() {
        // this.className = ''
    }
    function dragDrop(){
        if (squareIdBeingDragged !== null){
            classBeingReplaced = this.className
            squareIdBeingReplaced = parseInt(this.id)
            // if (classBeingDragged === 'bayraktar' && squareIdBeingReplaced === squareIdBeingDragged){
            //
            // }
            this.className = classBeingDragged
            squares[squareIdBeingDragged].className = classBeingReplaced
            setTimeout(()=> {
                if (killer === 0){
                    this.className = classBeingReplaced
                    squares[squareIdBeingDragged].className = classBeingDragged
                    if (isMoves === true){
                        currentMoves++
                    }
                }
                squareIdBeingReplaced = null
                squareIdBeingDragged = null
                classBeingReplaced = null
                classBeingDragged = null
            }, 151)
        }
    }


    function moveDecrease(){
        if (isMoves === true){
            currentMoves--
            setTimeout(()=> {
                movesDisplay.textContent = currentMoves
                if (currentMoves === 0){
                    movesDisplay.style.color = 'red'
                    let timerIdMoves = setInterval(()=>{
                        if (timerId === null){
                            clearInterval(timerIdMoves)
                            lose()
                        }
                    }, 10)
                }
            }, 160)
        }
    }

    function dragEnd() {
        if (squareIdBeingDragged !== null && squareIdBeingReplaced !== null) {

            let validMoves = [squareIdBeingDragged - 1,
                squareIdBeingDragged - width,
                squareIdBeingDragged + 1,
                squareIdBeingDragged + width
            ]
            let validMove = validMoves.includes(squareIdBeingReplaced)
            if (timerId === null) {
                timerId = setInterval(checking, 100)
            }
            if (classBeingDragged === 'dron' && validMove) {
                killer++
                squares[squareIdBeingReplaced].className = ''
                for (let i = 0; i < squares.length; i++) {
                    if (squares[i].className === classBeingReplaced && !squares[i].hasAttribute('data-disabled')) {
                        militaryNumbers(i)
                        squares[i].className = ''
                        score++
                        scoreDisplay.textContent = score
                    }
                }
            }
            if (classBeingReplaced === 'dron' && validMove) {
                killer++
                squares[squareIdBeingDragged].className = ''
                for (let i = 0; i < squares.length; i++) {
                    if (squares[i].className === classBeingDragged && !squares[i].hasAttribute('data-disabled')) {
                        militaryNumbers(i)
                        squares[i].className = ''
                        score++
                        scoreDisplay.textContent = score
                    }
                }
            }
            if (classBeingDragged === "bayraktar" && classBeingReplaced === "bayraktar") {
                squares[squareIdBeingDragged].className = ''
                if (detect === true) {
                    squares[squareIdBeingDragged].oncontextmenu= null
                    squares[squareIdBeingReplaced].oncontextmenu = null
                }
                if (detect === false) {
                    squares[squareIdBeingDragged].ondblclick= null
                    squares[squareIdBeingReplaced].ondblclick = null
                }
                squares[squareIdBeingReplaced].className = ''
                let boomScore = 1
                killer++
                moveDecrease()
                if (squareIdBeingReplaced % width !== 0 && !squares[squareIdBeingReplaced - 1].hasAttribute('data-disabled')) {
                    militaryNumbers(squareIdBeingReplaced - 1)
                    squares[squareIdBeingReplaced - 1].className = ''
                    boomScore++
                }
                if ((squareIdBeingReplaced + 1) % width !== 0 && !squares[squareIdBeingReplaced + 1].hasAttribute('data-disabled')) {
                    militaryNumbers(squareIdBeingReplaced + 1)
                    squares[squareIdBeingReplaced + 1].className = ''
                    boomScore++
                }
                if (squareIdBeingReplaced < squares.length - width && !squares[squareIdBeingReplaced + width].hasAttribute('data-disabled')) {
                    militaryNumbers(squareIdBeingReplaced + width)
                    squares[squareIdBeingReplaced + width].className = ''
                    boomScore++
                }
                if (squareIdBeingReplaced >= width && !squares[squareIdBeingReplaced - width].hasAttribute('data-disabled')) {
                    militaryNumbers(squareIdBeingReplaced - width)
                    squares[squareIdBeingReplaced - width].className = ''
                    boomScore++
                }
                if (squareIdBeingReplaced < squares.length - width - 1 && (squareIdBeingReplaced + 1) % width !== 0 && !squares[squareIdBeingReplaced + width + 1].hasAttribute('data-disabled')) {
                    militaryNumbers(squareIdBeingReplaced + width + 1)
                    squares[squareIdBeingReplaced + width + 1].className = ''
                    boomScore++
                }
                if (squareIdBeingReplaced < squares.length - width + 1 && squareIdBeingReplaced % width !== 0 && !squares[squareIdBeingReplaced + width - 1].hasAttribute('data-disabled')) {
                    militaryNumbers(squareIdBeingReplaced + width - 1)
                    squares[squareIdBeingReplaced + width - 1].className = ''
                    boomScore++
                }
                if (squareIdBeingReplaced >= width + 1 && squareIdBeingReplaced % width !== 0 && !squares[squareIdBeingReplaced - width - 1].hasAttribute('data-disabled')) {
                    militaryNumbers(squareIdBeingReplaced - width -1)
                    squares[squareIdBeingReplaced - width - 1].className = ''
                    boomScore++
                }
                if (squareIdBeingReplaced >= width && (squareIdBeingReplaced + 1) % width !== 0 && !squares[squareIdBeingReplaced - width + 1].hasAttribute('data-disabled')) {
                    militaryNumbers(squareIdBeingReplaced - width + 1)
                    squares[squareIdBeingReplaced - width + 1].className = ''
                    boomScore++
                }
                score += boomScore
                scoreDisplay.textContent = score
            }
            if ((squareIdBeingReplaced && !validMove) || ((squareIdBeingReplaced + 1) % width === 0 && squareIdBeingDragged % width === 0) || ((squareIdBeingDragged + 1) % width === 0 && squareIdBeingReplaced % width === 0)) {
                squares[squareIdBeingReplaced].className = classBeingReplaced
                squares[squareIdBeingDragged].className = classBeingDragged
            }
            else if (squareIdBeingReplaced && validMove) {
                // squareIdBeingReplaced = null
                moveDecrease()
            }
            else squares[squareIdBeingDragged].className = classBeingDragged
        }
    }




    function moveDown() {
        killerGlobal = 0
        for (let i = 0; i < width*height - width; i++){
            if (squares[i + width].className === ''){
                killerGlobal++
                squares[i + width].className = squares[i].className
                squares[i].className = ''
                const firstRow = [0, 1,2,3,4,5,6,7]
                const isFirstRow = firstRow.includes(i)
                if (isFirstRow && squares[i].className === ""){
                    let randomColor = Math.floor(Math.random() * militaryEquipment.length)
                    squares[i].className = militaryEquipment[randomColor]
                }
            }
        }
    }

    function checkForSpace() {
        for (let i = 0; i < width; i++){
            if (squares[i].className === ""){
                killerGlobal++
                let randomColor = Math.floor(Math.random() * militaryEquipment.length)
                squares[i].className = militaryEquipment[randomColor]
            }
        }
    }



    function checkColumnForFive() {
        for (let i = 0; i< width*height - width*4; i++){
            let columnOfFive = [i, i+width, i+width*2, i+width*3, i+width*4]
            let decidedClass = squares[i].className
            const isBlank = squares[i].className === ''

            if (squares[i].hasAttribute('data-disabled')){
                if (squares[i].getAttribute('data-disabled') === 'true'){
                    continue
                }
            }
            if (squares[i+width].hasAttribute('data-disabled')){
                if (squares[i+width].getAttribute('data-disabled') === 'true'){
                    continue
                }
            }
            if (squares[i+width*2].hasAttribute('data-disabled')){
                if (squares[i+width*2].getAttribute('data-disabled') === 'true'){
                    continue
                }
            }
            if (squares[i+width*3].hasAttribute('data-disabled')){
                if (squares[i+width*3].getAttribute('data-disabled') === 'true'){
                    continue
                }
            }
            if (squares[i+width*4].hasAttribute('data-disabled')){
                if (squares[i+width*4].getAttribute('data-disabled') === 'true'){
                    continue
                }
            }

            if (columnOfFive.every(index => squares[index].className === decidedClass && !isBlank)){
                killer++
                if (isPlaying === true) {
                    score += 5
                    scoreDisplay.textContent = score
                }
                scoreDisplay.textContent = score
                killerGlobal++
                let indexLast
                columnOfFive.forEach(index => {
                    militaryNumbers(index)
                    squares[index].className = ''
                    indexLast = index
                })
                createColorBoom(indexLast)
            }

        }
    }

    function checkRowForFive() {
        for (let i = 0; i< width*height - 4; i++){
            let rowOfFive = [i, i+1, i+2, i+3, i+4]
            let decidedClass = squares[i].className
            const isBlank = squares[i].className === ''

          if ((i+4) % width === 0 || (i+3) % width === 0 || (i+2) % width === 0 || (i+1) % width === 0) continue

            if (squares[i].hasAttribute('data-disabled')){
                if (squares[i].getAttribute('data-disabled') === 'true'){
                    continue
                }
            }
            if (squares[i+1].hasAttribute('data-disabled')){
                if (squares[i+1].getAttribute('data-disabled') === 'true'){
                    continue
                }
            }
            if (squares[i+2].hasAttribute('data-disabled')){
                if (squares[i+2].getAttribute('data-disabled') === 'true'){
                    continue
                }
            }
            if (squares[i+3].hasAttribute('data-disabled')){
                if (squares[i+3].getAttribute('data-disabled') === 'true'){
                    continue
                }
            }
            if (squares[i+4].hasAttribute('data-disabled')){
                if (squares[i+4].getAttribute('data-disabled') === 'true'){
                    continue
                }
            }

            if (rowOfFive.every(index => squares[index].className === decidedClass && !isBlank)){
                if (isPlaying === true) {
                    score += 5
                    scoreDisplay.textContent = score
                }
                killer++
                scoreDisplay.textContent = score
                let indexLast
                killerGlobal++
                rowOfFive.forEach(index => {
                    militaryNumbers(index)
                    squares[index].className = ''
                    indexLast = index
                })
                createColorBoom(indexLast)
            }

        }
    }





    function checkRowForFour() {
        for (let i = 0; i< width*height - 3; i++){
            let rowOfFour = [i, i+1, i+2, i+3]
            let decidedClass = squares[i].className
            const isBlank = squares[i].className === ''


            if ((i+3) % width === 0 || (i+2) % width === 0 || (i+1) % width === 0) continue
            if (squares[i].hasAttribute('data-disabled')){
                if (squares[i].getAttribute('data-disabled') === 'true'){
                    continue
                }
            }
            if (squares[i+1].hasAttribute('data-disabled')){
                if (squares[i+1].getAttribute('data-disabled') === 'true'){
                    continue
                }
            }
            if (squares[i+2].hasAttribute('data-disabled')){
                if (squares[i+2].getAttribute('data-disabled') === 'true'){
                    continue
                }
            }
            if (squares[i+3].hasAttribute('data-disabled')){
                if (squares[i+3].getAttribute('data-disabled') === 'true'){
                    continue
                }
            }
            if (rowOfFour.every(index => squares[index].className === decidedClass && !isBlank)){
                if (isPlaying === true) {
                    score += 4
                    scoreDisplay.textContent = score
                }
                killer++
                scoreDisplay.textContent = score
                let indexLast
                killerGlobal++
                rowOfFour.forEach(index => {
                    militaryNumbers(index)
                    squares[index].className = ''
                    indexLast = index
                })
                createBoomSmall(indexLast)
            }

        }
    }


    function checkColumnForFour() {
        for (let i = 0; i< width*height - width*3; i++){
            let columnOfFour = [i, i+width, i+width*2, i+width*3]
            let decidedClass = squares[i].className
            const isBlank = squares[i].className === ''

            if (squares[i].hasAttribute('data-disabled')){
                if (squares[i].getAttribute('data-disabled') === 'true'){
                    continue
                }
            }
            if (squares[i+width].hasAttribute('data-disabled')){
                if (squares[i+width].getAttribute('data-disabled') === 'true'){
                    continue
                }
            }
            if (squares[i+width*2].hasAttribute('data-disabled')){
                if (squares[i+width*2].getAttribute('data-disabled') === 'true'){
                    continue
                }
            }
            if (squares[i+width*3].hasAttribute('data-disabled')){
                if (squares[i+width*3].getAttribute('data-disabled') === 'true'){
                    continue
                }
            }


            if (columnOfFour.every(index => squares[index].className === decidedClass && !isBlank)){
                killer++
                if (isPlaying === true) {
                    score += 4
                    scoreDisplay.textContent = score
                }
                scoreDisplay.textContent = score
                let indexLast
                killerGlobal++
                columnOfFour.forEach(index => {
                    militaryNumbers(index)
                    squares[index].className = ''
                    indexLast = index
                })
                createBoomSmall(indexLast)
            }

        }
    }


function checkRowForThree() {
    for (let i = 0; i< width*height - 2; i++){
        let rowOfThree = [i, i+1, i+2]
        let decidedClass = squares[i].className
        const isBlank = squares[i].className === ''

        if ((i+2) % width === 0 || (i+1) % width === 0) continue
        if (squares[i].hasAttribute('data-disabled')){
            if (squares[i].getAttribute('data-disabled') === 'true'){
                continue
            }
        }
        if (squares[i+1].hasAttribute('data-disabled')){
            if (squares[i+1].getAttribute('data-disabled') === 'true'){
                continue
            }
        }
        if (squares[i+2].hasAttribute('data-disabled')){
            if (squares[i+2].getAttribute('data-disabled') === 'true'){
                continue
            }
        }

        if (rowOfThree.every(index => squares[index].className === decidedClass && !isBlank)){
            killer++
            if (isPlaying === true) {
                score += 3
                scoreDisplay.textContent = score
            }
            killerGlobal++
            rowOfThree.forEach(index => {
                militaryNumbers(index)
                squares[index].className = ''
            })
        }

    }
}

    function checkColumnForThree() {
        for (let i = 0; i< width*height - width*2; i++){
            let columnOfThree = [i, i+width, i+width*2]
            let decidedClass = squares[i].className
            const isBlank = squares[i].className === ''

            if (squares[i].hasAttribute('data-disabled')){
                if (squares[i].getAttribute('data-disabled') === 'true'){
                    continue
                }
            }
            if (squares[i+width].hasAttribute('data-disabled')){
                if (squares[i+width].getAttribute('data-disabled') === 'true'){
                    continue
                }
            }
            if (squares[i+width*2].hasAttribute('data-disabled')){
                if (squares[i+width*2].getAttribute('data-disabled') === 'true'){
                    continue
                }
            }

            if (columnOfThree.every(index => squares[index].className === decidedClass && !isBlank)){
                killer++
                if (isPlaying === true) {
                    score += 3
                    scoreDisplay.textContent = score
                }
                killerGlobal++
                columnOfThree.forEach(index => {
                    militaryNumbers(index)
                    squares[index].className = ''
                })
            }

        }
    }


    function militaryNumbers(i){
        if (isPlaying === true) {

            if (squares[i].className === 'tank') {
                tankCounter++
                // currentTanks--
            }
            if (squares[i].className === 'plane') {
                planeCounter++
                // currentPlanes--
            }
            if (squares[i].className === 'hail') {
                hailCounter++
                // currentHails--
            }
            if (squares[i].className === 'helicopter') {
                helicopterCounter++
                // currentHelicopters--
            }
            if (squares[i].className === 'rocket') {
                rocketCounter++
                // currentRockets--
            }
            if (squares[i].className === 'howitzer') {
                howitzerCounter++
                // currentHowitzers--
            }
            if (tankAim !== 0) {
                scoreImgAim.textContent = tankCounter
            }
            if (squares[i].hasAttribute('data-bordered')) {
                if (squares[i].getAttribute('data-bordered') === 'true') {
                    squares[i].setAttribute('data-bordered', false)
                    borderedCounter++
                }
            }
            if (borderedAll !== 0) {
                scoreImgAim.textContent = borderedCounter
            }
        }
    }

    function scoreChecking() {
        if (score >= aim){
            scoreDisplay.style.color = "green"
        }
        if (tankCounter >= tankAim && tankAim !== 0){
            scoreImgAim.style.color = "green"
        }
        if (borderedCounter >= borderedAll && borderedAll !== 0){
            scoreImgAim.style.color = "green"
        }
        if (score >= aim && tankCounter >= tankAim && borderedCounter >= borderedAll){
            win()
        }
    }


        function win() {
        if (currentLevel === currentLevelUnlock){
            if (currentLevelUnlock === 1){
                levelOne.classList.add('completed')
                levelTwo.style.display = 'block'
            }
            if (currentLevelUnlock === 2){
                levelTwo.classList.add('completed')
                levelThree.style.display = 'block'
            }
            if (currentLevelUnlock === 3){
                levelThree.classList.add('completed')
                levelFour.style.display = 'block'
            }
            if (currentLevelUnlock === 4){
                levelFour.classList.add('completed')
                levelFive.style.display = 'block'
            }
            currentLevelUnlock++
        }
            if (timerIdDecrease !== null){
                clearInterval(timerIdDecrease)
                timerIdDecrease = null
            }
            context.style.display = 'block'
            contextTitle.textContent = "Вітаю! Ви виграли!"
            restartBtn.textContent = 'Пройти знову'
            mapBtn.textContent = "далі"
            let timerIdInside = setInterval(() =>{
                if (timerId === null){
                    getNull()
                    clearInterval(timerId)
                    clearInterval(timerIdInside)
                }
            }, 100)

        }



    function checking() {
         moveDown()
         checkRowForFive()
         checkColumnForFive()
         checkColumnForFour()
         checkRowForFour()
         checkRowForThree()
         checkColumnForThree()
         checkForSpace()
         boomChecking()
         scoreChecking()
         squaresChecking()
         if (killerGlobal === 0){
             if (isPlaying === false){
                 isPlaying = true
                 grid.classList.remove('inactive')
                 mixUpBtn.removeAttribute('disabled')
                 if (timerIdDecrease === null && isTime === true){
                     timerIdDecrease = setInterval(timeDecrease, 1000)
                 }
             }
             clearInterval(timerId)
             timerId = null
         }
    }


function squaresChecking() {
    currentHowitzers = 0
    currentTanks = 0
    currentHails = 0
    currentHelicopters = 0
    currentPlanes = 0
    currentRockets = 0
    currentBay = 0
    currentDron = 0
    unDisabledSquares.forEach(square => {
        if (square.className === 'tank') {
            currentTanks++
        }
        if (square.className === 'plane') {
            currentPlanes++
        }
        if (square.className === 'hail') {
            currentHails++
        }
        if (square.className === 'helicopter') {
            currentHelicopters++
        }
        if (square.className === 'rocket') {
            currentRockets++
        }
        if (square.className === 'howitzer') {
            currentHowitzers++
        }
        if (square.className === 'bayraktar') {
            currentBay++
        }
        if (square.className === 'dron') {
            currentDron++
        }
    })
}


    function createBoomSmall(index) {
        if (isPlaying === true) {
            squares[index].className = 'bayraktar'
            if (isBay === false) {
                if (detect === true){
                    popupText.textContent = "Це - Байрактар при довгому кліку на нього він підриває ворожу техніку, що знаходиться поряд"
                }
                if (detect === false){
                    popupText.textContent = "Це - Байрактар при двойному кліку на нього він підриває ворожу техніку, що знаходиться поряд"
                }
                popupImg.setAttribute('src', "img/bayractar.jpg")
                popup.style.display = "block"
                isBay = true
                clearInterval(timerIdDecrease)
                timerIdDecrease = null
            }
        }
    }




    function createColorBoom(index){
        if (isPlaying === true) {
            squares[index].className = 'dron'
            if (isDron === false) {
                popupText.textContent = "Це - Дрон-камікадзе, якщо його навести на певний вид ворожої техніки, він знищить її в полі зору"
                popupImg.setAttribute('src', "img/dron.png")
                popup.style.display = "block"
                isDron = true
                clearInterval(timerIdDecrease)
                timerIdDecrease = null
            }
        }
    }




function boomChecking() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].className === 'bayraktar') {
                squares[i].setAttribute('draggable', false)
                if (detect === true) {
                    squares[i].oncontextmenu = function (boom) {
                            let boomScore = 1
                            if (timerId === null) {
                                timerId = setInterval(checking, 100)
                            }
                            killerGlobal++
                            squares[i].className = ''
                            squares[i].oncontextmenu = null
                            if (i % width !== 0 && !squares[i - 1].hasAttribute('data-disabled')) {
                                militaryNumbers(i - 1)
                                squares[i - 1].className = ''
                                boomScore++
                            }
                            if ((i + 1) % width !== 0 && !squares[i + 1].hasAttribute('data-disabled')) {
                                militaryNumbers(i + 1)
                                squares[i + 1].className = ''
                                boomScore++
                            }
                            if (i < squares.length - width && !squares[i + width].hasAttribute('data-disabled')) {
                                militaryNumbers(i + width)
                                squares[i + width].className = ''
                                boomScore++
                            }
                            if (i >= width && !squares[i - width].hasAttribute('data-disabled')) {
                                militaryNumbers(i - width)
                                squares[i - width].className = ''
                                boomScore++
                            }
                            score += boomScore
                            scoreDisplay.textContent = score
                        }
                }
                if (detect === false) {
                    squares[i].ondblclick = function (boom) {
                        let boomScore = 1
                        if (timerId === null) {
                            timerId = setInterval(checking, 100)
                        }
                        killerGlobal++
                        squares[i].className = ''
                        squares[i].ondblclick = null
                        if (i % width !== 0 && !squares[i - 1].hasAttribute('data-disabled')) {
                            militaryNumbers(i - 1)
                            squares[i - 1].className = ''
                            boomScore++
                        }
                        if ((i + 1) % width !== 0 && !squares[i + 1].hasAttribute('data-disabled')) {
                            militaryNumbers(i + 1)
                            squares[i + 1].className = ''
                            boomScore++
                        }
                        if (i < squares.length - width && !squares[i + width].hasAttribute('data-disabled')) {
                            militaryNumbers(i + width)
                            squares[i + width].className = ''
                            boomScore++
                        }
                        if (i >= width && !squares[i - width].hasAttribute('data-disabled')) {
                            militaryNumbers(i - width)
                            squares[i - width].className = ''
                            boomScore++
                        }
                        squares[i].className = ''
                        squareIdBeingDragged = null
                        squareIdBeingReplaced = null
                        classBeingDragged = null
                        classBeingReplaced = null
                        score += boomScore
                        scoreDisplay.textContent = score
                    }

                }
            }
            if (squares[i].className !== 'bayraktar') {
                console.log('bay')
               if (detect === true) {
                  squares[i].oncontextmenu = null
               }
               if (detect === false) {
                  squares[i].ondblclick = null
               }
               squares[i].setAttribute('draggable', true)
            }
        }
}


function timeDecrease(){
    currentTime--
    timeDisplay.textContent = currentTime + 'c'
    if (currentTime <= 0){
        timeDisplay.style.color = "red"
        lose()
    }
}

function lose(){
    if (timerId !== null){
        clearInterval(timerId)
        timerId = null
    }
    if (timerIdDecrease !== null){
        clearInterval(timerIdDecrease)
        timerIdDecrease = null
    }
    getNull()
    context.style.display = 'block'
    contextTitle.textContent = "На жаль, ви програли"
    restartBtn.textContent = 'Спробувати знову'
    mapBtn.textContent = "на мапу"
}


    restartBtn.addEventListener('click', restartGame)

    mapBtn.addEventListener('click', mapExit)

    function mapExit() {
        statistics.style.display = "none"
        menuButtons.style.display = 'none'
        grid.style.display = "none"
        map.style.display = "block"
        context.style.display = "none"
    }

    function restartGame(){
        if (currentLevel === 1){
            levelOneStart()
        }
        if (currentLevel === 2){
            levelTwoStart()
        }
        if (currentLevel === 3){
            levelThreeStart()
        }
        if (currentLevel === 4){
            levelFourStart()
        }
        if (currentLevel === 5){
            levelFiveStart()
        }
    }

    btnPopupClose.addEventListener('click', () => {
        popup.style.display = 'none'
        if (timerIdDecrease === null && isTime === true && isPlaying === true){
            timerIdDecrease = setInterval(timeDecrease, 1000)
        }
    })


















})