import { isValidObjectId } from "mongoose";
import { 
    dbServiceCount, 
    dbServiceCreate, 
    dbServiceFindOne, 
    dbServicePaginate, 
    dbServiceUpdateOne 
} from "../../../db/dbServices.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { 
    taskFindFilterKeys, 
    taskSchemaKeys, 
    taskUpdateSchemaKeys 
} from "../../../utils/validation/taskValidation.js";
import {
    validateFilterWithJoi,
    validateParamsWithJoi
} from '../../../utils/validateRequest.js'
import { Task } from '../../../models/task.model.js'
const addTask = asyncHandler(async(req,res) => {
    try {
        let dataToCreate = {...req.body || [] }
        let validateRequest = validateParamsWithJoi(
            dataToCreate,
            taskSchemaKeys
        )
        if(!validateRequest.isValid){
            return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
        }

        dataToCreate.addedBy = req.user.id

        dataToCreate = new Task(dataToCreate)

        let createdTask = await dbServiceCreate(Task,dataToCreate)

        return res.success({ data : createdTask });
    } catch (error) {
        return res.internalServerError({ message:error.message });
    }
})

const findAllTask = asyncHandler(async(req,res) => {
    try {
       let options ={}
       let  query = {}

       let validateRequest = validateFilterWithJoi(
        req.body,
        taskFindFilterKeys,
        Task.schema.obj
      );

      if(!validateRequest.isValid){
        return res.validationError({ message: `${validateRequest.message}` });
      }

      if(typeof req.body.query === 'object' && req.body.query !== null){
        query = {...req.body.query}
      }

      if(req.body.isCountOnly){
        let totalRecords = await dbServiceCount(Task,query)
        return res.success({ data: { totalRecords } });
      }
      if(typeof req.body.options === 'object' && req.body.options !== null){
        options = {...req.body.options}
      }
        query.addedBy = req.user.id;
        let foundTasks = await dbServicePaginate(Task,query,options)
        console.log('found task',foundTasks)
        if (!foundTasks || !foundTasks.data || !foundTasks.data.length){
            return res.recordNotFound(); 
        }
        return res.success({data:foundTasks})
    } catch (error) {
        return res.internalServerError({ message:error.message });
    }
})

const getTask = asyncHandler(async(req,res)=>{
    try {
        let query={}
        if(!isValidObjectId(req.params.id)){
            return res.validationError({ message : 'invalid objectId.' });
        }
        query._id = req.params.id
        let options = {}

        let foundTask = await dbServiceFindOne(Task,query,options)

        if(!foundTask){
            return res.recordNotFound();
        }

        return res.success({data:foundTask})

    } catch (error) {
        return res.internalServerError({ message:error.message });
    }
})

const softDeleteTask = asyncHandler(async(req,res)=>{
    try {
        let query={}
        if(!isValidObjectId(req.params.id)){
            return res.validationError({ message : 'invalid objectId.' });
        }
        query._id = req.params.id;
        let updatedBody = {
            isDeleted:true,
            updatedBy:req.user.id
        }

        const isDeletedTask = await dbServiceUpdateOne(Task,query,updatedBody)

        if(!isDeletedTask){
            return res.recordNotFound();
        }

        return res.success({ data:isDeletedTask});

    } catch (error) {
        return res.internalServerError({ message:error.message });
    }
})

const updateTask = asyncHandler(async(req,res) => {
    try {
        let dataToUpdate = {
            ...req.body,
            updatedBy:req.user.id
        }

        let validateRequest = validateParamsWithJoi(
            dataToUpdate,
            taskUpdateSchemaKeys
        )

        if(!validateRequest.isValid){
            return res.validationError({message: `Invalid values in parameters, ${validateRequest.message}`})
        }

        const query = {_id : req.params.id}

        let updatedTask = await dbServiceUpdateOne(Task,query,dataToUpdate)
        if (!updatedTask){
            return res.recordNotFound();
        }
        return res.success({data:updatedTask}) 
    } catch (error) {
        return res.internalServerError({message:error.message})
    }
})

export {
    findAllTask,
    getTask,
    softDeleteTask,
    addTask,
    updateTask
}