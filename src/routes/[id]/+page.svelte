<script lang="ts">
    import AnimeList from '$lib/components/animeList.svelte';

    type Anime = { name: string; url: string; from: string };

    const urls = ['ani.gamer', 'anime1.me', 'anime1.one', 'hanime1.me'];

    let { data } = $props();
    let selectedUrl = $state<string>('');

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
    let selectedAnime = $derived.by<Anime[]>(() => {
        if (selectedUrl == '') return animes;
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
        <button
            onclick={() => {
                selectedUrl = '';
            }}>All</button
        >
        {#each urls as url}
            <button
                onclick={() => {
                    selectedUrl = url;
                }}>{url}</button
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
        display: grid;
        grid-gap: 10px;
        grid-template-columns: repeat(5, 1fr);
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
            grid-template-columns: repeat(2, 1fr);
        }
    }

    .buttons button {
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
    }
</style>
