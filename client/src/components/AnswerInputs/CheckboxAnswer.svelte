<script>
    let preAnswer;
</script>
<input placeholder="Preset Answer" bind:value="{preAnswer}">
<div class="checkbox-answer">
    <h4>{preAnswer}</h4>
    <input type="checkbox" disabled>
</div>

<style>
    .checkbox-answer{
        display: flex;
    }
</style>