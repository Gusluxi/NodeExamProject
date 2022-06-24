<script>
    import { surveyId, baseURL } from "../../stores/generalStore.js";
    import { useNavigate, useLocation } from "svelte-navigator";
    import Question from "../../components/QuestionInputs/Question.svelte";
    import { toast } from "@zerodevx/svelte-toast";

    const navigate = useNavigate();
    const location = useLocation();

	let title;
    let count = 0;
    let questionsArray = [];

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
                surveyId.set(result.postedId);
                const from = ($location.state && $location.state.from) || "/";
                navigate(from, { replace: true });
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
            <Question /> 
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