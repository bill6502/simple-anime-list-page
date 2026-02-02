<script lang="ts">
    import { type Anime } from '$lib/types';
    import AnimeList from '$lib/components/animeList.svelte';

    const urls = ['all', 'ani.gamer', 'anime1.me', 'hanime1.me'];
    const urlMap = {
        all: '全部',
        'ani.gamer': '巴哈姆特動畫瘋',
        'anime1.me': 'Anime1',
        'hanime1.me': 'Hanime1',
    };

    let { data } = $props();

    let selectedUrl = $state<string>('all');
    let animes = $derived.by<Anime[]>(() =>
        [...data.animes]
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
            }),
    );
    let websites = $derived.by<string[]>(() =>
        urls.filter(
            (url) =>
                url == 'all' ||
                animes.some((anime) => anime.url.includes('https://' + url)),
        ),
    );
    let selectedAnime = $derived.by<Anime[]>(() => {
        if (selectedUrl == 'all') {
            return animes;
        }
        return animes.filter((anime) =>
            anime.url.includes('https://' + selectedUrl),
        );
    });

    let userName = $derived<string>(data.userName);
</script>

<svelte:head>
    <title>動畫收藏清單</title>
    <meta name="description" content="Anime List" />
</svelte:head>

<div class="container">
    <p>{userName}</p>
    <div class="buttons">
        {#each websites as url (url)}
            <button
                class={selectedUrl == url ? 'selected' : ''}
                onclick={(e) => {
                    selectedUrl = url;
                }}>{urlMap[url]}</button
            >
        {/each}
    </div>
    <div class="list">
        <AnimeList animes={selectedAnime} />
    </div>
</div>

<style>
    .container {
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
        border-radius: 1rem;
        overflow: hidden;
    }

    p {
        font-size: 2rem;
        font-weight: bold;
        text-align: center;
        color: aliceblue;
    }

    .buttons {
        position: sticky;
        top: 0;
        display: flex;
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
        padding: 1rem;
        margin: 0.5rem;
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

        transition:
            background-color 0.1s ease-out 0.1s,
            color 0.1s ease-in-out;

        &.selected,
        &:hover {
            background-color: #63605f;
            color: #d9d4cf;
        }
    }
</style>
