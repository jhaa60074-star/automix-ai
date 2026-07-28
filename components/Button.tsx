import Link from 'next/link';
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonBaseProps = {
  children: ReactNode;
  variant?: string;
  className?: string;
};

type ButtonAsLinkProps = ButtonBaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

type ButtonAsButtonProps = ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: never;
};

type ButtonProps = ButtonAsLinkProps | ButtonAsButtonProps;

export default function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const baseClass = `btn btn-${variant} ${className}`;
  
  if ('href' in props && props.href) {
    const { href, ...rest } = props as ButtonAsLinkProps;
    return (
      <Link href={href} className={baseClass} {...rest}>
        {children}
      </Link>
    );
  }
  
  const { href, ...rest } = props as ButtonAsButtonProps;
  return (
    <button className={baseClass} {...rest}>
      {children}
    </button>
  );
}
