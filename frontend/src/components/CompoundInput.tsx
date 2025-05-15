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
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

export default CompoundInput;
