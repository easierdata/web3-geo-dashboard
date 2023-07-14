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
    <a href="/about">About</a>
    <img src="/easierLogo.png" alt="Easier logo" width=auto height="100">
</footer>