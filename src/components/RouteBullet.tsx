import { ROUTE_COLORS } from '../types';

interface RouteBulletProps {
  route: string;
  size?: 'small' | 'medium' | 'large';
}

export default function RouteBullet({ route, size = 'medium' }: RouteBulletProps) {
  const backgroundColor = ROUTE_COLORS[route] || '#808183';

  const sizeStyles = {
    small: { width: '24px', height: '24px', fontSize: '14px' },
    medium: { width: '32px', height: '32px', fontSize: '18px' },
    large: { width: '40px', height: '40px', fontSize: '22px' },
  };

  const style = {
    ...sizeStyles[size],
    backgroundColor,
    color: '#fff',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    flexShrink: 0,
  };

  return <div style={style}>{route}</div>;
}
