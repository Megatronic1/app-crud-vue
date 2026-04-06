<script setup>
import { RouterLink as Link } from 'vue-router'; // Renombramos para evitar conflicto

defineProps({
    to: {
        type: [String, Object], // Debe aceptar objetos para {name: 'inicio'}
        required: true
    }
});
</script>

<template>
  <Link 
    :to="to" 
    class="block md:inline-block rounded bg-blue-600 py-2 px-3 
    text-white uppercase text-sm font-bold shadow hover:bg-blue-500" 
    >
    <slot></slot>
  </Link>
</template>