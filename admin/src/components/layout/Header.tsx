import { useAuthStore } from '../../store/authStore';

export default function Header() {
  const { user } = useAuthStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {user?.firstName} {user?.lastName}
          </span>
          <span className="text-xs text-gray-500">({user?.email})</span>
        </div>
      </div>
    </header>
  );
}

