import React, { useState } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';

const GroupButton = ({ item, onChange, selectedValue }) => {
  const handleOptionChange = (value) => {
    onChange(value);
  };

  return (
    <ButtonGroup aria-label="group-options">
      {item.map((type, key) => (
        <Button
          key={key}
          style={selectedValue === type ? { background: 'blue' } : {}}
          variant="secondary"
          onClick={() => handleOptionChange(type)}
        >
          {type}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default GroupButton;
