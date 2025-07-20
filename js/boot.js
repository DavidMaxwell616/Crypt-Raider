const Game_State = {
  INTRO: 0,
  LEVEL_INTRO: 1,
  LEVEL: 2,
  LEVEL_TRANSITION: 3,
  GAME_OVER: 4
};
const BLOCK_SIZE = 50;
const GAME_WIDTH = 900;
const GAME_HEIGHT = 650;
var blocks;
var splash;
var glow1;
var glow2;
var glow1_scale = 2.5;
var glow2_scale = 2.5;
var glow1_grow = .05;
var glow2_grow = .01;
var start_button;
var start_button2;
var level = 2;
var get_ready;
var backgroundImage;
var score = 0;
var objectData;
var levelData;
//var platforms;
var map;
var layer;
var tileset;
var levelText;
var levelCode;
var startText;
var cursors;
var portal;
var portal_open;
var portalOpen;
var player_level_won;
var player_level_intro;
var info_group;
var level_complete;

const PLAYER_LEVEL_INTRO = 'player level intro';
const PLAYER_LEVEL_WON = 'player level won';

const Level_Codes =
  [
    'l3VIFNXL6O0',
    'l1GDCJTH4BU',
    'lDIIBX80DTS',
    'lZ4DJKCGM46',
    'lY8BUJAAHML',
    'l3DQ84AHPJ2',
    'lUATCLAZHAU',
    'lKPU91XGSMG',
    'lXPQ5V9CO5S',
    'lPXAA197342',
    'lUZLUV05WJ5',
    'lIHFREW7HFB',
    'l8I1NH0NLMS',
    'lL0LOD3SNZQ',
    'lV9HLCQJW0Z',
    'lWVJKG7WORV',
    'lGE5EEHX239',
    'lB9Z887UJ0P',
    'l2GYU2W1AKA',
    'lCFF6Z4PWAQ',
    'lS3F44JY4LG',
    'lMCY5EP0UDX',
    'lSVIXSLLG49',
    'l6PEUSYSJ3I',
    'lU6I3685MLA',
    'lA99B9759UZ',
    'lI6BN8BHK5E',
    'lLWB65SAYF1',
    'lRVWMYMRB4F',
    'l2VRIKKRJXL',
    'l6R96LV6DI4',
    'lZF72GXQZNZ',
    'l65EZUDIEPY',
    'lDA13UNFJIA',
    'lM55VJPWZXS',
    'l2BYN8X5WMB',
    'l477S23DCHQ',
    'lKZREX9NC48',
    'lT54PBR00R0',
    'lAMWC2NCB6O',
    'lECB7Q1YR31',
    'lIX4WJ175Q7',
    'lLH0I4E6BUP',
    'lK4W7EY3F3I',
    'l5Z5IV6Q7GE',
    'lJX9RNBGA9Y',
    'lY86UHYAJ5R',
    'l2G30XY0ZTZ',
    'lCFE5W9IQIP',
    'lIPJPM2J8DG',
    'lPBUTYDDH4Z',
    'lVS1P2DSMGY',
    'lRAKL3OBAHV',
    'lGKVTIJSUSR',
    'lNA5DFCGCME',
    'lPG3EV7U2KG',
    'lLG0Z00AF28',
    'lC2M94DQVTL',
    'lMDYO005UQ6',
    'l7NMKJOJ2UG',
    'lJ3ZAHFIEC8',
    'lRW5KJ9IBE2',
    'l38J7PF4HZO',
    'l40GRJBNOV2',
    'lE5SUVG3LY4',
    'lD4FBOJDP3F',
    'lVOIFB8UYQQ',
    'lBOB1L58LEI',
    'lV84THCBUN9',
    'l9P8JTWVPEM',
    'lMGQPWHO4VO',
    'lV051W4XM7C',
    'lR6LFWJE51K',
    'lR4GDSNGVH3',
    'lALPXUSWXCB',
    'l4IFHR3HVVH',
    'lSDMMDWK2A1',
    'lNN80D14B8D',
    'lDDACAL94S9',
    'lVEBAZGWPGN',
    'l8Y8HTQM86I',
    'l7ZK42H0DR8',
    'lFHQKVSBGZ9',
    'lS6Q1ER5H9L',
    'lS1HZG3STX1',
    'lDXVKCB2TB7',
    'lMUDNJEZOJH',
    'lBL1Z05VKX1',
    'lZ174NPKCBT',
    'lP41MV540WW',
    'lUMXVPC54CP'
  ];
