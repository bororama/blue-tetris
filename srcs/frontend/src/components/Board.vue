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

.grid
{
	display: grid;
	grid-template-columns: 320px 200px;
}

.right-column
{
	display: flex;
	flex-direction: column;
}

.board
{
	border: 3px solid red;/* for testing purposes */
}


</style>
