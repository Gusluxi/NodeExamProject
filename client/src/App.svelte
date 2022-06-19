<script>
	import { Router, Route } from "svelte-navigator";
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
</script>


<main>
	<Router>
		<Route path="/" component={Frontpage} />
		<Route path="/about" component={About} />
		<Route path="/login" component={Login} />
		<Route path="/signup" component={Signup} />
		<Route path="/takeSurvey/*" component={SurveyForm} />

		<PrivateRoute path="/surveys/*" let:location>
			<OverviewSurvey />
		</PrivateRoute>
		
		<PrivateRoute path="/surveys/*/stats" let:location>
			<StatsSurvey />
		</PrivateRoute>
		
		<PrivateRoute path="/surveys/*/edit" let:location>
			<EditSurvey />
		</PrivateRoute>
		
		<PrivateRoute path="/newsurvey" let:location>
			<CreateSurvey />
		</PrivateRoute>
		
	</Router>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>