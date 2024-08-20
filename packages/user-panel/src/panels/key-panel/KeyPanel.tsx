import React from 'react';
import {NameManagement} from './NameManagement';
import {KeyManagement} from './KeyManagement';

export const KeyPanel = () => {
  return (
    <div style={{ padding: '20px', maxWidth: 700, margin: 'auto' }}>
      <NameManagement />
      <KeyManagement />
    </div>
  );
};
