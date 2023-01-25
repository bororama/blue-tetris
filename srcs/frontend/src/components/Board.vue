<script setup lang="ts">
import	constants from './constants.ts';
import { ref } from 'vue';

class Board {
	cols: number;
	rows: number;
	width: number;
	height: number;
}

const board = new Board();

board.cols = constants.COLS;
board.rows = constants.ROWS;
board.width = constants.COLS * constants.BLOCK_SIZE;
board.height = constants.ROWS * constants.BLOCK_SIZE;

</script>

<template>
	<canvas class='board' :width="board.width" :height="board.height"></canvas>
</template>

<style scoped>

.board
{
	border: 3px solid red;/* for testing purposes */
}

</style>
