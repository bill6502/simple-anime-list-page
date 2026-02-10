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
    let notificationMessage = $derived.by(() => {
        if (store.notificationMessage != '') {
            setTimeout(() => {
                store.notificationMessage = '';
            }, 3000);
        }
        return store.notificationMessage;
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
{#if notificationMessage != ''}
    <div
        transition:fly={{ y: 50, duration: 500 }}
        class="message"
        data-message="notification"
    >
        <p>{notificationMessage}</p>
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
        border: 0.1rem solid #00ee00;
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
            border-color: #00ee00;
        }

        &[data-message='notification'] {
            border-color: #eeee00;
        }

        &[data-message='error'] {
            border-color: #ee0000;
        }
    }
</style>
