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

export  {Vector2};