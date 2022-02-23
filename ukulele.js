let canvas;
let ctx;
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
let imgNameArr = ['NoteCubesSS.png', 'MusicalNotesSS.png', 'NoteCubeSSWhite.png', 'MusicalNotesSSWhite.png'];
let spriteSheets = [];
let notes = [];
var synth = new Tone.Synth().toMaster();

let noteArray = [['0G40', 0], ['0C40', 150], ['0E40', 300], ['0A40', 450], 
['1G4#', 600], ['1C4#', 750], ['1F40', 900], ['1A4#', 1050], 
['2A40', 1200], ['2D40', 1350], ['2F4#', 1500], ['2B40', 1650], 
['3A4#', 1800], ['3D4#', 1950], ['3G40', 2100], ['3C50', 2250], 
['4B40', 2400], ['4E40', 2550], ['4G4#', 2700], ['4C5#', 2850], 
['5C50', 3000], ['5F40', 3150], ['5A40', 3300], ['5D50', 3450], 
['6C5#', 3600], ['6F4#', 3750], ['6A4#', 3900], ['6D5#', 4050], 
['7D50', 4200], ['7G40', 4350], ['7B40', 4500], ['7E50', 4650], 
['8D5#', 4800], ['8G4#', 4950], ['8C50', 5100], ['8F50', 5250], 
['9E50', 5400], ['9A40', 5550], ['9C5#', 5700], ['9F5#', 5850], 
['AF50', 6000], ['AA4#', 6150], ['AD50', 6300], ['AG50', 6450], 
['BF5#', 6600], ['BB40', 6750], ['BD5#', 6900], ['BG5#', 7050], 
['CG50', 7200], ['CC50', 7350], ['CE50', 7500], ['CA50', 7650]];

let noteMap = new Map(noteArray);

document.addEventListener('DOMContentLoaded', SetupCanvas);

class Note{
    constructor(name, xStart){
        this.name = name;
        this.type = this.name.slice(4);
        this.visible = true;
        this.fileName = this.name.slice(0,4);
        if(this.type === '4') this.ssTopSymbolX = 140;
        if(this.type === '5') this.ssTopSymbolX = 280;
        if(this.type === '6') this.ssTopSymbolX = 420;
        this.topNoteX = xStart || 2490;
        this.bottomNoteX = xStart || 2490;
        this.noteCubeSSX;
        this.hasSharp = (this.name.charAt(3) === '#') ? true : false;
        this.noteCode = this.name.slice(1,3);

        if(this.noteCode === 'C4') this.topNoteY = 270, this.bottomNoteY = 1050, this.noteCubeSSX = 150;
        if(this.noteCode === 'D4') this.topNoteY = 220, this.bottomNoteY = 1050, this.noteCubeSSX = 1350;
        if(this.noteCode === 'E4') this.topNoteY = 170, this.bottomNoteY = 900, this.noteCubeSSX = 300;
        if(this.noteCode === 'F4') this.topNoteY = 120, this.bottomNoteY = 900, this.noteCubeSSX = 900;
        if(this.noteCode === 'G4') this.topNoteY = 70, this.bottomNoteY = 900, this.noteCubeSSX = 2100;
        if(this.noteCode === 'A4') this.topNoteY = 20, this.bottomNoteY = 750, this.noteCubeSSX = 450;
        if(this.name.slice(1,4) === 'A4#') this.topNoteY = 20, this.bottomNoteY = 750, this.noteCubeSSX = 1050;
        if(this.noteCode === 'B4') this.topNoteY = -30, this.bottomNoteY = 750, this.noteCubeSSX = 1650;
        if(this.noteCode === 'C5') this.topNoteY = -80, this.bottomNoteY = 750, this.noteCubeSSX = 2250;
        if(this.noteCode === 'D5') this.topNoteY = -130, this.bottomNoteY = 750, this.noteCubeSSX = 3450;
        if(this.noteCode === 'E5') this.topNoteY = -180, this.bottomNoteY = 750, this.noteCubeSSX = 4650;
        if(this.noteCode === 'F5') this.topNoteY = -230, this.bottomNoteY = 750, this.noteCubeSSX = 5250;
        if(this.noteCode === 'G5') this.topNoteY = -280, this.bottomNoteY = 750, this.noteCubeSSX = 6450;
        if(this.noteCode === 'A5') this.topNoteY = -330, this.bottomNoteY = 750, this.noteCubeSSX = 7650;

        this.speed = 5;
    }
    Update(){
        this.topNoteX -= this.speed;
        this.bottomNoteX -= this.speed;
        if(this.bottomNoteX === 240) this.visible = false;
    }
    Draw(){
        if(this.visible){
            if(this.bottomNoteX <= (canvasWidth / 2) && this.bottomNoteX >= ((canvasWidth / 2) - 112)){
                ctx.drawImage(spriteSheets[3], this.ssTopSymbolX, 0, 138, 362,
                    this.topNoteX, this.topNoteY, 138, 362);
                    if(this.hasSharp){
                        ctx.drawImage(spriteSheets[3], 560, 0, 138, 362, 
                            (this.topNoteX + 25), (this.topNoteY + 60), 140, 362);
                    }
                    ctx.drawImage(spriteSheets[2], this.noteCubeSSX, 0, 150, 112, this.bottomNoteX, this.bottomNoteY, 150, 112);
                    synth.triggerAttackRelease(this.noteCode, "4n");
            } else {
                ctx.drawImage(spriteSheets[1], this.ssTopSymbolX, 0, 138, 362,
                    this.topNoteX, this.topNoteY, 138, 362);
                    if(this.hasSharp){
                        ctx.drawImage(spriteSheets[1], 560, 0, 138, 362, 
                            (this.topNoteX + 25), (this.topNoteY + 60), 140, 362);
                    }
                    ctx.drawImage(spriteSheets[0], this.noteCubeSSX, 0, 150, 112, this.bottomNoteX, this.bottomNoteY, 150, 112);
            }
        }
    }
}

