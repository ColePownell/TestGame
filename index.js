
var canvas = document.getElementById("PLAYSPACE")
var canvasP = document.getElementById("PLAYERSPACE")
var canvasr = document.getElementById("OPP-R")
var canvasrm = document.getElementById("OPP-RM")
var canvaslm = document.getElementById("OPP-LM")
var canvasl = document.getElementById("OPP-L")
var startBtn = document.getElementById("start")
var PHP = document.getElementById("PLAYER-HP")
var OHP = document.getElementById("OPP-HP")
var ONAME = document.getElementById("OPP-NAME")
let ctxp = canvasP.getContext('2d');
let ctx = canvas.getContext('2d');
let ctxr = canvasr.getContext('2d');
let ctxrm = canvasrm.getContext('2d');
let ctxlm = canvaslm.getContext('2d');
let ctxl = canvasl.getContext('2d');
let playerHP = 30
let playerDmg = 4
let oppHP = 0
let tempArray = {}
let tempString = ""
let tempNum = 0
let end = false; // is the game over
let atkArray = {} // holds the arrays of cords of when attacks hit
var img = new Image();
var randNum = 0
let oppArray = {} // opp info array
let x = 102//temp used for making map img
let y = 100 //temp used for making map img
let canMove = true; // if the player has moved to recently
let canAtk = true;
let frame2 = false;
let oppLocation = 0; // opp canvas location 0-3
let oppID = 0; // index in json of opp
let plx = 612; //player location y
let ply = 300; //player location x
let pls = { // simple player location used for checking damage
    y: 4,
    x: 7
}
let atkInt = null // var for the attack loop
let aniInt = null // var for animation loop
let atkresInt = null // var for atk rest loop
let atkdmgInt = null // var for damage loop
var opp = [
    {   
    "name":"Worm",
    "hp":8,
    "dmg":2,
    "atks":2,
    "file1":"./Images/wormatk1.png",
    "file1b":"./Images/wormatk1b.png",
    "atk1":"1,1:1,2:1,3:1,4:1,5:1,6:1,7",
    "file2":"./Images/wormatk2.png",
    "file2b":"./Images/wormatk2b.png",
    "atk2":"12,1:12,2:12,3:12,4:12,5:12,6:12,7"
    },
    {
        "name": "dog",
        "hp":"8",
        "dmg":"2",
        "atks":"2",
        "file1":"./Images/wormatk1",
        "file1b":"./Images/wormatk1b",
        "atk1":"1,1:1,2:1,3:1,4:1,5:1,6:1,7"
    }
]

//creates array of opp location cavases
canvasArray = new Array();
canvasArray[0] = ctxr
canvasArray[1] = ctxrm
canvasArray[2] = ctxlm
canvasArray[3] = ctxl

//default img array for default background and player img
imgArray = new Array();
imgArray[0] = new Image();
imgArray[0].src = "./Images/Default.png"
imgArray[1] = new Image();
imgArray[1].src = "./Images/PlayerArt.png"
imgArray[2] = new Image();
imgArray[2].src = "/Images/Gameover100.png"
imgArray[3] = new Image();
imgArray[3].src = "/Images/Win100.png"

//starts the fight with the worm
function wormFight() {
loadWorm()
//worm animation
aniInt=setInterval(function() {
    canvasArray[oppLocation].clearRect(0, 0, 300, 200);
if(frame2 == true) {
canvasArray[oppLocation].drawImage(imgArrayWorm[0],0,196.6,300,196.6,0,0,300,200)
frame2 = false;
} else
{
    canvasArray[oppLocation].drawImage(imgArrayWorm[0],0,0,300,196.6,0,0,300,200)
    frame2 = true;
}
}, 700);

//attack loop
atkInt = setInterval(function() {
    randNum = (Math.floor(Math.random() * (oppArray.atks)) +1)
    ctx.clearRect(0, 0, 1224, 700);
    ctx.drawImage(imgArrayWorm[randNum],0,0) // warning dmg area

    atkdmgInt = setTimeout(function() {
        ctx.clearRect(0, 0, 1224, 700);
        ctx.drawImage(imgArrayWorm[randNum + oppArray.atks],0,0) // show when dmg happens
        
        atkresInt = setTimeout(function() {
            ctx.drawImage(imgArray[0],0,0) //sets back to default background
        }, 200)// time damage stays on screen
        checkDmg(randNum) 
    }, 1500)// time till damage
}, 3000); // time till next attack

}

