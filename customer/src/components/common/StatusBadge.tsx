interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
  CONFIRMED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmed' },
  SHIPPED: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Shipped' },
  DELIVERED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' },
  CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
  RETURNED: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Returned' },
  ACTIVE: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
  INACTIVE: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inactive' },
  BLOCKED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Blocked' },
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const style = statusStyles[status] || statusStyles.PENDING;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${style.bg} ${style.text} ${sizeClasses[size]}`}
      role="status"
      aria-label={`Status: ${style.label}`}
    >
      {style.label}
    </span>
  );
}
