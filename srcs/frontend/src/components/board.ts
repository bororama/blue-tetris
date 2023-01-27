import	constants from './constants';
import	{ ref, resolveTransitionHooks } from 'vue';
import  { Vector2 } from './constants'
import  { Tetromino, Jtetromino } from './pieces';



const moves = {
	ArrowLeft : (p : Tetromino) : Vector2 =>  new Vector2(p.position.x - 1, p.position.y),
	ArrowRight : (p : Tetromino) : Vector2 =>  new Vector2(p.position.x + 1, p.position.y),
	ArrowDown : (p : Tetromino) : Vector2 =>  new Vector2(p.position.x, p.position.y + 1),
}



class Board {
	cols: number;
	rows: number;
	width: number;
	height: number;
	canvas: CanvasRenderingContext2D | null;
	grid: Array<Array<number>>;
	piece: Tetromino | null;
	
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
			let p = moves[pressedKey](this.piece!)
			if (this.validPosition(this.piece! , p))
			{
				this.piece!.move(p);
				this.canvas!.clearRect(0, 0, this.canvas!.canvas.width, this.canvas!.canvas.height);
				this.piece?.draw();
			}
		})
		console.table(this.grid);
		this.reset();
		let piece = new Jtetromino(this.canvas!);
		piece.draw();
		this.piece = piece;
	}

	validPosition(piece: Tetromino, newPosition : Vector2) : boolean {
		let isValid: boolean = true;
		piece.shape.forEach((row, dy)=> {
			let y = newPosition.y + dy;
			row.forEach((value, dx) => {
				if (value) {
					let x = newPosition.x + dx;
					if (! (this.insideWalls(x) && this.aboveFloor(y))){
						isValid = false;
						return isValid;	
					}
				}
			});
			if (!isValid)
				return isValid;
		});
		return isValid;
	}

	aboveFloor(y : number): boolean{
		console.log(`floor now ${y}`);
		return (y < this.rows);
	}
	insideWalls(x : number): boolean{
		return (0 <= x && x < this.cols);
	}
}

export const board = ref( new Board());