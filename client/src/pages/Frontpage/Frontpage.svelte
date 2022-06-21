<script>
    	import { user } from "../../stores/authStore.js";
</script>
<div>
    <img src="/images/Stellar Surveys.png" alt="Stellar Surveys">
    {#if ($user.loggedIn)}
		<h1>Welcome {$user.currentUser.username}</h1>
	{/if}
    <h1>Take - create - experience Surveys in a stellar new vision</h1>
</div>