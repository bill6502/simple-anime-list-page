<script lang="ts">
    import { store } from '$lib/store.svelte';
    import { fade } from 'svelte/transition';
    import { page } from '$app/state';
    import { innerWidth } from 'svelte/reactivity/window';
    import { goto } from '$app/navigation';

    let animeListId = $state<string>('');
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

    async function gotoId() {
        const url_id = `${store.baseUrl}/${animeListId}`;

        await goto(url_id, { invalidateAll: true });
    }
</script>

{#snippet nav(title: string, href: string)}
    <a class={innerWidth.current! <= 720 ? 'button' : ''} {href}>{title}</a>
{/snippet}
<div class="container">
    <div class="main">
        <p class="title">動畫清單</p>
        <div class="nav">
            <div class="nav-item">
                {#if innerWidth.current! <= 720}
                    <button
                        class="button"
                        onclick={() => (expanding = !expanding)}>導覽</button
                    >
                {/if}
                {#if innerWidth.current! > 720 || expanding}
                    {@render nav('首頁', `${store.baseUrl}/`)}

                    {#if store.user && store.userAnimeListId}
                        {@render nav(
                            '收藏',
                            `${store.baseUrl}/${store.userAnimeListId}`,
                        )}
                    {/if}
                {/if}
            </div>
            <form
                onsubmit={async (e) => {
                    e.preventDefault();
                    await gotoId();
                }}
            >
                <input bind:value={animeListId} placeholder="搜尋動畫清單" />
            </form>
            {#if innerWidth.current! > 720 || expanding}
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
    <hr />
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 83rem;
        align-items: center;
        justify-content: center;
        text-align: center;
        margin: 0 auto;
        margin-top: 1rem;
        padding: 0 1rem;
        gap: 1rem;

        hr {
            width: 100%;
            border: none;
            margin: 0;
            /*margin-top: 1rem;*/
            border-top: 0.1rem solid #ccc;
        }
    }

    .main {
        display: flex;
        width: 100%;
        min-height: 4rem;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 3rem;
        padding: 0 1rem;
    }

    .nav {
        width: 100%;
        flex: 1;
        text-align: left;
        align-items: center;
        display: flex;
        text-align: center;
        gap: 1rem;

        form {
            flex: 1;
            border: none;
            outline: none;
            padding: 0.5rem;
            margin: 0 5rem;
        }
        input {
            width: 100%;
            border: none;
            outline: none;
            border-radius: 0.5rem;
            min-height: 2.5rem;
            background-color: #d9d4cf;
            color: #7c7877;
            font-size: 1rem;
            text-align: center;

            transition: background-color 0.3s ease;
            &:focus {
                background-color: #e5e5e5;
            }
        }
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
        .container {
            margin-bottom: 0;
        }
        .main {
            flex-direction: column;
            padding: 0;
            gap: 1rem;
        }
        .nav {
            flex-direction: column;
            gap: 1rem;

            form {
                width: 100%;
                padding: 0;
            }
        }

        .nav-item {
            flex-direction: column;
            width: 100%;
            gap: 1rem;
        }
    }
</style>
