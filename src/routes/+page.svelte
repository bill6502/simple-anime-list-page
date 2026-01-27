<script lang="ts">
    import { goto } from '$app/navigation';
    let { data } = $props();
    let animes = $derived<{ name: string; url: string }[]>(data.animes);
    let userName = $derived<string>(data.userName);

    let id = $state<string>('');

    const searchId = async () => {
        await goto(`?id=${id}`, { invalidateAll: true });
    };
</script>

<svelte:head>
    <title>動畫收藏清單</title>
    <meta name="description" content="Anime List" />
</svelte:head>

<dev>
    {#if !userName || !animes}
        <form
            class="search-container"
            onsubmit={async (e) => {
                e.preventDefault();
                await searchId();
            }}
        >
            <input bind:value={id} placeholder="Enter id" />
            <button onclick={async () => await searchId()}>Search</button>
        </form>
    {:else}
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
                        <td
                            ><a href={anime.url} target="_blank">{anime.url}</a
                            ></td
                        >
                    </tr>
                {/each}
            </tbody>
        </table>
    {/if}
</dev>

<style>
    p {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 16px;
        text-align: center;
        color: aliceblue;
    }

    dev {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 0.6;
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

    .search-container {
        width: 60%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .search-container > input,
    button {
        width: 100%;
        border-radius: 1rem;
        height: 2rem;
        padding: 0.5rem 2rem;
        border: none;
        outline: none;
    }

    .search-container > button {
        width: 100%;
    }

    .thtitle * {
        padding: 1.3rem;
    }
</style>
