<template>
    <div class="flex justify-between bg-gray-100 border border-gray-50 rounded-lg p-4 my-4 dark:bg-gray-800 dark:border-gray-700 ">
        
        <div class="flex w-full items-center">
            <div class="flex items-center h-5" :class="{ 'opacity-75': task.completed }">
                <input id="helper-checkbox" aria-describedby="helper-checkbox-text" type="checkbox" value="" 
                :checked="task.completed"
                @change="$emit('toggle-complete',{id:id})"
                class="input-checkBox">
            </div>
            <div class="ms-2 text-sm">
                <p  for="helper-checkbox" class="w-full font-medium italic text-gray-800 dark:text-gray-200"

                    v-if="!isEditing" @dblclick="$emit('edit' , {index})"
                    :class="{ 'line-through': task.completed }">

                {{ task.name }} 
                </p>
                <input v-else type="text" class="input" 
                    v-model="editedName"
                    @blur="saveChanges"
                    @keyup.enter="saveChanges"
                    @keyup.esc="cancelEdit"
                    ref="editInput">
            </div>
        </div>
        <div>
            <button 
                @click="$emit('delete', {id})"
                class="opacity-1 group-hover:opacity-100 p-2 text-gray-400 
                        hover:text-red-500 transition-opacity"
                >
                <span class="sr-only">Delete task</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                </button>
        </div>


    </div>
</template>
<script>
import { nextTick, ref, watch } from 'vue';
// import {defineEmits} from 'vue'
export default {
    emits : ['toggle-complete', 'delete' , 'edit' , 'save'] ,
    props: {
        id : {
            type: String,
            required: true
        },
        task: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            required: true
        },
        isEditing: {
            type: Boolean,
            default: false
        }
},
    setup(prop , {emit}) {

        let editedName = ref(prop.task.name); // hamani 
        const editInput = ref(null)
        

        //this watch for focuse on input that appear when isEditing is true
        watch( 
            // First argument: What we're watching
            () => prop.isEditing, // her is editing true or false
            async (newValue)=>{
            if(newValue){
                editedName.value = prop.task.name
            }
            await nextTick()
        
            // 3. Focus the input - this works because input exists now
            editInput.value?.focus()
        }
            
        );
        
        const saveChanges = () => {
            if (editedName.value.trim()) {
                emit('save', {
                id:prop.task.id ,
                index: prop.index,
                name: editedName.value.trim()
                })
            }
        }


        return {
            editInput , editedName , saveChanges
        }
    },
}
</script>


<style scoped>
.input-checkBox{
    @apply w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600
}
.input {
    @apply bg-gray-50 border outline-none italic border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-[80%] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
}
</style>