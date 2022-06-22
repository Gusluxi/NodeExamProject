
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
    

</script>
{#if surveys}
    <h1>{surveys[0].title}</h1>
{/if}
