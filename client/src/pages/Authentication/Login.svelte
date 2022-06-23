<script>
    import { Link, useNavigate, useLocation } from "svelte-navigator";
	import { user } from "../../stores/authStore.js";
    import { baseURL } from "../../stores/generalStore.js";
    import { toast } from '@zerodevx/svelte-toast'

    const navigate = useNavigate();
    const location = useLocation();

    let username;
    let password;
    let attemptsRemaning;

    console.log($user);
     

    async function login() {
        if (attemptsRemaning === 0) {
            toast.push("No more attempts available, Try again in 5 minutes", {
                theme: {
                    '--toastBackground': '#F56565',
                    '--toastBarBackground': '#C53030'
            }});
        }

        const response = await fetch($baseURL + '/auth/login', {
            method: 'POST',
            headers: {
                "content-type": "application/json",
                "Accept": "application/json"
            },
                body: JSON.stringify({
                    username,
                    password
                })
        });

        //LIDT I TVIVL HVAD DET HER GØR HEHE
        const result = await response.json();
        attemptsRemaning = result.attemptsLeft;
        if (result.loggedIn) {
            user.set(result);
            localStorage.setItem('user',JSON.stringify(result))
            const from = ($location.state && $location.state.from) || "/";
            navigate(from, { replace: true });
        } else {
            toast.push("Invalid Username or Password, "+ result.attemptsLeft +" attempts left", {
                theme: {
                    '--toastBackground': '#F56565',
                    '--toastBarBackground': '#C53030'
            }});
        }
}


</script>

<div id="account-wrapper">
    <div id="login-area">
        <h3>Login</h3>
        <div >
            <input
                bind:value={username}
                type="text"
                name="username"
                placeholder="Username"
            />
            <br/>
            <input
                bind:value={password}
                type="password"
                name="password"
                placeholder="Password"
            />
            <br />
            <button on:click={login} type="submit">Login</button>
        </div>
    </div>
    <div id="signup-area">
        <h4>Don't have an account?</h4>
        <Link to="/signup"><button>Sign up</button></Link>
    </div>
</div>

<style>
    #account-wrapper {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        flex-direction: column;
        padding: 2rem;
    }
    #login-area {
        font-size: 1.5rem;
        border: solid 4px #c5c5c5;;
        padding: 2rem;
        width: 350px;
        margin: auto;
    }
    #signup-area {
        font-size: 1.5rem;
        width: 350px;
        padding: 2rem;
        margin: auto;
    }
</style>

