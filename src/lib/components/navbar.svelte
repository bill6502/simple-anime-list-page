<script lang="ts">
    import { store } from '$lib/store.svelte';
    import { slide, scale } from 'svelte/transition';
    import { page } from '$app/state';
    import { innerWidth } from 'svelte/reactivity/window';
    import { goto } from '$app/navigation';

    let pictureUrl = $derived.by<string>(() =>
        store.user
            ? `https://cdn.discordapp.com/avatars/${store.user.id}/${store.user.avatar}.png`
            : 'https://cdn-icons-png.flaticon.com/512/17561/17561717.png ',
    );

    let animeListId = $state<string>('');
    let showAuth = $state<boolean>(false);
    let expanding = $state<boolean>(false);

    let collectNav = $state<HTMLElement | undefined>(undefined);

    $effect(() => {
        if (innerWidth.current! > 720) {
            expanding = false;
        }
    });

    function setLastPath() {
        if (store.user) {
            store.message = '已取得授權';
            return;
        }

        localStorage.setItem('lastPath', page.url.pathname);

        window.location.href = store.authUrl;
    }

    function clear() {
        localStorage.removeItem('user');
        localStorage.removeItem('userAnimeListId');

        store.user = null;
        store.userAnimeListId = '';
    }

    async function gotoId(e: Event) {
        e.preventDefault();
        const url_id = `${store.baseUrl}/${animeListId}?from=${page.url.pathname}`;
        await goto(url_id, { invalidateAll: true });
    }
</script>

{#snippet nav(title: string, path: string, href: string, enabled: boolean)}
    <a
        in:slide={{ duration: 300 }}
        out:slide={{ duration: 100 }}
        class:button={innerWidth.current! <= 720}
        class:current={store.currentPath === path}
        class:disabled={!enabled}
        href={enabled ? href : undefined}>{title}</a
    >
{/snippet}
{#snippet userButton(title: string, onclick: () => void, delayTimes: number)}
    {@const duration = 200}
    {@const delay = Math.floor(duration / 5)}
    <div class="user-button">
        <button
            in:scale={{
                duration: duration,
                delay: delay * delayTimes,
            }}
            out:scale={{ duration: 0 }}
            class="button"
            {onclick}>{title}</button
        >
    </div>
{/snippet}
<div class="container">
    <div class="main">
        <div class="title">
            <img src={`${store.baseUrl}/video.svg`} alt="Video Icon" />
            <p>動畫清單</p>
        </div>
        <div class="nav">
            <div class="nav-item">
                {#if innerWidth.current! <= 720}
                    <button
                        class="button"
                        onclick={() => (expanding = !expanding)}>導覽</button
                    >
                {/if}
                {#if innerWidth.current! > 720 || expanding}
                    {@render nav('首頁', 'home', `${store.baseUrl}/`, true)}
                    {@render nav(
                        '收藏',
                        'mylist',
                        `${store.baseUrl}/${store.userAnimeListId}`,
                        // @ts-ignore
                        store.user && store.userAnimeListId,
                    )}
                {/if}
            </div>
            <form onsubmit={gotoId}>
                <input bind:value={animeListId} placeholder="搜尋動畫清單" />
                <img src={`${store.baseUrl}/search.svg`} alt="Search Icon" />
            </form>
            {#if innerWidth.current! > 720 || expanding}
                <div class="user-info">
                    <div
                        class="user-avatar"
                        onclick={() => (showAuth = !showAuth)}
                        title="點擊以顯示/隱藏"
                    >
                        <img src={pictureUrl} />
                    </div>
                    {#if showAuth}
                        <div class="drop-down-list">
                            {#if store.user}
                                <p>{store.user.username}</p>
                            {:else}
                                <p>未取得授權</p>
                            {/if}
                            {@render userButton('取得授權', setLastPath, 1)}
                            {@render userButton('清除授權', clear, 2)}
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
    <hr />
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 83rem;
        align-items: center;
        justify-content: center;
        text-align: center;
        margin: 0 auto;
        margin-top: 1rem;
        padding: 0 1rem;
        gap: 1rem;

        hr {
            width: 100%;
            border: none;
            margin: 0;
            border-top: 0.1rem solid #ccc;
        }
    }

    .main {
        display: flex;
        width: 100%;
        min-height: 4rem;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 3rem;
        padding: 0 1rem;
    }

    .nav {
        width: 100%;
        flex: 1;
        text-align: left;
        align-items: center;
        display: flex;
        text-align: center;
        gap: 1rem;

        form {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: row;
            flex: 1;
            border: none;
            outline: none;
            margin: 0 5rem;
            height: 2.5rem;
            border-radius: 0.5rem;
            overflow: hidden;

            & > img {
                object-fit: contain;
                height: 2.5rem;
                width: min-content;
                padding: 0.2em;
                background-color: #d9d4cf;
                fill: #d9d4cf;
                transition: fill 0.3s ease;
                border-left: 0.02rem solid aliceblue;
            }

            & > input {
                width: 100%;
                height: 100%;
                border: none;
                outline: none;
                min-height: 2.5rem;
                background-color: #d9d4cf;
                color: #7c7877;
                font-size: 1rem;
                text-align: center;

                transition: background-color 0.3s ease;
                &:focus {
                    background-color: #e5e5e5;
                }
            }
        }
    }

    .nav-item {
        box-sizing: border-box;
        border-radius: 0.5rem;
        border: none;
        outline: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.7rem;
        gap: 2rem;

        & > a {
            text-decoration: none;
            transition:
                background-color 0.3s ease-in-out,
                color 0.3s ease-in-out;
        }
    }

    .user-info {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }
    .drop-down-list {
        max-width: 30rem;
        display: flex;
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(calc(-50% - 4rem));
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 0.5rem;
        padding: 0.7rem;
        border-radius: 0.3rem;
        gap: 0.5rem;

        background-color: #7c7877;

        z-index: 11;
        .button {
            width: 10rem !important;
            border-radius: 0.3rem !important;
        }

        p {
            color: aliceblue;
            font-size: 1.5rem;
            font-weight: bold;
            text-align: center;
        }
    }

    .user-avatar {
        & img {
            width: 4rem;
            border-radius: 50%;
            cursor: pointer;
        }
    }

    .title {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        img {
            height: 2.5rem;
            object-fit: contain;
        }
        p {
            font-size: 2rem;
            font-weight: bold;
            text-align: center;
            overflow-wrap: break-word;
            word-break: break-all;
            color: aliceblue;
        }
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

        &:active {
            background-color: #d9d4cf;
            color: #7c7877;
        }
    }

    .disabled {
        opacity: 0.5;
        filter: grayscale(1);
        cursor: default;
        display: inline-flex;
    }

    .current {
        color: skyblue;
    }

    @media screen and (width <= 720px) {
        .container {
            margin-bottom: 0;
        }
        .main {
            flex-direction: column;
            padding: 0;
            gap: 1rem;
        }
        .nav {
            flex-direction: column;
            gap: 1rem;

            form {
                width: 100%;
                padding: 0;
            }
        }

        .nav-item {
            flex-direction: column;
            width: 100%;
            gap: 1rem;
            background-color: #7c7877;
        }

        .user-info {
            .drop-down-list {
                transform: translateX(-50%);
                width: 70vw;
                min-width: 300px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-gap: 0.5rem;
                align-items: center;
                justify-content: center;
                button {
                    width: 100% !important;
                    margin: 0 auto;
                }
                p {
                    grid-column: 1 / -1;
                    font-size: 2rem;
                }
            }
        }
    }
</style>
