import React from 'react';

type Props = {
  value: 'email' | 'sms';
  onChange: (val: 'email' | 'sms') => void;
};

const NotificationSelect = ({ value, onChange }: Props) => (
  <div>
    <label>Notification Type:</label>
    <select
      className="ml-3 border border-gray-300 rounded px-4 py-2 focus:border-violet-400 focus:outline-0"
      value={value}
      onChange={(e) => onChange(e.target.value as 'email' | 'sms')}
    >
      <option value="email">Email</option>
      <option value="sms">SMS</option>
    </select>
  </div>
);

export default NotificationSelect;
