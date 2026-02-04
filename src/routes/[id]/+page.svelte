<script lang="ts">
    import { page } from '$app/stores';
    import { type Anime } from '$lib/types';
    import AnimeList from '$lib/components/animeList.svelte';
    import { PUBLIC_DB } from '$env/static/public';

    const urls = ['all', 'ani.gamer', 'anime1.me', 'hanime1.me'];
    const urlMap = {
        all: '全部',
        'ani.gamer': '巴哈姆特動畫瘋',
        'anime1.me': 'Anime1',
        'hanime1.me': 'Hanime1',
    };

    let { data } = $props();

    let message = $state<string>('');
    let selectedUrl = $state<string>('all');
    let animes = $state<Anime[]>([]);

    let user = $state<any | null>(
        localStorage.getItem('user')
            ? JSON.parse(localStorage.getItem('user')!)
            : null,
    );
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
        fetch(`${PUBLIC_DB}/updateWebsiteInfo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                args: { userId: user.id, userName: user.username },
            }),
        })
            .then((updateAnimesList) => updateAnimesList.json())
            .then((data) => (isMyAnimeList = data.value == id))
            .catch((error) => {
                message = '動畫清單更新錯誤';
                isMyAnimeList = false;
                setTimeout(() => {
                    message = '';
                }, 1500);
            });
    });

    async function updateAnimeList() {
        const updateAnimesList = await fetch(`${PUBLIC_DB}/updateWebsiteInfo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                args: { userId: user.id, userName: user.username },
            }),
        });

        if (!updateAnimesList.ok) {
            message = '動畫清單更新錯誤';
            setTimeout(() => {
                message = '';
            }, 1500);
            return;
        }

        const id = (await updateAnimesList.json()).value;
        console.log(id);
        const getAnimeList = await fetch(`${PUBLIC_DB}/getWebsiteInfoBy_Id`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ args: { id } }),
        });

        if (!getAnimeList.ok) {
            message = '動畫清單取得錯誤';
            setTimeout(() => {
                message = '';
            }, 1500);
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
    <div class="message" data-error={message ? true : false}>
        <p>{message}</p>
    </div>
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
        <button
            class="updateButton"
            data-disabled={!user || !isMyAnimeList}
            onclick={async () => {
                await updateAnimeList();
                window.scrollTo(0, 0);
            }}>更新</button
        >
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
        overflow: hidden;
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

    .updateButton {
        animation: flip 0.7s;
        &[data-disabled='true'] {
            display: none;
        }
    }

    .message {
        position: absolute;
        top: 0%;
        left: 50%;
        transform: translate(-50%, -100%);
        background-color: #fff5f5;
        border: 1px solid #ff0000;
        color: #000000;
        border-radius: 0.2rem;
        padding: 0 1rem;
        min-width: 20rem;
        font-size: 1rem;
        text-align: center;
        z-index: 999;

        p {
            line-height: 3rem;
        }

        &[data-error='false'] {
            animation: none;
        }
        &[data-error='true'] {
            animation: message 1s;
        }
    }

    @keyframes flip {
        0% {
            display: inline-flex;
        }
        5% {
            transform: scale(0, 1);
        }
        100% {
            transform: scale(1, 1);
        }
    }

    @keyframes message {
        0% {
            top: 0%;
        }
        70% {
            top: 0.7%;
        }
        80% {
            top: 0.7%;
        }
        100% {
            top: 0%;
        }
    }
</style>
