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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  ArrowLeft,
  User,
  Phone,
  Mail,
  BookOpen,
  Calendar,
  Loader2,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  status: "PAID" | "COMPLETED";
  price_paid: number;
  created_at: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  course_title: string;
}

const TeacherEnrollments = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherEnrollments();
  }, []);

  const fetchTeacherEnrollments = async () => {
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

      // Teachers usually only see paid/completed enrollments for their own courses
      const response = await fetch(`${API_BASE_URL}/teacher/enrollments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setEnrollments([]);
        return;
      }

      const data = await response.json();
      if (data.success) {
        setEnrollments(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching teacher enrollments:", error);
      toast({
        title: "Error",
        description: "Failed to load student enrollments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter((e) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      e.first_name?.toLowerCase().includes(searchLower) ||
      e.last_name?.toLowerCase().includes(searchLower) ||
      e.course_title?.toLowerCase().includes(searchLower)
    );
  });

  if (selectedEnrollment) {
    return (
      <AdminLayout isTeacher>
        <div className="space-y-6">
          <Button variant="ghost" onClick={() => setSelectedEnrollment(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Students
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
                </div>
                <div className="space-y-3 pt-4 border-t text-sm">
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
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" /> Enrollment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-bold text-lg">{selectedEnrollment.course_title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">Enrolled on: {new Date(selectedEnrollment.created_at).toLocaleDateString()}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm pt-4">
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge className="mt-1 bg-green-100 text-green-800 border-green-200">
                      {selectedEnrollment.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Access Granted</p>
                    <p className="font-medium">Full Course Access</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout isTeacher>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">My Students</h1>
            <p className="text-muted-foreground">Manage students enrolled in your courses</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{enrollments.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by student name or course..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="border rounded-lg overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Enrollment Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              ) : filteredEnrollments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEnrollments.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.first_name} {e.last_name}</TableCell>
                    <TableCell>{e.course_title}</TableCell>
                    <TableCell>{new Date(e.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        {e.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedEnrollment(e)}>
                        View Profile
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

export default TeacherEnrollments;
