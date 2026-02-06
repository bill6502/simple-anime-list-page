<script lang="ts">
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { store } from '$lib/store.svelte';

    let { data } = $props();

    let animeListId = $state<string>(store.userAnimeListId);

    $effect(() => {
        store.message(data.error, 'error');
    });

    async function gotoId() {
        const url_id = `${base}/${animeListId}`;

        await goto(url_id, { invalidateAll: true });
    }

    async function clear() {
        localStorage.removeItem('user');
        localStorage.removeItem('userAnimeListId');

        store.user = null;
        store.userAnimeListId = '';

        await goto(`${base}/`);
        location.reload();
    }
</script>

<svelte:head>
    <title>動畫收藏清單查詢</title>
</svelte:head>
<div class="container">
    {#if store.user}
        <div class="user">
            <img
                src={`https://cdn.discordapp.com/avatars/${store.user.id}/${store.user.avatar}.png`}
                alt="User Avatar"
            />
            <p>{store.user.username}</p>
        </div>
    {/if}
    <form
        class="search-container"
        onsubmit={async (e) => {
            e.preventDefault();
            await gotoId();
        }}
    >
        <input
            bind:value={animeListId}
            oninput={() => (store.errorMessage = '')}
            placeholder="Enter ID"
        />
        <div class="buttons">
            <button class="search" type="submit">搜尋</button>
            <div class="dcButtons">
                <a
                    class="dcButton"
                    type="button"
                    data-type="getID"
                    href={store.authUrl}
                >
                    取得授權</a
                >
                <button
                    class="dcButton"
                    type="button"
                    data-type="clear"
                    onclick={clear}
                >
                    清除授權</button
                >
            </div>
        </div>
    </form>
</div>

<style>
    .container {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: auto 0;
        gap: 1rem;
    }

    .search-container {
        width: 60%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .search-container > input,
    button,
    a {
        box-sizing: border-box;
        border-radius: 0.7rem;
        padding: 1.5rem 2rem;
        border: none;
        outline: none;
        cursor: pointer;
        text-decoration: none;
    }

    .search-container > input {
        width: 100%;
        height: 2rem;
        cursor: unset;
        text-align: center;
    }

    .buttons {
        display: flex;
        width: 100%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        word-break: break-all;
        gap: 1rem;
    }

    .search {
        justify-content: center;
        padding: 0.8rem 3rem;
        width: 100%;
        height: auto;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: #c0c0c0;
        }
    }

    .dcButtons {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        word-break: break-all;
        width: 100%;
        height: auto;
        gap: 1rem;
        padding: 0 5rem;
    }

    .dcButton {
        position: relative;
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: center;
        text-align: center;
        line-height: 1.5;
        padding: 0.8rem 3rem;
        width: 100%;
        height: auto;
        color: #ffffff;

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

    .user {
        position: absolute;
        bottom: 120%;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        word-break: break-all;
        gap: 0.5rem;

        img {
            width: 5rem;
            height: 5rem;
            border-radius: 50%;
        }

        p {
            font-size: 1.2rem;
            font-weight: bold;
            color: #ffffff;
        }
    }

    @media screen and (width <= 850px) {
        .dcButtons {
            flex-direction: column;
            padding: 0;
        }
    }
</style>
