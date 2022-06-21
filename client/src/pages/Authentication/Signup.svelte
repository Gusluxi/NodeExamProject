<script>
    import { useNavigate, useLocation } from "svelte-navigator";
    import { baseURL } from "../../stores/generalStore.js";
    import { toast } from '@zerodevx/svelte-toast'

    const navigate = useNavigate();
	const location = useLocation();

    let newUsername;
    let newEmail;
    let newPassword;
    let inputTextColor;
    let disabledStatus = true;

    function showToast(msg) {
        toast.push(msg, {
                theme: {
                    '--toastBackground': '#ffdc6a',
                    '--toastColor': '#424242',
                    '--toastBarBackground': '#C53030',
            }});
    }

    function handleInput(event) {
        const emailValidation = isEmailValid(event.target.value);
        if(!emailValidation) {
            showToast("Email is invalid");
            inputTextColor = "red";
            disabledStatus = true;
        } else {
            inputTextColor = "normal";
            disabledStatus = false;
        }
    }

    function isEmailValid(email) {
        const emailRegexp = new RegExp(
            /^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
        );
        return emailRegexp.test(email);
    }
 
    async function handleSignup() {
        let validUser = true;
        if (!newUsername || String(newUsername).length > 18) {
            validUser = false;
            showToast("Please add a username between 0-18 char");
        }
        if (!newEmail || String(newEmail).length > 320) {
            validUser = false;
            showToast("Please add a valid email");
        }
        if (!newPassword || String(newPassword).length > 30) {
            validUser = false;
            showToast("Please add a valid password");
        } 
        if (validUser) {
            const response = await fetch($baseURL + '/auth/signup', {
			method: 'POST',
            headers: {
                "content-type": "application/json",
                "Accept": "application/json"
            },
			body: JSON.stringify({
				newUsername,
                newEmail,
                newPassword
			})
		    });
            const result = await response.json();
            if (result.rowsAffected > 0) {
                toast.push("Account created!")
                const from = ($location.state && $location.state.from) || "/login";
		        navigate(from, { replace: true });
            }
        }
    }
</script>
<div id="account-wrapper">
    <div id="login-area">
        <h4>Create a new account</h4>
        <div>

            <input
                on:change={handleInput}
                bind:value={newEmail}
                type="email"
                name="newEmail"
                placeholder="Email"
                id="{inputTextColor}"
            />
            <br/>
            <input
                bind:value={newUsername}
                type="text"
                name="newUsername"
                placeholder="Username"
                autocomplete="new-username"
            />
            <br/>
            <input
                bind:value={newPassword}
                type="password"
                name="newPassword"
                placeholder="Password"
                autocomplete="new-password"
            />
            <br/>
            <button disabled="{disabledStatus}" on:click={handleSignup} type="submit">Signup</button>
        </div>
    </div>
</div>


<style>
    #red {
        color: #e20000;
    }

    #normal {
        color: #000000;
    }

    #account-wrapper {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        flex-direction: column;
        padding: 2rem;
    }
    #login-area {
        font-size: 1.5rem;
        border: solid 4px #c5c5c5;
        padding: 2rem;
        width: 350px;
        margin: auto;
    }
</style>