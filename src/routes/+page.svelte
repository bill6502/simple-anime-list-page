<script lang="ts">
    import { goto } from '$app/navigation';

    let id = $state<string>('');
    let message = $state<string>('');

    const searchId = async () => {
        await goto(`/${id}`, { invalidateAll: true });
        message = '清單不存在';
    };
</script>

<svelte:head>
    <title>動畫收藏清單</title>
    <meta name="description" content="Anime List" />
</svelte:head>

<dev class="container">
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
    {#if message}
        <dev class="message">
            <p>{message}</p>
        </dev>
    {/if}
</dev>

<style>
    .container {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: auto 0;
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

    .message {
        position: absolute;
        top: 120%;
        left: 50%;
        transform: translateX(-50%);
        background-color: #fff5f5;
        border: 1px solid #ff0000;
        color: #000000;
        border-radius: 0.2rem;
        padding: 0 1rem;
        font-size: 1rem;
        p {
            line-height: 1;
        }
    }
</style>
