"use client";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Home() {

  const [fields, setFields] = useState([]);

  const formik = useFormik({
    initialValues: {
      formTitle: "",
      fields: [],
      emailto: ""
    },
    onSubmit: async (values) => {
      const data = {
        formTitle: values.formTitle,
        formFields: values.fields,
        emailto: values.emailto
      }
      await fetch("/api/add-form", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }).then(response => response.json())
        .then(data => toast.success(data.message));
    }
  });

  const addField = () => {
    setFields([
      ...fields,
      { label: "", placeholder: "", isRequired: false, type: "text", options: [] }
    ]);
  };

  const removeField = (index) => {
    const updatedFields = fields.filter((_, idx) => idx !== index);
    setFields(updatedFields);
  };

  const updateField = (index, key, value) => {
    const updatedFields = fields.map((field, idx) =>
      idx === index ? { ...field, [key]: value } : field
    );
    setFields(updatedFields);
  };

  const addOption = (fieldIndex) => {
    const updatedFields = fields.map((field, idx) =>
      idx === fieldIndex
        ? { ...field, options: [...(field.options || []), ""] }
        : field
    );
    setFields(updatedFields);
  };

  const updateOption = (fieldIndex, optionIndex, value) => {
    const updatedFields = fields.map((field, idx) =>
      idx === fieldIndex
        ? {
          ...field,
          options: field.options.map((opt, optIdx) =>
            optIdx === optionIndex ? value : opt
          )
        }
        : field
    );
    setFields(updatedFields);
  };

  const removeOption = (fieldIndex, optionIndex) => {
    const updatedFields = fields.map((field, idx) =>
      idx === fieldIndex
        ? {
          ...field,
          options: field.options.filter((_, optIdx) => optIdx !== optionIndex)
        }
        : field
    );
    setFields(updatedFields);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formik.setFieldValue("fields", fields);
    formik.handleSubmit();
  };

  return (
    <div className="p-5">
      <h2 className="text-center font-bold text-2xl">Create Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="formTitle" className="text-sm font-semibold">Form Title</label>
          <input
            type="text"
            id="formTitle"
            name="formTitle"
            value={formik.values.formTitle}
            onChange={formik.handleChange}
            placeholder="Enter form title"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="emailto" className="text-sm font-semibold">Receiver Email</label>
          <input
            type="email"
            id="emailto"
            name="emailto"
            value={formik.values.emailto}
            onChange={formik.handleChange}
            placeholder="admin@example.com"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">Form Fields</h3>
          {fields.map((field, index) => (
            <div key={index} className="mb-4 border p-3 rounded relative">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-semibold">Label</label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateField(index, "label", e.target.value)}
                    placeholder="Field label"
                    className="w-full p-2 border rounded mb-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm">Placeholder</label>
                  <input
                    type="text"
                    value={field.placeholder}
                    onChange={(e) =>
                      updateField(index, "placeholder", e.target.value)
                    }
                    placeholder="Field placeholder"
                    className="w-full p-2 border rounded mb-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm">Field Type</label>
                  <select
                    value={field.type}
                    onChange={(e) => updateField(index, "type", e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="email">Email</option>
                    <option value="select">Select</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="password">Password</option>
                    <option value="date">Date</option>
                    <option value="file">File</option>
                    <option value="time">Time</option>
                  </select>
                </div>
              </div>
              {(field.type === "select" || field.type === "checkbox") && (
                <div>
                  <h4 className="font-semibold mt-2 text-sm">Options</h4>
                  {field.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          updateOption(index, optIndex, e.target.value)
                        }
                        placeholder="Option value"
                        className="w-full p-2 border rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(index, optIndex)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(index)}
                    className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
                  >
                    Add Option
                  </button>
                </div>
              )}
              <div className="mt-4">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.isRequired}
                    onChange={(e) =>
                      updateField(index, "isRequired", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Required</span>
                </label>
              </div>
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center bg-red-600 rounded-full">
                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="text-white text-sm"
                >
                  x
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={addField}
            className="bg-blue-500 text-white px-4 py-1 rounded-full"
          >
            Add Field
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-1 rounded-full"
          >
            Save Form
          </button>

        </div>

      </form>
    </div>
  );
}
