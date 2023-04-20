const gameBoard = document.querySelector(".gameboard");
const scoreElement = document.querySelector(".score");
const HighScoreElement = document.querySelector(".high-score");
let gameOver = false;
let foodX = 13, foodY = 10;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;
//Getting High Sccore from Local Storage
let highscore = localStorage.getItem("high-score") || 0;
HighScoreElement.innerHTML = `High Score: ${highscore}`;

const changeFoodPosition = () => {
    //Passing a random value between 0-30 as the food posn
    //We take 30 as we divided the grid that way
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}


const handleGameOver = () => {
    //Clearing timer and reloading the page
    clearInterval(setIntervalId);
    alert("Game Over !...Press OK to restart");
    location.reload();
}

const changeDirection = (e) => {

    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX= 0;
        velocityY= -1;
    } 
    else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX= 0;
        velocityY= 1;
    } 
    else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX= -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX= 1;
        velocityY = 0;
    }

}

const initGame = () => {

    if(gameOver == true)
    {
        return handleGameOver();
    }

    let htmlMarkup = `<div class = "food" style = "grid-area: ${foodY} / ${foodX}"></div>`;

    //Checking if snake Ate food
    if(snakeX == foodX && snakeY == foodY)
    {
        changeFoodPosition();
        snakeBody.push([foodX,foodY]);// Pushing food position to snake body array
       
        //Updating Score and Highscore
        score += 50;
        highscore = (score >= highscore)? score: highscore; 
        localStorage.setItem("high-score", highscore);
        scoreElement.innerHTML = `Score: ${score}`;
        HighScoreElement.innerHTML = `High Score: ${highscore}`;
    }


    //Updating snake body posn....works like caterpillar
    //basicalling snake body is divided in segments and we are updating each segment posn
    //with that of the segment in front of it while moving the snake head posn forward as 
    //well....this basically moves all body segments in a linear order
    for(let i = snakeBody.length -1; i>0; i--)
    {
        snakeBody[i] = snakeBody[i-1];
    }

    //Initialising snake head
    snakeBody[0] = [snakeX, snakeY];

    //Updating Snake Head Position
    snakeX += velocityX;
    snakeY += velocityY;

    //Checking if snake hit the wall...if yes, then Game Over
    if(snakeX<=0 || snakeX>30 || snakeY<=0 || snakeY>30)
    {
        gameOver = true;
    }

    //Generating Body of snake
    for(let i =0; i<snakeBody.length; i++)
    {
        //grid is given by 'y coord/ x coord' thus 'snakeBody[i][1]/snakeBody[i][0]
        htmlMarkup += `<div class = "head" style = "grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        
        //Checking if snake hit its own body and if yes...GameOver
        if(i!==0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0])
        {
            gameOver = true;
        }
    }

    gameBoard.innerHTML = htmlMarkup;
}

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);

