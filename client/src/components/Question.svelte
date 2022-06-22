<script>
    import { baseURL } from "../../stores/generalStore.js";
	let title;
	let result = null
	
	async function newQuestion () {
        const response = await fetch($baseURL + '/api/questions', {
			method: 'POST',
            headers: {
                "content-type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
				question,
				questiontype,
				selectedSurveyId
			})
		});
		
		const json = await response.json()
		result = JSON.stringify(json)
	}
</script>




