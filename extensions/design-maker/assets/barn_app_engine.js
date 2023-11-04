/*jshint esversion: 6 */
/*jshint -W069 */
/*jslint browser: true */
/*globals ga:false */
/*globals jQuery:false */
/*globals console:false */
/*globals alert:false */
/*globals PIXI:false */
/*globals createjs:false */


function BarnEngine(target,ready_callback){
  var app = this; //reference to this.

  /* =============================================================================================================================
  [ shortcuts ]
  0. __INIT
  1. __EVENT
  2. __GET
  3. __ACTION
  4. __SETUP
  5. __TOOL

  */

  // -----------------------------------------------------------------------------------------------------------------------------
  /* 0. __INIT */
  // ------------------------------------------------------------------
  this.data = { 'display_scale': 1, 'backgroundColor': 0xFFFFFF};

  // -----------------------------------------------------------------------------------------------------------------------------
  /* 1. __EVENT */
  // ------------------------------------------------------------------

  //auto resize to fit
  this.event_resize = function(){
    //console.log('Barn Engine: event_resize');
    let app_size = this.get_size();
    let pixiapp = this.pixiapp;
    pixiapp.renderer.resize(app_size.width, app_size.height);
    this.action_resize_stage();
    console.log(app_size);
  };

  this.event_first_draw =  function(){
    this.get_size();
    this.setup_display();
    this.event_resize();
    this.action_switch_display_mode('front');
    //trigger callback
    ready_callback();
  };

  // -----------------------------------------------------------------------------------------------------------------------------
  /* 2. __GET */
  // ------------------------------------------------------------------
  this.get_size = function(){
    let pixiapp = this.pixiapp;
    this.data.app_width = pixiapp.view.parentNode.clientWidth;
    this.data.app_height = pixiapp.view.parentNode.clientHeight;
    let size_obj = {width: this.data.app_width, height: this.data.app_height};
    return size_obj;
  };

  this.action_convert_base64 = function() {
    console.log("Action Convert Base 64");
        let pixiapp = this.pixiapp;
        //const image = pixiapp.renderer.plugins.extract.base64(this.containers['display']);
        const image = pixiapp.renderer.plugins.extract.base64(this.containers['display']);
        //const canvas = pixiapp.renderer.plugins.extract.getcanvas();
        //document.getElementById("dataurl").innerHTML = image
        //var test = pixiappbase64();
        //alert(test);
        console.log(image);
		$("#dm-custom-base64-code").val(image);
    }
  // -----------------------------------------------------------------------------------------------------------------------------
  /* 3. __ACTION */
  // ------------------------------------------------------------------

  //resize and center
  this.action_resize_stage = function(){
    let display = this.containers['display'];
    let app_width = this.data.app_width;
    let app_height = this.data.app_height;
    let app_size = Math.min(app_height,app_width);
    let re_scale = this.data.display_scale;
    display.height = display.width = app_size*re_scale;
    display.position.set((app_width)/2,(app_height)/2);

  };

  this.action_blank_design = function(){
  //for testing
  }

  this.action_set_layer_part = function(layer,image='',content=''){
    console.log("Part Image : " + image);
    if(content == 'blank'){
      this.sprites['front_'+layer].texture = PIXI.Texture.EMPTY;
    }else{
      let front_img = image;
      var new_front_texture = PIXI.Texture.fromImage(front_img);
      this.sprites['front_'+layer].texture = new_front_texture;
    }

    console.log("Ready Part Image");
  };

  this.action_set_layer_text = function(layer,enterText){

    console.log("Text : " + enterText);
    
     var new_text_texture = this.texts['front_'+layer];
      new_text_texture.setText(enterText);


  };


  this.action_set_layer_mask = function(layer,image='',content=''){
    console.log("mask Image : " + image);
    if(content == 'blank'){
      this.sprites['front_'+layer+'_mask'].texture = PIXI.Texture.EMPTY;
    }else{
      let front_img = image;
      var new_front_texture = PIXI.Texture.fromImage(front_img);
      this.sprites['front_'+layer+'_mask'].texture = new_front_texture;
    }
    console.log("Ready Mask Image");
  };

  this.action_show_print = function(print){
    console.log("Ready Print Image");
    console.log(print);

    let print_sprite_front = this.sprites['front_print'];
    var new_print_front = PIXI.Texture.fromImage(print);
    print_sprite_front.blendMode = PIXI.BLEND_MODES.ADD;
    print_sprite_front.texture = new_print_front;
    print_sprite_front.scale.set(1.5);

    this.action_show_masks(true);
    
  };

  this.action_show_masks = function(show){
    let masks = ['skirt_mask'];

    for(n=0;n<1;n++){
      this.sprites['front_'+masks[n]].visible = show;
    }

  };

  //switch display mode (front / back / double)
  this.action_switch_display_mode = function(mode){
    this.display_mode = mode;
    let front_display = true;
    let back_display = true;
    if(mode == 'front'){ back_display = false; }
    this.containers['front'].visible = front_display;
  };

  
  // -----------------------------------------------------------------------------------------------------------------------------
  /* 4. __SETUP */
  // ------------------------------------------------------------------
  this.setup = function(target){
    this.target = target;
    let ready = true;
    if (!window.jQuery) { ready = false; console.log('Barn Engine: no jquery'); }
    if (!window.PIXI){ ready = false; console.log('Barn Engine: no PIXI');}
    if(ready){
      console.log('Barn Engine: READY');
      this.setup_stage();
    }
  };

  //create stage
  this.setup_stage = function(){
    let target = this.target;
    var start_width = $(target).height();
    var start_height = $(target).height();
    let type = "WebGL";
    if(!PIXI.utils.isWebGLSupported()){
      type = "canvas";
    }

    let pixiapp = new PIXI.Application({width: start_width, height: start_height, resolution:2, autoResize:true});
    this.pixiapp = pixiapp;
    pixiapp.renderer.backgroundColor = 0xffffff;
    $(target).append(pixiapp.view);

    pixiapp.render();


    setTimeout(function () {
      app.event_first_draw();
    }, 500);

    window.onresize = function(event) {
        app.event_resize();
    };
  };

  //build the display groups
  this.setup_display = function(){
    //console.log('setup_display');
    this.setup_display_base();
    this.setup_display_limits();
    this.setup_display_groups();

  };

  this.setup_display_base = function(){
    this.data.design_parts = {};
    this.containers = {};
    this.sprites = {};
    this.texts = {};

    let display = new PIXI.Container();
    let app_width = this.data.app_width;
    let app_height = this.data.app_height;
    let app_size = Math.min(app_height,app_width);
    let pixiapp = this.pixiapp;
    pixiapp.stage.addChild(display);
    this.containers['display'] = display;

  };

  this.setup_display_limits = function(){
    //this square sets the bounds of the display so the scaling does not fall over
    let display = this.containers['display'];

    square_base = PIXI.Sprite.from(PIXI.Texture.WHITE);
    square_base.width = 1300;
    square_base.height = 1300;
    square_base.tint = this.data.backgroundColor;
    square_base.anchor.set(0.5);
    square_base.position.set(0,0);

    display.addChild(square_base);
  };

  this.setup_display_groups = function(){
    //front
    this.setup_group('front');
    this.setup_group_layer('front','skirt_mask','');
    this.setup_group_layer('front','print','');
    this.setup_group_layer('front','skirt','');
    this.setup_group_layer('front','text','');

    //hide the mask layers.
    this.action_show_masks(false);
  };

  this.setup_group = function(group_name){
    let display = this.containers['display'];
    let group = new PIXI.Container();
    this.containers[group_name] = group;
    display.addChild(group);
  };

  this.setup_group_layer = function(group_name,layer_name,item_name){
    let group = this.containers[group_name];
    let new_layer = new PIXI.Sprite();
    new_layer.anchor.set(0.5);
    // move the sprite to the center of the screen
    new_layer.x = 0;
    new_layer.y = 0;
    new_layer.scale.set(1);
    group.addChild(new_layer);
    this.sprites[group_name+'_'+layer_name] = new_layer;
    if(layer_name == 'text') {

      var new_text_texture = this.sprites[group_name+'_'+layer_name];
      
      console.log($("#design-maker").attr("data-text-font-size"));
      console.log($("#design-maker").attr("data-text-font-style"));

      const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 55,
        fontStyle: 'normal',
        fontWeight: 'bold'
      });

      test = new PIXI.Text("",style);    
      test.anchor.set(0.5);
      test.x = 0;
      test.y = 0;
      test.scale.set(1);
      new_text_texture.addChild(test);
      this.texts[group_name+'_'+layer_name] = test;
    }

  };


  // -----------------------------------------------------------------------------------------------------------------------------
  /* 5. __TOOL */
  // ------------------------------------------------------------------



  //START
  this.setup(target);
}
