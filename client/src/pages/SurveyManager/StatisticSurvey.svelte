<script>
    import { Link, useParams } from  "svelte-navigator";
    import { onMount } from "svelte";
    import { baseURL } from "../../stores/generalStore.js";
    import SurveyForm from "../SurveyForm/SurveyForm.svelte";

    const params = useParams()
    let questions;
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
            questionAnswers.push({question: question, answers: answersArray ? answersArray : false});
            console.log(answersArray);
        })
        
    })
    console.log("Questions and answers:", questionAnswers);


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
                <th>Question</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    preset answer
                </td>
                <td>
                    user answer
                </td>
            </tr>
        </tbody>
    </table>

    <style>
        table, tbody, thead, td, th{
            border: 1px solid black;
            border-collapse: collapse;
            background-color: #6767d7;
        }
        table {
            width: 600px;
            font-size: 1.2rem;
            margin:auto;
        }
    </style>