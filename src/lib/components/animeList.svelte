<script lang="ts">
    import { type Anime } from '$lib/types';
    import { flip } from 'svelte/animate';
    import { fade } from 'svelte/transition';

    type props = { animes: Anime[] };

    let { animes }: props = $props();
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
                <td class={`tdURL`} data-from={anime.from}
                    ><a href={anime.url} target="_blank">{anime.url}</a></td
                >
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

    .row:nth-child(2n + 1) * {
        background-color: #d9d4cf;
        color: #7c7877;
    }

    .row:nth-child(2n + 2) * {
        background-color: #7c7877;
        color: #d9d4cf;
    }

    .tdName {
        width: 40%;
    }

    .tdURL {
        width: 60%;
        transition: box-shadow 0.1s cubic-bezier(0.4, 0, 0.2, 1);

        a {
            background-color: transparent !important;
        }

        &:hover {
            transition: box-shadow 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.4s !important;
            a {
                color: aliceblue !important;
            }
        }
    }

    .tdURL[data-from='anigamer'] {
        box-shadow: inset -0.3rem 0 0 0 #009bad;
        &:hover {
            box-shadow: inset -100rem 0 0 0 #009bad;
        }
    }

    .tdURL[data-from='anime1me'] {
        box-shadow: inset -0.3rem 0 0 0 #b92d72;
        &:hover {
            box-shadow: inset -100rem 0 0 0 #b92d72;
        }
    }

    .tdURL[data-from='hanime1me'] {
        box-shadow: inset -0.3rem 0 0 0 #b20710;
        &:hover {
            box-shadow: inset -100rem 0 0 0 #b20710;
        }
    }
</style>
