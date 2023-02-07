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

    setColor(newColor : string) {
        this.color = newColor;
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
    }
}


class Otetromino extends Tetromino{
    constructor (canvas: CanvasRenderingContext2D, color : string){
        const shape: Array<Array<number>> = [
            [3, 3],
            [3, 3],
        ];
        super(canvas, color, shape);
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
    }
}

class Ttetromino extends Tetromino{
    constructor (canvas: CanvasRenderingContext2D, color : string){
        const shape: Array<Array<number>> = [
            [0, 0, 0],
            [6, 6, 6],
            [0, 6, 0],
        ];
        super(canvas, color, shape);
    }
}

class Itetromino extends Tetromino{
    constructor (canvas: CanvasRenderingContext2D, color : string){
        const shape: Array<Array<number>> = [
            [0, 0, 7, 0],
            [0, 0, 7, 0],
            [0, 0, 7, 0],
            [0, 0, 7, 0],
        ];
        super(canvas, color, shape);
    }
}

export  {Tetromino, Jtetromino, Ltetromino, Itetromino, Otetromino, Ztetromino, Stetromino, Ttetromino};