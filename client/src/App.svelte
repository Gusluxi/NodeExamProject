<script>
	//Imports
	import { onMount } from "svelte";
	import { Link, Router, Route } from "svelte-navigator";
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import { user } from "./stores/authStore.js";
	import { baseURL } from "./stores/generalStore.js";
	import GdprBanner from '@beyonk/gdpr-cookie-consent-banner'
	import '@beyonk/gdpr-cookie-consent-banner/dist/style.css' // import optional styles

	//Pages
	import About from "./pages/About/About.svelte";
	import Login from './pages/Authentication/Login.svelte';
	import Signup from './pages/Authentication/Signup.svelte';
	import Frontpage from "./pages/Frontpage/Frontpage.svelte";
	import SurveyForm from "./pages/SurveyForm/SurveyForm.svelte";
	import CreateSurvey from "./pages/SurveyManager/CreateSurvey.svelte";
	import OverviewSurvey from "./pages/SurveyManager/OverviewSurvey.svelte";
	import StatsSurvey from "./pages/SurveyManager/StatisticSurvey.svelte";
	import PrivateRoute from "./routes/PrivateRoute.svelte";

	const options = { initial: 0, next:0, onpop: () => {toast.pop(0)}, intro: { y: -64 } };
	const cookieText = 'We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept Cookies", you consent to our use of cookies. Alternatively you can click "Cookie Settings" to adjust which cookies to accept'
	let toastClass = "center";

	async function handleLogout() {
		const response = await fetch($baseURL + '/logout');
        const result = await response.json();
        if (result.loggedIn === false) {
            user.set(result.loggedIn)
			localStorage.clear();
			if($user.currentuset) {
				user.currentuser.set({})
			}
        }
	}

	onMount(async () => {
		const response= await fetch($baseURL + "/info/session/login")
		const { loggedIn } = await response.json();
		if(loggedIn === false) {
			localStorage.clear();
		}
	})
	
</script>
<GdprBanner cookieName="Stellar Cookie" description={cookieText}/>
<div class="{toastClass}">
	<SvelteToast {options} />
</div>


<main>
	<Router>
		<nav class="nav">
			<Link to="/">Home</Link>
			<Link to="/about">About</Link>
			<Link to="/surveys/view">Surveys</Link>
			{#if (!$user.loggedIn)}
				<Link to="/login">Login</Link>
				<Link to="/signup">Signup</Link>
			{/if}
			{#if ($user.loggedIn)}
				<Link on:click="{handleLogout}" to="/">Logout</Link>
			{/if}
		</nav>
		
		
		<Route path="/"><Frontpage /></Route>
		<Route path="/about"><About /></Route>
		<Route path="/login"><Login /></Route>
		<Route path="/signup"><Signup /></Route>
		<Route path="/takeSurvey/:id" ><SurveyForm /></Route>

		<PrivateRoute path="/surveys/view" let:location>
			<OverviewSurvey />
		</PrivateRoute>
		
		<PrivateRoute path="/surveys/stats/:id" let:location>
			<StatsSurvey />
		</PrivateRoute>
		
		<PrivateRoute path="/newsurvey" let:location>
			<CreateSurvey />
		</PrivateRoute>
		
		
	</Router>
</main>
<footer>
	<div>©{new Date().getFullYear()}</div>
	<div>gust0781@stud.kea.dk</div>
	<div>ludv1428@stud.kea.dk</div>
</footer>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		min-height: calc(97vh - 3.7em);
	}

	nav {
		max-width: 1300px;
		margin: auto;
		padding: 30px 0px;
		background-color: #00268d;
		box-shadow: 0px 0px 19px 1px rgba(0,0,0,0.75);
		-webkit-box-shadow: 0px 0px 19px 1px rgba(0,0,0,0.75);
		-moz-box-shadow: 0px 0px 19px 1px rgba(0,0,0,0.75);
	}

	.nav > :global(a) {
		font-size: 1.7rem;
		padding: 30px;
		text-transform: uppercase;
        text-decoration: none;
		color: #e7e7e7;
    }

	.nav > :global(a):hover {
		color: #89daff;
		background-color: #4268b9;
		box-shadow: 0px 0px 19px -4px rgba(0,0,0,0.75);
		-webkit-box-shadow: 0px 0px 19px -4px rgba(0,0,0,0.75);
		-moz-box-shadow: 0px 0px 19px -4px rgba(0,0,0,0.75);
		transition: 0.2s;
		font-weight: bold;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
	

	footer {
		height: 3em;
		width: 100%;
		display:flex;
		justify-content: space-around;
		background-color: #00268d;
	}

	footer div {
		margin-top: 1em;
	}

	
</style>