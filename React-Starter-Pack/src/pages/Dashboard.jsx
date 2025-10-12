import React, { useEffect, useState } from "react";
import {
  FilePenLineIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
  AlertTriangleIcon,
  LoaderIcon,
  Download,
} from "lucide-react";
import { dummyResumeData } from "../assets";
import { useNavigate } from 'react-router-dom'
const Dashboard = () => {
  const colors = [
    "#14B8A6",
    "#6366F1",
    "#EC4899",
    "#F59E0B",
    "#10B981",
    "#8B5CF6",
  ];
  const [allresume, setAllResume] = useState([]);
  const [showcreateresumes, setShowCreateResumes] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  // API Configuration
  const API_BASE_URL = 'https://backend-m1fy.onrender.com/api';
  
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return {};
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };
  // Load all resumes from API
  const loadAllResume = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/resume/`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setAllResume(data.resumes || []);
      } else {
        // Fallback to dummy data if API fails
        console.log('API failed, using dummy data');
        setAllResume(dummyResumeData);
      }
    } catch (error) {
      console.error('Load error:', error);
      // Fallback to dummy data
      setAllResume(dummyResumeData);
    } finally {
      setLoading(false);
    }
  };

  // Create new resume
  const createresume = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setCreating(true);
      const response = await fetch(`${API_BASE_URL}/resume/create`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: title.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        setShowCreateResumes(false);
        setTitle("");
        navigate(`/app/builder/${data.resume._id}`);
      } else {
        // Fallback: create with dummy ID and navigate
        setShowCreateResumes(false);
        setTitle("");
        navigate(`/app/builder/new`);
      }
    } catch (error) {
      console.error('Create error:', error);
      // Fallback: navigate to new resume builder
      setShowCreateResumes(false);
      setTitle("");
      navigate(`/app/builder/new`);
    } finally {
      setCreating(false);
    }
  };

  // Delete resume
  const deleteResume = async (resumeId) => {
    try {
      setDeleting(true);
      const response = await fetch(`${API_BASE_URL}/resume/${resumeId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        // Remove from local state
        setAllResume(prev => prev.filter(resume => resume._id !== resumeId));
        setShowDeleteModal(false);
        setResumeToDelete(null);
      } else {
        alert('Failed to delete resume. Please try again.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete resume. Please check your connection.');
    } finally {
      setDeleting(false);
    }
  };

  // Handle delete button click
  const handleDeleteClick = (e, resume) => {
    e.stopPropagation(); // Prevent navigation
    setResumeToDelete(resume);
    setShowDeleteModal(true);
  };

  // Handle edit button click
  const handleEditClick = (e, resumeId) => {
    e.stopPropagation(); // Prevent navigation
    navigate(`/app/builder/${resumeId}`);
  };
  useEffect(() => {
    loadAllResume();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      {/* Header */}
      <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
        Welcome, John Doe
      </p>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap">
        {/* Create Resume */}
        <button
          onClick={() => setShowCreateResumes(true)}
          className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-slate-400 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <PlusIcon className="size-11 transition-all duration-300 py-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full group-hover:scale-105" />
          <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
            Create Resume
          </p>
        </button>


      </div>

      <hr className="border-slate-300 my-6 sm:w-[305px]" />

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <LoaderIcon className="size-8 animate-spin text-indigo-600" />
          <span className="ml-2 text-slate-600">Loading your resumes...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && allresume.length === 0 && (
        <div className="text-center py-12">
          <FilePenLineIcon className="size-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">No resumes yet</h3>
          <p className="text-slate-500 mb-4">Create your first resume to get started</p>
          <button
            onClick={() => setShowCreateResumes(true)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Create Resume
          </button>
        </div>
      )}

      {/* Resume Grid */}
      {!loading && allresume.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allresume.map((resume, index) => {
            const baseColor = colors[index % colors.length];
            return (
              <div
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                key={resume._id || index}
                className="relative w-full h-48 bg-white flex flex-col items-center justify-center rounded-lg gap-2 border group cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
                style={{ borderColor: baseColor }}
              >
                <FilePenLineIcon
                  style={{ color: baseColor }}
                  className="size-8 group-hover:scale-105 transition-transform duration-300"
                />
                <p
                  style={{ color: baseColor }}
                  className="text-sm font-medium text-center px-2 line-clamp-2"
                >
                  {resume.title || 'Untitled Resume'}
                </p>
                <p
                  style={{ color: baseColor + "90" }}
                  className="absolute bottom-2 text-[11px] text-slate-400 transition-all duration-300"
                >
                  Updated {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : 'recently'}
                </p>

                {/* Hover Actions */}
                <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Open resume in builder page for download
                      window.open(`/app/builder/${resume._id}`, '_blank');
                    }}
                    className="p-1.5 bg-slate-100 hover:bg-green-100 rounded-full transition-colors"
                    title="Download Resume"
                  >
                    <Download className="size-4 text-green-600" />
                  </button>
                  <button 
                    onClick={(e) => handleEditClick(e, resume._id)}
                    className="p-1.5 bg-slate-100 hover:bg-blue-100 rounded-full transition-colors"
                    title="Edit Resume"
                  >
                    <PencilIcon className="size-4 text-blue-600" />
                  </button>
                  <button 
                    onClick={(e) => handleDeleteClick(e, resume)}
                    className="p-1.5 bg-slate-100 hover:bg-red-100 rounded-full transition-colors"
                    title="Delete Resume"
                  >
                    <TrashIcon className="size-4 text-red-600" />
                  </button>
                </div>

                {/* Accent Line */}
                <span
                  className="absolute top-0 left-0 w-full h-1 rounded-t-lg opacity-80"
                  style={{ backgroundColor: baseColor }}
                ></span>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Resume Modal */}
     {/* Create Resume Modal */}
{showcreateresumes && (
  <div
    onClick={() => setShowCreateResumes(false)}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white w-full max-w-md mx-4 p-6 rounded-xl shadow-lg relative"
    >
      {/* Close Button */}
      <button
        onClick={() => setShowCreateResumes(false)}
        className="absolute top-3 right-3 text-slate-500 hover:text-slate-700 transition"
      >
        <XIcon className="size-5" />
      </button>

      <h2 className="text-lg font-semibold text-slate-700 mb-4">
        Create a New Resume
      </h2>

      {/* ✅ Form Start */}
      <form onSubmit={createresume}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter resume title"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
          required
        />

        <button
          type="submit"
          disabled={creating || !title.trim()}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {creating ? (
            <>
              <LoaderIcon className="size-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Resume'
          )}
        </button>
      </form>
      {/* ✅ Form End */}
    </div>
  </div>
)}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && resumeToDelete && (
        <div
          onClick={() => setShowDeleteModal(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md mx-4 p-6 rounded-xl shadow-lg relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-700 transition"
            >
              <XIcon className="size-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <AlertTriangleIcon className="size-8 text-red-500" />
              <h2 className="text-lg font-semibold text-slate-700">
                Delete Resume
              </h2>
            </div>

            <p className="text-slate-600 mb-2">
              Are you sure you want to delete <strong>"{resumeToDelete.title}"</strong>?
            </p>
            <p className="text-slate-500 text-sm mb-6">
              This action cannot be undone. The resume will be permanently deleted.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteResume(resumeToDelete._id)}
                disabled={deleting}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <LoaderIcon className="size-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
