import { NextResponse } from "next/server";
import { dbConnection } from "../../../../config/dbConnection";
import { sendMail } from "../../../../helper/helper";
import Form from "../../../../models/formModel";
import Submission from "../../../../models/submissions";
import { IncomingForm } from "formidable";
import { Readable } from "stream";
import fs from "fs/promises";

dbConnection();

export const config = {
    api: {
        bodyParser: false, // Disable default body parser
    },
};

// Convert Web Streams API request to a Node.js readable stream
function readableFromWebStream(req) {
    const reader = req.body.getReader();
    return new Readable({
        async read() {
            const { done, value } = await reader.read();
            if (done) {
                this.push(null); // Signal end of stream
            } else {
                this.push(value); // Push chunk
            }
        },
    });
}

export const POST = async (req, { params }) => {
    const { id } = params;

    try {
        const formStream = readableFromWebStream(req); // Convert to readable stream
        const form = await new Promise((resolve, reject) => {
            const incomingForm = new IncomingForm({ multiples: true });
            incomingForm.parse(formStream, (err, fields, files) => {
                if (err) return reject(err);
                resolve({ fields, files });
            });
        });

        // Fetch form details from the database
        const formDetails = await Form.findById(id);
        if (!formDetails) {
            return NextResponse.json(
                {
                    message: "Invalid form",
                    success: false,
                },
                { status: 412 }
            );
        }

        // Save files locally
        const filePaths = [];
        for (const fileKey in form.files) {
            const file = form.files[fileKey];
            const fileData = await fs.readFile(file.filepath);
            const filePath = `./uploads/${file.newFilename}`;
            await fs.writeFile(filePath, fileData);
            filePaths.push(filePath);
        }

        // Save submission to the database
        const newSubmission = new Submission({
            formId: id,
            submissionData: { ...form.fields, files: filePaths },
        });

        await newSubmission.save();

        // Send email
        const payload = {
            receiver: formDetails.emailto,
            subject: "Test mail",
            body: { ...form.fields, files: filePaths },
        };
        await sendMail(payload);

        return NextResponse.json(
            {
                message: "Form successfully submitted",
                success: true,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                message: "Form submission failed",
                success: false,
                error: error.message,
            },
            { status: 500 }
        );
    }
};
