<script>
    import { baseURL } from "../../stores/generalStore.js";
	import CheckboxAnswer from "../AnswerInputs/CheckboxAnswer.svelte";
	import DateAnswer from "../AnswerInputs/DateAnswer.svelte";
	import RadioAnswers from "../AnswerInputs/RadioAnswers.svelte";
	import RatingAnswer from "../AnswerInputs/RatingAnswer.svelte";
	import TextAnswer from "../AnswerInputs/TextAnswer.svelte";

	export let surveyId;
	let questionsPostedId = 0;
	let selected;
	let newQuestion;
	let count = 0;
    let answersArray = [];


    function addAnswer() {
        count += 1;
        answersArray = answersArray.concat({surveyId: surveyId, answer: ""});
        console.log(answersArray);
    }

	async function saveQuestion() {
		console.log("Saving question?");
        const response = await fetch($baseURL + '/api/questions', {
            method: 'POST',
            headers: {
                "content-type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                newQuestion,
				surveyId
            })
		});
        const result = await response.json();
        console.log(result);
		if (response.status === 200) {
            questionsPostedId = result.postedId;
			surveyId = 0;
        }
	}

	async function saveAnswer() {
        const response = await fetch($baseURL + '/api/answers/questions/'+questionsPostedId, {
            method: 'POST',
            headers: {
                "content-type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
				answer: answersArray,
                preset: false
            })
		});
        const result = await response.json();
        console.log(result);
		if (response.status === 200) {
            questionsPostedId = result.postedId;
			surveyId = undefined;
        }
	}

	if(surveyId > 0) {
		console.log("Saving Question");
		saveQuestion();
	}
	if(questionsPostedId > 0) {
		console.log("Saving Answers");
		saveAnswer();
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
		<p>{newQuestion}</p>
	{:else}
		<p>"Your Question here"</p>
	{/if}
	
	{#if selected && Number(selected) === 1}
		
		<TextAnswer />
	{/if}
	{#if selected && Number(selected) === 2}
		<RatingAnswer />
	{/if}
	{#if selected && Number(selected) === 3}
		{#each answersArray as answerNumber}
			<input placeholder="What's a possible answer?" bind:value={answerNumber.answer}>
			<CheckboxAnswer preAnswer={answerNumber.answer} />
		{/each}
		<button on:click={addAnswer}>Add Answer</button>
	{/if}
	{#if selected && Number(selected) === 4}
		{#each answersArray as answerNumber}
			<input placeholder="What's a possible answer?" bind:value={answerNumber.answer}>
			<RadioAnswers preAnswer={answerNumber.answer} />
		{/each}
		<button on:click={addAnswer}>Add Answer</button>
	{/if}
	{#if selected && Number(selected) === 5}
		<DateAnswer />
	{/if}

</div>



<style>
	.question-n-type {
		display: flex;
		flex-direction: column;
	}
	.question-select {
		width: 200px;
	}
</style>