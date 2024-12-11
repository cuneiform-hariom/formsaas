"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

export default function Home() {
  const [formList, setFormList] = useState([])
  useEffect(() => {
    fetch("/api/get-formlist", {
      method: "GET",
    }).then((res) => res.json())
      .then((data) => setFormList(data.list))
  }, [])

  return (
    <div className='p-3'>
      {
        formList && formList.length > 0 ?
          <table className='table-auto w-full'>
            <thead>
              <tr>
                <th>From id</th>
                <th>Form Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                formList.map((ele) =>
                  <tr key={ele._id}>
                    <td>{ele._id}</td>
                    <td>{ele.formTitle}</td>
                    <td className='flex gap-4'>
                      <Link href={`forms/${ele._id}`}>Visit</Link>
                      <p>Delete</p>
                    </td>
                  </tr>
                )
              }
            </tbody>
          </table> : "No form created yet!"
      }
    </div>
  )
}
