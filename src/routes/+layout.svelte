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
    <a href="/page1">Page 1</a>
    <a href="/page2">Page 2</a>
    <img src="/easierLogo.png" alt="Easier logo" width=auto height="100">
</footer>