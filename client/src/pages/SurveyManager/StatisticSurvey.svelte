<script>
    import { Link, useParams } from  "svelte-navigator";
    import { onMount } from "svelte";
    import { baseURL } from "../../stores/generalStore.js";

    const params = useParams()

    console.log($params);

</script>

<h1>Statistics Survey</h1>