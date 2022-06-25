<script>
    import { Link, useParams } from  "svelte-navigator";
    import { onMount } from "svelte";
    import { baseURL } from "../../stores/generalStore.js";
    import { toast } from "@zerodevx/svelte-toast";
    import { io } from "socket.io-client";

    const params = useParams()
    let questions;
    let questionAnswers = [];
    
    onMount(async () => {
        socket.connect();
        const response = await fetch($baseURL + "/api/questions/surveys/" + $params.id);
        const { data: questionsArray } = await response.json();
        questions = questionsArray;
        await questions.map(async question => {
            const response = await fetch($baseURL + "/api/answers/questions/" + question.id)
            const { data: answersArray } = await response.json();
            
            questionAnswers = questionAnswers.concat({question: question, answers: answersArray ? answersArray : false});
            questionAnswers.sort(function(a, b) { 
                return a.question.id - b.question.id  ||  a.name.localeCompare(b.name);
            });
        })
    })
    
    const socket = io();
    socket.on('postAnswers', ({ answers })=>{
        console.log(answers);
        questionAnswers.map(questionAnswer => {
            answers.map(answer => {
                if(answer.questions.id === questionAnswer.question.id) {
                    questionAnswer.answers.push({ answer: answer.newAnswer, preset: 0, questionid: answer.questions.id})
                }
            })
        })
        questionAnswers = questionAnswers;
        toast.push("New answers!", {
                    theme: {
                        '--toastBackground': '#58b225'
                }});
    });
    
</script>
    
<h1>Statistics Survey</h1>
{#each questionAnswers as questionAnswer (questionAnswer.question.id)}
    <table>
        <thead>
            <tr>
                <th>{questionAnswer.question.question}</th>
            </tr>
        </thead>
        <tbody>
            {#if questionAnswer.answers === false}
                <tr>
                    <td>
                        No answers available
                    </td>
                </tr>
            {:else}
                {#each questionAnswer.answers as answer}
                {#if !answer.preset}
                    <tr>
                        <td>
                            Answer: {answer.answer}
                        </td>
                    </tr>
                {/if}
                {/each}
            {/if}
        </tbody>
    </table>
{:else}
<table>
    <thead>
        <tr>
            <th>Loading questions...</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                Loading user answers...
            </td>
        </tr>
    </tbody>
</table>
{/each}
 

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