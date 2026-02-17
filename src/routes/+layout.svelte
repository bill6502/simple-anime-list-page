<script lang="ts">
    import { innerWidth } from 'svelte/reactivity/window';
    import Tip from '$lib/components/tip.svelte';
    import Navbar from '$lib/components/navbar.svelte';
    import Totop from '$lib/components/totop.svelte';
    import './layout.css';

    let { children } = $props();

    let showUnAuth = $state<boolean>(false);
    let expanding = $state<boolean>(false);

    $effect(() => {
        if (innerWidth.current! > 720) {
            expanding = false;
        }
    });
</script>

<div class="app">
    <Navbar />
    <main>
        {@render children()}
    </main>
    <Tip />
    <Totop />
    <footer>
        <p>Just a simple anime-list page</p>
    </footer>
</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        width: 100%;
        /*max-width: 64rem;*/
        margin: 0 auto;
        box-sizing: border-box;
        gap: 1rem;
    }

    footer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        color: aliceblue;
    }

    @media (min-width: 480px) {
        footer {
            padding: 12px 0;
        }
    }
</style>
