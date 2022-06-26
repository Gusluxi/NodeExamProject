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
            showToast("Please enter a valid mail");
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
        let toastMessage = "";
        
        if (!newEmail || String(newEmail).length > 320 || String(newEmail).length < 5) {
            validUser = false;
            toastMessage += "Please add a shorter email. ";
        };
        if (!newUsername || String(newUsername).length > 18 || String(newUsername).length < 2) {
            validUser = false;
            toastMessage += "Please add a username between 2-18 char. ";
        };
        if (!newPassword || String(newPassword).length > 30 || String(newPassword).length < 3) {
            validUser = false;
            toastMessage += "Please add a password between 3-30 characters.";
        };
        
        if (toastMessage) {
            showToast(toastMessage);
        };
        //Check if email already exists.
        if (validUser) {
            const responseEmail = await fetch($baseURL + '/valid/email', {
			    method: 'POST',
                headers: {
                    "content-type": "application/json",
                    "Accept": "application/json"
                },
			    body: JSON.stringify({
                    email: newEmail
			    })
		    });
            const resultEmail = await responseEmail.json();
            
            if (resultEmail.emailExists) {
                showToast("Email already Exists");
                validUser = false;
            }
        }
        //Check if username already exists.
        if (validUser) {
            const responseUsername = await fetch($baseURL + '/valid/username', {
			    method: 'POST',
                headers: {
                    "content-type": "application/json",
                    "Accept": "application/json"
                },
			    body: JSON.stringify({
				    username: newUsername
			    })
		    });
            const resultUsername = await responseUsername.json();
            
            if (resultUsername.usernameExists) {
                showToast("Username already Exists");
                validUser = false;
            }
        }
             
        if (validUser) {
            const response = await fetch($baseURL + '/auth/signup', {
			method: 'POST',
            headers: {
                "content-type": "application/json",
                "Accept": "application/json"
            },
			body: JSON.stringify({
				username: newUsername,
                email: newEmail,
                password: newPassword
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