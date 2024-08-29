import React from 'react';
import {NameManagement} from '../../components/NameManagement';
import {KeyManagement} from '../../components/KeyManagement';

export const KeyPanel = () => {
  return (
    <div style={{ padding: '20px', maxWidth: 700, margin: 'auto' }}>
      <NameManagement />
      <KeyManagement />
    </div>
  );
};
