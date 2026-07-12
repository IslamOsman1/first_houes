import * as Icons from 'lucide-react';
export default function ServiceIcon({ name, size = 30 }) {
  const Icon = Icons[name] || Icons.Building2;
  return <Icon size={size} />;
}
