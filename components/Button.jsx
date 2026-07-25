import Link from 'next/link';

export default function Button({ children, href, variant = 'primary', className = '', ...props }) {
  const baseClass = `btn btn-${variant} ${className}`;
  
  if (href) {
    return (
      <Link href={href} className={baseClass} {...props}>
        {children}
      </Link>
    );
  }
  
  return (
    <button className={baseClass} {...props}>
      {children}
    </button>
  );
}
