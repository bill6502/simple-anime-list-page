<script lang="ts">
    import { page } from '$app/stores';
    import { type Anime } from '$lib/types';
    import { flip } from 'svelte/animate';
    import { fade } from 'svelte/transition';
    import { PUBLIC_DB } from '$env/static/public';

    type props = {
        animes: Anime[];
        user: any;
        showMessage: (message: string) => void;
        showErrorMessage: (message: string) => void;
    };

    let { animes, user, showMessage, showErrorMessage }: props = $props();

    let userAnimeListId = $state<string | null>(
        localStorage.getItem('userAnimeListId')
            ? JSON.parse(localStorage.getItem('userAnimeListId')!).value
            : null,
    );

    async function addAnime(name: string, url: string) {
        const response = await fetch(`${PUBLIC_DB}/addAnimeCollection`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                args: { name, url, userId: user.id },
            }),
        });

        if (!response.ok) {
            showErrorMessage('加入收藏失敗');
            return;
        }
        showMessage('成功加入收藏');
    }
</script>

<table>
    <tbody>
        {#each animes as anime (anime.name)}
            <tr
                class="row"
                animate:flip={{ duration: 500 }}
                in:fade={{ duration: 500 }}
            >
                <td class="tdName testLeftSide">{anime.name}</td>
                <td class="tdURL" data-from={anime.from}
                    ><a href={anime.url} target="_blank">{anime.url}</a>
                    {#if user && userAnimeListId != $page.params.id}
                        {@const name = anime.name}
                        {@const url = anime.url}
                        <button
                            onclick={async () => {
                                await addAnime(name, url);
                            }}>收藏</button
                        >
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

    .row {
        &:nth-child(2n + 1) * {
            background-color: #d9d4cf;
            color: #7c7877;
        }

        &:nth-child(2n + 2) * {
            background-color: #7c7877;
            color: #d9d4cf;
        }
    }

    .tdName {
        width: 40%;
    }

    .tdURL {
        position: relative;
        width: 60%;
        transition: box-shadow 0.1s cubic-bezier(0.4, 0, 0.2, 1);

        a {
            background-color: transparent !important;
        }

        & > button {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            background-color: transparent !important;
            border: none;
            color: #d9d4cf;
            cursor: pointer;
            font-size: 1rem;
            padding: 0.5rem 1rem;
            transition: background-color 0.3s ease-in-out;

            &:hover {
                background-color: #7c7877;
                color: #d9d4cf;
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
</style>
