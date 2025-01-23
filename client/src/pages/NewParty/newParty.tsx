import React, { useState } from 'react';
import TagSelection from './tagSelect';

const CreateParty: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        code: Math.random().toString(36).substring(7),
        tags: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // set random code
        setFormData({
            ...formData,
            code: Math.random().toString(36).substring(7),
        });

        // Handle form submission logic here
        try {
            const response = await fetch("http://localhost:5050/record", {
                method: "POST",
                headers: {
                 "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Record added successfully:", result);
            } else {
                console.error("Failed to add record:", response.statusText);
            }
        } catch (error) {
            console.error("Error submitting form data:", error);
        }

        console.log(formData);
    };

    return (
        <div>
            <h1>Create New Party</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="party name">Party Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <TagSelection />
                <button type="submit">Create Party</button>
            </form>
        </div>
    );
};

export default CreateParty;