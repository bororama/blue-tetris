import	constants from './constants';
import type { Vector2 } from './constants'
import	{ ref } from 'vue'

abstract class Tetromino{
    position: Vector2;
    canvas: CanvasRenderingContext2D;
    color: string;
    shape: Array<Array<number>>;

    constructor (canvas: CanvasRenderingContext2D, color: string, shape: Array<Array<number>>){
        this.position = { x: 3, y: 0 };
        this.canvas = canvas;
        this.color = color;
        this.shape = shape;
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
        console.log(`x:${p.x} y:${p.y}`);
        this.position.x = p.x;
        this.position.y = p.y;
    }
}

class Jtetromino extends Tetromino{
    constructor (canvas: CanvasRenderingContext2D){
        const shape: Array<Array<number>> = [
            [2, 0, 0],
            [2, 2, 2],
            [0, 0, 0],
        ];
        super(canvas, 'blue', shape);
    }
}


export  {Jtetromino};