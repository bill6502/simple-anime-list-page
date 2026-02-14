<script lang="ts">
    import { store } from '$lib/store.svelte';
    import { fly } from 'svelte/transition';

    let timeOut = 0;

    let message = $derived.by(() => {
        if (store.message != '') {
            clearTimeout(timeOut);
            timeOut = setTimeout(() => {
                store.message = '';
            }, 3000);
        }
        return store.message;
    });
</script>

{#if message != ''}
    <div
        transition:fly={{ y: 50, duration: 500 }}
        class="message"
        data-message="success"
    >
        <p>{message}</p>
    </div>
{/if}

<style>
    .message {
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%) translateY(-2rem);
        background-color: #d9d4cf;
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
        border-radius: 1rem;
        padding: 0 1rem;
        min-width: 20rem;
        z-index: 999;

        p {
            line-height: 3rem;
            font-size: 1rem;
            text-align: center;
            color: #7c7877;
        }
    }
</style>
