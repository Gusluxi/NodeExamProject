<script>
    let preAnswer; //EXPORT THIS
</script>
<input placeholder="Preset Answer" bind:value="{preAnswer}">
<div class="radio-answer">
    <h4>{preAnswer}</h4>
    <input type="radio" disabled>
</div>

<style>
    .radio-answer{
        display: flex;
    }
</style>