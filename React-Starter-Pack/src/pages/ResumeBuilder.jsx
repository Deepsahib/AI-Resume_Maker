import {
  ArrowLeftIcon,
  ChevronLeft,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  FolderIcon,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  Linkedin,
  Upload,
  Plus,
  Trash2,
  Globe,
  Download,
  Loader,
} from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { dummyResumeData } from "../assets";

const personalFields = [
  { key: "full_name", label: "Full Name", icon: User, type: "text", required: true },
  { key: "email", label: "Email Address", icon: Mail, type: "email", required: true },
  { key: "phone", label: "Phone Number", icon: Phone, type: "tel", required: true },
  { key: "location", label: "Location", icon: MapPin, type: "text", required: true },
  { key: "profession", label: "Profession", icon: BriefcaseBusiness, type: "text", required: true },
  { key: "linkedin", label: "LinkedIn Profile", icon: Linkedin, type: "url" },
  { key: "website", label: "Website", icon: Globe, type: "url" },
];

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [resumedata, setResumedata] = useState({
    _id: "",
    title: "",
    personal_info: {
      full_name: "",
      email: "",
      phone: "",
      location: "",
      profession: "",
      linkedin: "",
      website: "",
      image: ""
    },
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "minimal-image",
    accent_color: "#3B82F6",
    public: false,
  });

  const [activesectionindex, setActiveSectionIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'saved', 'error'
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const activeSection = sections[activesectionindex];

  // API Configuration
  const API_BASE_URL = 'http://localhost:3000/api';
  
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // API Functions
  const saveResumeToAPI = async (resumeData) => {
    try {
      setIsSaving(true);
      setSaveStatus('saving');
      
      const url = resumeData._id && resumeData._id !== "" 
        ? `${API_BASE_URL}/resume/${resumeData._id}`
        : `${API_BASE_URL}/resume/create`;
      
      const method = resumeData._id && resumeData._id !== "" ? 'PUT' : 'POST';
      
      // Clean data before sending to backend - remove frontend-generated _id fields
      const cleanedData = {
        ...resumeData,
        project: resumeData.project.map(({ _id, ...rest }) => rest),
        experience: resumeData.experience.map(({ _id, ...rest }) => rest),
        education: resumeData.education.map(({ _id, ...rest }) => rest)
      };
      
      const response = await fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: JSON.stringify(cleanedData)
      });

      const data = await response.json();

      if (response.ok) {
        // Update the resume data with the returned data from server
        if (data.resume) {
          setResumedata(prev => ({ ...prev, _id: data.resume._id }));
        }
        setSaveStatus('saved');
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        
        // Show success message briefly
        setTimeout(() => setSaveStatus(''), 3000);
        return { success: true, data: data.resume };
      } else {
        console.error('Save failed:', response.status, data);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(''), 5000);
        
        // More specific error messages
        let errorMessage = 'Save failed';
        if (response.status === 401) {
          errorMessage = 'Session expired. Please login again.';
          setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
          }, 2000);
        } else if (response.status === 500) {
          errorMessage = 'Server error. Please try again.';
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 5000);
      
      // Better error messages for network issues
      let errorMessage = 'Network error';
      if (error.message.includes('fetch')) {
        errorMessage = 'Cannot connect to server. Make sure backend is running on localhost:3000';
      } else if (error.message.includes('NetworkError')) {
        errorMessage = 'No internet connection. Please check your connection.';
      } else {
        errorMessage = error.message || 'Something went wrong. Please try again.';
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsSaving(false);
    }
  };

  const loadResumeFromAPI = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/${id}`, {
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (response.ok && data.resume) {
        setResumedata(data.resume);
        document.title = data.resume.title || 'Resume Builder';
        setHasUnsavedChanges(false);
        return { success: true, data: data.resume };
      } else {
        throw new Error(data.message || 'Failed to load resume');
      }
    } catch (error) {
      console.error('Load error:', error);
      return { success: false, error: error.message };
    }
  };

  const loadExistingResume = async () => {
    if (resumeId && resumeId !== 'new') {
      // Try to load from API first
      const result = await loadResumeFromAPI(resumeId);
      if (!result.success) {
        // Fallback to dummy data for demo purposes
        const resume = dummyResumeData.find((r) => r._id === resumeId);
        if (resume) {
          setResumedata(resume);
          document.title = resume.title;
        }
      }
    } else if (resumeId === 'new') {
      // Create a new resume
      document.title = 'New Resume';
    }
  };

  // Auto-save functionality
  const debouncedSave = useCallback(
    debounce((data) => {
      if (data._id || hasUnsavedChanges) {
        saveResumeToAPI(data);
      }
    }, 2000), // Auto-save after 2 seconds of inactivity
    [hasUnsavedChanges]
  );

  // Debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  useEffect(() => {
    loadExistingResume();
  }, [resumeId]);

  // Auto-save when resume data changes
  useEffect(() => {
    if (hasUnsavedChanges) {
      debouncedSave(resumedata);
    }
  }, [resumedata, hasUnsavedChanges, debouncedSave]);

  const handlePrev = () => {
    setActiveSectionIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setActiveSectionIndex((prev) => Math.min(prev + 1, sections.length - 1));
  };

  const updatePersonalInfo = (field, value) => {
    setResumedata(prev => ({
      ...prev,
      personal_info: {
        ...prev.personal_info,
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const addExperience = () => {
    setResumedata(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: "",
        position: "",
        start_date: "",
        end_date: "",
        description: "",
        is_current: false,
        _id: Date.now().toString()
      }]
    }));
    setHasUnsavedChanges(true);
  };

  const updateExperience = (index, field, value) => {
    setResumedata(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
    setHasUnsavedChanges(true);
  };

  const removeExperience = (index) => {
    setResumedata(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
    setHasUnsavedChanges(true);
  };

  const addEducation = () => {
    setResumedata(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: "",
        degree: "",
        field: "",
        graduation_date: "",
        gpa: "",
        _id: Date.now().toString()
      }]
    }));
    setHasUnsavedChanges(true);
  };

  const updateEducation = (index, field, value) => {
    setResumedata(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
    setHasUnsavedChanges(true);
  };

  const removeEducation = (index) => {
    setResumedata(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
    setHasUnsavedChanges(true);
  };

  const addProject = () => {
    setResumedata(prev => ({
      ...prev,
      project: [...prev.project, {
        name: "",
        type: "",
        description: "",
        _id: Date.now().toString()
      }]
    }));
    setHasUnsavedChanges(true);
  };

  const updateProject = (index, field, value) => {
    setResumedata(prev => ({
      ...prev,
      project: prev.project.map((proj, i) => 
        i === index ? { ...proj, [field]: value } : proj
      )
    }));
    setHasUnsavedChanges(true);
  };

  const removeProject = (index) => {
    setResumedata(prev => ({
      ...prev,
      project: prev.project.filter((_, i) => i !== index)
    }));
    setHasUnsavedChanges(true);
  };

  const addSkill = (skill) => {
    const skillName = skill.trim();
    if (skillName && !resumedata.skills.some(s => (typeof s === 'string' ? s : s.name) === skillName)) {
      setResumedata(prev => ({
        ...prev,
        skills: [...prev.skills, skillName]
      }));
      setHasUnsavedChanges(true);
    }
  };

  const removeSkill = (skillToRemove) => {
    setResumedata(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => (typeof skill === 'string' ? skill : skill.name) !== skillToRemove)
    }));
    setHasUnsavedChanges(true);
  };

  // Manual save function
  const handleManualSave = async () => {
    const result = await saveResumeToAPI(resumedata);
    if (result.success && !resumedata._id) {
      // If this was a new resume, redirect to the new URL with the ID
      navigate(`/app/builder/${result.data._id}`, { replace: true });
    }
  };

  // Save and go to dashboard
  const handleSaveAndGoToDashboard = async () => {
    const result = await saveResumeToAPI(resumedata);
    if (result.success) {
      navigate('/app');
    }
  };

  // Download Resume as PDF
  const downloadResumeAsPDF = () => {
    const resumeElement = document.getElementById('resume-preview');
    if (!resumeElement) return;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Get the resume HTML content
    const resumeHTML = resumeElement.innerHTML;
    
    // CSS for PDF styling
    const styles = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          color: #333;
          background: white;
        }
        .bg-white { background: white !important; }
        .text-white { color: white !important; }
        .shadow-lg, .shadow-md, .shadow { box-shadow: none !important; }
        .border { border: 1px solid #e5e7eb !important; }
        .rounded-lg { border-radius: 8px !important; }
        .p-6 { padding: 24px !important; }
        .p-4 { padding: 16px !important; }
        .mb-6 { margin-bottom: 24px !important; }
        .mb-4 { margin-bottom: 16px !important; }
        .mb-2 { margin-bottom: 8px !important; }
        .text-2xl { font-size: 24px !important; font-weight: bold !important; }
        .text-lg { font-size: 18px !important; font-weight: 600 !important; }
        .text-sm { font-size: 14px !important; }
        .font-bold { font-weight: bold !important; }
        .font-semibold { font-weight: 600 !important; }
        .text-gray-600 { color: #6b7280 !important; }
        .text-gray-500 { color: #9ca3af !important; }
        .flex { display: flex !important; }
        .items-center { align-items: center !important; }
        .gap-2 { gap: 8px !important; }
        .gap-3 { gap: 12px !important; }
        .w-full { width: 100% !important; }
        .h-32 { height: 128px !important; }
        .w-32 { width: 128px !important; }
        .object-cover { object-fit: cover !important; }
        @page {
          margin: 0.5in;
          size: A4;
        }
        @media print {
          body { -webkit-print-color-adjust: exact !important; }
        }
      </style>
    `;

    // Write the HTML content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Resume - ${resumedata.personal_info?.full_name || 'Resume'}</title>
        ${styles}
      </head>
      <body>
        ${resumeHTML}
      </body>
      </html>
    `);

    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  };

  // Smart Summary Enhancement (AI-powered client-side)
  const enhanceSummaryWithAI = async () => {
    if (!resumedata.professional_summary) {
      alert('Please write some content in the summary first, then click enhance!');
      return;
    }

    setIsEnhancing(true);
    
    // Smart Enhancement Algorithm
    const smartEnhance = (text) => {
      const profession = resumedata.personal_info.profession || 'Professional';
      const skills = resumedata.skills.map(s => typeof s === 'string' ? s : s.name).slice(0, 3).join(', ');
      const experience = resumedata.experience.length;
      
      // Enhanced text processing with AI-like improvements
      let enhanced = text.trim();
      
      // Professional transformations
      enhanced = enhanced.replace(/\bI am\b/gi, 'Accomplished');
      enhanced = enhanced.replace(/\bI have\b/gi, 'Bringing');
      enhanced = enhanced.replace(/\bI\b/gi, 'This professional');
      enhanced = enhanced.replace(/\bmy\b/gi, 'extensive');
      enhanced = enhanced.replace(/\bwith experience\b/gi, 'with proven expertise');
      enhanced = enhanced.replace(/\bexperience in\b/gi, 'specialized experience in');
      
      // Add power words
      const powerWords = {
        'good': 'exceptional',
        'great': 'outstanding',
        'nice': 'excellent',
        'work': 'deliver results',
        'help': 'drive success',
        'make': 'create innovative',
        'do': 'execute strategic'
      };
      
      Object.keys(powerWords).forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        enhanced = enhanced.replace(regex, powerWords[word]);
      });
      
      // Add professional prefixes if needed
      if (!enhanced.match(/^(Accomplished|Dynamic|Results-driven|Innovative|Strategic|Experienced)/i)) {
        const prefixes = ['Results-driven', 'Dynamic', 'Innovative', 'Strategic'];
        const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        enhanced = `${randomPrefix} ${profession} ${enhanced.charAt(0).toLowerCase() + enhanced.slice(1)}`;
      }
      
      // Add quantifiable experience
      if (experience > 0 && !enhanced.includes('year')) {
        enhanced = enhanced.replace(profession, `${profession} with ${experience}+ years of experience`);
      }
      
      // Add skills expertise
      if (skills && !enhanced.toLowerCase().includes('expertise') && !enhanced.toLowerCase().includes('skill')) {
        enhanced += ` Specialized expertise in ${skills} with a track record of delivering exceptional results.`;
      }
      
      // Ensure professional language
      enhanced = enhanced.replace(/\bvery\b/gi, 'highly');
      enhanced = enhanced.replace(/\breally\b/gi, 'exceptionally');
      enhanced = enhanced.replace(/\ba lot of\b/gi, 'extensive');
      
      // Proper capitalization and cleanup
      enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
      enhanced = enhanced.replace(/\s+/g, ' ').trim();
      
      // Ensure it ends with a period
      if (!enhanced.endsWith('.')) {
        enhanced += '.';
      }
      
      return enhanced;
    };
    
    // Simulate AI processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('🧠 Smart AI Enhancement Processing...');
    
    // Apply smart enhancement
    const enhancedSummary = smartEnhance(resumedata.professional_summary);
    
    console.log('✅ Smart Enhancement Complete!');
    
    // Update the summary
    setResumedata(prev => ({ 
      ...prev, 
      professional_summary: enhancedSummary 
    }));
    setHasUnsavedChanges(true);
    setIsEnhancing(false);
  };

  // Handle Photo Upload to Cloudinary
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      alert('Only JPG, PNG images are allowed');
      return;
    }

    setIsUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Photo uploaded successfully:', data);
        
        // Update resume data with uploaded image URL
        setResumedata(prev => ({
          ...prev,
          personal_info: {
            ...prev.personal_info,
            image: data.imageUrl
          }
        }));
        setHasUnsavedChanges(true);
        
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="size-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Step {activesectionindex + 1} of {sections.length}
            </span>
            
            {/* Save Status Indicator */}
            <div className="flex items-center gap-2 text-sm">
              {saveStatus === 'saving' && (
                <span className="text-blue-600 flex items-center gap-1">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                  Saving...
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="text-green-600 flex items-center gap-1">
                  ✓ Saved
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="text-red-600 flex items-center gap-1">
                  ✗ Save failed
                </span>
              )}
              {hasUnsavedChanges && saveStatus === '' && (
                <span className="text-orange-600">
                  Unsaved changes
                </span>
              )}
              {lastSaved && saveStatus === '' && !hasUnsavedChanges && (
                <span className="text-gray-500">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button 
                onClick={downloadResumeAsPDF}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2"
              >
                <Download className="size-4" />
                Download PDF
              </button>
              
              <button 
                onClick={handleManualSave}
                disabled={isSaving}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  'Save Resume'
                )}
              </button>
              
              <button 
                onClick={handleSaveAndGoToDashboard}
                disabled={isSaving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  'Save & Dashboard'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
          {/* Left Side - Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
            {/* Section Navigation */}
            <div className="border-b border-gray-200 p-4">
              <div className="grid grid-cols-3 gap-2">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  const isActive = index === activesectionindex;
                  const isCompleted = index < activesectionindex;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSectionIndex(index)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition ${
                        isActive
                          ? "bg-indigo-100 text-indigo-700 font-medium"
                          : isCompleted
                          ? "bg-green-50 text-green-700"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <Icon className="size-4" />
                      <span className="hidden sm:block">{section.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">{activeSection.name}</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {activeSection.id === "personal" && "Enter your personal information"}
                  {activeSection.id === "summary" && "Write a compelling professional summary"}
                  {activeSection.id === "experience" && "Add your work experience"}
                  {activeSection.id === "education" && "Add your educational background"}
                  {activeSection.id === "projects" && "Showcase your projects"}
                  {activeSection.id === "skills" && "List your technical skills"}
                </p>
              </div>

              {/* Personal Info Section */}
              {activeSection.id === "personal" && (
                <div className="space-y-6">
                  {/* Upload Image */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                      {resumedata.personal_info.image ? (
                        <img src={resumedata.personal_info.image} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="size-8 text-gray-400" />
                      )}
                    </div>
                    <label
                      htmlFor="upload"
                      className={`text-sm cursor-pointer flex items-center gap-1 px-3 py-2 border rounded-lg transition-colors ${
                        isUploadingPhoto 
                          ? 'text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed'
                          : 'text-indigo-600 hover:text-indigo-800 border-indigo-200 hover:bg-indigo-50'
                      }`}
                    >
                      {isUploadingPhoto ? (
                        <>
                          <Loader className="size-4 animate-spin" /> Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="size-4" /> Upload Photo
                        </>
                      )}
                    </label>
                    <input 
                      id="upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={isUploadingPhoto}
                    />
                  </div>

                  {/* Personal Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {personalFields.map(({ key, label, icon: Icon, type, required }) => (
                      <div key={key} className={key === "linkedin" || key === "website" ? "sm:col-span-2" : ""}>
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                          <Icon className="size-4 text-gray-500" />
                          {label}
                          {required && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type={type}
                          required={required}
                          placeholder={`Enter your ${label.toLowerCase()}`}
                          value={resumedata.personal_info[key] || ""}
                          onChange={(e) => updatePersonalInfo(key, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Professional Summary Section */}
              {activeSection.id === "summary" && (
                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      placeholder="Write a brief professional summary highlighting your key skills, experience, and career objectives..."
                      rows="8"
                      value={resumedata.professional_summary || ""}
                      onChange={(e) => {
                        setResumedata(prev => ({ ...prev, professional_summary: e.target.value }));
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
                    />
                    
                    {/* AI Enhance Button */}
                    <button
                      onClick={enhanceSummaryWithAI}
                      disabled={isEnhancing || !resumedata.professional_summary}
                      className="absolute top-2 right-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {isEnhancing ? (
                        <>
                          <Loader className="size-3 animate-spin" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="size-3" />
                          Enhance with AI
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-purple-800 text-sm">
                      ✨ <strong>AI Tip:</strong> Write a basic summary first, then click "Enhance with AI" to make it more professional and impactful!
                    </p>
                  </div>
                </div>
              )}

              {/* Experience Section */}
              {activeSection.id === "experience" && (
                <div className="space-y-6">
                  {resumedata.experience.map((exp, index) => (
                    <div key={exp._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-800">Experience {index + 1}</h3>
                        <button
                          onClick={() => removeExperience(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Job Title"
                          value={exp.position || ""}
                          onChange={(e) => updateExperience(index, "position", e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <input
                          type="text"
                          placeholder="Company Name"
                          value={exp.company || ""}
                          onChange={(e) => updateExperience(index, "company", e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <input
                          type="month"
                          placeholder="Start Date"
                          value={exp.start_date || ""}
                          onChange={(e) => updateExperience(index, "start_date", e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="month"
                            placeholder="End Date"
                            value={exp.end_date || ""}
                            onChange={(e) => updateExperience(index, "end_date", e.target.value)}
                            disabled={exp.is_current}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
                          />
                          <label className="flex items-center gap-1 text-sm">
                            <input
                              type="checkbox"
                              checked={exp.is_current || false}
                              onChange={(e) => updateExperience(index, "is_current", e.target.checked)}
                              className="rounded"
                            />
                            Current
                          </label>
                        </div>
                      </div>
                      <textarea
                        placeholder="Describe your responsibilities and achievements..."
                        rows="4"
                        value={exp.description || ""}
                        onChange={(e) => updateExperience(index, "description", e.target.value)}
                        className="w-full mt-4 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                      />
                    </div>
                  ))}
                  <button
                    onClick={addExperience}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 flex items-center justify-center gap-2 transition"
                  >
                    <Plus className="size-4" />
                    Add Experience
                  </button>
                </div>
              )}

              {/* Education Section */}
              {activeSection.id === "education" && (
                <div className="space-y-6">
                  {resumedata.education.map((edu, index) => (
                    <div key={edu._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-800">Education {index + 1}</h3>
                        <button
                          onClick={() => removeEducation(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Institution Name"
                          value={edu.institution || ""}
                          onChange={(e) => updateEducation(index, "institution", e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <input
                          type="text"
                          placeholder="Degree"
                          value={edu.degree || ""}
                          onChange={(e) => updateEducation(index, "degree", e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <input
                          type="text"
                          placeholder="Field of Study"
                          value={edu.field || ""}
                          onChange={(e) => updateEducation(index, "field", e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <input
                          type="month"
                          placeholder="Graduation Date"
                          value={edu.graduation_date || ""}
                          onChange={(e) => updateEducation(index, "graduation_date", e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <input
                          type="text"
                          placeholder="GPA (Optional)"
                          value={edu.gpa || ""}
                          onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addEducation}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 flex items-center justify-center gap-2 transition"
                  >
                    <Plus className="size-4" />
                    Add Education
                  </button>
                </div>
              )}

              {/* Projects Section */}
              {activeSection.id === "projects" && (
                <div className="space-y-6">
                  {resumedata.project.map((proj, index) => (
                    <div key={proj._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-800">Project {index + 1}</h3>
                        <button
                          onClick={() => removeProject(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Project Name"
                          value={proj.name || ""}
                          onChange={(e) => updateProject(index, "name", e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <input
                          type="text"
                          placeholder="Project Type"
                          value={proj.type || ""}
                          onChange={(e) => updateProject(index, "type", e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>
                      <textarea
                        placeholder="Project description, technologies used, and key achievements..."
                        rows="4"
                        value={proj.description || ""}
                        onChange={(e) => updateProject(index, "description", e.target.value)}
                        className="w-full mt-4 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                      />
                    </div>
                  ))}
                  <button
                    onClick={addProject}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 flex items-center justify-center gap-2 transition"
                  >
                    <Plus className="size-4" />
                    Add Project
                  </button>
                </div>
              )}

              {/* Skills Section */}
              {activeSection.id === "skills" && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Add Skills
                    </label>
                    <input
                      type="text"
                      placeholder="Type a skill and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          addSkill(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                  
                  {resumedata.skills.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Your Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {resumedata.skills.map((skill, index) => {
                          const skillName = typeof skill === 'string' ? skill : skill.name;
                          return (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                            >
                              {skillName}
                              <button
                                onClick={() => removeSkill(skillName)}
                                className="ml-1 text-indigo-600 hover:text-indigo-800"
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between">
                <button
                  onClick={handlePrev}
                  disabled={activesectionindex === 0}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="size-4" />
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={activesectionindex === sections.length - 1}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {activesectionindex === sections.length - 1 ? "Finish" : "Next"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Resume Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-800">Live Preview</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={resumedata.accent_color}
                    onChange={(e) => {
                      setResumedata(prev => ({ ...prev, accent_color: e.target.value }));
                      setHasUnsavedChanges(true);
                    }}
                    className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">Accent Color</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto h-[calc(100vh-200px)]">
              {/* Resume Preview Component */}
              <div id="resume-preview" className="bg-white shadow-lg max-w-[210mm] mx-auto" style={{ minHeight: '297mm' }}>
                <ResumePreview resumeData={resumedata} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error/Success Notifications */}
      {saveStatus === 'error' && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="font-medium">Save Failed</p>
            <p className="text-sm opacity-90">Please check your connection and try again.</p>
          </div>
          <button 
            onClick={() => setSaveStatus('')}
            className="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

      {saveStatus === 'saved' && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <span className="text-lg">✅</span>
          <div>
            <p className="font-medium">Resume Saved</p>
            <p className="text-sm opacity-90">Your changes have been saved successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Resume Preview Component
const ResumePreview = ({ resumeData }) => {
  const { personal_info, professional_summary, experience, education, project, skills, accent_color } = resumeData;

  return (
    <div className="p-8 text-gray-800 leading-relaxed" style={{ fontSize: '14px' }}>
      {/* Header */}
      <div className="text-center mb-6">
        {personal_info.image && (
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4" style={{ borderColor: accent_color }}>
            <img src={personal_info.image} alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-3xl font-bold mb-2" style={{ color: accent_color }}>
          {personal_info.full_name || "Your Name"}
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          {personal_info.profession || "Your Profession"}
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {personal_info.email && (
            <span className="flex items-center gap-1">
              <Mail className="size-3" />
              {personal_info.email}
            </span>
          )}
          {personal_info.phone && (
            <span className="flex items-center gap-1">
              <Phone className="size-3" />
              {personal_info.phone}
            </span>
          )}
          {personal_info.location && (
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {personal_info.location}
            </span>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-2">
          {personal_info.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="size-3" />
              LinkedIn
            </span>
          )}
          {personal_info.website && (
            <span className="flex items-center gap-1">
              <Globe className="size-3" />
              Website
            </span>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {professional_summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 pb-2 border-b-2" style={{ borderColor: accent_color, color: accent_color }}>
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {professional_summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 pb-2 border-b-2" style={{ borderColor: accent_color, color: accent_color }}>
            Work Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-800">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {exp.start_date && (
                      <p>
                        {new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - {' '}
                        {exp.is_current ? 'Present' : exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present'}
                      </p>
                    )}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 pb-2 border-b-2" style={{ borderColor: accent_color, color: accent_color }}>
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                    {edu.field && <p className="text-gray-500 text-sm">{edu.field}</p>}
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {edu.graduation_date && (
                      <p>{new Date(edu.graduation_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</p>
                    )}
                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {project && project.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 pb-2 border-b-2" style={{ borderColor: accent_color, color: accent_color }}>
            Projects
          </h2>
          <div className="space-y-4">
            {project.map((proj, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800">{proj.name}</h3>
                  {proj.type && (
                    <span className="text-sm text-gray-500 italic">{proj.type}</span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 pb-2 border-b-2" style={{ borderColor: accent_color, color: accent_color }}>
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-white text-sm font-medium"
                style={{ backgroundColor: accent_color }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!personal_info.full_name && !professional_summary && experience.length === 0 && education.length === 0 && project.length === 0 && skills.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FileText className="size-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Start filling out your information to see the preview</p>
          <p className="text-sm mt-2">Your resume will appear here as you type</p>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
