<script lang="ts">
    import MessageBlock from '$lib/components/messageBlock.svelte';
    import { store } from '$lib/store.svelte';
    import { fade } from 'svelte/transition';
    import { page } from '$app/state';
    import './layout.css';

    let { children } = $props();

    let innerWidth = $state<number>(0);

    let showUnAuth = $state<boolean>(false);
    let expanding = $state<boolean>(false);

    $effect(() => {
        if (innerWidth > 720) {
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

<svelte:window bind:innerWidth />

{#snippet nav(title: string, href: string)}
    <a class={innerWidth <= 720 ? 'button' : ''} {href}>{title}</a>
{/snippet}

<div class="app">
    <main>
        <div class="banner">
            <p class="title">動畫清單</p>

            <div class="nav">
                <div class="nav-item">
                    {#if innerWidth <= 720}
                        <button
                            class="button"
                            onclick={() => (expanding = !expanding)}
                            >導覽</button
                        >
                    {/if}
                    {#if innerWidth > 720 || expanding}
                        {@render nav('首頁', '/')}

                        {#if store.user && store.userAnimeListId}
                            {@render nav('收藏', `/${store.userAnimeListId}`)}
                        {/if}
                    {/if}
                </div>
                {#if innerWidth > 720 || expanding}
                    <div class="user-info">
                        {#if store.user}
                            <img
                                src={`https://cdn.discordapp.com/avatars/${store.user.id}/${store.user.avatar}.png`}
                                alt="User Avatar"
                                onclick={() => {
                                    showUnAuth = !showUnAuth;
                                }}
                            />
                        {/if}
                        {#if !store.user}
                            <a
                                class="dcButton"
                                data-type="getID"
                                onclick={setLastAnimeListId}
                                href={store.authUrl}>取得授權</a
                            >
                        {:else if showUnAuth}
                            <button
                                transition:fade={{ duration: 300 }}
                                class="dcButton"
                                type="button"
                                data-type="clear"
                                onclick={clear}
                            >
                                清除授權</button
                            >
                        {/if}
                    </div>
                {/if}
            </div>
        </div>
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

    .banner {
        display: flex;
        width: 100%;
        min-height: 4rem;
        align-items: center;
        text-align: center;
        padding: 0 0.3rem;
        gap: 3rem;
    }

    .nav {
        width: 100%;
        flex: 1;
        text-align: left;
        justify-content: space-between;
        display: flex;
        text-align: center;
    }

    .nav-item {
        box-sizing: border-box;
        border-radius: 0.7rem;
        border: none;
        outline: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;
    }

    .user-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;

        & img {
            width: 4rem;
            border-radius: 50%;
            cursor: pointer;
        }
    }

    .dcButton {
        box-sizing: border-box;
        position: relative;
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: center;
        padding: 0.8rem 3rem;
        height: auto;
        color: #ffffff;

        border-radius: 0.7rem;
        border: none;
        outline: none;
        cursor: pointer;
        text-decoration: none;

        transition: background-color 0.3s ease;
        cursor: pointer;

        &[data-type='getID'] {
            background-color: #7289da;
        }

        &[data-type='clear'] {
            background-color: #dd0000;
        }

        &:hover[data-type='getID'] {
            background-color: #5865f2;
        }

        &:hover[data-type='clear'] {
            background-color: #bb0000;
        }
    }

    .title {
        max-width: 100%;
        box-sizing: border-box;
        font-size: 2rem;
        font-weight: bold;
        text-align: center;
        overflow-wrap: break-word;
        word-break: break-all;
        color: aliceblue;
    }

    .button {
        border: none;
        border-radius: 0.5rem;
        background-color: #d9d4cf;
        color: #7c7877;
        cursor: pointer;

        display: inline-flex;
        justify-content: center;
        align-items: center;
        white-space: nowrap;

        overflow: hidden;
        width: 100%;
        height: 3rem;

        transition:
            background-color 0.1s ease-in-out,
            color 0.1s ease-in-out;

        &:active {
            background-color: #d9d4cf;
            color: #7c7877;
        }
    }

    @media screen and (width <= 720px) {
        .banner {
            flex-direction: column;
            gap: 1rem;
        }
        .nav {
            flex-direction: column;
            gap: 1rem;
        }

        .nav-item {
            flex-direction: column;
            gap: 1rem;
        }
    }
</style>
