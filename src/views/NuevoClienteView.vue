<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import ClienteService from '../services/ClienteService';
import  RouterLink  from '../components/UI/RouterLink.vue';
import Heading from '@/components/UI/Heading.vue';
import { FormKit } from '@formkit/vue';


const router=useRouter()


defineProps({
  titulo: {
    type: String
  }
})


const formData={     
nombre: '',
apellido: '',
email: '',
telefono: '',
empresa: '',
puesto: ''
}

const handleSubmit=((data)=>{
  data.estado=1
  ClienteService.agregarCliente(data)  
  .then(respuesta=>router.push({name:'listado-clientes'}))
  .catch(error=>console.log(error))
})

</script>

<template>
  <div>
    <div class="flex justify-end">
      <RouterLink :to="{name:'listado-clientes'}">
        Volver
      </RouterLink>
    </div>
    <Heading>{{ titulo }}</Heading>
    <div class="mx-auto mt-10 bg-white shadow">
      <div class="mx-auto md:w-2/3 py-20 px-6">
      
      <FormKit type="form" submit-label="Agregar Cliente"
      incomplete-message="No se pudo enviar,revisa los mensajes"
      @submit="handleSubmit" :value="formData"
      >

        <FormKit name="nombre" type="text" label="Nombre" placeholder="Nombre Cliente" 
        help="Es el nombre del cliente que deseas registrar"
        validation="required"
        :validation-messages="{required:'El nombre del cliente es requerido'}"
        
        />
        
        <FormKit name="apellido" type="text" label="Apellido" placeholder="Apellido Cliente" 
        help="Es el apellido del cliente que deseas registrar"
        validation="required"
        :validation-messages="{required:'El apellido del cliente es requerido'}"
        
        />

        <FormKit name="email" type="email" label="Email" placeholder="Email Cliente" 
        help="Es el Email del cliente que deseas registrar"
        validation="required|email"
        :validation-messages="{required:'El email del cliente es requerido', email:'Introduce un email valido'}"
        />
        
        <FormKit name="telefono" type="text" label="Télefono" placeholder="Télefono:###-###-####" 
        help="Es el Email del cliente que deseas registrar"
        validation="?matches:/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/"
        :validation-messages="{required:'El télefono del cliente es requerido', email:'Introduce un email valido', matches:'El formato no es valido'}"
        />

        <FormKit name="empresa" type="text" label="Empresa" placeholder="Empresa del cliente"/>
        <FormKit name="puesto" type="text" label="Puesto" placeholder="Puesto del cliente"/>

        
      </FormKit>
    </div>
    </div>
  </div>
</template>

<style>
.formkit-wrapper{
  max-width: 100%;
}
</style>