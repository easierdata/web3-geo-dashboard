<script>
    export const title = 'Title According to Layout Component';
    import '../styles/global.css';
</script>

<header>
    <h1>{title}</h1>
</header>

<main>
    <slot>
    </slot>
</main>
<footer>
    <a href="/basic_component_example">Basic Component Example</a>
    <a href="/prop_example">Prop Example</a>
    <img src="/easierLogo.png" alt="Easier logo" width=auto height="100">
</footer>