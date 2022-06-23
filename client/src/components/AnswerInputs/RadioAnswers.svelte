<script>
    export let preAnswer;
    console.log(preAnswer);
</script>
<div class="radio-answer">
    <input class="radio" type="radio" disabled>
    <p>{preAnswer ? preAnswer : "Answer here"}</p>
    
</div>

<style>
    .radio-answer{
        display: flex;
        padding: 10px;
        padding-top: 0px;
    }
    .radio {
        margin-top: 18px;
        margin-right: 10px
    }
</style>