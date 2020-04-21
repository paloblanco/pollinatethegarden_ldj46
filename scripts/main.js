// Game by Palo Blanco Games, 2020
// Rocco Panella
// credit for starting template to Frank Poth 08/13/2017

/*
################
INLINE RESOURCES
################
*/

var listColors = [
  "#000000", // 0 black
  "#1D2B53", // 1 dark blues
  "#7E2553", // 2 dark purple
  "#008751", // 3 dark green
  "#AB5236", // 4 brown
  "#5F574F", // 5 dark grey
  "#C2C3C7", // 6 light gray
  "#FFF1E8", // 7 white
  "#FF004D", // 8 red
  "#FFA300", // 9 orange
  "#FFEC27", // 10 yellow
  "#00E436", // 11 green
  "#29ADFF", // 12 blue
  "#83769C", // 13 indigo
  "#FF77A8", // 14 pink
  "#FFCCAA" ,// 15 purple
]

var listColorsHex = [
  0x000000, // 0 black
  0x1D2B53, // 1 dark blues
  0x7E2553, // 2 dark purple
  0x008751, // 3 dark green
  0xAB5236, // 4 brown
  0x5F574F, // 5 dark grey
  0xC2C3C7, // 6 light gray
  0xFFF1E8, // 7 white
  0xFF004D, // 8 red
  0xFFA300, // 9 orange
  0xFFEC27, // 10 yellow
  0x00E436, // 11 green
  0x29ADFF, // 12 blue
  0x83769C, // 13 indigo
  0xFF77A8, // 14 pink
  0xFFCCAA, // 15 purple
]



/*
################
DECLARATIONS
################
*/

var context, controller, rectangle, loop, update, draw, ctx, offCanvas, pixelRatio;
var baseheight, basewidth, basescale, colors;


/*
################
CANVAS SETUP
################
*/

//VIRTUAL RESOLUTION

baseheight = 240;
basewidth = 400;
basescale = 1; //scaling factor
targetheight = baseheight*basescale;
targetwidth = basewidth*basescale;
pixelRatio = window.devicePixelRatio;

//OFFSCREEN CANVAS

offCanvas = document.createElement("canvas");
offCanvas.width = basewidth;
offCanvas.height = baseheight;
offCanvas.style.imageRendering = "pixelated";
ctx = offCanvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

//ONSCREEN CANVAS

context = document.querySelector("canvas").getContext("2d");
context.canvas.height = targetheight * pixelRatio;
context.canvas.style.height = '${targetheight}px'
context.canvas.width = targetwidth * pixelRatio;
context.canvas.style.width = '${targetwidth}px'
// context.scale(basescale*pixelRatio, basescale*pixelRatio);
context.imageSmoothingEnabled = false;

/*
################
THREEJS SETUP
################
*/

// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let renderer;
let scene;
let mesh;
let mesh2
let bee;

// OFFSCREEN TARGET FOR 3D drawing
threeCanvas = document.createElement("canvas");
threeCanvas.width = basewidth;
threeCanvas.height = baseheight;
threeCanvas.style.imageRendering = "pixelated";
ctxThree = offCanvas.getContext("2d");
ctxThree.imageSmoothingEnabled = false;

