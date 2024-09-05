'use client';

import { useRef, useState } from 'react';

export default function PasswordInput({
  updateForm,
  key = 'password',
  value,
  label = 'Password',
  placeholder = 'Enter Your Password',
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
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const ref = useRef(null);

  const validatePassword = (value: string) => {
    if (value.length === 0) {
      setError('Password is required.');
      return false;
    }

    if (value.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }

    setError('');
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    validatePassword(value);

    setPassword(value);

    updateForm(key, value);
  };

  return (
    <div className="flex flex-col gap-md">
      <label htmlFor={key} className="text-sm font-medium text-gray-700">
        Password
      </label>
      <input
        type="password"
        id={key}
        name={key}
        placeholder={placeholder}
        defaultValue={value}
        value={password}
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
