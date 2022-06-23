<script>
    let min;
    let max;
</script>
<input type="number" bind:value="{min}">
<input type="number" bind:value="{max}">
<input type="range" min="{min}" max="{max}" disabled>