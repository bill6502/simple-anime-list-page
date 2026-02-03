<script lang="ts">
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';

    let { data } = $props();

    let id = $state<string>(data.listId);
    let user = $state<any>(data.user);
    let message = $derived<string>(data.error);

    const url =
        base == ''
            ? 'https://discord.com/oauth2/authorize?client_id=1446749870101757994&response_type=token&redirect_uri=http%3A%2F%2F127.0.0.1%3A5173&scope=identify'
            : 'https://discord.com/oauth2/authorize?client_id=1446749870101757994&response_type=token&redirect_uri=https%3A%2F%2Fbill6502.github.io%2Fsimple-anime-list-page&scope=identify';

    const gotoId = async () => {
        const url_id = `${base}/${id}`;

        await goto(url_id, { invalidateAll: true });
    };
</script>

<svelte:head>
    <title>動畫收藏清單</title>
    <meta name="description" content="Anime List" />
</svelte:head>

<div class="container">
    {#if user}
        <div class="user">
            <img
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                alt="User Avatar"
            />
            <p>{user.username}</p>
        </div>
    {/if}
    <form
        class="search-container"
        onsubmit={async (e) => {
            e.preventDefault();
            await gotoId();
        }}
    >
        <input bind:value={id} placeholder="Enter id" />
        <div class="buttons">
            <button class="search" type="submit">Search</button>
            <a class="login" type="button" href={url}> Update</a>
        </div>
    </form>
    {#if message}
        <dev class="message">
            <p>{message}</p>
        </dev>
    {/if}
</div>

<style>
    .container {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: auto 0;
        gap: 1rem;
    }

    .search-container {
        width: 60%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .search-container > input,
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

    .search-container > input {
        width: 100%;
        height: 2rem;
        cursor: unset;
    }

    .buttons {
        display: flex;
        width: 100%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        word-break: break-all;
        gap: 1rem;
    }

    .search {
        justify-content: center;
        padding: 0.8rem 3rem;
        width: 100%;
        height: auto;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: #c0c0c0;
        }
    }

    .login {
        position: relative;
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: center;
        padding: 0.8rem 3rem;
        width: 100%;
        height: auto;
        background-color: #7289da;
        color: #ffffff;

        transition: background-color 0.3s ease;
        cursor: pointer;
    }

    .login:hover {
        background-color: #5865f2;
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
            line-height: 3;
        }
    }

    .user {
        position: absolute;
        bottom: 120%;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        word-break: break-all;
        gap: 0.5rem;

        img {
            width: 5rem;
            height: 5rem;
            border-radius: 50%;
        }

        p {
            font-size: 1.2rem;
            font-weight: bold;
        }
    }
</style>
