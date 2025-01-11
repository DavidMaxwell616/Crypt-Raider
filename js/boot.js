var level = 1;
var score = 0;
const Game_State = {
  INTRO: 0,
  LEVEL_INTRO: 1,
  LEVEL: 2,
  GAME_OVER: 3
};
const BLOCK_SIZE = 50;
var splash;
var glow1;
var glow2;
var glow1_scale=2.5;
var glow2_scale=2.5;
var glow1_grow = .05;
var glow2_grow = .01;
var start_button;
var level = 1;