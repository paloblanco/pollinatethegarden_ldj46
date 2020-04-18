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
pixelRatio = 1.5;//window.devicePixelRatio;

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
    camera.position.set( 0, -7, 0 );
    camera.lookAt(0,0,0);
    // the above line is equivalent to doing the following:
    // camera.position.x = 0;
    // camera.position.y = 0;
    // camera.position.z = 10;

    // create a geometry
    const geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );

    // create a purple Basic material
    const material = new THREE.MeshStandardMaterial( { color: listColorsHex[2] } );
    const material2 = new THREE.MeshBasicMaterial( { color: listColorsHex[2] } );

    // create a Mesh containing the geometry and material
    mesh = new THREE.Mesh( geometry, material );
    mesh2 = new THREE.Mesh( geometry, material2 );

    // add the mesh to the scene
    scene.add( mesh );
    scene.add( mesh2 );
    mesh2.position.set(3,0,0);

    //add a light to the scene
    const light = new THREE.DirectionalLight(0xffffff, 5.0);

    //move the light, since its default position is 000
    light.position.set(0,-3,3);

    //add the light to the scene
    scene.add(light);

    // create a renderer
    renderer = new THREE.WebGLRenderer({antialias: false});
    renderer.setSize( basewidth, baseheight );

}

init();



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
  x:0, // center of the canvas
  x_velocity:0,
  x_draw:0,
  y:0,
  y_velocity:0,
  y_draw:0,
  dead: false,
  speed: 0.1,
  glow: false,
  flash: false,
  flashtime: 0,
  glowtime:0,
};

class corpse {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.y_velocity = 0;
    this.jumping = true;
    this.x_draw = 0;
    this.y_draw = 0;
  }
}


// thislevel = buildlevel(currentlevel);

/*
################
UPDATE
################
*/

update = function() {

  // move the camera

  if (controller.up) {
    camera.position.y += 0.05;
  };
  if (controller.down) {
    camera.position.y += -0.05;
  };
  if (controller.right) {
    camera.position.x += 0.05;
  };
  if (controller.left) {
    camera.position.x += -0.05;
  };
  
  
  // animate our cube a little bit
  mesh.rotation.z += 0.01;
  mesh.rotation.y += 0.01;
  mesh.rotation.x += 0.01;

  mesh2.rotation.z += 0.01;
  mesh2.rotation.y += 0.01;
  mesh2.rotation.x += 0.01; 
    

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
      
    // context.scale(basescale*pixelRatio, basescale*pixelRatio);

    

    // render, or 'create a still image', of the scene
    // this will create one still image / frame each time the animate
    // function calls itself
    

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