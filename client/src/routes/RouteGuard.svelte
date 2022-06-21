<script>
    import { useNavigate, useLocation } from "svelte-navigator";
    import { user } from "../stores/authStore.js";
    import { toast } from '@zerodevx/svelte-toast'


    const navigate = useNavigate();
    const location = useLocation();

    $: if (!$user.loggedIn) {
      toast.push("You must be logged in to access this page", {
                theme: {
                    '--toastBackground': '#4ac1ed',
                    '--toastBarBackground': '#3f91af'
            }});
      navigate("/login", {
        state: { from: $location.pathname },
        replace: true,
      });
    }
  </script>

  {#if $user}
    <slot />
  {/if}