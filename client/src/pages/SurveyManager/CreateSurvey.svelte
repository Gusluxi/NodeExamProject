<script>
    import { baseURL } from "../../stores/generalStore.js";
    import Question from "../../components/QuestionInputs/Question.svelte";
import { toast } from "@zerodevx/svelte-toast";
	let title;
    let count = 0;
    let questionsArray = [];
    let surveyPostedId = 0;

    function addQuestion() {
        count+= 1;
        questionsArray.push(count);
        questionsArray = questionsArray
    }
	
	async function newSurvey() {
        if(title) {
            const response = await fetch($baseURL + '/api/surveys', {
                method: 'POST',
                headers: {
                    "content-type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    title
                })
		    });
            const result = await response.json();
            console.log(result);
		    if (response.status === 200) {
                surveyPostedId = result.postedId;
            }
        } else {
            toast.push("Please add a title", {
                theme: {
                    '--toastBackground': '#F56565',
                    '--toastBarBackground': '#C53030'
            }});
        }
	}

</script>
<div class="question-wrapper">
    <h1>Create Survey</h1>
    Survey Title:
    <input bind:value={title} placeholder="Title">
    {#if questionsArray}
        {#each questionsArray as questionNumber}
            <h1>Question {questionNumber}.</h1>
            <Question surveyId={surveyPostedId} questionNumber={questionNumber}/> 
        {/each}
    {/if}

    <button on:click="{addQuestion}">Add New Question</button>

    <button class="btn" on:click="{newSurvey}">Complete Survey</button>
</div>

<style>
    .question-wrapper {
        width: 40%;
        margin: auto;
        text-align: left;
    }
</style>