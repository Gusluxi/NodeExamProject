<script>
    export let preAnswer;
</script>
<div class="radio-answer">
    <input class="radio" type="radio" disabled>
    <p>{preAnswer ? preAnswer : '"Your Preset Answer here"'}</p>
    
</div>

<style>
    .radio-answer{
        display: flex;
        padding: 10px;
        padding-top: 0px;
        word-wrap: break-word;
    }
    .radio {
        margin-top: 18px;
        margin-right: 10px
    }
</style>