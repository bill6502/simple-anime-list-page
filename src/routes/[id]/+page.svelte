<script lang="ts">
    import { page } from '$app/state';
    import { urls, type Anime } from '$lib/types';
    import { fade } from 'svelte/transition';
    import { store } from '$lib/store.svelte';
    import { innerWidth } from 'svelte/reactivity/window';
    import AnimeList from '$lib/components/animeList.svelte';
    import db from '$lib/db';
    import { goto } from '$app/navigation';

    const urlMap = {
        'ani.gamer': '巴哈姆特動畫瘋',
        'anime1.me': 'Anime1',
        'hanime1.me': 'Hanime1',
    };

    let { data } = $props();

    let expanding = $state<boolean>(false);

    let selectedUrl = $state<string>('all');
    let searchQuery = $state<string>('');
    let animes = $state<Anime[]>([]);

    let websites = $derived.by<string[]>(() =>
        urls.filter(
            (url) =>
                url == 'all' ||
                animes.some((anime) => anime.url.includes('https://' + url)),
        ),
    );
    let selectedAnime = $derived.by<Anime[]>(() =>
        animes
            .filter(
                (anime) =>
                    selectedUrl == 'all' ||
                    anime.url.includes('https://' + selectedUrl),
            )
            .filter(
                (anime) =>
                    searchQuery == '' ||
                    anime.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
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

    $effect(() => {
        if (innerWidth.current! > 720) {
            expanding = false;
        }
    });

    $effect(() => {
        if (page.url.searchParams.get('from')) {
            goto(page.url.pathname);
        }
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
        store.message('已成功更新', 'success');
    }

    function toggleSourceSelection() {
        expanding = !expanding;
    }

    function copyListId() {
        navigator.clipboard.writeText(page.params.id!);
        store.message('已複製清單ID至剪貼簿', 'success');
    }
</script>

<svelte:head>
    <title>動畫收藏清單</title>
</svelte:head>

<div class="container">
    <div class="title">
        <p class="copy" title="點擊以複製清單ID" onclick={copyListId}>
            {data.userName}
        </p>
        <p>{animes.length}部動畫</p>
    </div>
    <div class="buttons">
        {#if innerWidth.current! <= 720}
            <button class="button" onclick={toggleSourceSelection}>
                來源</button
            >
        {/if}
        {#each websites as url, i (url)}
            {#if innerWidth.current! > 720 || expanding || url == selectedUrl}
                <button
                    in:fade={{ duration: 300 }}
                    class={selectedUrl == url ? 'button selected' : 'button'}
                    onclick={(e) => {
                        selectedUrl = selectedUrl != url ? url : 'all';
                        expanding = !expanding ? true : expanding;
                        window.scrollTo(0, 0);
                    }}
                    >{`${urlMap[url]}(${animes.filter((anime) => anime.url.includes('https://' + url)).length})`}</button
                >
            {/if}
        {/each}
        {#if store.user && data.isMyAnimeList}
            {#if innerWidth.current! > 720 || expanding}
                <button
                    in:fade={{ duration: 500 }}
                    class="button"
                    onclick={async () => {
                        expanding = !expanding ? true : expanding;
                        await updateAnimeList();
                        window.scrollTo(0, 0);
                    }}>更新</button
                >
            {/if}
        {/if}
    </div>
    <input bind:value={searchQuery} placeholder="搜尋動畫" />
    <div class="list">
        <AnimeList animes={selectedAnime} />
    </div>
</div>

<style>
    .copy {
        cursor: pointer;
        &:hover {
            color: #c0c0c0;
        }
    }
    .container {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;

        & input {
            width: 100%;
            border: none;
            outline: none;
            font-size: 1rem;
            padding: 0.2rem 0.5rem;
            border-radius: 0.5rem;
            height: 3rem;
            text-align: center;
            align-items: center;
            background-color: #d9d4cf;
            color: #7c7877;

            transition: background-color 0.3s ease;
            &:focus {
                background-color: #e5e5e5;
            }
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
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0 3rem;

        p {
            font-size: 2rem;
            font-weight: bold;
            text-align: center;
            overflow-wrap: break-word;
            word-break: break-all;
            color: aliceblue;
        }
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
        .title {
            flex-direction: column;
        }
        .buttons {
            flex-direction: column;
        }
    }

    .button {
        border: none;
        border-radius: 0.5rem;
        background-color: #d9d4cf;
        color: #7c7877;
        cursor: pointer;

        display: flex;
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

    @media (hover: hover) and (pointer: fine) {
        .button {
            &:hover {
                background-color: #63605f;
                color: #d9d4cf;
            }
        }
    }
</style>
