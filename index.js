var canvasDisp = document.getElementById("rightDisp") //art on the right
var canvas = document.getElementById("PLAYSPACE") // where the basic board is
var canvasP = document.getElementById("PLAYERSPACE") // where the player image is
var canvasA = document.getElementById("ATKSPACE") //where opp attacks show up
var canvasr = document.getElementById("OPP-R")
var canvasrm = document.getElementById("OPP-RM")
var canvaslm = document.getElementById("OPP-LM")
var canvasl = document.getElementById("OPP-L")
var startBtn = document.getElementById("start")
var nextBtn = document.getElementById("next")
var PHP = document.getElementById("PLAYER-HP")
var OHP = document.getElementById("OPP-HP")
var ONAME = document.getElementById("OPP-NAME")
let ctxDisp = canvasDisp.getContext('2d');
let ctxp = canvasP.getContext('2d');
let ctxa = canvasA.getContext('2d')
let ctx = canvas.getContext('2d');
let ctxr = canvasr.getContext('2d');
let ctxrm = canvasrm.getContext('2d');
let ctxlm = canvaslm.getContext('2d');
let ctxl = canvasl.getContext('2d');
let fightNum = 1; // the number of fights
let playerHP = 30
let playerDmg = 4
let oppHP = 0
let tempArray = {}
let tempString = ""
let tempNum = 0
let tempEl = 0
let end = false; // is the game over
let atkArray = {} // holds the arrays of cords of when attacks hit
var img = new Image();
var randNum = 0
let oppArray = {} // opp info array

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
        "hp":20,
        "dmg":5,
        "atks":2,
        "file1":"./Images/dogatk1.png",
        "file1b":"./Images/dogatk1b.png",
        "atk1":"10,1:11,1:12,1:10,2:11,2:12,2:8,2:9,2:8,3:9,3:10,3:10,12:11,12:12,12:10,11:11,11:12,11:8,11:9,11:8,10:9,10:10,10:6,3:7,3:6,4:7,4:8,4:6,5:7,5",
        "file2":"./Images/dogatk2.png",
        "file2b":"./Images/dogatk2b.png",
        "atk2":"1,1:2,1:3,1:1,2:2,2:3,2:4,2:5,2:3,3:4,3:5,3:6,3:7,3:5,4:6,4:7,4:3,5:4,5:5,5:6,5:7,5:1,6:2,6:3,6:4,6:5,6:1,7:2,7:3,7"
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
imgArray[4] = new Image();
imgArray[4].src = "/Images/Default1.png"

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
            ctx.drawImage(imgArray[4],0,0) //sets back to default background
        }, 200)// time damage stays on screen
        checkDmg(randNum) 
    }, 1500)// time till damage
}, 3000); // time till next attack
}

function dogFight() {
    loadDog()
    //dog animation
    aniInt=setInterval(function() {
        canvasArray[oppLocation].clearRect(0, 0, 300, 200);
    if(frame2 == true) {
    canvasArray[oppLocation].drawImage(imgArrayDog[0],0,200,300,200,0,0,300,200)
    frame2 = false;
    } else
    {
        canvasArray[oppLocation].drawImage(imgArrayDog[0],0,0,300,200,0,0,300,200)
        frame2 = true;
    }
    }, 700);
    
    //dog attack loop
    atkInt = setInterval(function() {
        randNum = (Math.floor(Math.random() * (oppArray.atks)) +1)
        ctxa.drawImage(imgArrayDog[randNum],0,0) // warning dmg area
        atkdmgInt = setTimeout(function() {
            ctxa.clearRect(0, 0, 1224, 700);
            ctxa.drawImage(imgArrayDog[randNum + oppArray.atks],0,0) // show when dmg happens
            
            atkresInt = setTimeout(function() {
                ctxa.clearRect(0, 0, 1224, 700);
            }, 200)// time damage stays on screen
            checkDmg(randNum) 
        }, 1000)// time till damage
    }, 2500); // time till next attack
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
            EnableSBTN()
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
DisableSBTN()
})

