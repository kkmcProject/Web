"use client";

export default function InputBox({ type, id, name, placeholder, formData, setFormData }) {
  const handleChange = e => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      className="mb-3 p-2 bg-input-bg w-4/5 border border-input-border text-black"
      onChange={handleChange}
    ></input>
  );
}