//checks to see if player is in a purple area
function checkDmg(randNum) {
    tempString = pls.x + "," + pls.y // makes player location in string
    tempArray = atkArray[randNum] 
    if (tempArray.includes(tempString) == true)
    {
        playerHP = playerHP - oppArray.dmg //update player hp
        PHP.textContent = playerHP
        document.getElementById("PLAYERSPACE").style.borderColor = "red"
        setTimeout(function() {document.getElementById("PLAYERSPACE").style.borderColor = "white"}, 300)
        if (playerHP <= 0) { // when player dies
            end = true
            if(atkInt != null)
            {
                clearInterval(atkInt);
                clearInterval(aniInt)
                clearInterval(atkdmgInt)
                clearInterval(atkresInt)
            }
            ctx.clearRect(0, 0, 1224, 700);
            ctxp.clearRect(0, 0, 1224, 700);
            ctx.drawImage(imgArray[2],0,0)

        }
    }
}

startBtn.addEventListener("click", function() { // restes a bunch of stuff to start/start over game
//starts the worm fight
wormFight()
end = false
playerHP = 30;
PHP.textContent = 30;
ctx.clearRect(0, 0, 1224, 700);
ctx.drawImage(imgArray[0],0,0)
plx = 612;
ply = 300;
pls = {
    y: 4,
    x: 7
}
DrawPlayer(plx,ply);
})

// Loads Default map and player
img.src = "./Images/Default.png";
img.onload = () => {
ctx.drawImage(img,0,0);
img.src = "./Images/PlayerArt.png"
img.onload = () => {
ctxp.drawImage(img,612,300);
};
};




// MOVEMENT KEYPRESS
document.addEventListener("keydown", function(event) 
{
    if (end == false) {
    if (event.key === 'w') 
    {
        if(ply != 0) 
        {
            if(canMove == true)
            {
                pls.y = pls.y - 1
                ply = ply - 100;
                DrawPlayer(plx,ply);
                canMove = false
                setTimeout(function() {setCanMove()}, 300)
            }
        }
    }
}
});

document.addEventListener("keydown", function(event) 
{
    if (end == false) {
    if (event.key === 's') 
    {
        if(ply != 600) 
        {
            if(canMove == true)
            {
                pls.y = pls.y + 1
                ply = ply + 100;
                DrawPlayer(plx,ply);
                canMove = false
                setTimeout(function() {setCanMove()}, 300)
            }
        }
    }
}
});

document.addEventListener("keydown", function(event) 
{
    if (end == false) {
    if (event.key === 'a') 
    {
        if(plx != 0) 
        {
            if(canMove == true)
            {
                pls.x = pls.x - 1;
                plx = plx - 102;
                DrawPlayer(plx,ply);
                canMove = false
                setTimeout(function() {setCanMove()}, 300)
            }
        }
    }
    }
});

document.addEventListener("keydown", function(event) 
{
    if (end == false) {
    if (event.key === 'd') 
    {
        if(plx != 1122) 
        {
            if(canMove == true)
            {
                pls.x = pls.x + 1;
                plx = plx + 102;
                DrawPlayer(plx,ply);
                canMove = false
                setTimeout(function() {setCanMove()}, 300)
            }
        }
    }
}
});

