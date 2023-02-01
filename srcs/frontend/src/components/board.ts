import	constants from './constants';
import	{ ref, resolveTransitionHooks } from 'vue';
import  { Vector2 } from './constants'
import  { Tetromino, Jtetromino, Ltetromino, Itetromino, Otetromino, Ztetromino, Stetromino, Ttetromino } from './pieces';
import _ from 'lodash'

function clone(original : Tetromino) : Tetromino {
	return JSON.parse(JSON.stringify(original));
}

type move = (p : Tetromino) => void;
class Moves {
	ArrowLeft : move;
	ArrowRight : move;
	ArrowDown : move;
	ArrowUp	: move;
	'z' : move;

	constructor (){
		this.ArrowLeft = (p : Tetromino) =>  p.position.x -= 1;
		this.ArrowRight = (p : Tetromino) => p.position.x += 1;
		this.ArrowDown = (p : Tetromino)  =>  p.position.y += 1;
		this.ArrowUp = this.rightRotation;
		this.z = this.leftRotation;
	}

	rightRotation(p: Tetromino) {
		this._transposeMatrix(p.shape);
		this._reflectMatrixVertically(p.shape);

	}
	leftRotation(p: Tetromino) {
		this._transposeMatrix(p.shape);
		this._reflectMatrixHorizontally(p.shape);

	}
	private _transposeMatrix(m : Array<Array<number>>) {
		let n : Array<Array<number>>

		n = JSON.parse(JSON.stringify(m));
		for (let row = 0; row < m.length; ++row){
			for (let col = 0; col < m.length; ++col){
				m[row][col]  = n[col][row];
			}
		}
	}
	private _reflectMatrixVertically(m : Array <Array<number>>) {
		let n : Array<Array<number>>

		n = JSON.parse(JSON.stringify(m));
		for (let row = 0; row < m.length; ++row){
			for (let col = 0; col < m.length; ++col){
				m[row][col]  = n[row][n.length - 1 - col];
			}
		}
	}
	private _reflectMatrixHorizontally(m : Array <Array<number>>) {
		let n : Array<Array<number>>

		n = JSON.parse(JSON.stringify(m));
		for (let row = 0; row < m.length; ++row){
			for (let col = 0; col < m.length; ++col){
				m[row][col]  = n[n.length - 1 - row][col];
			}
		}
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
	initialize : boolean;
	pieceTemplate : Array<Tetromino | null>;
	color: Array<string>

	time = {
		start: 0,
		elapsed: 0,
		level: 1000,
	}
	constructor	(){
		this.cols = constants.COLS;
		this.rows = constants.ROWS;
		this.width = constants.COLS * constants.BLOCK_SIZE;
		this.height = constants.ROWS * constants.BLOCK_SIZE;
		this.canvas = null;
		this.grid = this.getEmptyBoardGrid();
		this.activePiece = null;
		this.moves = new Moves;
		this.initialize = true;
		this.pieceTemplate = [ 
			null,
			null,
			null,
			null,
			null,
			null,
			null,
		];
		this.color = [
			'white',
			'blue',
			'orange',
			'yellow',
			'green',
			'red',
			'purple',
			'aquamarine',
		]
	}

	canvasInit(canvas: HTMLCanvasElement): void{
		this.canvas = canvas.getContext('2d');
		this.canvas!.scale(constants.BLOCK_SIZE, constants.BLOCK_SIZE);
		this.pieceTemplate = [ 
			new Jtetromino(this.canvas!),
			new Ltetromino(this.canvas!),
			new Stetromino(this.canvas!),
			new Ztetromino(this.canvas!),
			new Otetromino(this.canvas!),
			new Ttetromino(this.canvas!),
			new Itetromino(this.canvas!),
		];
	}
	getEmptyBoardGrid(): Array<Array<number>> {
		return Array.from(
			{length: constants.ROWS}, (): Array<number> => Array(constants.COLS).fill(0)
		);
	}
	reset(): void {
		this.grid = this.getEmptyBoardGrid();
	}

	startGameLoop(): void {
		if (this.initialize === true) {
			window.addEventListener('keydown', e => {
				let newPosition : Tetromino;
				e.preventDefault();
				
				newPosition = _.cloneDeep(this.activePiece!);
				console.log(`Key :"${e.key}"`);
				if (e.key === ' '){
					this.hardDrop(newPosition);
				} else {
					const pressedKey = e.key as keyof typeof this.moves;
					this.moves[pressedKey](newPosition)
				}
				if (this.validPosition(newPosition)){
					this.activePiece = newPosition;
				}
			})
			this.initialize = false;
		}
		this.reset();
		this.activePiece = _.cloneDeep(this.pieceTemplate[Math.floor(Math.random() *  (this.pieceTemplate.length))]);
		this.animate();
	}



	animate(now : number = 0){
		this.time.elapsed = now - this.time.start;

		if (this.time.elapsed > this.time.level) {
			this.time.start = now;

			this.drop();
		}

		this.canvas!.clearRect(0, 0, this.canvas!.canvas.width, this.canvas!.canvas.height);

		this.draw();
		requestAnimationFrame(this.animate.bind(this));
	}

	drop() : void {
		let	ghostPiece = _.cloneDeep(this.activePiece!);

		this.moves['ArrowDown'](ghostPiece);
		if (this.validPosition(ghostPiece)){
			this.activePiece = ghostPiece;
		} else {
			this.freeze();
			this.clearLine();
			this.activePiece = _.cloneDeep(this.pieceTemplate[Math.floor(Math.random() *  (this.pieceTemplate.length))]);
		}
		//console.table(this.grid);
	}

	clearLine() {
		this.grid.forEach((row, y) => {
			if (row.every(value => {return (value > 0);})) {
				this.grid.splice(y, 1);
				this.grid.unshift(Array(this.cols).fill(0));
			}
		});
	}
	freeze() {
		this.activePiece?.shape.forEach((row, y) => {
			row.forEach((value, x) =>{
				if (value > 0){
					this.grid[y + this.activePiece!.position.y][x + this.activePiece!.position.x] = value;
				}
			});
		});
	}

	hardDrop(piece : Tetromino) : void {
		let ghostPiece : Tetromino;
		let newPosition: Vector2;

		ghostPiece = _.cloneDeep(piece);
		newPosition = new Vector2(ghostPiece.position.x, ghostPiece.position.y);
		while (this.validPosition(ghostPiece)){
			newPosition.x = ghostPiece.position.x;
			newPosition.y = ghostPiece.position.y;
			this.moves.ArrowDown(ghostPiece);
   		}
		piece.position = newPosition;
	}

	validPosition(piece: Tetromino) : boolean {
		let isValid: boolean = true;
		piece.shape.forEach((row, dy)=> {
			let y = piece.position.y + dy;
			row.forEach((value, dx) => {
				if (value) {
					let x = piece.position.x + dx;
					if (!(this.insideWalls(x) && this.aboveFloor(y) && !this.collided(y, x))){
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
	collided(x : number, y :number) : boolean {
		return (this.grid[x][y] !== 0);
	}
	draw(){

		this.activePiece!.draw();
		for (let row = 0; row < this.rows; ++row){
			for (let col = 0; col < this.cols; ++col){
				if (this.grid[row][col]) {
					this.canvas!.fillStyle = this.color[this.grid[row][col]];
					this.canvas!.fillRect( col, row, 1, 1);
				}
			}
		}
	}
	aboveFloor(y : number): boolean{
		return (y < this.rows);
	}
	insideWalls(x : number): boolean{
		return (0 <= x && x < this.cols);
	}
}

export const board = ref( new Board());