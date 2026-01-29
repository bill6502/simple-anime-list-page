<script lang="ts">
    type Anime = { name: string; url: string; from: string };
    const urls = ['gamer', 'anime1.me', 'anime1.one', 'hanime1.me'];

    let { data } = $props();
    let animes = $derived.by<Anime[]>(() =>
        [...data.animes]
            .sort((a, b) => a.url.localeCompare(b.url))
            .map((anime) => {
                let from = '';
                for (const url of urls) {
                    if (anime.url.includes(url)) {
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
    let userName = $derived<string>(data.userName);
</script>

<svelte:head>
    <title>動畫收藏清單</title>
    <meta name="description" content="Anime List" />
</svelte:head>

<div>
    <p>{userName}</p>
    <table>
        <thead class="thtitle">
            <tr>
                <th class="tdName">Name</th>
                <th class="tdURL titleRightSide">URL</th>
            </tr>
        </thead>
        <tbody>
            {#each animes as anime}
                <tr>
                    <td class="tdName">{anime.name}</td>
                    <td class={`tdURL ${anime.from}RightSide`}
                        ><a href={anime.url} target="_blank">{anime.url}</a></td
                    >
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    p {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 16px;
        text-align: center;
        color: aliceblue;
    }

    table {
        border-collapse: collapse;
        width: 100%;
        table-layout: fixed;
    }

    th,
    td {
        padding: 1rem;
        text-align: left;
        word-break: break-all;
    }

    thead > tr {
        background-color: #abd0ce;
        color: #333;
        width: 100%;
    }

    tbody > tr:nth-child(2n + 1) * {
        background-color: #d9d4cf;
        color: #7c7877;
    }

    tbody > tr:nth-child(2n + 2) * {
        background-color: #7c7877;
        color: #d9d4cf;
    }
    .tdName {
        width: 30%;
    }
    .tdURL {
        width: 70%;
    }

    .thtitle {
        position: sticky;
        top: 0;
    }

    .thtitle * {
        padding: 1.5rem;
    }

    .titleRightSide {
        box-shadow: inset -0.5rem 0 0 0 #abd0ce;
    }

    .gamerRightSide {
        box-shadow: inset -0.5rem 0 0 0 #009bad;
    }

    .anime1meRightSide {
        box-shadow: inset -0.5rem 0 0 0 #b92d72;
    }

    .anime1oneRightSide {
        box-shadow: inset -0.5rem 0 0 0 #fff;
    }

    .hanime1meRightSide {
        box-shadow: inset -0.5rem 0 0 0 #b20710;
    }
</style>
