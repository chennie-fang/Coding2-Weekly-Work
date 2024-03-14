let serial;
let latestData = "waiting for data"; 
let score = 0;
let stars = [];
let starSpeed = 2;
const numberOfStars = 6; 
const minStarDistance = 30; 
let img;
let imgbg;
function preload() {
  img = loadImage('R.png'); 
  imgbg = loadImage('11.jpg'); 
}

function setup() {
  createCanvas(700, 500);
  serial = new p5.SerialPort();
  serial.open("/dev/tty.usbmodem101");
  serial.on('connected', serverConnected);
  serial.on('list', gotList);
  serial.on('data', gotData);
  serial.on('error', gotError);
  serial.on('open', gotOpen);
  serial.on('close', gotClose);

  frameRate(150);
  for (let i = 0; i < numberOfStars; i++) {
    spawnStar();
  }
}

// We are connected and ready to go
function serverConnected() {
  print("Connected to Server");
}

// Got the list of ports
function gotList(thelist) {
  print("List of Serial Ports:");
  // theList is an array of their names
  for (let i = 0; i < thelist.length; i++) {
    // Display in the console
    print(i + " " + thelist[i]);
  }
}

function gotOpen() {
  print("Serial Port is Open");
}

function gotClose() {
  print("Serial Port is Closed");
  latestData = "Serial Port is Closed";
}

function gotError(theerror) {
  print(theerror);
}

function gotData() {
  let currentString = serial.readLine();    
  trim(currentString);                    
  
  if (!currentString) return;             
  console.log(currentString);             

  latestData = currentString;            
}

function draw() {
  if (score < 50) {
    background(171, 240, 124);
    let y = map(latestData, 30, 0, -10, 470);
    image(img, 120, y - 15, 120, 145);
    
    for (let i = 0; i < stars.length; i++) {
      fill(255, 224, 119);
      drawStar(stars[i].x, stars[i].y, 10, 30, 5);

      let d = dist(120 + 120 / 2, y, stars[i].x, stars[i].y);
      let rSum = 120 / 2 + 15;

      if (d < rSum) {
        score++;
        stars.splice(i, 1);
        spawnStar();
      }

      stars[i].x -= starSpeed;
      
      if (stars[i].x < 0) {
        stars.splice(i, 1);
        spawnStar();
      }
    }
    
    fill(255, 161, 37);
    stroke(0);
    strokeWeight(1);
    textSize(30);
    text('SCORE: ' + score, 280, 45);
  } else {
   image(imgbg,-50,0,width+100,height);
  }
}

function spawnStar() {
  let newStar = {
    x: width,
    y: random(20, height - 20)
  };

  let overlapping = false;
  for (let i = 0; i < stars.length; i++) {
    let d = dist(newStar.x, newStar.y, stars[i].x, stars[i].y);
    if (d < minStarDistance) {
      overlapping = true;
      break;
    }
  }

  if (!overlapping) {
    stars.push(newStar);
  } else {
    spawnStar();
  }
}

function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = -PI/2; a < TWO_PI-PI/2; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
