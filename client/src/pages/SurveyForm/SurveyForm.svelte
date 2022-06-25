<script>
    import { Link, useParams, useNavigate } from  "svelte-navigator";
    import { onMount } from "svelte";
    import { toast } from '@zerodevx/svelte-toast'
    import { baseURL } from "../../stores/generalStore.js";
    
    const params = useParams();
    const navigate = useNavigate();
    let filledInputs;
    let questions;
    let questionPreAnswers = [];
    let surveyId = $params.id;
    console.log($params);

    onMount(async () => {
        const response = await fetch($baseURL + "/api/questions/surveys/" + surveyId);
        const { data: questionsArray } = await response.json();
        questions = questionsArray;
        await questions.map(async question => {
            if(question.questiontype === 3 || question.questiontype === 4) {
                const response = await fetch($baseURL + "/api/answers/preset/questions/" + question.id)
                const { data: answersArray, error: errormsg } = await response.json();
                console.log("Answers",answersArray, "Error", errormsg);
                if (question.questiontype === 3) {
                    questionPreAnswers = questionPreAnswers.concat({questions: question, answers: errormsg ? false : answersArray, newAnswer: []});
                } else {
                    questionPreAnswers = questionPreAnswers.concat({questions: question, answers: errormsg ? false : answersArray, newAnswer: ""});
                }
                console.log("Questions and preset answers:", questionPreAnswers);
            } else {
                questionPreAnswers = questionPreAnswers.concat({questions: question, answers: false, newAnswer: ""});
            }
            questionPreAnswers.sort(function(a, b) { 
                return a.questions.id - b.questions.id  ||  a.name.localeCompare(b.name);
            });
        })
    })

    async function submitAnswers() {
        filledInputs = true;
        questionPreAnswers.map(qna => {
            if (qna.newAnswer === "" || qna.newAnswer.length === 0) {
                filledInputs = false;
            }
        })
        if (filledInputs) {
            questionPreAnswers.map(qna => {
                if(Array.isArray(qna.newAnswer)) {
                    qna.newAnswer = qna.newAnswer.toString();
                }
            })
            
            const response = await fetch($baseURL + '/api/answers', {
                method: 'POST',
                headers: {
                    "content-type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    answers: questionPreAnswers
                })
		    });
		    const result = await response.json();
            console.log(result);
            if (response.status === 200) {
                toast.push("Form submitted, Thank you!", {
                    theme: {
                        '--toastBackground': '#58b225'
                }});
                navigate("/", { replace: true });
            }
        } else {
            toast.push("Please answer all the questions before submitting", {
                theme: {
                    '--toastBackground': '#c7a12c'
            }});
        }
    }

</script>


<div class="question-box">
    <div class="questions-div">
    {#each questionPreAnswers as qna}
        <h3 class="question-header">{qna.questions.question}</h3>
        {#if qna.questions.questiontype === 1}
            <textarea class="text-area" bind:value="{qna.newAnswer}" placeholder='"Write your answer here..."' cols="50" rows="4" maxlength="200"></textarea>
        {/if}

        {#if qna.questions.questiontype === 2}
            <input type="scale" bind:value={qna.newAnswer}>
        {/if}

        {#if qna.questions.questiontype === 3}
            {#if qna.answers.length > 0 || qna.answers !== false}
                <div class=preanswer-wrapper>
                    {#each qna.answers as preanswer}
                        <div class="preanswer-wrapper">
                            <label for={preanswer.id} class="preanswer">
                                <input 
                                id="{preanswer.id}"
                                class="checkbox-radio-input"
                                type="checkbox" 
                                on:change={e => {if(e.target.checked) {qna.newAnswer.push(preanswer.answer)} else {qna.newAnswer = qna.newAnswer.filter(answer => answer !== preanswer.answer.toString())}}} 
                                name={qna.questions.id}
                                bind:value={preanswer.answer}>
                                {  preanswer.answer}
                            </label>
                        </div>
                    {:else}
                        Loading answers...
                    {/each}
                </div>    
            {/if}
            
        {/if}
        {#if qna.questions.questiontype === 4}
            {#if qna.answers !== false || qna.answers.length !== 0}
                <div class="preanswer-wrapper">
                    {#each qna.answers as preanswer}
                        <div class="preanswer-wrapper">
                            <label for="{preanswer.id}" class="preanswer">
                                <input id="{preanswer.id}" class="checkbox-radio-input" type="radio" on:change={() => {qna.newAnswer = preanswer.answer}} name={qna.questions.id} bind:value={preanswer.answer}>
                                {preanswer.answer}
                            </label>
                        </div>
                        
                    {:else}
                        Loading answers...
                    {/each}
                </div>
            {/if}
        {/if}

        {#if qna.questions.questiontype === 5}
            <input type="date" bind:value={qna.newAnswer}>
        {/if}

        {#if qna.questions.questiontype === 6}
            <input type="number" bind:value={qna.newAnswer}>
        {/if}
    {:else}
        <p>Loading Questions...</p>
    {/each}
    </div>
    <button class="submit-btn" on:click={submitAnswers}>Submit Form</button>
	

</div>

<style>
    .preanswer-wrapper input[type="radio"] input[type="checkbox"] {
        display: none;
    }

    .preanswer-wrapper label {
        display:inline-block;
        font-size: 1rem;
    }


    .question-header {
        margin-top:40px;
    }

    .preanswer-wrapper {
        display: flex;
        flex-direction: column;;
    }

    .question-box {
        width: 40%;
        margin: auto;
        text-align: left;
    }

    .submit-btn {
        color: #100079;
    }

    input, textarea, button {
        font-weight: bold;
    }
    

    
</style>