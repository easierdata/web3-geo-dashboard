<script>
    import UpdateText from "../../lib/updateText.svelte";
    let text = "Page 1 Prop";
    let count = 0;
</script>

<UpdateText {text} />

<div class="about">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, alias asperiores aspernatur atque autem commodi consequatur cumque cupiditate delectus doloremque doloribus ea earum eligendi eos esse est eum eveniet excepturi exercitationem facilis fugiat fugit hic id illum impedit ipsa ipsum iure laboriosam laborum libero</p>
</div>

<a href="/">Home</a>

<style>
    .about {
        text-align: center;
        margin: 20px auto;
    }
</style>
