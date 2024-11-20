import ToDoList from '@/components/ToDoList.vue'
import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path:'/',
      name:'TodoList',
      component : ToDoList
    },
  ],
})

export default router
