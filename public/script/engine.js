var Engine = {};

window.addEventListener("load", function(){
  Engine.init();
});

Engine.init = function(){
  this.renderer = new PIXI.WebGLRenderer(800,600);
  document.body.appendChild(this.renderer.view);

  this.stage = new PIXI.Container();
  this.stage.interactive = true;

  PIXI.loader
    .add("warrior", "images/warrior.png")
    .add("sWarrior", "images/warrior.json")
    .load(function(loader,resources){
      Engine.ready(loader,resources);
    });

  this.lastTime = 0;
};

Engine.ready = function(loader, resources)
{
  this.warrior = new Engine.AnimSprite(resources.sWarrior.data,resources);
  this.warrior.x = 200;
  this.warrior.y = 200;
  this.warrior.interactive = true;
  this.warrior.click = function(mD) {
    Engine.warrior.setAnim("attack");
  };
  this.stage.addChild(this.warrior);
  
  this.loop();
};

Engine.loop = function(){
  requestAnimationFrame(Engine.loop);
  
  var currentTime = (new Date()).getTime();
  var dt = (currentTime - Engine.lastTime) / 1000;
  Engine.lastTime = currentTime;

  Engine.warrior.animate(dt);
  Engine.renderer.render(Engine.stage);
};
