<script lang="ts">
    import { slide, fly } from 'svelte/transition';
    import { scrollY } from 'svelte/reactivity/window';
</script>

{#if scrollY.current! > 500}
    <div transition:fly={{ y: 50, duration: 300 }}>
        <button
            class="totop"
            on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-arrow-up-circle"
            >
                <polyline points="18 13 12 7 6 13"></polyline>
                <line x1="12" y1="17" x2="12" y2="7"></line>
            </svg>
        </button>
    </div>
{/if}

<style>
    div {
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: 2rem;
        right: 2rem;
        z-index: 1000;
        padding: 0;
    }
    .totop {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #7c7877;
        color: #d9d4cf;
        border: none;
        border-radius: 50%;
        padding: 0.8rem;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .totop svg {
        width: 2rem;
        height: 2rem;
        display: block;
    }

    @media (hover: hover) and (pointer: fine) {
        .totop:hover {
            background-color: #d9d4cf;
            color: #7c7877;
        }
    }
</style>
