var Engine = {};
Engine._extends = function(ChildClass, ParentClass)
{
    var F = function() { };
    //F.prototype = ParentClass.prototype;
    for(var n in ParentClass.prototype)
      F.prototype[n] = ParentClass.prototype[n];
    for(var m in ChildClass.prototype)
        F.prototype[m] = ChildClass.prototype[m];
    ChildClass.prototype = new F();
    ChildClass.prototype.constructor = ChildClass;
    ChildClass.prototype._super = ParentClass.prototype;        
};

Engine.init = function(){
  console.log("Init Engine");
  this.loader = new createjs.LoadQueue();
  this.stage = new createjs.Stage("canvas");

  this.loader.on("complete", this.ready, this);
  this.loader.on("error", function(evt){
   console.log("Could not load files: ");
   console.log(evt.data.id);
  });

  this.state = null;
  this.loader.loadManifest("resources.json");
  this.message = "Humans vs Demons!";
};

Engine.setState = function(state){
  createjs.Tween.removeAllTweens();

  this.stage = new createjs.Stage("canvas");
  this.state = state;
  this.state.init();
  
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", this.stage);
  
  document.onkeydown = Engine.onKeyboard;
};

Engine.ready = function(){
  Engine.setState(Engine.Menu);
};

Engine.onKeyboard = function(evt){
  Engine.state.onKeyboard(evt);
};

Engine.reset = function(dir){
  
  if(dir === 1) Engine.message = "Second player wins!";
  else if(dir === -1) Engine.message = "First player wins!";
  else Engine.message = "Draw!";

  Engine.setState(Engine.Menu);

};

function resize(){
  //Engine.stage.canvas.width = window.innerWidth;
  //Engine.stage.canvas.height = window.innerHeight;
  Engine.stage.canvas.width = 800;
  Engine.stage.canvas.height = 600;
  Engine.height = 600;
  Engine.width = 800;
}

function init(){
  Engine.init();
  window.addEventListener("resize",resize,false);
  resize();
}

Engine.randomB = function(){
  return Math.random() < 0.5;
};

Engine.randomR = function(min, max){
  return Math.random() * (max - min) + min;
};

Engine.randomZ = function(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

Engine.randomArr = function(arr){
  if(arr.length < 1) return undefined;
  return arr[this.randomZ(0,arr.length-1)];
};
