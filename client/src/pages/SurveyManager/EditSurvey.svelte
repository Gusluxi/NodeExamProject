<script>
    import { Link, useParams } from  "svelte-navigator";
    import { onMount } from "svelte";
    import { baseURL } from "../../stores/generalStore.js";

    const params = useParams()
    console.log($params);  
    //Man skal kunne adde et question når man har lavet det. Man skal kunne ændre title på survey, evt ændre på question who knows.
</script>
<h1> Edit Survey</h1>