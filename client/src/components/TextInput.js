import React from 'react';

const TextInput = ({ label, value, onChange, placeholder }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div>
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={handleChange} // Gọi handleChange khi giá trị của input thay đổi
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextInput;
