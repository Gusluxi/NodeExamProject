<script>
    import { baseURL } from "../../stores/generalStore.js";
	import CheckboxAnswer from "../AnswerInputs/CheckboxAnswer.svelte";
	import DateAnswer from "../AnswerInputs/DateAnswer.svelte";
	import RadioAnswers from "../AnswerInputs/RadioAnswers.svelte";
	import RatingAnswer from "../AnswerInputs/RatingAnswer.svelte";
	import TextAnswer from "../AnswerInputs/TextAnswer.svelte";

	
	let selected;
	let newQuestion;
	let count = 0;
    let answersArray = [];

    function addAnswer() {
        count+= 1;
        answersArray.push([count]);
        answersArray = answersArray
    }

</script>
<div class="question-n-type">
	<h3>Select Question type</h3>
	<select class="question-select" bind:value={selected} name="question-type" id="question-type">
		<option value="1">Text Response</option>
		<option value="2">Rating Scale</option>
		<option value="3">Checkbox</option>
		<option value="4">Radio Select</option>
		<option value="5">Date</option>
	</select>
	<h3>Ask a Question</h3>
	<textarea class="text-area" bind:value="{newQuestion}" placeholder="Write the question here" cols="50" rows="3" maxlength="150"></textarea>
	
</div>
<div class="answer-box">
	{#if newQuestion}
		<h2>{newQuestion}</h2>
	{:else}
		<h2>Question</h2>
	{/if}
	
	{#if selected && Number(selected) === 1}
		
		<TextAnswer />
	{/if}
	{#if selected && Number(selected) === 2}
		<RatingAnswer />
	{/if}
	{#if selected && Number(selected) === 3}
		{#each answersArray as answerNumber}
			<h1>{answerNumber}</h1>
			<CheckboxAnswer />
		{/each}
		<button>Add Answer</button>
	{/if}
	{#if selected && Number(selected) === 4}
		{#each answersArray as answerNumber}
			<h1>{answerNumber}</h1>
			<RadioAnswers />
		{/each}
		<button>Add Answer</button>
	{/if}
	{#if selected && Number(selected) === 5}
		<DateAnswer />
		<button>Add Answer</button>
	{/if}

</div>



<style>
	.question-n-type {
		display: flex;
		flex-direction: column;
		margin: auto;
	}
	.question-select {
		margin: auto;
		width: 200px;
	}
	.text-area {
		margin:auto;
	}
</style>