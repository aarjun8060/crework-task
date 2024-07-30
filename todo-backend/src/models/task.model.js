import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { 
    convertObjectToEnum
} from "../utils/common.js";
import {
    taskPriority,
    TaskStatus
} from '../constants.js'
const myCustomLabels = {
    totalDocs: 'itemCount',
    docs: 'data',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'next',
    prevPage: 'prev',
    totalPages: 'pageCount',
    pagingCounter: 'slNo',
    meta: 'paginator',
  };
mongoosePaginate.paginate.options = {customLabels:myCustomLabels}
const taskSchema = Schema({
    userId: {
        ref: 'user',
        type: Schema.Types.ObjectId
    },
    order:{
        type:String
    },
    status:{
        type:String,
        enum: convertObjectToEnum(TaskStatus),
        require:true,
    },
    title:{
        type:String,
        require:true
    },
    desc:{
        type:String,
    },
    priority : {
        type:String,
        enum: convertObjectToEnum(taskPriority)
    },
    deadline : {
        type:Date,
    },
    addedBy: {
        ref: 'user',
        type: Schema.Types.ObjectId
    },
    updatedBy: {
        ref: 'user',
        type: Schema.Types.ObjectId
    },
    isAppUser: { type: Boolean, default: true },
    isActive: { type: Boolean },
    isDeleted: { type: Boolean },
    createdAt: { type: Date },
    updatedAt: { type: Date },
},{
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
})

taskSchema.pre('save',async function(next){
    this.isDeleted= false,
    this.isActive= true
    next()
})

taskSchema.method('toJSON', function () {
    const {
      _id, __v, ...object 
    } = this.toObject({ virtuals:true });
    object.id = _id; 
    return object;
});

taskSchema.plugin(mongoosePaginate);
export const Task = mongoose.model("Task",taskSchema);