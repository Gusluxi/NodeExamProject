
<script>
    import { Link } from  "svelte-navigator";
    import { onMount } from "svelte";
    import { baseURL } from "../../stores/generalStore.js";

    let surveys;

    onMount(async () => {
        const response = await fetch($baseURL + "/api/surveys");
        const { data: surveysArray } = await response.json();
        console.log(surveysArray);
        surveys = surveysArray;
    })

    function handleLink() {

    }

    async function handleDelete(survey) {
        const response = await fetch($baseURL + '/api/surveys/' + survey.id, {
			    method: 'DELETE',
                headers: {
                    "content-type": "application/json",
                    "Accept": "application/json"
                }
		    });
            if (response.status === 200) {
                const surveyIndexNr = surveys.findIndex(singleSurvey => singleSurvey.id === survey.id);
                surveys.splice(surveyIndexNr, 1); 
                surveys = surveys;
            }
    }
</script>

<div class="surveys-wrapper">
    <div>
        {#if surveys}
            {#each surveys as survey (survey.id)}
            <div class="single-survey-wrapper">
                <h1>{survey.title}</h1>
                <div class=button-wrapper>
                    <Link class="link" to="/surveys/stats/{survey.id}" >
                        <button class="btn">Stats</button>
                    </Link> 
                    <Link class="link" to="/surveys/edit/{survey.id}">
                        <button class="btn">Edit</button>
                    </Link> 
                        <button class="btn" on:click="{handleLink}">Copy Link</button>
                        <button class="btn" on:click="{handleDelete(survey)}">Delete</button>
                </div>
            </div>
            {/each}
        {/if}
    </div>
    <div class="new-survey">
        <Link to="/newsurvey"><button class="btn">Create a Survey</button></Link>
    </div>
</div>



<style>
    .single-survey-wrapper {
        display: flex;
        justify-content:space-between
    }
    .single-survey-wrapper > :global(a) {
        margin: 0;
        padding: 0;
        width: auto;
        height: 0;
    }
    .button-wrapper {
        margin-top: 20px;
    }
    .btn {
        font-size: 1.1rem;
        height: 40px;
  
    }
    .surveys-wrapper {
        width: 40%;
        margin: auto;
        display: flex;
        flex-direction: column;
        text-align: left;
    }
    .new-survey {
        margin-top: 50px;
        text-align: center;
    }


</style>