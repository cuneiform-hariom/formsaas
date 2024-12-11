import { NextResponse } from "next/server"
import { dbConnection } from "../../../config/dbConnection"
import Form from "../../../models/formModel"

dbConnection()

export const GET = async (req) => {
    try {
        const list = await Form.find()
        return NextResponse.json({
            success: true,
            message: "Form list get successfully!",
            list
        })
    } catch (error) {
        return NextResponse.json({
            message: "Some error!",
            success: false,
            error: error
        }, { status: 412 })
    }
}