"use client"
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function SingleForm() {
    const [formdetail, setformdetail] = useState(null)
    const [formValues, setFormValues] = useState({})
    const { id } = useParams()

    useEffect(() => {
        fetch(`/api/formdetail/${id}`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then(data => {
                setformdetail(data.formDetail)
                // Initialize formValues state with default values
                const initialValues = {}
                data.formDetail?.formFields.forEach(field => {
                    if (field.type === 'checkbox') {
                        initialValues[field.label] = []
                    } else {
                        initialValues[field.label] = ''
                    }
                })
                setFormValues(initialValues)
            })
    }, [id])

    // const handleInputChange = (e, field) => {
    //     const { name, value, type, checked, files } = e.target
    //     setFormValues(prev => {
    //         if (type === 'checkbox') {
    //             const values = prev[field.label] || []
    //             if (checked) {
    //                 return { ...prev, [field.label]: [...values, value] }
    //             } else {
    //                 return { ...prev, [field.label]: values.filter(val => val !== value) }
    //             }
    //         }
    //         return { ...prev, [field.label]: value }
    //     })
    // }

    const handleInputChange = (e, field) => {
        const { type, checked, value, files } = e.target;
        setFormValues(prev => {
            if (type === 'checkbox') {
                const values = prev[field.label] || [];
                if (checked) {
                    return { ...prev, [field.label]: [...values, value] };
                } else {
                    return { ...prev, [field.label]: values.filter(val => val !== value) };
                }
            } else if (type === 'file') {
                return { ...prev, [field.label]: files }; // Store the FileList object
            }
            return { ...prev, [field.label]: value };
        });
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault()
    //     fetch(`/api/form-submit/${id}`, {
    //         method: "POST",
    //         body: JSON.stringify(formValues)
    //     }).then((res) => res.json())
    //         .then(data => toast(data.message))
    // }

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create FormData object
        const formData = new FormData();
        // Append form values to FormData
        Object.entries(formValues).forEach(([key, value]) => {
            if (value instanceof FileList) {
                // If it's a file input, append each file
                Array.from(value).forEach(file => formData.append(key, file));
            } else if (Array.isArray(value)) {
                // If it's a checkbox (array), append each value
                value.forEach(val => formData.append(key, val));
            } else {
                // Append regular inputs
                formData.append(key, value);
            }
        });

        // Send FormData to API
        fetch(`/api/form-submit/${id}`, {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then(data => toast(data.message))
            .catch(err => console.error('Error submitting form:', err));
    };

    return (
        <div className='p-3'>
            <h2>Form Title: {formdetail && formdetail.formTitle}</h2>
            <form onSubmit={handleSubmit}>
                {
                    formdetail && formdetail.formFields?.map((ele, i) =>
                        <div key={i}>
                            <label htmlFor={ele.label}>{ele.label}</label>
                            {
                                ele.type !== "select" && ele.type !== "checkbox" && ele.type !== "file" &&
                                <input
                                    type={ele.type}
                                    name={ele.label}
                                    id={ele.label}
                                    className='w-full p-2 border rounded'
                                    value={formValues[ele.label] || ''}
                                    onChange={(e) => handleInputChange(e, ele)}
                                    required={ele.isRequired}
                                />
                            }
                            {
                                ele.type === "file" &&
                                <input
                                    type="file"
                                    name={ele.label}
                                    id={ele.label}
                                    className="w-full p-2 border rounded"
                                    onChange={(e) => handleInputChange(e, ele)}
                                    required={ele.isRequired}
                                />
                            }
                            {
                                ele.type === "select" &&
                                <select
                                    name={ele.label}
                                    id={ele.label}
                                    className="w-full p-2 border rounded"
                                    value={formValues[ele.label] || ''}
                                    onChange={(e) => handleInputChange(e, ele)}
                                    required={ele.isRequired}
                                >
                                    {ele.options?.map((opt, i) =>
                                        <option value={opt} key={i}>{opt}</option>
                                    )}
                                </select>
                            }
                            {
                                ele.type === "checkbox" &&
                                ele.options?.map((opt, i) =>
                                    <div key={i} className='flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700'>
                                        <input
                                            type="checkbox"
                                            name={ele.label}
                                            value={opt}
                                            id={`${ele.label}-${opt.replace(" ", "")}`}
                                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                                            checked={(formValues[ele.label] || []).includes(opt)}
                                            onChange={(e) => handleInputChange(e, ele)}
                                        />
                                        <label className='w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300' htmlFor={`${ele.label}-${opt.replace(" ", "")}`}>{opt}</label>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
                <div className="mt-3">
                    <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800' type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}