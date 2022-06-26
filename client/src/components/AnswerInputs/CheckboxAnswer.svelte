<script>
    export let preAnswer;
</script>
<div class="checkbox-answer">
    <input class="checkbox" type="checkbox" disabled>
    <p>{preAnswer ? preAnswer : '"Your Preset Answer here"'}</p>
</div>

<style>
    .checkbox-answer{
        display: flex;
        word-wrap: break-word;
    }
    .checkbox {
        margin-top: 18px;
        margin-right: 10px
    }
</style>