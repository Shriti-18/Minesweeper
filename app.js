$url: "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
document.addEventListener('DOMContentLoaded',()=>{
    const grid=document.querySelector('.grid')
    var resetButton=document.querySelector("#reset");
    var modeButtons=document.querySelectorAll(".mode");
    var messageDisplay=document.querySelector("#message");

    
    let width=10;
    let squares=[]
    var bombAmount=20;
    let flags=0;
    let isGameOver=false
    //create Board;
    init()
    function init(){
        setupModeButtons();
        createBoard()
        reset();
    }
    resetButton.addEventListener("click",function(){
         reset();
    })

    function reset(){
        isGameOver=false;
        messageDisplay.textContent="";
        resetButton.textContent="New Board";
        grid.innerHTML = '';
        flags=0;
        while(squares.length > 0) {
            squares.pop();
        }
	    createBoard();	
    }



    function createBoard(){
        console.log(bombAmount);
      
        //get shuffled game array with random bombs
        let bombsArray = Array(bombAmount).fill('bomb')
        let emptyArray= Array(width*width-bombAmount).fill('valid')
        let gameArray=emptyArray.concat(bombsArray);
        let shuffledArray=gameArray.sort(()=>Math.random()-0.5)
        console.log(shuffledArray);
        
        
        for(let i=0;i<width*width;i++){
            const square=document.createElement('div')
            square.setAttribute('id',i)
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square)
            squares.push(square)

            //normal click
            square.addEventListener('click',function(e){
                    click(square)
            })

            //cntrl and left click
            square.oncontextmenu=function(e){
                e.preventDefault()
                addFlag(square)
            }
        }

        //add numbers
        for(let i=0;i<squares.length;i++){
            let total=0;
            const isLeftEdge=(i%width===0);
            const isRightEdge=(i%width===width-1);

            if(squares[i].classList.contains('valid')){
                if(i>0 && !isLeftEdge && squares[i-1].classList.contains('bomb'))total++;//checking on left
                if(i>9 && !isRightEdge && squares[i+1-width].classList.contains('bomb'))total++; //checking on up
                if(i>9 && squares[i-width].classList.contains('bomb'))total++;
                if(i>10 && !isLeftEdge && squares[i-1-width].classList.contains('bomb'))total++;
                if(i<99 && !isRightEdge && squares[i+1].classList.contains('bomb'))total++;
                if(i<90 && !isLeftEdge && squares[i-1+width].classList.contains('bomb'))total++;
                if(i<89 && !isRightEdge && squares[i+1+width].classList.contains('bomb'))total++;
                if(i<90 && squares[i+width].classList.contains('bomb'))total++;
                squares[i].setAttribute('data',total);

            }
        }
    }

   
    function setupModeButtons(){

        //mode button event listener
        for(var i=0;i<modeButtons.length;i++){
        modeButtons[i].addEventListener("click",function(){
            modeButtons[0].classList.remove("selected");
            modeButtons[1].classList.remove("selected");
            this.classList.add("selected");
            this.textContent==="Easy"?bombAmount=10 : bombAmount=20;
            reset();
        })
    }	
    }
   
    

    function addFlag(square){
        console.log(flags);
        if(isGameOver) return
        if(!square.classList.contains('checked') && flags<bombAmount)
        {
            if(!square.classList.contains('flag')){
                square.classList.add('flag')
                square.innerHTML='<span style="font-size:20px;color:#FFFF33 "><i class="fa fa-flag"></i></span>'
                flags++
                checkForWin()
            }
            else{
                square.classList.remove('flag')
                square.innerHTML('')
                flags--
            }
        }
    }
    //click on square actions 

    function click(square){
        console.log('clicked');
        let currentId=square.getAttribute('id')
       console.log(currentId);
       if(square.classList.contains('checked')|| square.classList.contains('flag'))return
       if(square.classList.contains('bomb')){
         gameOver(square)
         return
       }
       else{
           let total=square.getAttribute('data')
           if(total!=0){
           square.classList.add('checked')
           square.innerHTML=total
           return
           }
           checkSquare(square,currentId)
       }
       square.classList.add('checked')
    }

    //check neighbouring squares once square is clicked
    function checkSquare(square,currentId){
        const isLeftEdge=(parseInt(currentId)%width===0);
        const isRightEdge=(parseInt(currentId)%width===width-1);

        setTimeout(()=>{
            //
            if(currentId>0 && !isLeftEdge ){
                const newId= squares[parseInt(currentId)-1].getAttribute('id')
                const newSquare=document.getElementById(newId)
                click(newSquare);
            }
            if(currentId>9 && !isRightEdge){
                const newId= squares[parseInt(currentId)+1-width].getAttribute('id')
                const newSquare=document.getElementById(newId)
                click(newSquare);
            }
            if(currentId>9){
                const newId= squares[parseInt(currentId)-width].getAttribute('id')
                const newSquare=document.getElementById(newId)
                click(newSquare);
            }
            if(currentId>10 && !isLeftEdge){
                const newId= squares[parseInt(currentId)-1-width].getAttribute('id')
                const newSquare=document.getElementById(newId)
                click(newSquare);
            }
            if(currentId<99 && !isRightEdge){
                const newId= squares[parseInt(currentId)+1].getAttribute('id')
                const newSquare=document.getElementById(newId)
                click(newSquare);
            }
            if(currentId<90 && !isLeftEdge){
                const newId= squares[parseInt(currentId)-1+width].getAttribute('id')
                const newSquare=document.getElementById(newId)
                click(newSquare);
            }
            if(currentId<89 && !isRightEdge){
                const newId= squares[parseInt(currentId)+1+width].getAttribute('id')
                const newSquare=document.getElementById(newId)
                click(newSquare);
            }
            if(currentId<90){
                const newId= squares[parseInt(currentId)+width].getAttribute('id')
                const newSquare=document.getElementById(newId)
                click(newSquare);
            }
        },10)
    }

    //game over
    function gameOver(square){
        console.log('BOOM! Game Over !')
        resetButton.textContent="Play Again?";
        messageDisplay.textContent="YOU LOOSE!";
        isGameOver= true;
       
        squares.forEach(square=>{
            if(square.classList.contains('bomb')){
                square.innerHTML='<span style="font-size:20px;color:black"><i class="fa fa-bomb"></i></span>';
            }
        })
        // reset();
    }

    //check for win
    function checkForWin(){
        let matches=0
        for(let i=0;i<squares.length;i++){
            if(squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')){
                matches++
            }
            if(matches===bombAmount){
            console.log('YOU WIN');
            resetButton.textContent="Play Again?";
            messageDisplay.textContent="WIN!";
            isGameOver=true;
            }
        }
    }

})