<script>
    import { Link, useParams } from  "svelte-navigator";
    import { onMount } from "svelte";
    import { baseURL } from "../../stores/generalStore.js";
    import SurveyForm from "../SurveyForm/SurveyForm.svelte";
    import { io } from "socket.io-client";

    const params = useParams()
    let questions;
    let questionAnswers = [];
    console.log($params);
    
    onMount(async () => {
        socket.connect();
        const response = await fetch($baseURL + "/api/questions/surveys/" + $params.id);
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

    const socket = io('ws:http://localhost:3000');
    socket.on('answersocket', (x)=>{
    console.log(x);
    console.log("hej");
    questionAnswers = x;
    });

</script>

<h1>Statistics Survey</h1>

    
     <table>
        {#if questions}
        {#each questions as question }
        <thead>
            <tr>
                <th>{question.question}</th>
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
        {/each}
        {/if}
    </table>
    

    <!--
    <table>
        {#if questionAnswers}
        {#each questionAnswers as questionAnswer }
        <thead>
            <tr>
                <th>{questionAnswer.question}</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                        <td>
                            preset answer
                        </td>
                        <td>
                            {questionAnswer.answer}
                        </td>
            </tr>
        </tbody>
        {/each}
        {/if}
    </table>
    -->

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