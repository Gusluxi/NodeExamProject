<script>
    import { submittable, surveyId, baseURL } from "../../stores/generalStore.js";
    import { useNavigate, useLocation } from "svelte-navigator";
    import Question from "../../components/QuestionInputs/Question.svelte";
    import { toast } from "@zerodevx/svelte-toast";

    const navigate = useNavigate();
    const location = useLocation();
    const maxQuestions = 30;

	let title;
    let count = 0;
    let questionsArray = [];

    addQuestion()

    function addQuestion() {
        count+= 1;
        questionsArray.push(count);
        questionsArray = questionsArray
    }
    function removeQuestion() {
        count-= 1;
        questionsArray.splice(count,1)
        questionsArray = questionsArray;
    }
	
	async function newSurvey() {
        if(title) {
            if($submittable) {
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
                if (response.status === 200) {
                    surveyId.set(result.postedId);
                    const from = ($location.state && $location.state.from) || "/";
                    navigate(from, { replace: true });
                }
            } else {
                toast.push("Please fill the questions and answers", {
                theme: {
                    '--toastBackground': '#F56565',
                    '--toastBarBackground': '#C53030'
                }});
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
            <div class="question-div">
            {#each questionsArray as questionNumber}
                <h1 class="question-header">Question {questionNumber}.</h1>
                <Question /> 
                {#if (count > 1)}
                    <button class="remove-question" on:click="{removeQuestion}">Remove Question</button>
                {/if}
            {/each}
            </div>
            {#if (count < maxQuestions)}
                    <button on:click="{addQuestion}">Add New Question</button>
            {/if}
        {/if}
    
    
    
    
    <button class="btn" on:click="{newSurvey}">Complete Survey</button>
</div>

<style>
    .question-wrapper {
        width: 50%;
        margin: auto;
        text-align: left;
        padding: 20px;
    }

    .question-div {
        border: 5px solid #234ec4;
        padding: 40px;
        margin: 20px 0 20px 0;
        
    }

    .question-header {
        color: #cef6ff
    }

    .remove-question {
        color: #6f0000;
        position: right;
    }
    input, button {
        font-weight: bold;
    }

</style>
