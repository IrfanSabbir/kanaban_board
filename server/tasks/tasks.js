const express = require('express')
const router = express.Router()

const Task = require('../model/tasks')


router.get('/:project',  async(req, res) =>{
    try {
        const taskList = await Task.findOne({project: req.params.project}).select('task');
        let task = []
        if(taskList?.task) task= taskList?.task
        res.json({
            taskList : task
        })
    } catch (error) {
        res.json({
            message : "nothing found"
        })
    }
   
})

router.post('/:project',  async(req, res) =>{
    const {name, category} = req.body
    const data = await Task.findOne({project: req.params.project})
    if(data){
        const project = [...data.task, {name, category}]
        data.task = project
        const newTask = await data.save()
    }
    else{
        const newProject = await Task({
            project: req.params.project,
            task: [{name, category}]
        }) 
        const newTask = await newProject.save()
    }
    res.json({
        message: "task added",
    })
 
})

router.put('/:project',  async(req, res) =>{
    try {
        const data = await Task.findOne({project: req.params.project})
        if(data){

            const tasks = req.body.filter(task => {
                if(task) return task
            })
            data.task = tasks
            const newTask = await data.save()
            res.json({
                message : "task updated",
                tasks
            })
        }
        else{
            res.json({
                message : "Noting found to update"
            })
        }
    } catch (error) {
        res.json({
            message : "Nothing found"
        })
    }
})


module.exports = router