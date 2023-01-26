import	constants from './constants';
import	{ ref } from 'vue'


class Board {
	cols: number;
	rows: number;
	width: number;
	height: number;
	canvas: CanvasRenderingContext2D | null;
	grid: Array<Array<number>>;
	
	constructor	(){
		this.cols = constants.COLS;
		this.rows = constants.ROWS;
		this.width = constants.COLS * constants.BLOCK_SIZE;
		this.height = constants.ROWS * constants.BLOCK_SIZE;
		this.canvas = null;
		this.grid = this.getEmptyBoardGrid();
	}
	startGame(): void{
		console.log("game-loop would start here");
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
}

export const board = ref( new Board());