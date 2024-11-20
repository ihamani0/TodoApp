import { defineStore } from 'pinia'

import { db } from '@/firebase/firebase-config';
import { collection , addDoc , getDocs , deleteDoc , updateDoc, serverTimestamp, orderBy, doc } from 'firebase/firestore';

export const useToDoListStore = defineStore('Tasks' , {
    state : ()=> ({
        Tasks:[] ,
        isLoding:false,
        
    } ), 
    getters : {
        getTotalTasks(){
            return this.Tasks.length
        } , 
        getTotalCompletedTask(){
            return this.Tasks.filter(t => t.completed).length
        } ,
        getListCompletedTask(){
            return this.Tasks.filter(t => t.completed)
        } ,
        getListActiveTask(){
            return this.Tasks.filter(t => !t.completed)
        } ,


    } , 
    actions:{
        //add task 
        async addTask(task){

            //this = state

            //add timestamp so when retrive data he make sort to data  
            let TaskwithTimeStamp= {

                ...task,
                created_at : serverTimestamp(),
            }
            

            try {
                const docRef = await addDoc(collection(db , 'ToDoApp') , TaskwithTimeStamp);
                    this.Tasks.push({
                        id:docRef.id ,
                        ...TaskwithTimeStamp
                    });
            } catch (error) {
                console.log("Error Drom add Task ACtion : " +error)
            }
        }, 

        // Update Task 
        async updateTask(newtask , id){
            try {
                this.Tasks.forEach(task=>{
                    if(task.id === id){
                        task.name = newtask;
                    }
                }); 

                let Taskref = doc(db,'ToDoApp' , id)
                await updateDoc(Taskref , {name:newtask})
            } catch (error) {
                window.alert(error);
            }
            
        }, 


        async deleteTask(id){

            
            try {
                let Taskref = doc(db,'ToDoApp' , id)
                await deleteDoc(Taskref);
                this.Tasks = this.Tasks.filter((t) => t.id !== id)
            } catch (error) {
                window.alert(error);
            }
        },

        //change state of Task
        async toggleCompleted(id){
            
            try {
                // i make this variable to update statu in firestore
                let completed = null;
            this.Tasks.forEach(task => {
                if(task.id === id){
                    task.completed = !task.completed ;
                    completed = task.completed;
                }
            }) ; 
            //update fire store
                let TaskRef = doc(db ,'ToDoApp' , id);
                
                await updateDoc(TaskRef , {completed:completed})
            } catch (error) {
                window.alert(error);
            }

        }, 


        async toggleAllCompltedStor(checked){
            try {
                this.Tasks.forEach(element => {
                    element.completed = checked
                });

                const tasksCollection = collection(db, "ToDoApp");
                const querySnapshot = await getDocs(tasksCollection);

                //console.log(querySnapshot);
                // Step 2: Iterate over each document
                    for (const document of querySnapshot.docs) {

                        const docRef = doc(db, "ToDoApp", document.id);
                        // Step 3: Update the document
                        await updateDoc(docRef, { completed: checked });
                    }
                
            } catch (error) {
                
            }
        } , 

        //fetch From firestore 
        async getAllTaskFromFireStore(){
            this.isLoding=true;
            const querySnapshot = await getDocs(collection(db, "ToDoApp") , orderBy('created_at' , "desc"));
            this.Tasks = querySnapshot.docs.map((doc) => ({
                id: doc.id ,
                ...doc.data() ,
            }));
            this.isLoding=false;
        }


    }
});


