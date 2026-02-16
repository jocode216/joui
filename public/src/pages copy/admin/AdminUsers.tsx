import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Eye, Phone, MapPin, User, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = 'https://storemy.josephteka.com/api';

// Type definitions
interface User {
  id: number;
  first_name: string;
  last_name?: string;
  phone: string;
  address: string;
  preferred_contact: 'CALL' | 'WHATSAPP' | 'TELEGRAM';
  telegram_username?: string;
  created_at: string;
}

interface ApiResponse {
  success: boolean;
  data: User[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/users?page=1&limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch users');
      }

      setUsers(data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.phone?.includes(searchQuery) ||
      user.address?.toLowerCase().includes(searchLower) ||
      user.telegram_username?.toLowerCase().includes(searchLower);
    
    return matchesSearch;
  });

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage user accounts ({users.length} total)
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, address, or telegram..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold">{users.length}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold">
                    {users.filter(u => u.preferred_contact === 'WHATSAPP').length}
                  </p>
                  <p className="text-sm text-muted-foreground">WhatsApp Users</p>
                </div>
                <Phone className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold">
                    {users.filter(u => u.preferred_contact === 'TELEGRAM').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Telegram Users</p>
                </div>
                <MapPin className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <div className="card-minimal overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="table-header">User</TableHead>
                <TableHead className="table-header">Phone</TableHead>
                <TableHead className="table-header">Contact Method</TableHead>
                <TableHead className="table-header">Joined Date</TableHead>
                <TableHead className="table-header text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Loading users...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? 'No users found matching your search' : 'No users found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="table-cell">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(user.first_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.first_name || 'User'}</p>
                          <p className="text-xs text-muted-foreground">
                            ID: {user.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="table-cell">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{user.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.preferred_contact === 'WHATSAPP' 
                          ? 'bg-green-100 text-green-800' 
                          : user.preferred_contact === 'TELEGRAM'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.preferred_contact?.toLowerCase() || 'call'}
                      </span>
                      {user.telegram_username && user.preferred_contact === 'TELEGRAM' && (
                        <p className="text-xs text-muted-foreground mt-1">
                          @{user.telegram_username}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="table-cell text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="table-cell text-right">
                      <Link to={`/users/${user.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;