import	constants, { GAME_SYSTEM } from './constants';
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
	'a' : move;

	constructor (){
		this.ArrowLeft = (p : Tetromino) =>  p.position.x -= 1;
		this.ArrowRight = (p : Tetromino) => p.position.x += 1;
		this.ArrowDown = (p : Tetromino)  =>  p.position.y += 1;
		this.ArrowUp = (p : Tetromino) => p.rightRotation();
		this.z = (p : Tetromino) => p.leftRotation();
		this.a = (p : Tetromino) => p.doubleRotation();
	}


}

class Board {
	cols: number;
	rows: number;
	width: number;
	height: number;
	canvas: CanvasRenderingContext2D | null;
	nextPieceCanvas : CanvasRenderingContext2D | null;
	heldPieceCanvas : CanvasRenderingContext2D | null;
	grid: Array<Array<number>>;
	activePiece: Tetromino | null;
	shadowPiece: Tetromino | null;
	heldPiece: Tetromino | null;
	hardDropped : boolean;
	held : boolean;
	moves: Moves;
	initialize : boolean;
	pieceTemplate : Array<Tetromino | null>;
	colorPalette: Array<string>
	account : any;
	points : Array<number>;
	requestId: number;
	pieceGenerator: Array<number>;

	time = {
		start: 0,
		elapsed: 0,
		level: 1000,
	}

	accountValues = {
		score : 0,
		lines: 0,
		level: 0,
	}

	updateAccount(key: any, value: any) {
		let element = document.getElementById(key);
		if (element){
			element.textContent = value;
		}
	}

	constructor	(){
		this.cols = constants.COLS;
		this.rows = constants.ROWS;
		this.width = constants.COLS * constants.BLOCK_SIZE;
		this.height = constants.ROWS * constants.BLOCK_SIZE;
		this.canvas = null;
		this.nextPieceCanvas = null;
		this.heldPieceCanvas = null;
		this.grid = this.getEmptyBoardGrid();
		this.activePiece = null;
		this.shadowPiece = null;
		this.heldPiece = null;
		this.hardDropped = false;
		this.held = false;
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
		this.colorPalette = [
			'white',
			'blue',
			'orange',
			'yellow',
			'green',
			'red',
			'purple',
			'aquamarine',
		]

		this.points = GAME_SYSTEM.POINTS;

		this.account = new Proxy(this.accountValues, {
			set : (target : any, key: string | symbol, value: any) => {
				target[key] = value;
				this.updateAccount(key, value);
				return true;
			}
		});

		this.requestId = 0;

		this.pieceGenerator = [1, 2, 3, 4, 5, 6, 7].sort((a, b) => 0.5 - Math.random());
	}

	canvasInit(canvas: HTMLCanvasElement): void{
		this.canvas = canvas.getContext('2d');
		this.canvas!.scale(constants.BLOCK_SIZE, constants.BLOCK_SIZE);
		
		let tmpCanvas = <HTMLCanvasElement> document.querySelector('.displayNextPiece');

		this.nextPieceCanvas = tmpCanvas.getContext('2d');
		this.nextPieceCanvas!.scale(30, 30);
		
		tmpCanvas = <HTMLCanvasElement> document.querySelector('.displayHeldPiece');
		this.heldPieceCanvas = tmpCanvas.getContext('2d');
		this.heldPieceCanvas!.scale(30, 30);

		this.pieceTemplate = [ 
			new Jtetromino(this.canvas!, this.colorPalette[1]),
			new Ltetromino(this.canvas!, this.colorPalette[2]),
			new Otetromino(this.canvas!, this.colorPalette[3]),
			new Stetromino(this.canvas!, this.colorPalette[4]),
			new Ztetromino(this.canvas!, this.colorPalette[5]),
			new Ttetromino(this.canvas!, this.colorPalette[6]),
			new Itetromino(this.canvas!, this.colorPalette[7]),
		];
	}
	getEmptyBoardGrid(): Array<Array<number>> {
		return Array.from(
			{length: constants.ROWS}, (): Array<number> => Array(constants.COLS).fill(0)
		);
	}
	reset(): void {
		this.grid = this.getEmptyBoardGrid();
		this.account.score = 0;
		this.account.lines = 0;
		this.account.level = 0;
		this.time.level = GAME_SYSTEM.LEVEL[this.account.level];
		this.activePiece = null;
		this.heldPiece = null;
		this.held = false;
	}

	startGameLoop(): void {
		if (this.initialize === true) {
			window.addEventListener('keydown', e => {
				let newPosition : Tetromino;

				if (GAME_SYSTEM.KEYS.includes(e.key)){
					e.preventDefault();
					
					newPosition = _.cloneDeep(this.activePiece!);
					if (e.key === 'c') {
						this.holdPiece();
					}
					else {
						if (e.key === ' ') {
							this.hardDrop(newPosition);
							this.hardDropped = true;
						} else {
							const pressedKey = e.key as keyof typeof this.moves;
							this.moves[pressedKey](newPosition)
							if (e.key === 'ArrowUp' || e.key === 'z') {
								this.unstickRotation(newPosition);
							}
						}
						if (this.validPosition(newPosition)){
							this.activePiece = newPosition;
						}
					}
				}
			})
			this.initialize = false;
		}
		this.reset();
		this.get_next_piece();
		this.gameLoop();
	}
	


