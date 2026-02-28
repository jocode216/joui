import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function LessonDashboard() {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessLevel, setAccessLevel] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const fetchLessons = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/courses/${courseId}/lessons`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCourse(response.data.data.course);
      setLessons(response.data.data.lessons);
      setAccessLevel(response.data.data.access_level);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching lessons');
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (reorderedLessons) => {
    try {
      const token = localStorage.getItem('token');
      const reorderData = {
        lessons: reorderedLessons.map((lesson, index) => ({
          id: lesson.id,
          order_index: index
        }))
      };

      await axios.post(
        'http://localhost:5000/api/lessons/reorder',
        reorderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLessons(reorderedLessons);
    } catch (err) {
      alert('Error reordering lessons');
    }
  };

  const handleDeleteClick = (lesson) => {
    setSelectedLesson(lesson);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteLesson = async () => {
    if (!selectedLesson) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/lessons/${selectedLesson.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setLessons(lessons.filter(lesson => lesson.id !== selectedLesson.id));
      setIsDeleteDialogOpen(false);
      setSelectedLesson(null);
      
      // Optional: Show success message
      alert('Lesson deleted successfully');
    } catch (err) {
      alert(err.response?.data?.error || 'Error deleting lesson');
    }
  };

  if (loading) return <div className="text-center py-8">Loading lessons...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{course?.title}</h1>
        <p className="text-gray-600 mt-2">{course?.description}</p>
        <div className="mt-2">
          <span className="text-sm text-gray-500">
            Teacher: {course?.teacher?.first_name} {course?.teacher?.last_name}
          </span>
          <span className="ml-4 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
            {accessLevel}
          </span>
        </div>
      </div>

      {/* Access Level Based Content */}
      {accessLevel !== 'FREE_ONLY' && (
        <div className="mb-4">
          <Link
            to={`/courses/${courseId}/lessons/add`}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Add New Lesson
          </Link>
        </div>
      )}

      {/* Lessons List */}
      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-gray-500 w-8">#{index + 1}</span>
                <div>
                  <h3 className="text-lg font-semibold">
                    <Link 
                      to={`/lessons/${lesson.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {lesson.title}
                    </Link>
                  </h3>
                  {lesson.description && (
                    <p className="text-gray-600 text-sm mt-1">{lesson.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {lesson.is_free && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    Free
                  </span>
                )}
                
                {accessLevel !== 'FREE_ONLY' && (
                  <>
                    <Link
                      to={`/lessons/${lesson.id}/edit`}
                      className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded border border-blue-200 hover:border-blue-300 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(lesson)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {lessons.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No lessons available for this course.
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedLesson?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setSelectedLesson(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLesson}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Delete Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LessonDashboard;