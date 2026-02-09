<script lang="ts">
    import { store } from '$lib/store.svelte';
    import { fly } from 'svelte/transition';

    let successMessage = $derived.by(() => {
        if (store.successMessage != '') {
            setTimeout(() => {
                store.successMessage = '';
            }, 3000);
        }
        return store.successMessage;
    });
    let errorMessage = $derived.by(() => {
        if (store.errorMessage != '') {
            setTimeout(() => {
                store.errorMessage = '';
            }, 3000);
        }
        return store.errorMessage;
    });
</script>

{#if successMessage != ''}
    <div
        transition:fly={{ y: 50, duration: 500 }}
        class="message"
        data-message="success"
    >
        <p>{successMessage}</p>
    </div>
{/if}
{#if errorMessage != ''}
    <div
        transition:fly={{ y: 50, duration: 500 }}
        class="message"
        data-message="error"
    >
        <p>{errorMessage}</p>
    </div>
{/if}

<style>
    .message {
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%) translateY(-2rem);
        background-color: #fff5f5;
        border: 1px solid #00ee00;
        color: #000000;
        border-radius: 0.2rem;
        padding: 0 1rem;
        min-width: 20rem;
        font-size: 1rem;
        text-align: center;
        z-index: 999;

        p {
            line-height: 3rem;
        }

        &[data-message='success'] {
            background-color: #f5fff5;
            border-color: #00ee00;
        }

        &[data-message='error'] {
            background-color: #fff5f5;
            border-color: #ee0000;
        }
    }
</style>
