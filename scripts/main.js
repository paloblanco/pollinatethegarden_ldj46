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
    scene.background = new THREE.Color(listColorsHex[9]);

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
    light.shadow.mapSize.width = 512;  // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5;       // default
    light.shadow.camera.far = 500      // default

    //move the light, since its default position is 000
    // light.position.set(2,-3,4);

    //add the light to the scene
    var light = new THREE.AmbientLight( 0x606060 ); // soft white light
    scene.add(light);

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
      color: listColorsHex[3],
      flatShading: false,
  });

  const greenMaterial = new THREE.MeshStandardMaterial({
    color: listColorsHex[11],
    flatShading: false,
});

  const yellowMaterial = new THREE.MeshStandardMaterial({
    color: listColorsHex[10],
    flatShading: false,
});

  const pinkMaterial = new THREE.MeshStandardMaterial({
    color: listColorsHex[14],
    flatShading: false,
});



  const darkMaterial = new THREE.MeshStandardMaterial({
    color: listColorsHex[0],
    flatShading: true,
});

const auraMaterial = new THREE.MeshStandardMaterial({
  color: listColorsHex[9],
  // flatShading: true,
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
  legLeft = new THREE.Mesh( eyeGeometry, darkMaterial );
  legRight = new THREE.Mesh( eyeGeometry, darkMaterial );
  armLeft = new THREE.Mesh( eyeGeometry, darkMaterial );
  armRight = new THREE.Mesh( eyeGeometry, darkMaterial );

  eyeLeft.position.set(-0.25,0.5,0.25);
  eyeRight.position.set(0.25,0.5,0.25);
  
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
  bee.add( eyeLeft, eyeRight );
  bee.add( stripe1, stripe2, stripe3, armLeft, armRight); 

  beeAll.add(bee);
  beeAll.add(legLeft, legRight);

  const seedGeometry = new THREE.SphereBufferGeometry(0.15,6,6);
  seed = new THREE.Mesh(seedGeometry, greenMaterial);
  seed.castShadow = true;

  sprout = new THREE.Group();
  // scene.add(sprout);
  const stemGeometry = new THREE.CylinderBufferGeometry(0.05,0.05,0.5,6);
  const stem = new THREE.Mesh(stemGeometry, greenMaterial);
  stem.rotation.x = Math.PI/2;
  stem.castShadow = true;
  const sproutTopGeometry = new THREE.SphereBufferGeometry(0.15,4,4);
  const sproutTop = new THREE.Mesh(sproutTopGeometry, greenMaterial);
  sproutTop.castShadow = true;
  sproutTop.position.set(0,0,0.4);
  sproutTop.scale.set(1,1,2)
  const leafGeometry = new THREE.SphereBufferGeometry(0.05,4,4);
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
  flowerCenter.castShadow = true;
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
  }
  update() {
    this.timer += 1;
    if (this.timer > 600) {
      let chance = Math.random();
      if (chance < .005) {
        if (this.state == "sprout") {
          this.state = "bloom";
          scene.remove(this.sprout);
          this.bloom = bloom.clone();
          scene.add(this.bloom);
          this.bloom.position.set(this.x,this.y,this.z);
          this.timer = 0;
        } else if (this.state == "bloom") {
          this.state = "pollen";
          this.bloom.add(this.aura);
          this.timer=0;
        }
      }
    }
    if (this.aura) {this.aura.rotation.z += .1}
  }
}

for (let i=0; i<6; i++) {
  allFlowers.push(new FlowerObj(0.5+20*Math.random(),0.5+19*Math.random()))
}

/*
################
PRINTING SPRITE FONT
################
*/

// FIX SPRITE SHEET
var font_sheet = new Image();
font_sheet.src = "data/pico8_font_nokia.png";

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

//loading other images
var sprite_sheet = new Image();
sprite_sheet.src = "data/phoenix2_nokia.png";

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

var beep = new sound("data/sound_0.wav");

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

