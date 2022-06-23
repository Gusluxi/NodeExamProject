<script>
    let min;
    let max;
    let scale;
</script>

<input bind:value="{scale}" type="range" min="{min}" max="{max}">
<p>Value: {scale}</p>
<input class="number" type="number" placeholder="min" bind:value="{min}">
<input class="number" type="number" placeholder="max" bind:value="{max}">

<style>
    .number {
        width: 100px;
    }
</style>