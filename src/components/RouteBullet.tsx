import { ROUTE_COLORS } from '../types';

interface RouteBulletProps {
  route: string;
  size?: 'small' | 'medium' | 'large';
}

export default function RouteBullet({ route, size = 'medium' }: RouteBulletProps) {
  const backgroundColor = ROUTE_COLORS[route] || '#808183';

  const sizeStyles = {
    small: { width: '16px', height: '16px', fontSize: '10px' },
    medium: { width: '24px', height: '24px', fontSize: '14px' },
    large: { width: '32px', height: '32px', fontSize: '18px' },
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
