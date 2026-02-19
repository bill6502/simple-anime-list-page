<script lang="ts">
    import { store } from '$lib/store.svelte';
    import { urls, type Anime } from '$lib/type';
    import AnimeList from '$lib/components/animeList.svelte';
    import { setLocalStorage, updateMyAnimeList } from '$lib/utility.js';
    import { slide } from 'svelte/transition';
    import db from '$lib/db';

    let { data } = $props();

    let searchQuery = $state<string>('');
    let addAnimeName = $state<string>('');
    let addAnimeUrl = $state<string>('');

    let isAddingAnime = $state<boolean>(false);
    let isComparingToMyAnimeList = $state<boolean>(false);

    let animes = $state<Anime[]>(data.animes);
    let filteredAnimes = $derived.by<Anime[]>(() =>
        animes
            .filter(
                (anime) =>
                    searchQuery == '' ||
                    anime.name.toLowerCase().includes(searchQuery),
            )
            .filter(
                (anime) =>
                    !isComparingToMyAnimeList ||
                    !store.userAnimeList.some((a) => a.name == anime.name),
            ),
    );

    $effect(() => {
        store.currentPath = 'home';
        store.message = '';
        setLocalStorage();
    });

    async function addAnime() {
        if (!store.user) {
            store.message = '需取得Discord授權';
            return;
        }

        if (addAnimeName == '' || addAnimeUrl == '') {
            store.message = '請輸入動畫名稱與網址';
            return;
        }
        if (
            animes.some((anime) => anime.name.trim() == addAnimeName.trim()) ||
            animes.some((anime) => anime.url.trim() == addAnimeUrl.trim())
        ) {
            store.message = '動畫已存在';
            return;
        }

        const regex = urls.map((url) => `(${url})`).join('|');
        if (!addAnimeUrl.match(regex)) {
            store.message = '可加入網址僅限 ani.gamer , anime1.me , hanime1.me';
            return;
        }

        const response = await db.addAnimeCollection(
            addAnimeName,
            addAnimeUrl,
            store.user.id,
        );
        if (response.ok) {
            store.message = '已加入收藏中';

            let from = '';
            for (const url of urls) {
                if (addAnimeUrl.includes('https://' + url)) {
                    from = url.replace('.', '');
                }
            }
            await updateMyAnimeList();
            animes.push({ name: addAnimeName, url: addAnimeUrl, from });
        } else {
            store.message = '加入收藏失敗';
        }
    }

    function toggleComparingToMyAnimeList() {
        if (!store.user) {
            store.message = '需取得Discord授權';
            return;
        }
        isComparingToMyAnimeList = !isComparingToMyAnimeList;
    }

    function toggleAddAnime() {
        isAddingAnime = !isAddingAnime;
    }

    function search(
        event: KeyboardEvent & {
            currentTarget: EventTarget & HTMLInputElement;
        },
    ) {
        if (event.key === 'Enter') {
            const input = event.target as HTMLInputElement;
            const query = input.value.toLowerCase().trim();
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
    <title>首頁 - 動畫清單</title>
</svelte:head>
<div class="container">
    <div class="title">
        <p>資料庫內所有動畫</p>
        <p>{animes.length}部動畫</p>
    </div>
    <div class="panel">
        <div class="search">
            <input
                oninput={clearSearch}
                onkeyup={search}
                placeholder="搜尋動畫"
            />
            <div class="buttons">
                <button
                    class:enabled={isAddingAnime}
                    onclick={toggleAddAnime}
                    class="button"
                    title="新增動畫">新增動畫</button
                >
                <button
                    onclick={toggleComparingToMyAnimeList}
                    class="button"
                    class:enabled={isComparingToMyAnimeList}
                    disabled={!(store.user && store.userAnimeList)}
                    title="顯示未收藏動畫">未收藏</button
                >
            </div>
        </div>
        {#if isAddingAnime}
            <div
                in:slide={{ duration: 300 }}
                out:slide={{ duration: 100 }}
                class="addPanel"
            >
                <p>新增動畫</p>
                <div class="addPanelInputs">
                    <input bind:value={addAnimeName} placeholder="動畫名稱" />
                    <input bind:value={addAnimeUrl} placeholder="動畫網址" />
                </div>
                <button
                    disabled={!(store.user && searchQuery)}
                    onclick={addAnime}
                    class="button">加入</button
                >
            </div>
        {/if}
    </div>
    <div class="list">
        <AnimeList animes={filteredAnimes} />
    </div>
</div>

<style>
    .container {
        position: relative;
        display: flex;
        max-width: 64rem;
        margin: 0 auto;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
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

    .list {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 0.7rem;
        overflow: hidden;
    }

    button {
        box-sizing: border-box;
        border-radius: 0.5rem;
        padding: 1.5rem 2rem;
        border: none;
        outline: none;
        cursor: pointer;
        text-decoration: none;
    }

    .panel {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;

        .search {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            width: 100%;

            button {
                width: 100%;
            }

            .enabled {
                background-color: #63605f !important;
                color: #d9d4cf !important;
            }

            .buttons {
                display: flex;
                gap: 1rem;
                justify-content: center;
                align-items: center;
                box-sizing: border-box;
                background-color: transparent;
                z-index: 10;
            }
        }

        input {
            width: 100%;
            height: 2rem;
            text-align: center;
            box-sizing: border-box;
            border-radius: 0.5rem;
            padding: 1.5rem 2rem;
            border: none;
            outline: none;
            text-decoration: none;
            background-color: #d9d4cf;
            color: #7c7877;

            transition: background-color 0.3s ease;
            &:focus {
                background-color: #e5e5e5;
            }
        }
    }

    .addPanel {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.7rem;
        border-radius: 0.5rem;
        gap: 1rem;
        background-color: #7c7877;

        & p {
            max-width: 100%;
            box-sizing: border-box;
            font-size: 2rem;
            font-weight: bold;
            text-align: center;
            overflow-wrap: break-word;
            word-break: break-all;
            color: aliceblue;
        }
    }

    .addPanelInputs {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;

        & input {
            width: 50%;
            height: 2rem;
            cursor: unset;
            text-align: center;
            background-color: #d9d4cf;
            color: #7c7877;
        }
    }

    .addPanelInputs > input {
        width: 100%;
        height: 2rem;
        cursor: unset;
        text-align: center;
        background-color: #d9d4cf;
        color: #7c7877;
    }

    @media (width <= 720px) {
        .title {
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .addPanelInputs {
            flex-direction: column;
        }

        .addPanelInputs > input {
            width: 100%;
        }

        .search {
            flex-direction: column !important;

            & * {
                width: 100% !important;
            }

            .buttons {
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 0.7rem;
                background-color: #7c7877 !important;
                border-radius: 0.5rem;
            }
        }
    }
</style>