function SetupCanvas(){
    canvas = document.getElementById("my-canvas");
    ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillStyle = "black";
    ctx.fillRect(0,0, canvas.width, canvas.height);

    let noteBuffer = 170;
    let sumOfBuffers = 0;
    let noteType = 4;

    for(let i = 0; i < song.length; i++){
        let newX = 2490 + ((i * 170) + noteBuffer) + sumOfBuffers;
        notes.push(new Note(song[i], newX));
        if(noteType === '5') sumOfBuffers += 170;
        if(noteType === '6') sumOfBuffers += 510;
        noteType = song[i].slice(4);
        if(noteType === '4') noteBuffer = 170;
        if(noteType === '5') noteBuffer = 340;
        if(noteType === '6') noteBuffer = 680;
    }

    PreloadImages(imgNameArr, Render);
}

let song = ['0C404', '0E404', '1F404', '3G405',
'0C404', '0E404', '1F404', '3G405', 
'0C404', '0E404', '1F404', '3G405',
'0E405', '0C405', '0E405', '2D405',
'0E404', '0E404', '2D404', '0C405',
'0C404', '0E405', '3G405', '3G404', '1F405',
'1F404', '0E404', '1F404', '3G405', '0E405',
'0C405', '2D405', '0C405',];

function PreloadImages(files, imgsLoadedCallback){
    var fileCounter = 0;
    var numOfFiles = files.length;
    files.forEach(function(file){
        PreloadImage(file, function(){
            fileCounter++;
            if(fileCounter == numOfFiles){
                imgsLoadedCallback();
            }
        });
    });
    function PreloadImage(url, imgLoadedCallback){
        var img = new Image();
        img.onload = imgLoadedCallback;
        img.src = url;
        spriteSheets.push(img);
    }
}

function Render(){
    ctx.clearRect(0,0, canvasWidth, canvasHeight);
    DrawBoard();
    for(let i = 0; i < notes.length; i++){
        notes[i].Update();
        notes[i].Draw();
    }

    requestAnimationFrame(Render);
}

function DrawBoard(){
    ctx.beginPath();
    ctx.strokeStyle = "#6A9954";
    ctx.lineWidth = 3;
    ctx.moveTo(36, 100);
    ctx.lineTo(2528, 100);
    ctx.stroke();
    ctx.moveTo(36, 200);
    ctx.lineTo(2528, 200);
    ctx.stroke();
    ctx.moveTo(36, 300);
    ctx.lineTo(2528, 300);
    ctx.stroke();
    ctx.moveTo(36, 400);
    ctx.lineTo(2528, 400);
    ctx.stroke();
    ctx.moveTo(36, 500);
    ctx.lineTo(2528, 500);
    ctx.stroke();
    ctx.moveTo(36, 600);
    ctx.lineTo(2528, 600);
    ctx.stroke();

    ctx.moveTo(36, 800);
    ctx.lineTo(2528, 800);
    ctx.stroke();
    ctx.moveTo(36, 950);
    ctx.lineTo(2528, 950);
    ctx.stroke();
    ctx.moveTo(36, 1100);
    ctx.lineTo(2528, 1100);
    ctx.stroke();
    ctx.moveTo(36, 1250);
    ctx.lineTo(2528, 1250);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#FFFF00';
    ctx.moveTo((canvasWidth / 2), 0);
    ctx.lineTo((canvasWidth / 2), canvasHeight);
    ctx.stroke();

    ctx.drawImage(spriteSheets[1], 0, 0, 140, 362, 50, 120, 140, 362);



}