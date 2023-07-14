<script>
import UpdateText from "../lib/updateText.svelte";
let text = "HomePage Prop";
</script>

<UpdateText {text} />
<div class="index" >
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, alias asperiores aspernatur atque autem
        commodi consequatur cumque cupiditate delectus doloremque doloribus ea earum eligendi eos esse est eum eveniet
        excepturi exercitationem facilis fugiat fugit hic id illum impedit ipsa ipsum iure laboriosam laborum libero
    </p>

    </div>

<style>
    .index {
        text-align: center;
        margin: 20px auto;
        
    }
</style>
