import React from 'react';
import {NameManagement} from '../../components/NameManagement';
import {KeyManagement} from '../../components/KeyManagement';
import {PageContainer} from "../../components/WrapperElement";

export const KeyPanel = () => {
  return (
    <PageContainer>
      <NameManagement />
      <KeyManagement />
    </PageContainer>
  );
};