function init() {

    // create a Scene
    scene = new THREE.Scene();
    // set the background color
    scene.background = new THREE.Color(listColorsHex[12]);

    //make the camera
    // Create a Camera
    const fov = 30; // AKA Field of View
    const aspect = basewidth / baseheight;
    const near = 0.1; // the near clipping plane
    const far = 100; // the far clipping plane
    camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

    // every object is initially created at ( 0, 0, 0 )
    // we'll move the camera back a bit so that we can view the scene
    camera.position.set( 10, 3, 3 );
    camera.lookAt(10,10,3);

    // create a geometry
    const geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
    const geoFloor = new THREE.BoxBufferGeometry( 20, 20, 1 );

    // create a purple Basic material
    const material = new THREE.MeshStandardMaterial( { color: listColorsHex[12] } );
    const material2 = new THREE.MeshStandardMaterial( { color: listColorsHex[3] } );

    // create a Mesh containing the geometry and material
    mesh = new THREE.Mesh( geometry, material );
    mesh2 = new THREE.Mesh( geoFloor, material2 );

    // add the mesh to the scene
    // scene.add( mesh );
    scene.add( mesh2 );
    mesh.position.set(10,10,1.5);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh2.position.set(10,10,0.5);
    mesh2.castShadow = true;
    mesh2.receiveShadow = true;

    //add a light to the scene
    // const light = new THREE.DirectionalLight(0xffffff, 1.0);
    //Create a PointLight and turn on shadows for the light
    var light = new THREE.PointLight( 0xffffff, 1, 100 );
    light.position.set( 10, 10, 30 );
    light.castShadow = true;            // default false
    scene.add( light );

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 128;  // default
    light.shadow.mapSize.height = 128; // default
    light.shadow.camera.near = 0.5;       // default
    light.shadow.camera.far = 50      // default

    //move the light, since its default position is 000
    // light.position.set(2,-3,4);

    //add the light to the scene
    var lighta = new THREE.AmbientLight( 0x606060 ); // soft white light
    scene.add(lighta);

    // create a renderer
    renderer = new THREE.WebGLRenderer({antialias: false});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    renderer.setSize( basewidth, baseheight );

}

init();

let legLeft, legRight, armLeft, armRight;
let seed, sprout, bud, bloom, pollen, sprout2, aura, playerAura;

