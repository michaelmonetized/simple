'use client';

import { useRef, useState } from 'react';

export default function EmailInput({
  updateForm,
  key = 'email',
  value,
  label = 'Email',
  placeholder = 'Enter Your Email',
  description,
  ...props
}: {
  updateForm: Function;
  key?: string;
  value?: string;
  label?: string;
  placeholder?: string;
  description?: string;
  props?: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const ref = useRef(null);

  const validateEmail = (value: string) => {
    if (value.length === 0) {
      setError('Email is required.');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError('Invalid email format.');
      return false;
    }

    setError('');
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    validateEmail(value);

    setEmail(value);

    updateForm(key, value);
  };

  return (
    <div className="flex flex-col gap-md">
      <label htmlFor={key} className="text-sm font-medium text-gray-700">
        Email
      </label>
      <input
        type="email"
        id={key}
        name={key}
        placeholder={placeholder}
        defaultValue={value}
        value={email}
        onChange={handleChange}
        className="w-full rounded-lg border border-white-200 px-md py-sm text-md text-black focus:border-cyan-400 invalid:border-red-400 valid:border-green-400 value-['']:invalid:border-cyan-400"
        ref={ref}
        {...props}
      />
      {description && <p className="text-sm text-gray-500">{description}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
