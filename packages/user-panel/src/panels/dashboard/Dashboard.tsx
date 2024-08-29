import React from 'react';
import {EntryPointLink} from "../../components/EntryPointLink";

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '1em',
  } as React.CSSProperties,
};

export const Dashboard = () => {
  return (
      <div style={styles.container}>
        <EntryPointLink />
      </div>
  );
};
