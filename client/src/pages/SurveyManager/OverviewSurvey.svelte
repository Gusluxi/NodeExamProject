
<script>
    import { Link } from  "svelte-navigator";
    import { onMount } from "svelte";
    import { baseURL } from "../../stores/generalStore.js";
    import { user } from "../../stores/authStore.js";
    import { toast } from "@zerodevx/svelte-toast";

    let surveys;
    toast.pop(0)
    onMount(async () => {
        if($user.loggedIn) {
            const response = await fetch($baseURL + "/api/surveys");
            const { data: surveysArray } = await response.json();
            surveys = surveysArray;
            surveys.map(survey => {
                survey.editing = false;
                survey.deleting = false;
            })
        }
        
    })

    async function updateTitle(survey) {
        if(survey.title) {
            const response = await fetch($baseURL + '/api/surveys/' + survey.id, {
                method: 'PATCH',
                headers: {
                    "content-type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    title: survey.title
                })
		    });
		    const result = await response.json();
            if (result.error) {
                toast.push("Titel was NOT updated!", {
                    theme: {
                        '--toastBackground': '#58b225'
                }});
            }
        }
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
                <div>
                    {#if survey.editing}
                        <input type="text" bind:value={survey.title} on:change={() => {survey.editing = false; updateTitle(survey)}}>
                    {:else}
                        <h2>{survey.title}</h2>
                    {/if}
                    
                </div>
                <div class=button-wrapper>
                    <Link class="link" to="/surveys/stats/{survey.id}" >
                        <button class="btn">Stats</button>
                    </Link> 
                        <button class="btn" on:click={() => {survey.editing = !survey.editing}}>Edit</button>
                    <Link class="link" to="/takeSurvey/{survey.id}">
                        <button class="btn">Open Survey</button>
                    </Link>
                    <div class="del-wrapper">
                        {#if survey.deleting}
                            <button class="del-btn" on:click="{handleDelete(survey)}">Yes</button>
                            <button class="btn" on:click={() => {survey.deleting = false}}>No</button>
                        {:else}
                            <button class="btn" on:click={() => {survey.deleting = true}}>Delete Survey</button>
                        {/if}
                    </div>
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
        display: flex;
        margin-top: 20px;
    }
    .del-wrapper {
        width:170px;
    }
    .btn {
        font-size: 1.1rem;
        height: 40px;
        margin-left: 10px;
        min-width: 66px;
    }
    .del-btn {
        font-size: 1.1rem;
        height: 40px;
        color: #760000;
        margin-left: 10px;
        min-width: 66px;
    }
    .surveys-wrapper {
        width: 60%;
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