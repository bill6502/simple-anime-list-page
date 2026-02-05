<script lang="ts">
    import { page } from '$app/stores';
    import { type Anime } from '$lib/types';
    import { store } from '$lib/store.svelte';
    import { fade } from 'svelte/transition';
    import db from '$lib/db';
    import AnimeList from '$lib/components/animeList.svelte';

    const urls = ['all', 'ani.gamer', 'anime1.me', 'hanime1.me'];
    const urlMap = {
        all: '全部',
        'ani.gamer': '巴哈姆特動畫瘋',
        'anime1.me': 'Anime1',
        'hanime1.me': 'Hanime1',
    };
    const messageDuration = 2200;
    const user = store.user;

    let { data } = $props();

    let selectedUrl = $state<string>('all');
    let animes = $state<Anime[]>([]);

    let isMyAnimeList = $state<boolean>(false);
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

    //isMyAnimeList?
    $effect(() => {
        const id = $page.params.id;
        if (!user) {
            return;
        }

        db.updateWebsiteInfo(user.id, user.username)
            .then((updateAnimesList) => updateAnimesList.json())
            .then((data) => (isMyAnimeList = data.value == id))
            .catch((error) => {
                store.message('動畫清單更新錯誤', 'error');
                isMyAnimeList = false;
            });
    });

    async function updateAnimeList() {
        const updateAnimesList = await db.updateWebsiteInfo(
            user.id,
            user.username,
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
</script>

<svelte:head>
    <title>動畫收藏清單</title>
    <meta name="description" content="Anime List" />
</svelte:head>
<div class="container">
    <p class="title">{userName}</p>
    <div class="buttons">
        {#each websites as url (url)}
            <button
                class={selectedUrl == url ? 'selected' : ''}
                onclick={(e) => {
                    selectedUrl = url;
                    window.scrollTo(0, 0);
                }}>{urlMap[url]}</button
            >
        {/each}
        {#if user && isMyAnimeList}
            <button
                transition:fade={{ duration: 500, delay: 200 }}
                onclick={async () => {
                    await updateAnimeList();
                    window.scrollTo(0, 0);
                }}>更新</button
            >
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

    .list {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 0.7rem;
        overflow: hidden;
    }

    .title {
        font-size: 2rem;
        font-weight: bold;
        text-align: center;
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

    .buttons > button {
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

        &.selected,
        &:hover {
            background-color: #63605f;
            color: #d9d4cf;
        }
    }
</style>
