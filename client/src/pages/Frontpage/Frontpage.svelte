<script>
    	import { user } from "../../stores/authStore.js";
        import { onMount } from "svelte";
        import { toast } from '@zerodevx/svelte-toast';
        onMount(() => {
            toast.pop(0)
        })
</script>
<div>
    <div id="logo-wrapper">
        <img id="logo" src="/images/Stellar Surveys1.png" alt="Stellar Surveys">
    </div>
    
    {#if ($user.loggedIn)}
		<h1>Welcome {$user.currentUser.username}</h1>
	{/if}
    <h2>Take. Create. Experience Surveys in a new fashion</h2>

</div>

<style>
    #logo-wrapper {
        margin: 40px;
    }

    #logo {
        width: 1000px;
    }
</style>