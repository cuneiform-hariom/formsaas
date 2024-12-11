import { NextResponse } from "next/server";
import { dbConnection } from "../../../../config/dbConnection";
import Form from "../../../../models/formModel";

dbConnection()

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const formDetail = await Form.findById(id)
        return NextResponse.json({
            formDetail,
            success: true,
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error
        }, { status: 412 })
    }
}