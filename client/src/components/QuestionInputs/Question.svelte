<script>
    import { submittable, surveyId, baseURL } from "../../stores/generalStore.js";
	import CheckboxAnswer from "../AnswerInputs/CheckboxAnswer.svelte";
	import DateAnswer from "../AnswerInputs/DateAnswer.svelte";
	import NumberAnswer from "../AnswerInputs/NumberAnswer.svelte";
	import RadioAnswers from "../AnswerInputs/RadioAnswers.svelte";
	import RatingAnswer from "../AnswerInputs/RatingAnswer.svelte";
	import TextAnswer from "../AnswerInputs/TextAnswer.svelte";

	let questionsPostedId;
	let selected;
	let newQuestion;
	let count = 0;
    let answersArray = [];
	$: $surveyId, saveQuestion();

	addAnswer();

	function checkSubmit(newAnswer) {
		if(newQuestion) {
			submittable.set(true);
		}
		if(newAnswer) {
			submittable.set(true);
		}
	}

    function addAnswer() {
        count += 1;
        answersArray = answersArray.concat({ answer: ""});
		submittable.set(false)
    }

	function removeAnswer() {
        count -= 1;
        answersArray.pop();
		answersArray = answersArray;
		submittable.set(true)
    }

	async function saveQuestion() {
        const response = await fetch($baseURL + '/api/questions', {
            method: 'POST',
            headers: {
                "content-type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                question: newQuestion,
				questionType: Number(selected),
				surveyId: $surveyId
            })
		});
        const result = await response.json();
		if (response.status === 200) {
            questionsPostedId = result.postedId;
			saveAnswer()
        }
	}

	async function saveAnswer() {
		answersArray.filter(answer => {
			return answer.answer !== "";
		})
		if(answersArray.length > 0) {
			const response = await fetch($baseURL + '/api/answers/questions/'+questionsPostedId, {
				method: 'POST',
				headers: {
					"content-type": "application/json",
					"Accept": "application/json"
				},
				body: JSON.stringify({
					surveyId: $surveyId,
					answers: answersArray,
					preset: true
				})
			});
			const result = await response.json();
			if (response.status === 200) {
				questionsPostedId = 0;
				submittable.set(false);
			}
		}
        
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
		<option value="6">Number</option>
	</select>
	<h3>Ask a Question</h3>
	<textarea class="text-area" on:change={checkSubmit} bind:value="{newQuestion}" placeholder="Write the question here" cols="50" rows="3" maxlength="150"></textarea>
	
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
		<RatingAnswer min=1 max=5/>
	{/if}
	{#if selected && Number(selected) === 3}
		{#each answersArray as answerNumber (answerNumber)}
			<input on:change={checkSubmit(answerNumber.answer)} placeholder="What's a possible answer?" bind:value={answerNumber.answer}>
			<CheckboxAnswer preAnswer={answerNumber.answer} />
		{/each}
		<button on:click={addAnswer}>Add Answer</button>
		{#if answersArray.length > 0}
			<button on:click={removeAnswer}>Remove Answer</button>
		{/if}
	{/if}
	{#if selected && Number(selected) === 4}
		{#each answersArray as answerNumber (answerNumber)}
			<input on:change={checkSubmit(answerNumber.answer)} placeholder="What's a possible answer?" bind:value={answerNumber.answer}>
			<RadioAnswers preAnswer={answerNumber.answer} />
		{/each}
		<button on:click={addAnswer}>Add Answer</button>
		{#if answersArray.length > 0}
			<button on:click={removeAnswer}>Remove Answer</button>
		{/if}
		
	{/if}
	{#if selected && Number(selected) === 5}
		<DateAnswer />
	{/if}
	{#if selected && Number(selected) === 6}
		<NumberAnswer />
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