function initMeshes() {
  // used to build a train in section 1.6
  bee = new THREE.Group();
  // scene.add( bee );

  beeAll = new THREE.Group();
  scene.add(beeAll);

  bee.castShadow = true;
  bee.receiveShadow = true;

  const bodyMaterial = new THREE.MeshStandardMaterial({
      color: listColorsHex[10],
      flatShading: false,
  });

  const detailMaterial = new THREE.MeshStandardMaterial({
      color: listColorsHex[6],
      flatShading: false,
  });

  const greenMaterial = new THREE.MeshStandardMaterial({
    color: listColorsHex[11],
    flatShading: false,
});

  const yellowMaterial = new THREE.MeshStandardMaterial({
    color: listColorsHex[10],
    flatShading: true,
});

  const pinkMaterial = new THREE.MeshStandardMaterial({
    color: listColorsHex[14],
    flatShading: true,
});



  const darkMaterial = new THREE.MeshStandardMaterial({
    color: listColorsHex[0],
    flatShading: true,
});

const auraMaterial = new THREE.MeshStandardMaterial({
  color: listColorsHex[9],
  flatShading: true,
  opacity:0.5,
  transparent:true,
});

  const bodyGeometry = new THREE.BoxBufferGeometry( 1,1,1 );
  const body = new THREE.Mesh( bodyGeometry, bodyMaterial, castShadow = true, receiveShadow = true );
  body.castShadow = true;
  body.receiveShadow = true;

  const eyeGeometry = new THREE.BoxBufferGeometry( 0.15,0.15,0.15 );
  const eyeLeft = new THREE.Mesh( eyeGeometry, darkMaterial );
  const eyeRight = new THREE.Mesh( eyeGeometry, darkMaterial );
  const mouth = new THREE.Mesh( eyeGeometry, darkMaterial );
  legLeft = new THREE.Mesh( eyeGeometry, darkMaterial );
  legRight = new THREE.Mesh( eyeGeometry, darkMaterial );
  armLeft = new THREE.Mesh( eyeGeometry, darkMaterial );
  armRight = new THREE.Mesh( eyeGeometry, darkMaterial );
  const stingerGeometry = new THREE.CylinderBufferGeometry(0.15,0,0.3,6);
  const stinger = new THREE.Mesh( stingerGeometry, detailMaterial);
  const wingGeometry = new THREE.CylinderBufferGeometry(.15,.15,.05);
  const wing = new THREE.Mesh(wingGeometry, detailMaterial);


  eyeLeft.position.set(-0.25,0.5,0.25);
  eyeRight.position.set(0.25,0.5,0.25);
  mouth.position.set(0.0,0.5,-0.25);
  mouth.scale.set(3,1,0.75);
  stinger.position.set(0,-0.6,0);
  wing.position.set(-0.35,0,0.65);
  wing.scale.set(2.4,1.2,1.2);
  wing.rotation.z = Math.PI*0.5;
  wing.rotation.y = -Math.PI*0.25;
  wing2 = wing.clone();
  wing2.position.set(0.35,0,0.65);
  wing2.rotation.y = Math.PI*0.25;



  legLeft.position.set(-0.25,0.0,-0.65);
  legLeft.scale.set(2,2,2);
  legRight.position.set(0.25,0.0,-0.65);
  legRight.scale.set(2,2,2);
  armLeft.position.set(-0.65,0.0,0.0);
  armLeft.scale.set(2,2,2);
  armRight.position.set(0.65,0.0,0.0);
  armRight.scale.set(2,2,2);

  const stripeGeometry = new THREE.BoxBufferGeometry( 1.05,0.15,1.05 );
  const stripe1 = new THREE.Mesh(stripeGeometry, darkMaterial);
  stripe1.position.set(0,0.2,0);
  const stripe2 = new THREE.Mesh(stripeGeometry, darkMaterial);
  stripe2.position.set(0,-0.1,0);
  const stripe3 = new THREE.Mesh(stripeGeometry, darkMaterial);
  stripe3.position.set(0,-0.4,0);
  
  bee.add( body );
  bee.add( eyeLeft, eyeRight , mouth);
  bee.add( stripe1, stripe2, stripe3, armLeft, armRight, stinger, wing, wing2); 

  beeAll.add(bee);
  beeAll.add(legLeft, legRight);

  const seedGeometry = new THREE.SphereBufferGeometry(0.15,6,6);
  seed = new THREE.Mesh(seedGeometry, greenMaterial);
  seed.castShadow = true;

  sprout = new THREE.Group();
  // scene.add(sprout);
  const stemGeometry = new THREE.CylinderBufferGeometry(0.05,0.05,0.5,4);
  const stem = new THREE.Mesh(stemGeometry, greenMaterial);
  stem.rotation.x = Math.PI/2;
  // stem.castShadow = true;
  const sproutTopGeometry = new THREE.SphereBufferGeometry(0.15,5,4);
  const sproutTop = new THREE.Mesh(sproutTopGeometry, greenMaterial);
  // sproutTop.castShadow = true;
  sproutTop.position.set(0,0,0.4);
  sproutTop.scale.set(1,1,2)
  const leafGeometry = new THREE.SphereBufferGeometry(0.05,5,4);
  const leaf = new THREE.Mesh(leafGeometry, greenMaterial);
  leaf.scale.set(3,1,1)
  const leaf2 = leaf.clone();
  const leaf3 = leaf.clone();
  leaf.position.set(0.15,0,0.1);
  leaf2.position.set(-0.15,0,0);
  leaf3.position.set(0.15,0,-0.1);

  sprout.add(stem, leaf, leaf2, leaf3, sproutTop);
  sprout.position.set(2,2,1.25);

  bloom = new THREE.Group();
  const flowerTop = new THREE.Group();

  const flowerCenterGeometry = new THREE.SphereBufferGeometry(0.15,4,4);
  const flowerCenter = new THREE.Mesh(flowerCenterGeometry, yellowMaterial);
  // flowerCenter.castShadow = true;
  flowerTop.add(flowerCenter);

  const flowerPetalGeometry = new THREE.SphereBufferGeometry(0.15,4,4);
  const flowerPetal = new THREE.Mesh(flowerPetalGeometry, pinkMaterial);
  flowerPetal.position.set(0,0,.2);

  fp2 = flowerPetal.clone();
  fp2.position.set(0,0,-.2);

  fp3 = flowerPetal.clone();
  fp3.position.set(.14,0,-.13);

  fp4 = flowerPetal.clone();
  fp4.position.set(.14,0,.13);

  fp5 = flowerPetal.clone();
  fp5.position.set(-.14,0,-.13);

  fp6 = flowerPetal.clone();
  fp6.position.set(-.14,0,.13);

  flowerTop.add(flowerPetal, fp2, fp3, fp4, fp5, fp6);
  flowerTop.position.set(0,0,0.4);

  const auraGeometry = new THREE.SphereBufferGeometry(1,4,4);
  aura = new THREE.Mesh(auraGeometry, auraMaterial);

  playerAura = aura.clone();
  
  // bloom.add(aura);
  
  
  bloom.add(stem.clone(), leaf.clone(), leaf2.clone(), leaf3.clone(), flowerTop);
  bloom.position.set(4,2,1.25);
  // scene.add(bloom);

  




}

