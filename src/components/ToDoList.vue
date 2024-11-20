<template>
    <div class="max-w-2xl mx-auto">

        <!-- Header -->
        <div class="p-4 relative">
            <h1 class="text-3xl m-4 p-4 font-bold text-center italic rotate-3 ">
                ToDo list</h1>

            <div class="absolute left-[50rem] top-[3rem] cursor-pointer" @click="ToggleThem()">
                <MoonIcon v-if="isDarkThem" class="h-5" />
                <SunIcon v-else class="h-6" />
            </div>
        </div>
        <!-- Body -->
        <!-- Loding spinner -->

        <div v-if="TasksStore.isLoding">
            <loding-spinner></loding-spinner>
        </div>
        <div  v-else
        class="flex flex-col gap-10 ">

            <!-- Content -->
            <!-- input -->
            <div class="flex justify-between">
                <input type="text" class="input" placeholder="What are you thinking now" v-model.trim="newTask"
                    @keypress.enter="addTask" />

                <button class="btn-add" @click="addTask">Add</button>
            </div>

            <div>
                <button class="btn-menu" :class="{active:TabStatus==='all'}" @click="changeTAb('all')">All</button>
                <button class="btn-menu" :class="{active:TabStatus==='done'}"  @click="changeTAb('done')">Complted</button>
                <button class="btn-menu" :class="{active:TabStatus==='still'}" @click="changeTAb('still')">Activ</button>
            </div>

            <div class="flex justify-between font-sans italic">
                <div class="flex justify-between items-center">
                    <input type="checkBox" class="input-checkBox" 
                    @change="toggleCompletedAllTask">
                    <label class="mx-2  ">Check All</label>
                </div>
                <div class="text-sm">
                    Totol : {{ TasksStore.getTotalTasks }} | Done : {{ TasksStore.getTotalCompletedTask }}
                </div>
            </div>

            <!-- To do All Task List -->
            <div class="my-4" >
                <TransitionGroup name="list" tag="div" class="flex flex-col gap-4">
                    <!-- Task -->
                    <TheTask v-for="(task, index) in filterdTabs" 
                    :key="task.id" 
                    :id="task.id" 
                    :task="task"
                    :index="index" 
                    :is-editing="isEditing[index]" 
                    @toggle-complete="toggleTaskComplete"
                    @edit="startEditing" 
                    @save="saveTask" 
                    @delete="deleteTask" />
                    <!-- End Task -->
                </TransitionGroup>
            </div>




        </div>
        <!-- Task Statistics -->
    </div>
</template>

<script>
import SunIcon from './ui/SunIcon.vue';
import MoonIcon from './ui/MoonIcon.vue';
import TheTask from './ui/TheTask.vue';

import { computed, onBeforeMount, onMounted, ref } from 'vue';
import { useToDoListStore } from '@/stores/ToDoListStore';
import LodingSpinner from './ui/LodingSpinner.vue';
export default {
    components: {
        SunIcon, MoonIcon, LodingSpinner, TheTask
    },
    setup() {

        const isDarkThem = ref(false);

        const TasksStore = useToDoListStore();

        let TabStatus=ref('all');

        let newTask = ref('');

        const isEditing = ref(TasksStore.Tasks.map(() => false));

        //computed
        const filterdTabs = computed(()=>{
            switch(TabStatus.value){
                case 'done' : 
                    return TasksStore.getListCompletedTask;
                    break;
                case 'still' : 
                    return TasksStore.getListActiveTask;
                    break;
                default:
                    return TasksStore.Tasks;        
            }
        });

        //Methods

        const changeTAb=(tab)=>{
            TabStatus.value = tab;
        }

        const addTask = () => {
            if (!newTask.value) return

            let newT =
            {
                name: newTask.value,
                completed: false
            };

            TasksStore.addTask(newT);
            newTask.value = '';
        }


        const toggleTaskComplete = (payload) => {

            TasksStore.toggleCompleted(payload.id)
        }


        const startEditing = (payload) => {
            isEditing.value[payload.index] = true;
        }


        const saveTask = (payload) => {

            TasksStore.updateTask(payload.name, payload.id)

            isEditing.value[payload.index] = false;
        }

        const deleteTask = (payload) => {

            TasksStore.deleteTask(payload.id)

        }


        const toggleCompletedAllTask = (event)=>{

            TasksStore.toggleAllCompltedStor(event.target.checked)

        } 

        //toggle dark mode and light mode
        const ToggleThem = () => {
            isDarkThem.value = !isDarkThem.value;
            localStorage.setItem('darkMode', isDarkThem.value);
            document.documentElement.classList.toggle('dark', isDarkThem.value);
        }

        onMounted(() => {
            //wheene the component mounted he check in local storag if ther dara mode to true 
            //if true he maek the root html class=true 
            isDarkThem.value = localStorage.getItem('darkMode') === 'true';
            if (isDarkThem.value) { document.documentElement.classList.add('dark'); }
        });
        onBeforeMount(()=>{
            TasksStore.getAllTaskFromFireStore();
        })

        return {
            isDarkThem, ToggleThem, TasksStore, startEditing, isEditing, saveTask, newTask, addTask,
            deleteTask, toggleTaskComplete , changeTAb , filterdTabs , TabStatus , toggleCompletedAllTask
        }
    }
}
</script>

<style scoped>
.btn-menu{
    @apply mx-1 border dark:border-slate-700 text-gray-800 dark:text-gray-50 px-3 py-2.5 rounded-lg italic
                    hover:bg-gray-300 dark:hover:bg-slate-700 transition duration-100 ease-in
}
.active{
    @apply bg-slate-700 text-gray-50 border border-gray-50 dark:bg-gray-50 dark:text-slate-700 
            hover:bg-slate-600  dark:hover:bg-gray-100
}

.btn-add {
    @apply text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-300 dark:border-gray-600 italic
}

.input {
    @apply bg-gray-50 border outline-none italic border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-[80%] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
}
.input-checkBox{
    @apply w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600
}


.list-enter-active,
.list-leave-active {
    transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}
</style>