import React from 'react';

type Props = {
  value: 'email' | 'sms';
  onChange: (val: 'email' | 'sms') => void;
};

const NotificationSelect = ({ value, onChange }: Props) => (
  <div>
    <label>Notification Type:</label>
    <select value={value} onChange={(e) => onChange(e.target.value as 'email' | 'sms')}>
      <option value="email">Email</option>
      <option value="sms">SMS</option>
    </select>
  </div>
);

export default NotificationSelect;
