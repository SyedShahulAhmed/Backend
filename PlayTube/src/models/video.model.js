import mongoose, {Schema} from "mongoose";
import mongoosAggregatePaginate from 'mongoose-aggregate-paginate-v2'
const videoSchema = new Schema(
    {
        videoFile : {
            type : String,
            required : true,
        },
        thumbnail : {
            type : String,
            required : true,
        },
        title : {
            type : String,
            required : true,
        },
        decription : {
            type : String,
            required : true,
        },
        views : {
            type : Number,
            default : 0,
        },
        duration : {
            type : Number,
            required : true,
        },
        isPublished : {
            type : Boolean,
            default : true,
        },
        owner : {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    },
    {timestamps : true}
)
videoSchema.plugin(mongoosAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema)