import joi from "joi";
import { 
    isCountOnly, 
    options, 
    populate, 
    select 
} from "./commonFilterValidation.js";
import { taskPriority, TaskStatus } from "../../constants.js";
import { convertObjectToEnum } from "../common.js";

 
 

export const taskSchemaKeys = joi.object({
    order: joi.number(),
    status: joi.string().valid(...convertObjectToEnum(TaskStatus)).required(),
    title: joi.string().required(),
    priority: joi.string().valid(...convertObjectToEnum(taskPriority)).optional(),
    deadline: joi.date().optional().allow(''),
    isDeleted : joi.boolean(),
    isActive:joi.boolean()
}).unknown(true)

export const taskUpdateSchemaKeys = joi.object({
    isDeleted : joi.boolean(),
    isActive:joi.boolean()
}).unknown(true)



let keys = ['query', 'where'];
/** validation keys and properties of addon for filter documents from collection */
export const taskFindFilterKeys = joi.object({
    options: options,
    ...Object.fromEntries(
        keys.map((key) => [key,joi.object({
            order: joi.number().optional(),
            status: joi.string().valid(...convertObjectToEnum(TaskStatus)).optional(),
            title: joi.string().optional(),
            desc: joi.string().optional(),
            priority: joi.string().valid(...convertObjectToEnum(taskPriority)).optional(),
            deadline: joi.date().optional(),
            isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
            isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
            id: joi.any(),
            _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
        }).unknown(true)]),
    ),
    isCountOnly: isCountOnly,
    populate: joi.array().items(populate),
    select: select
}).unknown(true)