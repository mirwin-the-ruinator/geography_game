import React from 'react';

type Props = {
  type: 'text' | 'email' | 'tel';
  label: string;
  value: string;
  onChange: (val: string) => void;
};

const CompoundInput = ({ type, label, value, onChange }: Props) => (
  <div>
    <label>{label}</label>
    <input
      className="border border-gray-300 rounded px-3 py-2 w-full focus:border-violet-400 focus:outline-0"
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default CompoundInput;