var currentlevel = 1;
var timer = 0;
// Level array
var levels = {"1": [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 17, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], "2": [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 32, 0, 8, 2, 2, 4, 0, 17, 0, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2], "3": [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 17, 2, 2, 0, 0, 0, 0, 0, 0, 8, 2, 3, 4, 0, 0, 0, 0, 0, 0, 5, 3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3], "4": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 8, 2, 0, 0, 0, 0, 0, 0, 0, 0, 5, 3, 0, 0, 32, 0, 0, 0, 0, 0, 5, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3], "5": [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 17, 2, 2, 0, 0, 0, 0, 0, 0, 8, 2, 3, 4, 18, 18, 18, 18, 18, 18, 5, 3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3], "6": [0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 8, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 18, 0, 0, 18, 0, 0, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], "7": [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 0, 0, 0, 0, 6, 0, 0, 0, 5, 4, 0, 0, 0, 0, 6, 0, 0, 0, 5, 4, 0, 0, 0, 0, 19, 0, 0, 0, 5, 4, 32, 0, 20, 0, 19, 0, 17, 0, 5, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3], "8": [0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 32, 0, 0, 0, 0, 0, 0, 19, 17, 2, 2, 0, 0, 0, 0, 0, 0, 8, 2, 3, 4, 18, 0, 20, 0, 0, 18, 5, 3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3], "9": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 21, 21, 21, 21, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], "10": [0, 0, 0, 0, 0, 19, 0, 0, 19, 0, 32, 0, 0, 0, 0, 19, 0, 17, 19, 0, 2, 2, 21, 21, 21, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 0, 0, 0, 20, 0, 0, 0, 0, 0, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3], "11": [32, 0, 0, 0, 0, 0, 0, 5, 3, 3, 8, 0, 0, 0, 0, 0, 0, 5, 3, 3, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 18, 18, 18, 18, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3], "12": [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 9, 0, 0, 0, 5, 0, 0, 0, 0, 0, 9, 0, 0, 0, 5, 0, 0, 0, 0, 0, 9, 0, 0, 0, 5, 32, 0, 22, 0, 0, 9, 0, 17, 0, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3], "13": [0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 22, 0, 32, 0, 0, 0, 0, 0, 9, 17, 2, 2, 2, 18, 18, 18, 18, 8, 8, 2, 3, 3, 4, 2, 2, 2, 2, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], "14": [0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 17, 0, 9, 0, 0, 22, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 18, 18, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3], "15": [3, 3, 3, 3, 3, 3, 3, 3, 24, 25, 4, 0, 0, 0, 0, 0, 0, 26, 24, 24, 4, 0, 0, 0, 0, 0, 26, 24, 24, 24, 4, 0, 0, 0, 0, 26, 24, 24, 24, 24, 4, 0, 32, 10, 26, 24, 24, 24, 24, 24, 3, 2, 2, 2, 2, 2, 23, 23, 23, 23], "16": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "17": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "18": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "19": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "20": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "21": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "22": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "23": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "24": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
var mylevel;
var corpselist = [];
var plate = false;
var hitplate = false;

var getblock = function(x,y) {
  let xi = Math.floor((x-2)/8);
  let yi = Math.floor(y/8);
  // let thislevel = levels[currentlevel.toString()];
  let ix = thislevel[xi + yi*10];
  if (ix==19 & plate) {
    ix = 0;
  }
  return ix;
};

var setblock = function(x,y,num) {
  let xi = Math.floor((x-2)/8);
  let yi = Math.floor(y/8);
  // let thislevel = levels[currentlevel.toString()];
  // let ix = thislevel[xi + yi*10];
  thislevel[xi + yi*10] = num;
  return num;
};

var buildlevel = function(lev) {
  let thislevel = levels[currentlevel.toString()];
  for (let i=0; i < thislevel.length; i ++) {
    let ix = thislevel[i];
    if (ix == 32) {
      thislevel[i] = 0;
      phoenix.x = (i%10)*8 + 2;
      phoenix.y = Math.floor(i/10)*8;
    };
  };
  corpselist=[];
  plate = false;
  return thislevel;
};


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



// thislevel = buildlevel(currentlevel);

/*
################
UPDATE
################
*/

let walkTime = 0;
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

camera.position.x = player.x;
camera.position.y = player.y-10;
camera.position.z = player.z+4;
camera.lookAt(player.x,player.y,player.z+1)

update = function() {

  // move the player

  player.y_velocity_goal = 0;
  player.x_velocity_goal = 0;

  if (controller.up) {
    player.y_velocity_goal = 0.05;
  };
  if (controller.down) {
    player.y_velocity_goal = -0.05;
  };
  if (controller.right) {
    player.x_velocity_goal = 0.05;
  };
  if (controller.left) {
    player.x_velocity_goal = -0.05;
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
        } else {
          player.pollinated = true;
          bee.add(player.aura);
          f.state = "bloom";
          f.timer=0;
          f.bloom.remove(f.aura);
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
    


    print("Its Alive!", 11,12);
      
    

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

  // if (i==3) {
    
  //   draw();
  // }

  

  // context.drawImage(renderTarget.texture.mipmaps,0,0,pixelRatio*basescale*400,pixelRatio*basescale*240);



  // call update when the browser is ready to draw again
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