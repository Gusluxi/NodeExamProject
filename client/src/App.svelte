<script>
	import { Link, Router, Route } from "svelte-navigator";
	
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { user } from "./stores/authStore.js";
	import { baseURL } from "./stores/generalStore.js";
	
	import About from "./pages/About/About.svelte";
	import Login from './pages/Authentication/Login.svelte';
	import Signup from './pages/Authentication/Signup.svelte';
	import Frontpage from "./pages/Frontpage/Frontpage.svelte";
	import SurveyForm from "./pages/SurveyForm/SurveyForm.svelte";
	import CreateSurvey from "./pages/SurveyManager/CreateSurvey.svelte";
	import EditSurvey from "./pages/SurveyManager/EditSurvey.svelte";
	import OverviewSurvey from "./pages/SurveyManager/OverviewSurvey.svelte";
	import StatsSurvey from "./pages/SurveyManager/StatisticSurvey.svelte";
	import PrivateRoute from "./routes/PrivateRoute.svelte";
	const options = {};

	async function handleLogout() {
		const response = await fetch($baseURL + '/logout');
        const result = await response.json();
        console.log(result);
        
        if (result.loggedIn === false) {
            user.set(result.loggedIn)
			user.currentuser.set({})
        }
	}

</script>


<main>
	<Router>
		<nav>
			<Link to="/">Home</Link>
			<Link to="/about">About</Link>
			<Link to="/surveys/view">Surveys(Guarded)</Link>
			{#if (!$user.loggedIn)}
				<Link to="/login">Login</Link>
				<Link to="/signup">Signup</Link>
			{/if}
			{#if ($user.loggedIn)}
				<Link on:click="{handleLogout}" to="/">Logout</Link>
			{/if}
			
		</nav>
		{#if ($user.loggedIn)}
			<h1>Hej {$user.currentUser.username}</h1>
		{/if}
		
		<Route path="/" component={Frontpage} />
		<Route path="/about" component={About} />
		<Route path="/login" component={Login} />
		<Route path="/signup" component={Signup} />
		<Route path="/takeSurvey/*" component={SurveyForm} />

		<PrivateRoute path="/surveys/view" let:location>
			<OverviewSurvey />
		</PrivateRoute>
		
		<PrivateRoute path="/surveys/stats" let:location>
			<StatsSurvey />
		</PrivateRoute>
		
		<PrivateRoute path="/surveys/edit" let:location>
			<EditSurvey />
		</PrivateRoute>
		
		<PrivateRoute path="/newsurvey" let:location>
			<CreateSurvey />
		</PrivateRoute>
		
	</Router>
</main>
<SvelteToast {options} />
<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
	nav {
		margin: auto;
		padding: 30px 0px;
		background-color: #00268d;
		box-shadow: 0px 0px 19px 1px rgba(0,0,0,0.75);
		-webkit-box-shadow: 0px 0px 19px 1px rgba(0,0,0,0.75);
		-moz-box-shadow: 0px 0px 19px 1px rgba(0,0,0,0.75);
	}
	:global(a) {
		padding: 30px;
		text-transform: uppercase;
        text-decoration: none;
		font-size: large;
		color: #e7e7e7;
    }
	:global(a):hover {
		color: #89daff;
		background-color: #5574b8;
		box-shadow: 0px 0px 19px -4px rgba(0,0,0,0.75);
		-webkit-box-shadow: 0px 0px 19px -4px rgba(0,0,0,0.75);
		-moz-box-shadow: 0px 0px 19px -4px rgba(0,0,0,0.75);
		transition: 0.3s;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>