initMeshes();

// set up sounds
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
};

var beep1 = new sound("data/pollinate_0.wav");
beep1.sound.volume=0.025;
var beep2 = new sound("data/pollinate_1.wav");
beep2.sound.volume=0.025;
let music = new sound("data/LD46_Song.mp3");
music.sound.loop = true;
music.sound.volume = 0.5;

/*
################
FLOWER LOGIC
################
*/
let allSeeds = [];
let allFlowers = [];

class SeedObj {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.z = 1;
    this.y_velocity = 0.3*(0.5-Math.random());
    this.x_velocity = 0.3*(0.5-Math.random());
    this.z_velocity = 0.15 + 0.05*(Math.random());
    this.grav = 0.01;
    this.x_draw = 0;
    this.y_draw = 0;
    this.dead = false;
    this.age = 0;
    this.mesh = seed.clone();
    scene.add(this.mesh);
    this.mesh.position.set(this.x,this.y,this.z);
  }
  update() {
    this.x += this.x_velocity;
    this.y += this.y_velocity;
    this.z += this.z_velocity;
    if (this.x > 20 | this.x < 0) {this.x_velocity *= -1}
    if (this.y > 20 | this.y < 0) {this.y_velocity *= -1}
    this.mesh.position.set(this.x,this.y,this.z);
    this.z_velocity += -this.grav;
    if (this.z < 1) {
      this.dead = true;
      scene.remove(this.mesh);
      // this.mesh.dispose();
      allFlowers.push(new FlowerObj(this.x, this.y));
    }
  }
}

class FlowerObj {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.z = 1.25;
    this.age = 0;
    this.state = "sprout";
    this.gotPollen = false;
    this.sprout = sprout.clone();
    scene.add(this.sprout);
    this.sprout.position.set(this.x,this.y,this.z);
    this.timer = 0;
    this.aura = aura.clone();
    this.goalTime = 600 + Math.floor(400*Math.random());
  }
  update() {
    this.timer += 1;
    if (this.timer > this.goalTime) {
      
        if (this.state == "sprout") {
          this.state = "bloom";
          scene.remove(this.sprout);
          // this.sprout.dispose();
          this.bloom = bloom.clone();
          scene.add(this.bloom);
          this.bloom.position.set(this.x,this.y,this.z);
          this.timer = 0;
          this.goalTime = 600 + Math.floor(400*Math.random());
        } else if (this.state == "bloom") {
          this.state = "pollen";
          this.bloom.add(this.aura);
          this.timer=0;
          beep2.play();
          
        }
      
    }
    this.aura.rotation.z += .1
  }
}

for (let i=0; i<6; i++) {
  allFlowers.push(new FlowerObj(0.5+20*Math.random(),0.5+19*Math.random()))
}
allFlowers[0].timer = 1000;

/*
################
PRINTING SPRITE FONT
################
*/

// FIX SPRITE SHEET
var font_sheet = new Image();
font_sheet.src = "data/pico8_font_white.png";

