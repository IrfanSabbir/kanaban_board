import { useEffect, useState } from 'react'
import '../App.css'
import axios from 'axios'
const KarabanBoard = () => {
    const [taskeList, setTaskList] = useState([])
    const [tasks , setTasks] = useState({todo: [],progress: [], done:[]}) 
    const [taskInput, setTaskInput] = useState('')
    useEffect( async() =>{
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}task/kanban`)
             setTaskList(result.data.taskList)
        } catch (error) {
            setTaskList([])
        }
    },[])

    useEffect(() =>{
        let tasksData = {
            todo: [],
            progress: [],
            done: []
        }
        taskeList.map ((task) => {
            if(!task || !task.name || !task.category)  return
           return( tasksData[task.category].push(
                <div key={task.name} 
                    onDragStart = {(e) => onDragStart(e, task.name)}
                    draggable
                    className="TaskBody"
                >
                    {task.name}
                </div>
            ))
        });
        setTasks(tasksData)
    },[taskeList])

    const createTask = async() => {
        try {
            const input  = {name: taskInput , category: "todo"}
            const result = await axios.post(`${process.env.REACT_APP_BASE_URL}task/kanban`, input)
            const taskData =[...taskeList] 
            taskData.push(input)
            setTaskList(taskData)
            setTaskInput('')
        } catch (error) {
            alert("try again")
        }
    }

    const onDragStart = (ev, id) => {
        ev.dataTransfer.setData("id", id);
    }

    const onDragOver = (ev) => {
        ev.preventDefault();
    }

    const onDrop = async(ev, cat) => {
       let id = ev.dataTransfer.getData("id")
       let index = -1;
       let deleteIndex = -1;
       let taskCurrent ={}
       let tasks = taskeList.map((task, i) => {
           if(!task) return 
           else{
               if (task.name === id) {
                   task.category = cat;
                   taskCurrent = {...task , category: cat}
                   deleteIndex =i;
               }
               if (task.name === ev.target.innerHTML) {
                task.category = cat;
                index = i ;
                }
               return task;
           }
       })
       if(index >= 0 && taskCurrent !== {}){
            delete tasks[deleteIndex]
            tasks.splice(index, 0, taskCurrent)
       }
       else{
        delete tasks[deleteIndex]
        tasks.push(taskCurrent)

       }
       try {
            const result = await axios.put(`${process.env.REACT_APP_BASE_URL}task/kanban`, tasks)
            if(result.data && result.data.tasks){
                setTaskList(result.data.tasks)
            }
        } catch (error) {
            alert("try again")
        }
    }
    return(
        <div>
            <div className="Container">
            <h2 className="Header">kanban Board</h2>
                <br />
                <div className="FormBody">
                    <input 
                        onChange={(e) => setTaskInput(e.target.value)}
                        type="text"
                        placeholder="Write your Task..."
                        value={taskInput}
                        />
                    <button 
                        type="submit"
                        onClick={createTask} 
                        className={taskInput ? 'EnlabledButton' : 'DsiabledButton'}
                    >Add</button>
                </div>

                <div className="FlexContainer">
                    <div className="ToDo"
                        onDragOver={(e)=>onDragOver(e)}
                        onDrop={(e)=>{onDrop(e, "todo")}}
                    >
                         <span className="TaskTitle">To Do</span>
                         {tasks.todo}
                    </div>
                    <div className="Progress"
                         onDragOver={(e)=>onDragOver(e)}
                         onDrop={(e)=>{onDrop(e, "progress")}}
                    >
                        <span className="TaskTitle">In Progress</span>
                        {tasks.progress}
                    </div>
                    <div className="Done"
                         onDragOver={(e)=>onDragOver(e)}
                         onDrop={(e)=>{onDrop(e, "done")}}
                    >
                        <span className="TaskTitle">Done</span>
                        {tasks.done}
                    </div>
                </div>
            </div>   
        </div>
    )
}

export default KarabanBoard