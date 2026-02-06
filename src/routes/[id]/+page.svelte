<script lang="ts">
    import { type Anime } from '$lib/types';
    import { page } from '$app/stores';
    import { fade } from 'svelte/transition';
    import { store } from '$lib/store.svelte';
    import AnimeList from '$lib/components/animeList.svelte';
    import db from '$lib/db';

    const urls = ['ani.gamer', 'anime1.me', 'hanime1.me'];
    const urlMap = {
        'ani.gamer': '巴哈姆特動畫瘋',
        'anime1.me': 'Anime1',
        'hanime1.me': 'Hanime1',
    };

    let { data } = $props();

    let innerWidth = $state<number>(0);
    let expanding = $state<boolean>(false);
    let showUnAuth = $state<boolean>(false);

    let selectedUrl = $state<string>('all');
    let animes = $state<Anime[]>([]);

    let websites = $derived.by<string[]>(() =>
        urls.filter(
            (url) =>
                url == 'all' ||
                animes.some((anime) => anime.url.includes('https://' + url)),
        ),
    );
    let selectedAnime = $derived.by<Anime[]>(() =>
        animes.filter(
            (anime) =>
                selectedUrl == 'all' ||
                anime.url.includes('https://' + selectedUrl),
        ),
    );
    let userName = $derived<string>(data.userName);

    //updateAnimeList
    $effect(() => {
        animes = [...data.animes]
            .sort((a, b) => a.url.localeCompare(b.url))
            .map((anime) => {
                let from = '';
                for (const url of urls) {
                    if (anime.url.includes('https://' + url)) {
                        from = url.replace('.', '');
                    }
                }

                return {
                    name: anime.name,
                    url: anime.url,
                    from: from,
                };
            });
    });

    async function updateAnimeList() {
        const updateAnimesList = await db.updateWebsiteInfo(
            store.user.id,
            store.user.username,
        );

        if (!updateAnimesList.ok) {
            store.message('動畫清單更新錯誤', 'error');
            return;
        }

        const id = (await updateAnimesList.json()).value;
        const getAnimeList = await db.getWebsiteInfoBy_Id(id);

        if (!getAnimeList.ok) {
            store.message('動畫清單取得錯誤', 'error');
            return;
        }

        const data = await getAnimeList.json();
        animes = (data.value.animes as Anime[])
            .sort((a, b) => a.url.localeCompare(b.url))
            .map((anime) => {
                let from = '';
                for (const url of urls) {
                    if (anime.url.includes('https://' + url)) {
                        from = url.replace('.', '');
                    }
                }

                return {
                    name: anime.name,
                    url: anime.url,
                    from: from,
                };
            });
    }

    function clear() {
        localStorage.removeItem('user');
        localStorage.removeItem('userAnimeListId');

        store.user = null;
        store.userAnimeListId = '';
    }

    function setLastAnimeListId() {
        localStorage.setItem('lastAnimeListId', $page.params.id!);
    }

    function toggleSourceSelection() {
        expanding = !expanding;
    }
</script>

<svelte:head>
    <title>動畫收藏清單</title>
</svelte:head>

<svelte:window bind:innerWidth />

<div class="container">
    <div class="banner">
        <p class="title">{data.userName}</p>
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
    </div>
    <div class="buttons">
        {#if innerWidth <= 720}
            <button class="button" onclick={toggleSourceSelection}>
                來源</button
            >
        {/if}
        {#each websites as url, i (url)}
            {#if innerWidth > 720 || expanding || url == selectedUrl}
                <button
                    transition:fade={{ duration: 300 }}
                    class={selectedUrl == url ? 'button selected' : 'button'}
                    onclick={(e) => {
                        selectedUrl = selectedUrl != url ? url : 'all';
                        expanding = false;
                        window.scrollTo(0, 0);
                    }}>{urlMap[url]}</button
                >
            {/if}
        {/each}
        {#if store.user && data.isMyAnimeList}
            {#if innerWidth > 720 || expanding}
                <button
                    transition:fade={{ duration: 300 }}
                    class="button"
                    onclick={async () => {
                        expanding = false;
                        await updateAnimeList();
                        window.scrollTo(0, 0);
                    }}>更新</button
                >
            {/if}
        {/if}
    </div>
    <div class="list">
        <AnimeList animes={selectedAnime} />
    </div>
</div>

<style>
    .container {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }

    .banner {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        text-align: center;
        padding: 0 0.5rem;
        gap: 0.7rem;
    }

    .user-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;

        & img {
            width: 3rem;
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

    .list {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 0.7rem;
        overflow: hidden;
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

    .buttons {
        position: sticky;
        top: 0;
        display: flex;
        gap: 1rem;
        justify-content: center;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
        padding: 0.7rem;
        background-color: #7c7877;
        border-radius: 0.5rem;
        z-index: 10;
    }

    @media screen and (width <= 720px) {
        .buttons {
            flex-direction: column;
        }
    }

    @media screen and (width <= 400px) {
        .banner {
            flex-direction: column;
        }
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

        &.selected {
            background-color: #63605f;
            color: #d9d4cf;
        }
        &:active {
            background-color: #d9d4cf;
            color: #7c7877;
        }
    }

    @media (hover: hover) {
        .button {
            &:hover {
                background-color: #63605f;
                color: #d9d4cf;
            }
        }
    }
</style>
