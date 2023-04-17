import React from 'react';

interface Props {
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export default React.memo((props: Props) => {
  return (
    <div
      style={{
        textAlign: 'left',
        backgroundColor: '#399',
        color: '#fff',
        padding: '.4rem .6rem',
        borderRadius: '3px 4px',
      }}
    >
      <div
        style={{
          fontSize: '1.5rem',
        }}
      >
        {props.title}
      </div>
    </div>
  );
});