var print = function(str, x, y) {
  str = str.toUpperCase();
  for (let ii=0; ii < str.length; ii++) {
    let xsheet, ysheet;
    let char = str[ii].charCodeAt(0);
    if (char < 65) {
      ysheet = 24;
      xsheet = (char - 48)*8;
    } else {
      ysheet = 48 + 8*Math.floor((char - 64)/16);
      xsheet = ((char - 64)%16)*8;
    };
    ctx.drawImage(font_sheet,xsheet,ysheet,8,8,x+8*ii,y,16,16);
  }
};



/*
################
CONTROLLER
################
*/

controller = {

left:false,
right:false,
up:false,
down:false,
keyListener:function(event) {
  var key_state = (event.type == "keydown")?true:false;
  switch(event.keyCode) {
    case 37:// left key
      controller.left = key_state;
    break;
    case 38:// up key
      controller.up = key_state;
    break;
    case 39:// right key
      controller.right = key_state;
    break;
    case 40:// down key
      controller.down = key_state;
    break;
  }
}
};

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

/*
################
ENTITY CREATION
################
*/




var player = {
  height:1,
  jumping:true,
  width:1,
  x:10, 
  x_velocity:0,
  x_velocity_goal:0,
  y:10,
  y_velocity:0,
  y_velocity_goal:0,
  z:1.65,
  z_velocity:0,
  total_velocity:0,
  angle:90,
  dead: false,
  speed: 0.1,
  glow: false,
  flash: false,
  flashtime: 0,
  glowtime:0,
  pollinated: false,
  aura: playerAura,
};

let vectorUp = new THREE.Vector3(0,0,1);

let bloom1 = new FlowerObj(player.x+4, player.y);
bloom1.state = "bloom";
scene.remove(bloom1.sprout);
bloom1.bloom = bloom.clone();
scene.add(bloom1.bloom);
bloom1.bloom.position.set(bloom1.x,bloom1.y,bloom1.z);
bloom1.timer = 700;

allFlowers.push(bloom1);


// thislevel = buildlevel(currentlevel);

/*
################
UPDATE
################
*/

let walkTime = 0;
let globalTime = 0;
let heightAdd = 0;
let heightAddGoal = 0;
let footSwing = 0;
let footSwingGoal = 0;
let xAddGoal = 0;
let yAddGoal = 0;
let zAddGoal = 0;
let xAdd = 0;
let yAdd = 0;
let zAdd = 0;
let progress = 0;
let win = false;
let interacted=false;
let musicOn=false;

camera.position.x = player.x;
camera.position.y = player.y-10;
camera.position.z = player.z+4;
camera.lookAt(player.x,player.y,player.z+1)

