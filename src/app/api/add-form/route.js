import { NextResponse } from "next/server"
import { dbConnection } from "../../../config/dbConnection"
import Form from "../../../models/formModel"

dbConnection()

export const POST = async (req) => {
    try {
        const reqBody = await req.json()
        const { formTitle, formFields, emailto } = reqBody
        const newForm = new Form({
            formTitle,
            formFields,
            emailto
        })
        await newForm.save()
        return NextResponse.json({
            message: "Form created successfully",
            success: true,
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({
            message: "Form creation failed",
            success: false
        }, { status: 412 })
    }
}