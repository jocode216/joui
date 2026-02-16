import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  CheckCircle,
  ArrowLeft,
  User,
  Phone,
  Mail,
  BookOpen,
  Calendar,
  Loader2,
  Trash2,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  status: "PENDING" | "PAID" | "CANCELLED" | "COMPLETED";
  payment_method?: string;
  payment_reference?: string;
  price_paid: number;
  created_at: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  course_title: string;
  teacher_name?: string;
  thumbnail_url?: string;
}

const AdminEnrollments = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast({
          title: "Error",
          description: "Authentication required",
          variant: "destructive",
        });
        return;
      }

      // We'll use the enrollments endpoint (adjusting based on typical backend structure)
      const response = await fetch(`${API_BASE_URL}/enrollments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Fallback for development if endpoint doesn't exist
        console.warn("Enrollments endpoint not found, using generic fetch or empty list");
        setEnrollments([]);
        return;
      }

      const data = await response.json();
      if (data.success) {
        setEnrollments(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      toast({
        title: "Error",
        description: "Failed to load enrollments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/enrollments/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Update failed");

      toast({
        title: "Success",
        description: `Status updated to ${newStatus}`,
      });
      
      // Update local state
      setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: newStatus as any } : e));
      if (selectedEnrollment?.id === id) {
        setSelectedEnrollment(prev => prev ? { ...prev, status: newStatus as any } : null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update enrollment status",
        variant: "destructive",
      });
    }
  };

  const filteredEnrollments = enrollments.filter((e) => {
    const matchesSearch = 
      e.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.course_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.payment_reference?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (selectedEnrollment) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Button variant="ghost" onClick={() => setSelectedEnrollment(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Enrollments
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" /> Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedEnrollment.first_name} {selectedEnrollment.last_name}</h3>
                  <p className="text-sm text-muted-foreground">User ID: {selectedEnrollment.user_id}</p>
                </div>
                <div className="space-y-2 pt-4 border-t text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEnrollment.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEnrollment.phone || "N/A"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Enrollment Details - #{selectedEnrollment.id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                  {selectedEnrollment.thumbnail_url ? (
                    <img src={selectedEnrollment.thumbnail_url} className="h-20 w-20 rounded object-cover" />
                  ) : (
                    <div className="h-20 w-20 bg-secondary flex items-center justify-center rounded">
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-lg">{selectedEnrollment.course_title}</h4>
                    <p className="text-sm text-muted-foreground">Teacher: {selectedEnrollment.teacher_name}</p>
                    <p className="mt-2 font-medium">Paid: ETB {selectedEnrollment.price_paid.toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm pt-4">
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge className="mt-1">{selectedEnrollment.status}</Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Enrollment Date</p>
                    <p className="font-medium">{new Date(selectedEnrollment.created_at).toLocaleDateString()}</p>
                  </div>
                  {selectedEnrollment.payment_reference && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Payment Reference</p>
                      <p className="font-mono">{selectedEnrollment.payment_reference}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-6 border-t">
                  {selectedEnrollment.status === "PENDING" && (
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => updateStatus(selectedEnrollment.id, "PAID")}>
                      <CheckCircle className="h-4 w-4 mr-2" /> Mark as Paid
                    </Button>
                  )}
                  {selectedEnrollment.status !== "CANCELLED" && (
                    <Button variant="outline" className="text-red-600" onClick={() => updateStatus(selectedEnrollment.id, "CANCELLED")}>
                      <XCircle className="h-4 w-4 mr-2" /> Cancel Enrollment
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Student Enrollments</h1>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by student, course, or reference..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              ) : filteredEnrollments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No enrollments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEnrollments.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>
                      <div className="font-medium">{e.first_name} {e.last_name}</div>
                      <div className="text-xs text-muted-foreground">{e.email}</div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{e.course_title}</TableCell>
                    <TableCell>{new Date(e.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>ETB {e.price_paid.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={e.status === 'PAID' ? 'default' : e.status === 'PENDING' ? 'secondary' : 'destructive'}>
                        {e.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedEnrollment(e)}>
                        View
                      </Button>
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

export default AdminEnrollments;
