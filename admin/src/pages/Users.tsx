import { useQuery, useMutation, useQueryClient } from 'react-query';
import { userApi } from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Users() {
  const queryClient = useQueryClient();

  const { data: usersData, isLoading } = useQuery(
    'admin-users',
    () => userApi.getUsers(),
    { select: (res) => res.data.data }
  );

  const toggleBlockMutation = useMutation(
    (id: string) => userApi.toggleUserBlock(id),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries('admin-users');
        const isBlocked = response.data.data.isBlocked;
        toast.success(`User ${isBlocked ? 'blocked' : 'unblocked'} successfully`);
      },
      onError: () => {
        toast.error('Failed to update user status');
      },
    }
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Users</h1>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usersData?.users?.map((user: any) => (
                <tr key={user.id}>
                  <td className="font-medium">
                    {user.firstName} {user.lastName}
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>{user._count?.orders || 0}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isBlocked
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Are you sure you want to ${user.isBlocked ? 'unblock' : 'block'} this user?`
                          )
                        ) {
                          toggleBlockMutation.mutate(user.id);
                        }
                      }}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        user.isBlocked
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {usersData?.pagination && usersData.pagination.pages > 1 && (
          <div className="mt-4 flex justify-center space-x-2">
            {[...Array(usersData.pagination.pages)].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => {
                    // TODO: Implement pagination
                  }}
                  className={`px-4 py-2 rounded-lg ${
                    usersData.pagination.page === page
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

