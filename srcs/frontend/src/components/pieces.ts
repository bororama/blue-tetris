import	constants from './constants';
import { Vector2 } from './constants'
import	{ ref } from 'vue'

abstract class Tetromino{
    pieceId: number;
    spawnPosition: Vector2;
    position: Vector2;
    canvas: CanvasRenderingContext2D;
    color: string;
    shape: Array<Array<number>>;

    constructor (canvas: CanvasRenderingContext2D, color: string, shape: Array<Array<number>>, spawnPosition : Vector2 = {x: 3, y: 0}){
        this.pieceId = 0;
        this.spawnPosition = new Vector2(spawnPosition.x, spawnPosition.y);
        this.position = spawnPosition;
        this.canvas = canvas;
        this.color = color;
        this.shape = shape;
    }

    drawToContext(context : CanvasRenderingContext2D): void {
        context.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    context.fillRect(x, y, 1, 1);
                }
            });
        });
    }

    draw(): void{
        this.canvas.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.canvas.fillRect( this.position.x + x, this.position.y + y, 1, 1);
                }
            });
        });
    }

    move(p : Vector2): void{
        this.position.x = p.x;
        this.position.y = p.y;
    }

    setColor(newColor : string) {
        this.color = newColor;
    }
    
    rightRotation() {
		this._transposeMatrix(this.shape);
		this._reflectMatrixVertically(this.shape);

	}

	leftRotation() {
		this._transposeMatrix(this.shape);
		this._reflectMatrixHorizontally(this.shape);

	}
	doubleRotation() {
		this.leftRotation();
		this.leftRotation();
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

class Jtetromino extends Tetromino{
    constructor (canvas: CanvasRenderingContext2D, color : string){
        const shape: Array<Array<number>> = [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0],
        ];
        super(canvas, color, shape);
        this.pieceId = 1;
    }
}

class Ltetromino extends Tetromino{
    constructor (canvas: CanvasRenderingContext2D, color : string){
        const shape: Array<Array<number>> = [
            [0, 0, 2],
            [2, 2, 2],
            [0, 0, 0],
        ];
        super(canvas, color, shape);
        this.pieceId = 2;
    }
}


class Otetromino extends Tetromino{
    constructor (canvas: CanvasRenderingContext2D, color : string){
        const shape: Array<Array<number>> = [
            [3, 3],
            [3, 3],
        ];
        super(canvas, color, shape, {x : 4, y : 0});
        this.pieceId = 3;
    }
}

class Stetromino extends Tetromino{
    constructor (canvas: CanvasRenderingContext2D, color : string){
        const shape: Array<Array<number>> = [
            [0, 0, 0],
            [0, 4, 4],
            [4, 4, 0],
        ];
        super(canvas, color, shape);
        this.pieceId = 4;
    }

    rightRotation(): void {
        super.leftRotation();
    }
    leftRotation(): void {
        super.rightRotation();
    }
}

class Ztetromino extends Tetromino{
    constructor (canvas: CanvasRenderingContext2D, color : string){
        const shape: Array<Array<number>> = [
            [0, 0, 0],
            [5, 5, 0],
            [0, 5, 5],
        ];
        super(canvas, color, shape);
        this.pieceId = 5;
    }

    rightRotation(): void {
        super.leftRotation();
    }
    leftRotation(): void {
        super.rightRotation();
    }
}

class Ttetromino extends Tetromino{
    constructor (canvas: CanvasRenderingContext2D, color : string){
        const shape: Array<Array<number>> = [
            [0, 6, 0],
            [6, 6, 6],
            [0, 0, 0],
        ];
        super(canvas, color, shape);
        this.pieceId = 6;
    }
}

class Itetromino extends Tetromino{
    constructor (canvas: CanvasRenderingContext2D, color : string){
        const shape: Array<Array<number>> = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [7, 7, 7, 7],
            [0, 0, 0, 0],
        ];
        super(canvas, color, shape);
        this.pieceId = 7;
    }
    rightRotation(): void {
        super.leftRotation();
    }
    leftRotation(): void {
        super.rightRotation();
    }
}

export  {Tetromino, Jtetromino, Ltetromino, Itetromino, Otetromino, Ztetromino, Stetromino, Ttetromino};