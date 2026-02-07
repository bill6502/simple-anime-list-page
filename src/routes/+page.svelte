<script lang="ts">
    import { goto } from '$app/navigation';
    import { store } from '$lib/store.svelte';
    import AnimeList from '$lib/components/animeList.svelte';
    import { urls, type Anime } from '$lib/types';
    import db from '$lib/db';

    let { data } = $props();

    let animeListId = $state<string>('');
    let animes = $state<Anime[]>(data.animes);

    let searchQuery = $state<string>('');
    let filteredAnimes = $derived.by<Anime[]>(() =>
        animes.filter(
            (anime) =>
                searchQuery == '' ||
                anime.name
                    .toLocaleLowerCase()
                    .includes(searchQuery.toLocaleLowerCase()),
        ),
    );

    let addAnimeName = $state<string>('');
    let addAnimeUrl = $state<string>('');

    $effect(() => {
        store.message(data.error, 'error');
    });

    async function gotoId() {
        const url_id = `${store.baseUrl}/${animeListId}`;

        await goto(url_id, { invalidateAll: true });
    }

    async function addAnime() {
        if (addAnimeName == '' || addAnimeUrl == '') {
            store.message('請輸入動畫名稱與網址', 'error');
            return;
        }
        if (
            animes.some((anime) => anime.name == addAnimeName) ||
            animes.some((anime) => anime.url == addAnimeUrl)
        ) {
            store.message('動畫已存在', 'error');
            return;
        }

        const regex = urls.map((url) => `(${url})`).join('|');
        if (!addAnimeUrl.match(regex)) {
            store.message(
                '可加入網址僅限 ani.gamer , anime1.me , hanime1.me',
                'error',
            );
            return;
        }

        const response = await db.addAnimeCollection(
            addAnimeName,
            addAnimeUrl,
            store.user.id,
        );
        if (response.ok) {
            store.message('動畫已加入', 'success');

            let from = '';
            for (const url of urls) {
                if (addAnimeUrl.includes('https://' + url)) {
                    from = url.replace('.', '');
                }
            }
            animes.push({ name: addAnimeName, url: addAnimeUrl, from });
        } else {
            store.message('加入失敗', 'error');
        }
    }
</script>

<svelte:head>
    <title>動畫清單</title>
</svelte:head>
<div class="container">
    <form
        class="searchLlistId"
        onsubmit={async (e) => {
            e.preventDefault();
            await gotoId();
        }}
    >
        <input bind:value={animeListId} placeholder="搜尋動畫清單ID" />
    </form>
    <p class="title">資料庫內所有動畫 總計{animes.length}部</p>
    <div class="panel">
        <input bind:value={searchQuery} placeholder="搜尋動畫" />
        {#if store.user && searchQuery}
            <div class="addPanel">
                <p>加入動畫</p>
                <div class="addPanelInputs">
                    <input bind:value={addAnimeName} placeholder="動畫名稱" />
                    <input bind:value={addAnimeUrl} placeholder="動畫網址" />
                </div>
                <button onclick={addAnime} class="button">加入</button>
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
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
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

    .list {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 0.7rem;
        overflow: hidden;
    }

    .searchLlistId {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;

        & button {
            width: 30%;
        }
    }

    .searchLlistId > input,
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

    .searchLlistId > input {
        width: 100%;
        height: 2rem;
        cursor: unset;
        text-align: center;
        background-color: #d9d4cf;
        color: #7c7877;
    }

    .panel {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;

        & input {
            width: 100%;
            height: 2rem;
            text-align: center;
            box-sizing: border-box;
            border-radius: 0.7rem;
            padding: 1.5rem 2rem;
            border: none;
            outline: none;
            text-decoration: none;
            background-color: #d9d4cf;
            color: #7c7877;
        }
    }

    .addPanel {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;

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

    @media (width <= 720px) {
        .addPanelInputs {
            flex-direction: column;
            /*align-items: stretch;*/
        }

        .addPanelInputs > input {
            width: 100%;
        }
    }
</style>
