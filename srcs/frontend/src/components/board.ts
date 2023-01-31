import	constants from './constants';
import	{ ref, resolveTransitionHooks } from 'vue';
import  { Vector2 } from './constants'
import  { Tetromino, Jtetromino } from './pieces';
import _ from 'lodash'

function clone(original : Tetromino) : Tetromino {
	return JSON.parse(JSON.stringify(original));
}

type move = (p : Tetromino) => void;
class Moves {
	ArrowLeft : move;
	ArrowRight : move;
	ArrowDown : move;

	constructor (){
		this.ArrowLeft = (p : Tetromino) =>  p.position.x -= 1;
		this.ArrowRight = (p : Tetromino) => p.position.x += 1;
		this.ArrowDown = (p : Tetromino)  =>  p.position.y += 1;
	}
}

class Board {
	cols: number;
	rows: number;
	width: number;
	height: number;
	canvas: CanvasRenderingContext2D | null;
	grid: Array<Array<number>>;
	activePiece: Tetromino | null;
	moves: Moves;
	
	constructor	(){
		this.cols = constants.COLS;
		this.rows = constants.ROWS;
		this.width = constants.COLS * constants.BLOCK_SIZE;
		this.height = constants.ROWS * constants.BLOCK_SIZE;
		this.canvas = null;
		this.grid = this.getEmptyBoardGrid();
		this.activePiece = null;
		this.moves = new Moves;
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
	reset(): void {
		this.grid = this.getEmptyBoardGrid();
	}
	startGame(): void {
		window.addEventListener('keydown', e => {
			let newPosition : Tetromino;
			e.preventDefault();
			
			newPosition = _.cloneDeep(this.activePiece!);
			console.log(`Key :"${e.key}"`);
			if (e.key === ' '){
				console.log("wut");
				/*this.hardDrop(this.activePiece!);*/
			} else {
				const pressedKey = e.key as keyof typeof this.moves;
				this.moves[pressedKey](newPosition)
			}
			if (this.validPosition(newPosition)){
				this.activePiece = newPosition;
				console.table(this.activePiece);
				this.canvas!.clearRect(0, 0, this.canvas!.canvas.width, this.canvas!.canvas.height);
				this.activePiece.draw();
			}
		})
		/*console.table(this.grid);*/
		this.reset();
		let piece = new Jtetromino(this.canvas!);
		this.activePiece = piece;
		this.activePiece.draw();
	}

/*	hardDrop(piece : Tetromino) : Vector2 {
		let position : Vector2;
		let nextPosition : Vector2;

		console.log('dropping hard');
		console.table(this);
		position = piece.position;
		nextPosition = this.moves.ArrowDown(piece);
		while (this.validPosition(piece)){
			position = nextPosition;
			piece.move(position);
			nextPosition = this.moves.ArrowDown(piece);
		}
		return position;
	}*/

	validPosition(piece: Tetromino) : boolean {
		let isValid: boolean = true;
		piece.shape.forEach((row, dy)=> {
			let y = piece.position.y + dy;
			row.forEach((value, dx) => {
				if (value) {
					let x = piece.position.x + dx;
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
		return (y < this.rows);
	}
	insideWalls(x : number): boolean{
		return (0 <= x && x < this.cols);
	}
}

export const board = ref( new Board());