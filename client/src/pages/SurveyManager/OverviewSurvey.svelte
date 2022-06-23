
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
            const result = await response.json();
            if (response.status === 200) {
                const surveyIndexNr = surveys.findIndex(singleSurvey => singleSurvey.id === survey.id);
                surveys.splice(surveyIndexNr, 1); 
                surveys = surveys;
            }
    }
    
    

</script>
{#if surveys}
    {#each surveys as survey (survey.id)}
            <h1>{survey.title}</h1>
            <Link to="/surveys/stats/{survey.id}" >
                <button class="btn">Stats</button>
            </Link> 
            <Link to="/surveys/edit/{survey.id}">
                <button class="btn">Edit</button>
            </Link> 
                <button class="btn" on:click="{handleLink}">Copy Link</button>
                <button class="btn" on:click="{handleDelete(survey)}">Delete</button>
    {/each}
{/if}
<Link to="/newsurvey"><button>New Survey</button></Link>


<style>
    .btn {
        font-size: 1rem;
        margin: 0;
    }
</style>