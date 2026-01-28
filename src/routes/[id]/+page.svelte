<script lang="ts">
    let { data } = $props();
    let animes = $derived<{ name: string; url: string }[]>(data.animes);
    let userName = $derived<string>(data.userName);
</script>

<svelte:head>
    <title>動畫收藏清單</title>
    <meta name="description" content="Anime List" />
</svelte:head>

<p>{userName}</p>
<table>
    <thead class="thtitle">
        <tr>
            <th>Name</th>
            <th>URL</th>
        </tr>
    </thead>
    <tbody>
        {#each animes as anime}
            <tr>
                <td>{anime.name}</td>
                <td><a href={anime.url} target="_blank">{anime.url}</a></td>
            </tr>
        {/each}
    </tbody>
</table>

<style>
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
    }

    th,
    td {
        padding: 1rem;
        text-align: left;
    }

    thead > tr {
        background-color: #abd0ce;
        color: #333;
    }

    tbody > tr:nth-child(2n + 1) * {
        background-color: #d9d4cf;
        color: #7c7877;
    }

    tbody > tr:nth-child(2n + 2) * {
        background-color: #7c7877;
        color: #d9d4cf;
    }

    .thtitle * {
        padding: 1.3rem;
    }
</style>
