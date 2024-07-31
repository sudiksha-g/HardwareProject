import React from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

const CommonButton = ({ variant, color, onClick, children, ...props }) => {
  return (
    <Button
      variant={variant || 'contained'}
      color={color || 'primary'}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
};

CommonButton.propTypes = {
  variant: PropTypes.oneOf(['text', 'outlined', 'contained']),
  color: PropTypes.oneOf(['default', 'inherit', 'primary', 'secondary']),
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default CommonButton;