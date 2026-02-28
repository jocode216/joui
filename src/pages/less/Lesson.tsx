import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { apiCall } from "@/lib/api";
import { 
  Loader2, 
  AlertCircle, 
  PlayCircle, 
  Lock, 
  ChevronLeft, 
  ChevronRight,
  BookOpen 
} from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  description: string;
  video_url: string;
  order_index: number;
  is_free: boolean;
  course_id: number;
}

interface Course {
  id: number;
  title: string;
}

export default function Lesson() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (courseId && lessonId) {
      fetchLessonData();
    }
  }, [courseId, lessonId]);

  const fetchLessonData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch all data in parallel for better performance
      const [courseData, lessonsData, lessonData] = await Promise.all([
        apiCall(`/courses/${courseId}`),
        apiCall(`/courses/${courseId}/lessons`),
        apiCall(`/lessons/${lessonId}`)
      ]);
      
      setCourse(courseData.data || courseData);
      
      // Sort lessons by order_index
      const lessons = Array.isArray(lessonsData.data || lessonsData) 
        ? (lessonsData.data || lessonsData).sort((a: Lesson, b: Lesson) => a.order_index - b.order_index)
        : [];
      setAllLessons(lessons);
      
      setLesson(lessonData.data || lessonData);
    } catch (err: any) {
      setError(err.message || "Failed to load lesson");
      console.error("Error fetching lesson:", err);
    } finally {
      setLoading(false);
    }
  };

  const getEmbedUrl = (url: string): string => {
    if (!url) return "";
    
    // YouTube URL patterns
    const youtubePatterns = [
      { regex: /youtube\.com\/watch\?v=([^&\s]+)/, embed: 'https://www.youtube.com/embed/' },
      { regex: /youtu\.be\/([^&\s]+)/, embed: 'https://www.youtube.com/embed/' },
      { regex: /youtube\.com\/embed\/([^&\s]+)/, embed: 'https://www.youtube.com/embed/' }
    ];

    for (const pattern of youtubePatterns) {
      const match = url.match(pattern.regex);
      if (match) {
        return `${pattern.embed}${match[1]}`;
      }
    }
    
    // Return original URL if not YouTube
    return url;
  };

  // Find current lesson index and navigation lessons
  const currentIndex = allLessons.findIndex(l => l.id === Number(lessonId));
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleNavigate = (direction: 'prev' | 'next') => {
    const targetLesson = direction === 'prev' ? prevLesson : nextLesson;
    if (targetLesson) {
      navigate(`/teacher/courses/${courseId}/lessons/${targetLesson.id}`);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !lesson) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md mx-auto mt-20">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {error || "Lesson not found"}
          </h2>
          <p className="text-gray-600 mb-6">
            The lesson you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link 
            to={`/teacher/courses/${courseId}/lessons`} 
            className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Back to Lessons
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const embedUrl = getEmbedUrl(lesson.video_url);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header with back button */}
        <div className="mb-6">
          <Link
            to={`/teacher/courses/${courseId}/lessons`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Lessons
          </Link>
        </div>

        {/* Video Player Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          {embedUrl ? (
            <div className="aspect-video bg-black">
              <iframe
                src={embedUrl}
                title={lesson.title}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          ) : (
            <div className="aspect-video bg-gray-100 flex flex-col items-center justify-center">
              <PlayCircle className="w-16 h-16 text-gray-400 mb-2" />
              <p className="text-gray-500">No video available for this lesson</p>
            </div>
          )}
        </div>

        {/* Lesson Info Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-500">
                  {course?.title}
                </span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-500">
                  Lesson {lesson.order_index} of {allLessons.length}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            </div>
            
            {/* Access Badge */}
            {lesson.is_free ? (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                FREE
              </span>
            ) : (
              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" />
                PREMIUM
              </span>
            )}
          </div>
          
          {lesson.description && (
            <div className="prose max-w-none text-gray-700">
              <p>{lesson.description}</p>
            </div>
          )}
        </div>

        {/* Navigation Section */}
        <div className="grid grid-cols-2 gap-4">
          {/* Previous Lesson */}
          {prevLesson ? (
            <button
              onClick={() => handleNavigate('prev')}
              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-all text-left group"
            >
              <span className="text-xs text-gray-500 mb-1 block">Previous</span>
              <span className="font-medium text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
                <ChevronLeft className="w-4 h-4 inline mr-1" />
                {prevLesson.title}
              </span>
            </button>
          ) : (
            <div /> /* Empty div for spacing */
          )}
          
          {/* Next Lesson */}
          {nextLesson ? (
            <button
              onClick={() => handleNavigate('next')}
              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-all text-right group"
            >
              <span className="text-xs text-gray-500 mb-1 block">Next</span>
              <span className="font-medium text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
                {nextLesson.title}
                <ChevronRight className="w-4 h-4 inline ml-1" />
              </span>
            </button>
          ) : (
            <div /> /* Empty div for spacing */
          )}
        </div>

        {/* Course Progress (Optional) */}
        {allLessons.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Course Progress</span>
              <span className="text-sm text-gray-500">
                Lesson {currentIndex + 1} of {allLessons.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / allLessons.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}