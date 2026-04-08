<script setup>
import { onMounted, ref, computed } from 'vue';
import ClienteService from '../services/ClienteService';
import RouterLink from '../components/UI/RouterLink.vue';
import Heading from '@/components/UI/Heading.vue';
import Cliente from '@/components/UI/Cliente.vue'; // Solo dejamos uno

const clientes = ref([]); 

/*onMounted(() => {
  ClienteService.obtenerClientes()
    .then(({data}) => clientes.value = data.clientes)
    .catch(() => console.log('Hubo un error al conectar con la API'))
});*/

onMounted(async () => {
  try {
    const response = await ClienteService.obtenerClientes();
    // Forzamos que siempre sea un array para que el v-for no explote
    clientes.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error al conectar con la API:', error);
    clientes.value = [];
  }
});

defineProps({
  titulo: {
    type: String 
  }
});

/*const existenClientes = computed(() => {
  return clientes.value.length > 0
});*/

const existenClientes = computed(() => {
  return Array.isArray(clientes.value) && clientes.value.length > 0;
});

const actualizarEstado=({id, estado})=>{
  ClienteService.cambiarEstado(id,{estado:!estado})
  .then(()=>{
    const i=clientes.value.findIndex(cliente=>cliente.id===id)
    clientes.value[i].estado=!clientes.value[i].estado
  })
  .catch(error=>console.log(error))
}

const eliminarCliente=id=>{
  ClienteService.eliminarCliente(id)
  .then(()=>{
    clientes.value=clientes.value.filter(cliente=>cliente.id!==id)
  })
  .catch(error=>console.log(error))
}

</script>

<template>
  <div>
    <div class="flex justify-end">
      <RouterLink :to="{name:'agregar-cliente'}">
        Agregar Cliente
      </RouterLink>
    </div>
    
    <Heading>{{ titulo }}</Heading>

    <div v-if="existenClientes" class="flow-root mx-auto mt-10 p-5 bg-white shadow">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" class="p-2 text-left text-sm font-extrabold text-gray-600">Nombre</th>
                <th scope="col" class="p-2 text-left text-sm font-extrabold text-gray-600">Empresa</th>
                <th scope="col" class="p-2 text-left text-sm font-extrabold text-gray-600">Estado</th>
                <th scope="col" class="p-2 text-left text-sm font-extrabold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <Cliente 
                v-for="cliente in clientes" 
                :key="cliente.id"
                :cliente="cliente"
                @actualizar-estado="actualizarEstado"
                @eliminar-cliente="eliminarCliente"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else class="text-center mt-10 text-gray-500">
      No existen clientes
    </div>
  </div>
</template>