nextBtn.addEventListener("click", function() {
    DisableNBTN()
    canvasArray[oppLocation].clearRect(0, 0, 300, 200);
    fightNum++
    ctx.clearRect(0, 0, 1224, 700);
    ctxa.clearRect(0, 0, 1224, 700);
    ctx.drawImage(imgArray[0],0,0)
    plx = 612;
    ply = 300;
    pls = {
    y: 4,
    x: 7
}
end = false
setCanMove()
setCanAtk()
console.log(fightNum)
DrawPlayer(plx,ply);   
    switch(fightNum) {
        case 2:
            dogFight()
            document.getElementById("WORM").style.color = "red"
            document.getElementById("WORM").innerHTML = "WORM"
            document.getElementById("DOG").style.color = "yellow"
            document.getElementById("DOG").innerHTML = "VS DOG"
            break;
        case 3:

            document.getElementById("DOG").style.color = "red"
            document.getElementById("DOG").innerHTML = "DOG"
            document.getElementById("WARRIOR").style.color = "yellow"
            document.getElementById("WARRIOR").innerHTML = "VS WARRIOR"
            break;
        case 4:

            document.getElementById("WARRIOR").style.color = "red"
            document.getElementById("WARRIOR").innerHTML = "WARRIOR"
            document.getElementById("MAGE").style.color = "yellow"
            document.getElementById("MAGE").innerHTML = "VS MAGE"
            break;
        case 5:
         
            document.getElementById("MAGE").style.color = "red"
            document.getElementById("MAGE").innerHTML = "MAGE"
            document.getElementById("BEAST").style.color = "yellow"
            document.getElementById("BEAST").innerHTML = "VS BEAST"
            break;
        case 6:

            document.getElementById("BEAST").style.color = "red"
            document.getElementById("BEAST").innerHTML = "BEAST"
            document.getElementById("CHAMPION").style.color = "yellow"
            document.getElementById("CHAMPION").innerHTML = "VS CHAMPION"
            break;
        case 7:

            document.getElementById("CHAMPION").style.color = "red"
            document.getElementById("CHAMPION").innerHTML = "CHAMPION"
            document.getElementById("?????").style.color = "yellow"
            document.getElementById("?????").innerHTML = "VS ?????"
            break;
    }
    
})


// Loads Default map and player with other on load things
DisableNBTN()
img.src = "./Images/Default.png";
img.onload = () => {
ctx.drawImage(img,0,0);
img.src = "./Images/PlayerArt.png"
img.onload = () => {
ctxp.drawImage(img,612,300);
img.src = "./Images/ColDisp.png"
img.onload = () => {
ctxDisp.drawImage(img,0,0);

}
};
};

// diasable and enables fight and next buttons when needed
function DisableSBTN() {
    startBtn.disabled = true
    document.getElementById("start").style.opacity = 0.6
}
function EnableSBTN() {
    startBtn.disabled = false
    document.getElementById("start").style.opacity = 1
}

function DisableNBTN() {
    nextBtn.disabled = true
    document.getElementById("next").style.opacity = 0.6
}

function EnableNBTN() {
    nextBtn.disabled = false
    document.getElementById("next").style.opacity = 1
}



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
                    ctxa.clearRect(0, 0, 1224, 700);
                    ctx.drawImage(imgArray[3],0,0)
                    EnableNBTN()
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

function loadDog() {
imgArrayWorm = null
oppID = 1;
oppArray = JSON.parse(JSON.stringify(opp[1])) //grabs opp info
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


imgArrayDog = new Array();
imgArrayDog[0] = new Image();
imgArrayDog[0].src = "./Images/Dog.png"
imgArrayDog[1] = new Image();
imgArrayDog[1].src = oppArray.file1
imgArrayDog[2] = new Image();
imgArrayDog[2].src = oppArray.file2
imgArrayDog[3] = new Image();
imgArrayDog[3].src = oppArray.file1b
imgArrayDog[4] = new Image();
imgArrayDog[4].src = oppArray.file2b
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
let x = 102//temp used for making map img
let y = 100 //temp used for making map img



// ctx.fillStyle = 'purple';
// ctx.fillRect(918, 0, 306, 200);
// ctx.fillRect(714, 100, 306, 200);
// ctx.fillRect(918, 500, 306, 200);
// ctx.fillRect(714, 400, 306, 200);
// ctx.fillRect(510, 200, 306, 300);

// ctx.fillRect(0, 0, 306, 200);
// ctx.fillRect(204, 100, 306, 200);
// ctx.fillRect(0, 500, 306, 200);
// ctx.fillRect(204, 400, 306, 200);
// ctx.fillRect(408, 200, 306, 300);


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