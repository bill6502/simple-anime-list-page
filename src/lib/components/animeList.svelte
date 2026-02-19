<script lang="ts">
    import { page } from '$app/stores';
    import { type Anime } from '$lib/type';
    import { flip } from 'svelte/animate';
    import { fly } from 'svelte/transition';
    import { store } from '$lib/store.svelte';
    import { innerWidth } from 'svelte/reactivity/window';
    import { updateMyAnimeList } from '$lib/utility';
    import db from '$lib/db';

    type props = {
        animes: Anime[];
    };

    let { animes }: props = $props();

    async function addAnime(name: string, url: string) {
        const response = await db.addAnimeCollection(name, url, store.user!.id);

        if (!response.ok) {
            store.message = '加入收藏失敗';
            return;
        }
        store.message = '已加入收藏';

        await updateMyAnimeList();
    }

    async function deleteAnime(name: string, url: string) {
        const deleteAnimeCollection = await db.deleteAnimeCollection(
            name,
            url,
            store.user!.id,
        );

        if (!deleteAnimeCollection.ok) {
            store.message = '取消收藏失敗';
            return;
        }
        store.message = '已取消收藏';

        await updateMyAnimeList();
    }
</script>

<table>
    <thead>
        <tr class="title">
            <th class="name">名稱</th>
            <th class="url">連結</th>
        </tr>
    </thead>
    <tbody>
        {#each animes as anime (anime.name)}
            <tr
                class="row"
                animate:flip={{ duration: 500 }}
                in:fly={{ duration: 500 }}
            >
                <td class="tdName">{anime.name}</td>
                <td class="tdURL" data-from={anime.from}
                    ><a href={anime.url} target="_blank"
                        >{innerWidth.current! <= 820 ? '[連結]' : anime.url}</a
                    >
                    {#if store.user}
                        {#if store.userAnimeListId != $page.params.id}
                            {#if store.userAnimeList.some((a) => a.name == anime.name)}
                                <button
                                    onclick={async () => {
                                        await deleteAnime(
                                            anime.name,
                                            anime.url,
                                        );
                                    }}>取消</button
                                >
                            {:else}
                                <button
                                    onclick={async () => {
                                        await addAnime(anime.name, anime.url);
                                    }}>收藏</button
                                >
                            {/if}
                        {:else}
                            <button
                                onclick={async () => {
                                    await deleteAnime(anime.name, anime.url);
                                }}>取消</button
                            >
                        {/if}
                    {/if}
                </td>
            </tr>
        {/each}
    </tbody>
</table>

<style>
    table {
        border-collapse: collapse;
        width: 100%;
        table-layout: fixed;
    }

    td {
        padding: 1rem;
        text-align: left;
        word-break: break-all;
    }

    .title {
        display: flex;
        padding: 1.5rem 0;
        background-color: #7c7877;

        .name,
        .url {
            width: 100%;
            justify-content: center;
            align-items: center;
            text-align: center;
            background-color: #7c7877;
            color: #d9d4cf;
            text-align: center;
        }

        .name {
            width: 40%;
        }
        .url {
            width: 60%;
        }
    }

    .row {
        display: flex;

        & * {
            text-align: center;
            align-content: center;
        }
        &:nth-child(2n + 1) * {
            background-color: #d9d4cf;
            color: #7c7877;
        }
        &:nth-child(2n + 2) * {
            background-color: #7c7877;
            color: #d9d4cf;
        }
    }

    .row:has(*:hover) {
        .tdURL {
            transition: box-shadow 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.4s !important;
            a {
                color: #f5fffa !important;
            }
        }
        .tdURL[data-from='anigamer'] {
            box-shadow: inset -100rem 0 0 0 #009bad;
        }

        .tdURL[data-from='anime1me'] {
            box-shadow: inset -100rem 0 0 0 #b92d72;
        }

        .tdURL[data-from='hanime1me'] {
            box-shadow: inset -100rem 0 0 0 #b20710;
        }
    }

    .tdName {
        width: 40%;
    }

    .tdURL {
        display: flex;
        align-items: center;
        width: 60%;
        transition: box-shadow 0.1s cubic-bezier(0.4, 0, 0.2, 1);

        a {
            flex: 1;
            text-align: left;
            background-color: transparent !important;
        }

        button {
            background-color: transparent !important;
            border: none;
            color: #d9d4cf;
            cursor: pointer;
            font-size: 1rem;
            padding: 0.5rem 1rem;
            transition: background-color 0.3s ease-in-out;

            &:hover {
                background-color: #7c7877;
                color: #f5fffa;
            }
        }

        &:hover {
            transition: box-shadow 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.4s !important;
            a {
                color: aliceblue !important;
            }
        }

        &[data-from='anigamer'] {
            box-shadow: inset -0.3rem 0 0 0 #009bad;
            &:hover {
                box-shadow: inset -100rem 0 0 0 #009bad;
            }
        }

        &[data-from='anime1me'] {
            box-shadow: inset -0.3rem 0 0 0 #b92d72;
            &:hover {
                box-shadow: inset -100rem 0 0 0 #b92d72;
            }
        }

        &[data-from='hanime1me'] {
            box-shadow: inset -0.3rem 0 0 0 #b20710;
            &:hover {
                box-shadow: inset -100rem 0 0 0 #b20710;
            }
        }
    }

    @media screen and (width <= 820px) {
        .tdURL {
            a {
                text-align: center;
            }
        }
    }
</style>
