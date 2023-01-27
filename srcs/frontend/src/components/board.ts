import	constants from './constants';
import	{ ref, resolveTransitionHooks } from 'vue';
import  { Vector2 } from './constants'
import  { Jtetromino } from './pieces';



const moves = {
	ArrowLeft : (p : Jtetromino) : Vector2 =>  new Vector2(p.position.x - 1, p.position.y),
	ArrowRight : (p : Jtetromino) : Vector2 =>  new Vector2(p.position.x + 1, p.position.y),
	ArrowDown : (p : Jtetromino) : Vector2 =>  new Vector2(p.position.x, p.position.y + 1),
/* 	[KEY.LEFT] : (p : Jtetromino) : Vector2 => {...p, x: p.x - 1},
	[KEY.LEFT] : (p : Jtetromino) : Vector2 => {...p, x: p.x - 1},*/
}

class Board {
	cols: number;
	rows: number;
	width: number;
	height: number;
	canvas: CanvasRenderingContext2D | null;
	grid: Array<Array<number>>;
	piece: Jtetromino | null;
	
	constructor	(){
		this.cols = constants.COLS;
		this.rows = constants.ROWS;
		this.width = constants.COLS * constants.BLOCK_SIZE;
		this.height = constants.ROWS * constants.BLOCK_SIZE;
		this.canvas = null;
		this.grid = this.getEmptyBoardGrid();
		this.piece = null;
	}

	canvasInit(canvas: HTMLCanvasElement): void{
		this.canvas = canvas.getContext('2d');
		this.canvas!.scale(constants.BLOCK_SIZE, constants.BLOCK_SIZE);
	}
	getEmptyBoardGrid(): Array<Array<number>> {
		return Array.from(
			{length: constants.ROWS}, (): Array<number> => Array(constants.COLS).fill(0)
		);
	}
	reset(): void {
		this.grid = this.getEmptyBoardGrid();
	}	
	startGame(): void{
		window.addEventListener('keydown', e => {
			e.preventDefault();
			
			const pressedKey = e.key as keyof typeof moves;
			console.log(`keycode ${ e.key}`);
			console.log(`keyPressed ${ pressedKey}`);
			let p = moves[pressedKey](this.piece!)
			this.piece!.move(p);
			this.canvas!.clearRect(0, 0, this.canvas!.canvas.width, this.canvas!.canvas.height);

			this.piece?.draw();
		})
		console.log("game-loop would start here");
		console.table(this.grid);
		this.reset();
		let piece = new Jtetromino(this.canvas!);
		piece.draw();
		this.piece = piece;
	}
}

export const board = ref( new Board());