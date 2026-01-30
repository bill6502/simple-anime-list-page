<script lang="ts">
    import { flip } from 'svelte/animate';
    import { fade } from 'svelte/transition';

    let { animes } = $props();
</script>

<table>
    <tbody>
        {#each animes as anime (anime.name)}
            <tr animate:flip={{ duration: 500 }} in:fade={{ duration: 500 }}>
                <td class="tdName testLeftSide">{anime.name}</td>
                <td class={`tdURL ${anime.from}_right_side`}
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
        transition: box-shadow 1s cubic-bezier(0.47, 0.38, 0, 0.99);
        a {
            background-color: transparent !important;
        }
        &:hover a {
            color: aliceblue !important;
        }
    }

    .thtitle * {
        padding: 1.5rem;
    }

    .anigamer_right_side {
        box-shadow: inset -0.3rem 0 0 0 #009bad;
        &:hover {
            box-shadow: inset -100rem 0 0 0 #009bad;
        }
    }

    .anime1me_right_side {
        box-shadow: inset -0.3rem 0 0 0 #b92d72;
        &:hover {
            box-shadow: inset -100rem 0 0 0 #b92d72;
        }
    }

    .anime1one_right_side {
        box-shadow: inset -0.3rem 0 0 0 aliceblue;
        &:hover {
            box-shadow: inset -100rem 0 0 0 aliceblue;
            a {
                color: #505050 !important;
            }
        }
    }

    .hanime1me_right_side {
        box-shadow: inset -0.3rem 0 0 0 #b20710;
        &:hover {
            box-shadow: inset -100rem 0 0 0 #b20710;
        }
    }
</style>
