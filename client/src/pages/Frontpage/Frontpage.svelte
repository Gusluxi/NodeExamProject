<script>
    	import { user } from "../../stores/authStore.js";
</script>
<div>
    <div id="logo-wrapper">
        <img id="logo" src="/images/Stellar Surveys1.png" alt="Stellar Surveys">
    </div>
    
    {#if ($user.loggedIn)}
		<h1>Welcome {$user.currentUser.username}</h1>
	{/if}
    <h2>Take - create - experience Surveys in a stellar new vision</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
    <h2>Scroll</h2>
</div>

<style>
    #logo-wrapper {
        margin: 40px;
    }

    #logo {
        width: 1000px;
    }
</style>