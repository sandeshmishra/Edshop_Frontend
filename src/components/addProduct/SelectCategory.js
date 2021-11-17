import React, { useState } from 'react';

import CreatableSelect from 'react-select/creatable';
import "./AddProduct.css";

const createOption = (label) => ({
  label,
  value: label.trim(),
});
function SelectCategory({options, setOptions, value, setValue}){

  const handleChange = (newValue, actionMeta) => {
    console.group('Value Changed');
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    setValue(newValue)
  };
  const handleCreate = (inputValue) => {
    console.group('Option created');
    console.log('Wait a moment...');
    const newOption = createOption(inputValue);
    console.log(newOption);
    console.groupEnd();
    setOptions([...options, newOption]);
    setValue(newOption);
  };
    return (
      <CreatableSelect
        isClearable
        onChange={handleChange}
        onCreateOption={handleCreate}
        options={options}
        value={value}
        className="important"
      />
    );
}

export default SelectCategory;