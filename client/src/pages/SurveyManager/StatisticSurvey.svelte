<script>
    import { Link, useParams } from  "svelte-navigator";
    import { onMount } from "svelte";
    import { baseURL } from "../../stores/generalStore.js";
    import SurveyForm from "../SurveyForm/SurveyForm.svelte";

    const params = useParams()
    let questions;
    let answers;
    let questionAnswers = [];
    console.log($params);
    
    onMount(async () => {
        const response = await fetch($baseURL + "/api/questions/surveys/" + $params.id)
        const { data: questionsArray } = await response.json();
        console.log(questionsArray);
        questions = questionsArray;
        await questions.map(async question => {
            console.log(question.id);
            const response = await fetch($baseURL + "/api/answers/questions/" + question.id)
            const { data: answersArray } = await response.json();
            questionAnswers.push(answersArray);
            console.log(answersArray);
        })
        
    })
    console.log(questionAnswers);


</script>

<h1>Statistics Survey</h1>


    <div>
        {#if questions}
            {#each questions as question (question.id)}
            <div class="single-survey-wrapper">
                <h1>{question.question}</h1>
            </div>
            {/each}
        {/if}
    </div>

    <table>
        <thead>
            <tr>
                {#if questions}
                    {#each questions as question (question.id)}
                        <h1>{question.question}</h1>
                    {/each}
                    <th>
                        {#if answers}
                        {   #each answer as answer (answer.id)}
                                <h1>{answer.answer}</h1>
                            {/each}
                        {/if}
                    </th>
                {/if}
            </tr>
        </thead>
    </table>