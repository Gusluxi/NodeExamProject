<script>
    import { baseURL } from "../../stores/generalStore.js";
	let title;
	
	async function newSurvey () {
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
        console.log(result);
	}
</script>
<input bind:value={title}>
<button class="btn" on:click="{newSurvey}">New Survey</button>
