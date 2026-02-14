<script lang="ts">
    import { page } from '$app/state';
    import { urls, urlMap, type Anime } from '$lib/type';
    import { slide } from 'svelte/transition';
    import { store } from '$lib/store.svelte';
    import { innerWidth } from 'svelte/reactivity/window';
    import { setLocalStorage, updateMyAnimeList } from '$lib/utility';
    import AnimeList from '$lib/components/animeList.svelte';

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
                    page.params.id != store.userAnimeListId ||
                    store.userAnimeList.some((a) => a.name == anime.name),
            )
            .filter(
                (anime) =>
                    selectedUrl == 'all' ||
                    anime.url.includes('https://' + selectedUrl),
            )
            .filter(
                (anime) =>
                    searchQuery == '' ||
                    anime.name.toLowerCase().includes(searchQuery),
            ),
    );

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
        store.currentPath = 'mylist';
        setLocalStorage();
    });

    async function updateAnimeList() {
        if (!(store.user && page.params.id == store.userAnimeListId)) {
            store.notificationMessage = '需取得Discord授權';
            return;
        }
        await updateMyAnimeList();

        animes = store.userAnimeList
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
        store.successMessage = '已更新';
    }

    function toggleSourceSelection() {
        expanding = !expanding;
    }

    function copyListId() {
        navigator.clipboard.writeText(page.params.id!);
        store.successMessage = '已複製清單ID至剪貼簿';
    }

    function searchAnime(
        event: KeyboardEvent & {
            currentTarget: EventTarget & HTMLInputElement;
        },
    ) {
        if (event.key === 'Enter') {
            const input = event.target as HTMLInputElement;
            const query = input.value.toLowerCase();
            searchQuery = query;
        }
    }

    function clearSearch(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.value === '') {
            searchQuery = '';
        }
    }
</script>

<svelte:head>
    <title>收藏 - 動畫清單</title>
</svelte:head>

<div class="container">
    <div class="title">
        <button class="copy" title="點擊以複製清單ID" onclick={copyListId}>
            {data.userName}
        </button>
        <p>{animes.length}部動畫</p>
    </div>
    <div class="buttons">
        {#if innerWidth.current! <= 720}
            <button class="button" onclick={toggleSourceSelection}>
                <img src="/line.svg" alt="Line" />
            </button>
        {/if}
        {#each websites as url (url)}
            {#if innerWidth.current! > 720 || expanding || url == selectedUrl}
                <button
                    in:slide={{ duration: 300 }}
                    out:slide={{ duration: 100 }}
                    class="button"
                    class:selected={selectedUrl == url}
                    onclick={(e) => {
                        selectedUrl = selectedUrl != url ? url : 'all';
                        expanding = selectedUrl == 'all';
                    }}
                    >{`${urlMap[url as keyof typeof urlMap]}(${animes.filter((anime) => anime.url.includes('https://' + url)).length})`}</button
                >
            {/if}
        {/each}
        {#if innerWidth.current! > 720 || expanding}
            <button
                in:slide={{ duration: 300 }}
                out:slide={{ duration: 100 }}
                class="button"
                class:disabled={!(
                    store.user && page.params.id == store.userAnimeListId
                )}
                disabled={!(
                    store.user && page.params.id == store.userAnimeListId
                )}
                onclick={updateAnimeList}>更新</button
            >
        {/if}
    </div>
    <input oninput={clearSearch} onkeyup={searchAnime} placeholder="搜尋動畫" />
    <div class="list">
        <AnimeList animes={selectedAnime} />
    </div>
</div>

<style>
    .copy {
        font-size: 2rem;
        font-weight: bold;
        font-family: var(--font-body);
        background-color: transparent;
        color: aliceblue;
        border: none;
        outline: none;
        text-align: center;
        overflow-wrap: break-word;
        word-break: break-all;
        cursor: pointer;

        transition: color 0.2s ease-in-out;
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

            transition: color 0.1s ease-in-out;
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

    .button img {
        width: 3rem;
        height: 3rem;
        object-fit: contain;
    }

    @media screen and (width <= 720px) {
        .title {
            flex-direction: column;
        }
        .buttons {
            flex-direction: column;
        }
    }

    @media (hover: hover) and (pointer: fine) {
        .copy {
            &:hover {
                color: skyblue;
            }
        }
    }
</style>
