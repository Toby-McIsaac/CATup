//import React from 'react';
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

export default function TagSelection() {
    return (
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
      );
}