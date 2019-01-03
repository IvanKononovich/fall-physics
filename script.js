'use strict'


let canv = document.getElementById('canv');
let ctx = canv.getContext('2d');
let inputNumberCreatedParticle = document.getElementById('numberCreatedParticle');
let setParameters = document.getElementById('setParameters');

canv.width = window.innerWidth;
canv.height = window.innerHeight;

let arrAllParticle = [];
const SIZEPARTICLE = 8;
const FALLSPEED = 4;
let numberCreatedParticle = inputNumberCreatedParticle.value;
let idRequestAnimationFrame;

function neighborsStop(arr){
    arr.forEach((item)=>{
        item[2].permissionToMove = false;
        item[2].color = '#124ae5';
    });
}

function neighborhoodCheck(arr, target, neighborList){
    let arrNeighbor = neighborList.concat();

    arr.forEach((neighbour)=>{
        if(neighbour[2].particleId != target[2].particleId){
            if(target[1] + SIZEPARTICLE > neighbour[1] && target[1] + SIZEPARTICLE < neighbour[1] + SIZEPARTICLE){
                if(neighbour[0] + SIZEPARTICLE > target[0] && neighbour[0] < target[0] + SIZEPARTICLE){
                    if(arrNeighbor.length === 0) arrNeighbor.push(target);
                    arrNeighbor.push(neighbour);
                    neighborhoodCheck(arr, neighbour, arrNeighbor);
                } 
            }    
        }    
    });

    if(neighborList.length === arrNeighbor.length && arrNeighbor.length > 0){
        if(arrNeighbor[arrNeighbor.length-1][1] + SIZEPARTICLE >= window.innerHeight){
            neighborsStop(arrNeighbor);
        } 
    }
}

function launchAnimation(){
    idRequestAnimationFrame = requestAnimationFrame(function drawingParticle(){
        ctx.clearRect(0, 0, canv.width, canv.height);
        arrAllParticle.forEach((item, index)=>{
            ctx.beginPath();
            ctx.fillStyle = item[2].color;
            ctx.fillRect(item[0], item[1], SIZEPARTICLE, SIZEPARTICLE);
            
            if(item[2].permissionToMove){
                neighborhoodCheck(arrAllParticle, item, []);
            }    

            if(item[2].permissionToMove) item[1] += FALLSPEED;

            if(item[1] + SIZEPARTICLE >= canv.height){
                item[2].permissionToMove = false;
                item[2].color = '#8e5099';
            }
        });
        idRequestAnimationFrame = requestAnimationFrame(drawingParticle);
    });
}

function creatureParticle(x,y){
    cancelAnimationFrame(idRequestAnimationFrame);
    arrAllParticle.push([x, y, {
        permissionToMove: true,
        color: '#a92509',
        neighbors: false,
        particleId: Math.random()
    }]);
    launchAnimation();

}

function randomX(max, min){
    return Math.floor(Math.random() * (max - min) + min);
}

function deleteParticle(){
    for(let i = 0, len = arrAllParticle.length/3; i < len; i++){
        let index = randomX(len, 0);
        if(arrAllParticle[index]) arrAllParticle.splice(index, 1);
    }
    arrAllParticle.forEach((item)=>{
        item[2].color = '#a92509';
        item[2].permissionToMove = true;
    })
}

document.addEventListener('pointermove', (e)=>{  
    let x = e.pageX;
    let y = e.pageY;
    for(let i = 0; i < numberCreatedParticle; i++){
        let accessToCreation = true;
        arrAllParticle.forEach((item)=>{
            if(y + SIZEPARTICLE > item[1] && y < item[1] + SIZEPARTICLE){
                if(item[0] + SIZEPARTICLE > x && item[0] < x + SIZEPARTICLE){
                    accessToCreation = false;
                } 
            }    
        });

        if(accessToCreation){
            creatureParticle(x, y);
        }
        if(arrAllParticle.length < 0){
            creatureParticle(x, y);
        }
        x = x + Math.random() * 10 - Math.random() * 10;
        y = y + Math.random() * 10 - Math.random() * 10;
    }    
});
setParameters.addEventListener('pointerup', ()=>{
    numberCreatedParticle = +inputNumberCreatedParticle.value;
});
document.addEventListener('pointerup', (e)=>{
    if(e.target === canv) deleteParticle();
});
