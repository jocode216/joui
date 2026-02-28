import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PublicHeader from "@/components/layout/PublicHeader";
import Footer from "@/dataIhave/footer/Footer";
import { apiCall, formatPrice } from "@/lib/api";
import { Search, BookOpen, User, Loader2 } from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  image_url: string;
  price: number;
  teacher_first_name: string;
  teacher_last_name: string;
}

export default function CoursesBrowser() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { fetchCourses(); }, [search]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      let url = "/courses?status=APPROVED";
      if (search) url += `&q=${encodeURIComponent(search)}`;
      const data = await apiCall(url);
      setCourses(data.data || data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Browse Courses</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Expand your skills with structured courses taught by experienced mentors.</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-10">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button type="submit" className="btn-primary px-6">Search</button>
          </div>
        </form>

        {error && (
          <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No courses found</h3>
            <p className="text-muted-foreground text-sm">
              {search ? `No results for "${search}". Try a different search.` : "Check back soon for new courses!"}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">{courses.length} course{courses.length !== 1 ? "s" : ""}{search ? ` for "${search}"` : ""}</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link to={`/courses/${course.id}`} key={course.id} className="no-underline group">
                  <div className="dash-card overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                    <div className="aspect-video bg-muted overflow-hidden">
                      {course.image_url ? (
                        <img
                          src={course.image_url}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-10 h-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h3>
                      {course.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {course.teacher_first_name} {course.teacher_last_name}
                        </span>
                        <span className={`text-sm font-bold ${!course.price || course.price === 0 ? "text-emerald-600" : "text-primary"}`}>
                          {formatPrice(course.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