	gameOver() {
		cancelAnimationFrame(this.requestId);
		this.canvas!.fillStyle = 'black';
		this.canvas!.fillRect(1, 3, 8, 1.2);
		this.canvas!.font = '1px Arial';
		this.canvas!.fillStyle = 'red';
		this.canvas!.fillText('GAME OVER', 1.8, 4);
	}
	
	gameLoop(now : number = 0) {
		let checkContinuity : Boolean;
		this.time.elapsed = now - this.time.start;
		
		if (this.time.elapsed > this.time.level || this.hardDropped) {
			this.time.start = now;
			this.hardDropped = false;
			//this should commence the endGameloop routine
			checkContinuity = this.drop();
			if (!checkContinuity) {
				return ;
			}
		}
		
		this.shadowPiece = _.cloneDeep(this.activePiece)
		this.shadowPiece!.setColor('#09090909');
		this.hardDrop(this.shadowPiece!);

		this.clearAllCanvases();
		this.draw();
		this.requestId = requestAnimationFrame(this.gameLoop.bind(this));
	}

	pieceGenerationAlgorithm(): number {
		let returnPiece = this.pieceGenerator.pop()! - 1;
		if (this.pieceGenerator.length === 0) {
			this.pieceGenerator = [1, 2, 3, 4, 5, 6, 7].sort((a, b) => 0.5 - Math.random());
		}
		return returnPiece;
	}

	get_next_piece() {
		this.activePiece = _.cloneDeep(this.pieceTemplate[this.pieceGenerationAlgorithm()]);
	}

	holdPiece() {
		let tmp : Tetromino;
		if (this.held) {
			return ;
		}
		tmp = _.cloneDeep(this.pieceTemplate[ this.activePiece!.pieceId - 1]!);
		if (this.heldPiece === null) {
			this.get_next_piece();
		}
		else {
			this.activePiece = this.heldPiece;
		}
		this.heldPiece = tmp;
		this.held = true;
	}

	drop() : boolean {
		let	ghostPiece = _.cloneDeep(this.activePiece!);

		this.moves.ArrowDown(ghostPiece);
		if (this.validPosition(ghostPiece)) {
			this.activePiece = ghostPiece;
		} else {
			this.held = false;
			this.freeze();
			this.clearLine();
			this.get_next_piece();
			if (!this.validPosition(this.activePiece!)) {
				this.gameOver();
				return false;
			}
		}
		return true;
	}

	getLineClearPoints(linesCleared : number) {
		return this.points[linesCleared];
	}

	clearLine() {
		let linesCleared : number;

		linesCleared = 0;
		this.grid.forEach((row, y) => {
			if (row.every(value => {return (value > 0);})) {
				this.grid.splice(y, 1);
				this.grid.unshift(Array(this.cols).fill(0));
				linesCleared++;
			}
		});
		this.account.score += this.getLineClearPoints(linesCleared);
		this.account.lines += linesCleared;
		if (this.account.level < GAME_SYSTEM.MAX_LEVEL && this.account.lines >= GAME_SYSTEM.LINES_PER_LEVEL)
		{
			this.account.level++;
			this.account.lines = 0;
			this.time.level = GAME_SYSTEM.LEVEL[this.account.level];
		}
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

	unstickRotation(rotation : Tetromino) {
		let rightShift : Tetromino;
		let leftShift : Tetromino;

		if (!this.validPosition(rotation)) {
			rightShift = _.cloneDeep(rotation);
			leftShift = _.cloneDeep(rotation);
			
			this.moves.ArrowRight(rightShift);
			this.moves.ArrowLeft(leftShift);
			if (this.validPosition(rightShift)) {
				this.moves.ArrowRight(rotation);
			}
			else if (this.validPosition(leftShift)) {
				this.moves.ArrowLeft(rotation);				
			}
		}
	}
	collided(x : number, y :number) : boolean {
		return (this.grid[x][y] !== 0);
	}


	draw(){
		this.shadowPiece!.draw();
		this.activePiece!.draw();
		this.pieceTemplate[this.pieceGenerator[this.pieceGenerator.length - 1] - 1]!.drawToContext(this.nextPieceCanvas!);
		if (this.heldPiece !== null) {
			this.heldPiece!.drawToContext(this.heldPieceCanvas!);
		}
		for (let row = 0; row < this.rows; ++row){
			for (let col = 0; col < this.cols; ++col){
				if (this.grid[row][col]) {
					this.canvas!.fillStyle = this.colorPalette[this.grid[row][col]];
					this.canvas!.fillRect( col, row, 1, 1);
				}
			}
		}
	}
	
	clearAllCanvases() {
		this.canvas!.clearRect(0, 0, this.canvas!.canvas.width, this.canvas!.canvas.height);
		this.nextPieceCanvas!.clearRect(0, 0, this.nextPieceCanvas!.canvas.width, this.nextPieceCanvas!.canvas.height);
		this.heldPieceCanvas!.clearRect(0, 0, this.nextPieceCanvas!.canvas.width, this.nextPieceCanvas!.canvas.height);
	}

	aboveFloor(y : number): boolean{
		return (y < this.rows);
	}
	insideWalls(x : number): boolean{
		return (0 <= x && x < this.cols);
	}
}

export const board = ref( new Board());