update = function() {

  if (!win) {globalTime += 1}

  // move the player

  player.y_velocity_goal = 0;
  player.x_velocity_goal = 0;

  if (controller.up) {
    player.y_velocity_goal = 0.05;
    interacted=true;
  };
  if (controller.down) {
    player.y_velocity_goal = -0.05;
    interacted=true;
  };
  if (controller.right) {
    player.x_velocity_goal = 0.05;
    interacted=true;
  };
  if (controller.left) {
    player.x_velocity_goal = -0.05;
    interacted=true;
  };

  player.y_velocity_goal = player.y_velocity_goal*((player.x_velocity_goal==0) + 0.707*(player.x_velocity_goal!=0));
  player.x_velocity_goal = player.x_velocity_goal*((player.y_velocity_goal==0) + 0.707*(player.y_velocity_goal!=0));

  player.y_velocity += (player.y_velocity_goal - player.y_velocity)/2;
  if (Math.abs(player.y_velocity_goal - player.y_velocity) < 0.001) {player.y_velocity = player.y_velocity_goal}

  player.x_velocity += (player.x_velocity_goal - player.x_velocity)/2;
  if (Math.abs(player.x_velocity_goal - player.x_velocity) < 0.001) {player.x_velocity = player.x_velocity_goal}

  player.y += player.y_velocity;
  player.x += player.x_velocity;

  if (player.x < 0) {player.x = 0}
  if (player.x > 20) {player.x = 20}
  if (player.y < 0) {player.y = 0}
  if (player.y > 20) {player.y = 20}

  // if player.y

  if (player.y_velocity != 0 | player.x_velocity != 0 ){
    player.angle = Math.atan2(player.y_velocity, player.x_velocity);
    walkTime += 1;
  } else {
    walkTime = 0;
  }

  heightAddGoal = 0.2 * Math.abs((Math.sin(walkTime/5))**4);
  footSwingGoal = 0.4 * Math.sin(walkTime/5);
  heightAdd += (heightAddGoal - heightAdd)/2;
  footSwing += (footSwingGoal - footSwing)/2;
  
  bee.position.z = heightAdd;
  legLeft.position.y = footSwing;
  legRight.position.y = -footSwing;
  armLeft.position.y = -0.5*footSwing;
  armRight.position.y = 0.5*footSwing;
  
  beeAll.position.x = player.x;
  beeAll.position.y = player.y;
  beeAll.position.z = player.z;
  beeAll.setRotationFromAxisAngle(vectorUp,player.angle - Math.PI*0.5);

  xAddGoal = 20*player.x_velocity_goal;
  xAdd += (xAddGoal - xAdd)/30
  yAddGoal = 30*player.y_velocity_goal;
  yAdd += (yAddGoal - yAdd)/30

  camera.position.x = player.x+xAdd;
  camera.position.y = player.y-10 + yAdd;
  camera.position.z = player.z+4;

if (!win) {  
  for (let i = 0; i < allFlowers.length; i++) {
    f = allFlowers[i]
    if (f.state == "pollen") {
      if (Math.abs(f.x-player.x)<1 & Math.abs(f.y-player.y)<1) {
        if (player.pollinated) {
          player.pollinated = false;
          bee.remove(player.aura);
          let seedCount = 2 + Math.floor(5*Math.random());
          for (let i=0; i < seedCount; i++) {
            allSeeds.push(new SeedObj(f.x,f.y));
          }
          f.state = "bloom";
          f.timer=0;
          f.bloom.remove(f.aura);
          beep1.play();
          f.goalTime = 600 + Math.floor(400*Math.random());
        } else {
          player.pollinated = true;
          bee.add(player.aura);
          f.state = "bloom";
          f.timer=0;
          f.bloom.remove(f.aura);
          beep1.play();
          f.goalTime = 600 + Math.floor(400*Math.random());
        }
      }
    }
    
    f.update();
  }

  for (let i = 0; i < allSeeds.length; i++) {
    if (allSeeds[i].dead) {
      
      allSeeds.splice(i,1);
      
    } else {
      allSeeds[i].update();
    }
    
  }}

  progress = allFlowers.length;
  if (progress > 150) {
    win = true;
    music.stop();
  }

  if (interacted) {
    if (!musicOn) {
      music.play();
      musicOn=true;
    }
  }

}

/*
################
DRAW
################
*/

draw = function() {

    ctx.fillStyle = listColors[6];
    // ctx.fillRect(0, 0, 400, 240);// x, y, width, height
    ctx.fillStyle = listColors[0];

    renderer.render( scene, camera );
    

    ctx.drawImage(renderer.domElement,0,0,400,240);
    


    print("pollinate the garden      progress: " + String(progress) + " of 150", 11,12);
    print("time: " + String(Math.floor(globalTime/60)), 11,24);

    if (win) {
      print("You saved the garden", 60,100);
      print("title: pollinate the garden", 100,120);
      print("author: palo blanco games", 100,132);
      print("thrown together for ldj46", 100,144);
      print("Apr 20 2020", 100,156);
    }
    

    context.drawImage(offCanvas,0,0,pixelRatio*basescale*400,pixelRatio*basescale*240);

    
}

/*
################
MAIN LOOP
################
*/


loop = function() {

  update();
  draw();
  window.requestAnimationFrame(loop);



};

/*
################
SET UP LISTENERS AND START!
################
*/

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);