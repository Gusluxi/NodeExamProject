<script>
    export let min;
    export let max;
    let scale;
</script>

<input bind:value="{scale}" type="range" min="{min}" max="{max}">
<p>Value: {scale}</p>
