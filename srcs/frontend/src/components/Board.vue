<script setup lang="ts">
import	constants from './constants';
import	{ board } from './board';
import { ref, onMounted } from 'vue';


let boardReference = ref<HTMLCanvasElement>();


onMounted( ():void => {
	board.value.canvasInit(boardReference.value!);
});

</script>

<template>
<div class="grid" >
	<div class="left-column">
		<p>Round: <span id="round">0</span>/5</p>
		<br/>
		<p>Held Piece: </p>
		<canvas class="displayHeldPiece board" width="100" height="100" ></canvas>
	</div>
	<canvas ref="boardReference" class="board" :width="board.width" :height="board.height" ></canvas>
	<div class="right-column">
		<p>Score: <span id="score">0</span></p>
		<p>Lines: <span id="lines">0</span></p>
		<p>Level: <span id="level">0</span></p>
		<br/>
		<p>Next Piece: </p>
		<canvas class="displayNextPiece board" width="100" height="100" ></canvas>
		<br/>

	</div>
</div>
</template>

<style scoped>

.grid
{
	display: grid;
	grid-template-columns: 200px 320px 200px;
}
.left-column, .right-column
{
	display: flex;
	flex-direction: column;
}

.board
{
	border: 3px solid red;/* for testing purposes */
}

.displayNextPiece, .displayHeldPiece
{
	width : 100px;	
}
</style>
