const COLS: number = 10;
const ROWS: number = 20;
const BLOCK_SIZE: number = 30;

class Vector2{
	x : number;
	y : number;

	constructor (x: number, y:number){
		this.x = x;
		this.y = y;
	}
};

export default {
	COLS: COLS,
	ROWS: ROWS,
	BLOCK_SIZE: BLOCK_SIZE,
}

const POINTS = [
	0, /* NO LINES */
	100, /* SINGLE */
	300, /* DOUBLE */
	500, /* TRIPLE */
	800, /* TETRIS */
]

const LINES_PER_LEVEL = 10;

const LEVEL = [
	800,
	700,
	600,
	500,
	400,
	300,
	200,	
]

const KEYS = [
	'ArrowUp',
	'ArrowRight', 
	'ArrowDown', 
	'ArrowLeft', 
	'a', 
	'c', 
	'z', 
	' ',
]


const MAX_LEVEL = 7;

const GAME_SYSTEM = {
	POINTS : POINTS,
	LINES_PER_LEVEL : LINES_PER_LEVEL,
	LEVEL : LEVEL,
	MAX_LEVEL : MAX_LEVEL,
	KEYS : KEYS,
}

Object.freeze(GAME_SYSTEM);

export  {Vector2, GAME_SYSTEM};