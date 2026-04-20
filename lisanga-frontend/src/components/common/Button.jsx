import './Button.css';

function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  full = false,
  icon = false,
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  ...props 
}) {
  const classes = [
    'button',
    `button-${variant}`,
    size !== 'md' && `button-${size}`,
    full && 'button-full',
    icon && 'button-icon',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button 
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
