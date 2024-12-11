import { model, models, Schema } from "mongoose";

const submissionSchema = new Schema({
    formId: {
        type: Schema.Types.ObjectId, required: true, ref: "Form"
    },
    submissionData: {
        type: Array
    }
}, { timestamps: true })

const Submission = models.submissions || model("submissions", submissionSchema)
export default Submission