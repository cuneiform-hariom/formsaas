const { Schema, models, model } = require("mongoose");

const formSchema = new Schema({
    formTitle: {
        type: String,
        required: [true, "Form title is required"],
    },
    formFields: {
        type: Array
    },
    emailto: {
        type: String,
        required: [true, "Receiver email is required"]
    }
}, { timestamps: true })

const Form = models.forms || model("forms", formSchema)
export default Form