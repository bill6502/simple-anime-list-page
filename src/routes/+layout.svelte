<script lang="ts">
    import { store } from '$lib/store.svelte';
    import { fade } from 'svelte/transition';
    import { page } from '$app/state';
    import { innerWidth } from 'svelte/reactivity/window';
    import MessageBlock from '$lib/components/messageBlock.svelte';
    import Nav from '$lib/components/nav.svelte';
    import './layout.css';

    let { children } = $props();

    let showUnAuth = $state<boolean>(false);
    let expanding = $state<boolean>(false);

    $effect(() => {
        if (innerWidth.current! > 720) {
            expanding = false;
        }
    });

    function setLastAnimeListId() {
        if (page.params.id) {
            localStorage.setItem('lastAnimeListId', page.params.id);
        }
    }

    function clear() {
        localStorage.removeItem('user');
        localStorage.removeItem('userAnimeListId');

        store.user = null;
        store.userAnimeListId = '';
    }
</script>

<div class="app">
    <Nav />
    <main>
        {@render children()}
    </main>

    <MessageBlock />
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
        max-width: 64rem;
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
