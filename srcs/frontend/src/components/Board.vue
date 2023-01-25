<script setup lang="ts">
import	constants from './constants.ts';
import { ref, onMounted } from 'vue';

class Board {
	cols: number;
	rows: number;
	width: number;
	height: number;
	canvas: HTMLCanvasElement;
}


let boardReference = ref(null);
const board = new Board();

board.cols = constants.COLS;
board.rows = constants.ROWS;
board.width = constants.COLS * constants.BLOCK_SIZE;
board.height = constants.ROWS * constants.BLOCK_SIZE;

onMounted( () => {
	board.canvas = boardReference.value.getContext('2d');
	board.canvas.scale(constants.BLOCK_SIZE, constants.BLOCK_SIZE);
});

</script>

<template>
<div class="grid">
	<canvas ref="boardReference" class="board" :width="board.width" :height="board.height"></canvas>
	<div class="right-column">
		<p>Score: <span id="score">0</span></p>
		<p>Lines: <span id="lines">0</span></p>
		<p>Level: <span id="level">0</span></p>
		<canvas id="next" class="next"></canvas>
	</div>
</div>
</template>

<style scoped>

.board
{
	border: 3px solid red;/* for testing purposes */
}

</style>