// player attack, checks opp location
document.addEventListener("keydown", function(event) {
    if (end == false) {
    if (event.key === 'e') 
    {
        if(canAtk == true)
        {
            switch(pls.x) { 
                case 1:
                case 2:
                case 3:
                    tempNum = 0
                    document.getElementById("OPP-R").style.borderColor = "red"
                    setTimeout(function() {document.getElementById("OPP-R").style.borderColor = "white"}, 400)
                break;
                case 4:
                case 5:
                case 6:
                    tempNum = 1
                    document.getElementById("OPP-RM").style.borderColor = "red"
                    setTimeout(function() {document.getElementById("OPP-RM").style.borderColor = "white"}, 400)
                break;
                case 7:
                case 8:
                case 9:
                    tempNum = 2
                    document.getElementById("OPP-LM").style.borderColor = "red"
                    setTimeout(function() {document.getElementById("OPP-LM").style.borderColor = "white"}, 400)
                break;
                case 10:
                case 11:
                case 12:
                    tempNum = 3
                    document.getElementById("OPP-L").style.borderColor = "red"
                    setTimeout(function() {document.getElementById("OPP-L").style.borderColor = "white"}, 400)
                break;
            }

            if(tempNum == oppLocation) {
                oppHP = oppHP - playerDmg;
                OHP.textContent = oppHP;
                if(oppHP <= 0) { //when the opp dies
                    end = true
                    if(atkInt != null)
                    {
                        clearInterval(atkInt);
                        clearInterval(aniInt)
                        clearInterval(atkdmgInt)
                        clearInterval(atkresInt)
                    }
                    ctx.clearRect(0, 0, 1224, 700);
                    ctxp.clearRect(0, 0, 1224, 700);
                    ctx.drawImage(imgArray[3],0,0)
                }
                if (oppHP > 0){
                oppMove()
                }
            }
            setTimeout(function() {setCanAtk()}, 500)
        }
    }
}
});


//changes opp location after getting hit
function oppMove() {
    canvasArray[oppLocation].clearRect(0, 0, 300, 200);
    let temprandNum = Math.floor(Math.random() * 4)
    if (oppLocation != temprandNum)
    {
        oppLocation = temprandNum
    } else
    {
        oppMove()
    }
}

// enemmy loading arrays
function loadWorm() {

oppID = 0;
oppArray = JSON.parse(JSON.stringify(opp[0])) //grabs opp info
ONAME.textContent = oppArray.name
OHP.textContent = oppArray.hp
oppHP = oppArray.hp
atkArray = new Array(); // makes array of opp atack grids
tempString = oppArray.atk1
tempArray = tempString.split(":")
atkArray[1] = tempArray

tempString = oppArray.atk2
tempArray = tempString.split(":")
atkArray[2] = tempArray

imgArrayWorm = new Array();
imgArrayWorm[0] = new Image();
imgArrayWorm[0].src = "./Images/WormE.png"
imgArrayWorm[1] = new Image();
imgArrayWorm[1].src = oppArray.file1
imgArrayWorm[2] = new Image();
imgArrayWorm[2].src = oppArray.file2
imgArrayWorm[3] = new Image();
imgArrayWorm[3].src = oppArray.file1b
imgArrayWorm[4] = new Image();
imgArrayWorm[4].src = oppArray.file2b
}


// slows down the movement
function setCanMove() {
    canMove = true;
}

// failsafe for fast attacks
function setCanAtk() {
    canAtk = true;
}

 function DrawPlayer(plx, ply) {
    // img.src = "./Images/PlayerArt.png"
    // img.onload = () => {
    ctxp.clearRect(0, 0, 1224, 700);
    ctxp.drawImage(imgArray[1],plx,ply);
    // };
 }

// setTimeout(function() {DrawSpace(file)}, 5000);
// setTimeout(function() {DrawPlayer(plx,ply)}, 5000)

// ctx.fillStyle = 'purple';
// ctx.fillRect(1122, 0, 1224, 700);
// for(let i=0; i < 12; i++) {
// ctx.beginPath();
// ctx.strokeStyle = 'white';
// ctx.moveTo(x,0);
// ctx.lineTo(x,700);
// ctx.stroke();
// x= x + 102;
// console.log(x)

// ctx.beginPath();
// ctx.strokeStyle = 'white';
// ctx.moveTo(0,y);
// ctx.lineTo(1224,y);
// ctx.stroke();
// y = y + 100;
// }



// var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
// window.location.href=image;