import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const tags = [
    { value: "Birthday", label: "Birthday" },
    { value: "Wedding", label: "Wedding" },
    { value: "Graduation", label: "Graduation" },
    { value: "Anniversary", label: "Anniversary" },
    { value: "Housewarming", label: "Housewarming" },
    { value: "Baby Shower", label: "Baby Shower" },
    { value: "Holiday", label: "Holiday" },
    { value: "Other", label: "Other" },
];

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
                <CreatableSelect
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    options={tags}
                    placeholder="Select tags or type to create custom tags"
                    styles={{
                        option: (baseStyles) => ({
                        ...baseStyles,
                        color: 'black',
                        }),
                    }}
                    />
                <button type="submit">Create Party</button>
            </form>
        </div>
    );
};

export default CreateParty;