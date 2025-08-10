import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, 
  Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import "../styles/AdminPanel.css"

export default function AdminPanel({ handleLogout }) {
  const [users, setUsers] = useState([]);
  const [jobAnalyses, setJobAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const COLORS = ['#8B5CF6', '#06D6A0', '#FFD60A', '#FF006E', '#FB8500'];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.DEV 
          ? 'http://localhost:5003/api' 
          : '/api';

        const [usersRes, jobsRes] = await Promise.all([
          axios.get(`${apiUrl}/admin/users`, { 
            withCredentials: true,
            headers: { 'Accept': 'application/json' }
          }),
          axios.get(`${apiUrl}/job-analyses`, {
            withCredentials: true,
            headers: { 'Accept': 'application/json' }
          })
        ]);

        const jobData = jobsRes.data?.data || jobsRes.data || [];
        
        const transformedJobs = Array.isArray(jobData) 
          ? jobData.map(job => ({
              ...job,
              fraudulent: Boolean(job.fraudulent),
              platform: job.platform || 'Others',
              analysisDate: new Date(job.analysisDate)
            }))
          : [];

        setUsers(usersRes.data?.data || usersRes.data || []);
        setJobAnalyses(transformedJobs);
        
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load data. Please check console for details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prepare chart data
  const prepareChartData = () => {
    if (!Array.isArray(jobAnalyses)) return { fraudData: [], platformData: [] };

    const fraudData = [
      { name: 'Fraudulent', value: jobAnalyses.filter(j => j.fraudulent).length },
      { name: 'Legitimate', value: jobAnalyses.filter(j => !j.fraudulent).length }
    ];

    const platformStats = jobAnalyses.reduce((acc, job) => {
      const platform = job.platform || 'Others';
      if (!acc[platform]) {
        acc[platform] = { fraudulent: 0, legitimate: 0 };
      }
      job.fraudulent ? acc[platform].fraudulent++ : acc[platform].legitimate++;
      return acc;
    }, {});

    const platformData = Object.entries(platformStats).map(([platform, stats]) => ({
      platform,
      ...stats
    }));

    return { fraudData, platformData };
  };

  const { fraudData, platformData } = prepareChartData();

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter jobs based on search term
  const filteredJobs = jobAnalyses.filter(job => 
    job.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.experience.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.fraudulent ? 'fraudulent' : 'legitimate').includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(
    activeTab === 'users' 
      ? filteredUsers.length / itemsPerPage 
      : filteredJobs.length / itemsPerPage
  );

  // View job details
  const handleViewJob = (job) => {
    setSelectedJob(job);
  };

  // Close modal
  const closeModal = () => {
    setSelectedJob(null);
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5003/api/admin/users/${userId}`, {
        withCredentials: true
      });
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  // Toggle admin status
  const handleToggleAdmin = async (userId) => {
    try {
      const updatedUsers = users.map(user => 
        user._id === userId 
          ? { ...user, isAdmin: !user.isAdmin } 
          : user
      );
      setUsers(updatedUsers);
      
      await axios.put(
        `http://localhost:5003/api/admin/users/${userId}/toggle-admin`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Failed to toggle admin status:", err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">


        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 border-4 border-cyan-400 border-b-transparent rounded-full animate-spin animation-delay-150"></div>
          </div>
          <div className="mt-4 text-white font-semibold animate-pulse">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="text-red-300 text-xl font-bold mb-4">⚠️ Error</div>
          <div className="text-white">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-purple-800/40 via-pink-800/40 to-cyan-800/40 backdrop-blur-lg border-b border-white/10 shadow-2xl">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
              <span className="text-2xl">🚀</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              Admin Dashboard
            </h1>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-6 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-pink-500/25 hover:shadow-2xl"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex space-x-4 bg-white/5 backdrop-blur-lg rounded-2xl p-2 border border-white/10">
          <button
            onClick={() => {
              setActiveTab('users');
              setCurrentPage(1);
            }}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            👥 Users
          </button>
          <button
            onClick={() => {
              setActiveTab('jobs');
              setCurrentPage(1);
            }}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'jobs'
                ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            📊 Job Analyses
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pb-12">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search ${activeTab === 'users' ? 'users...' : 'jobs...'}`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl py-3 px-6 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            />
            <span className="absolute right-4 top-3 text-gray-400">
              {activeTab === 'users' ? '👤' : '🔍'}
            </span>
          </div>
        </div>

        {/* Users Section */}
        {activeTab === 'users' && (
          <div className="animate-fadeIn">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Users Management
              </h2>
              <div className="overflow-hidden rounded-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-purple-600/30 to-cyan-600/30 backdrop-blur-lg">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-300 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-300 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-300 uppercase tracking-wider">Admin</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {currentUsers.map((user, index) => (
                        <tr 
                          key={user._id} 
                          className="hover:bg-white/5 transition-colors duration-300 animate-slideInLeft"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-white font-medium">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleAdmin(user._id)}
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                user.isAdmin 
                                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30' 
                                  : 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-300 border border-gray-500/30 hover:bg-gray-500/30'
                              }`}
                            >
                              {user.isAdmin ? "Yes" : "No"}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-3 py-1 rounded-lg text-xs font-semibold transform hover:scale-105 transition-all duration-300"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 px-4 py-2 rounded-lg border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-gray-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 px-4 py-2 rounded-lg border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Jobs Section */}
        {activeTab === 'jobs' && (
          <div className="animate-fadeIn space-y-8">
            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Fraud Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={fraudData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      className="animate-spin-slow"
                    >
                      {fraudData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        color: 'white'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Fraud by Platform
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={platformData}>
                    <XAxis dataKey="platform" tick={{ fill: 'white' }} />
                    <YAxis tick={{ fill: 'white' }} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        color: 'white'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="fraudulent" name="Fraudulent" fill="#FF006E" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="legitimate" name="Legitimate" fill="#06D6A0" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Job Analyses Table */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Job Analyses
              </h2>
              <div className="overflow-hidden rounded-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-cyan-600/30 to-purple-600/30 backdrop-blur-lg">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300 uppercase tracking-wider">Platform</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300 uppercase tracking-wider">Experience</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300 uppercase tracking-wider">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {currentJobs.map((job, index) => (
                        <tr 
                          key={job._id} 
                          className={`hover:bg-white/5 transition-all duration-300 animate-slideInUp ${
                            job.fraudulent ? 'hover:bg-red-500/10' : 'hover:bg-green-500/10'
                          }`}
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-xs font-bold">
                                {job.platform.charAt(0)}
                              </div>
                              <span className="text-white font-medium">{job.platform}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold transform hover:scale-110 transition-transform duration-200 ${
                              job.fraudulent 
                                ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/30 animate-pulse' 
                                : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30'
                            }`}>
                              {job.fraudulent ? "Fraudulent" : "Legitimate"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-300">{job.experience}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-300">{job.analysisDate.toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-2 rounded-lg font-semibold text-sm transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                              onClick={() => handleViewJob(job)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 px-4 py-2 rounded-lg border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-gray-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 px-4 py-2 rounded-lg border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-900/90 to-purple-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform animate-scaleIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Job Post Details
              </h2>
              <button 
                className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-full flex items-center justify-center text-xl font-bold transform hover:scale-110 transition-all duration-300" 
                onClick={closeModal}
              >
                ×
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-purple-300 mb-4">Platform: {selectedJob.platform}</h3>
                  <div className="space-y-3">
                    <p className="flex items-center space-x-2">
                      <strong className="text-gray-300">Status:</strong>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedJob.fraudulent 
                          ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/30' 
                          : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30'
                      }`}>
                        {selectedJob.fraudulent ? "Fraudulent" : "Legitimate"}
                      </span>
                    </p>
                    <p><strong className="text-gray-300">Experience:</strong> <span className="text-white">{selectedJob.experience}</span></p>
                    <p><strong className="text-gray-300">Education:</strong> <span className="text-white">{selectedJob.education}</span></p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="space-y-3">
                    <p><strong className="text-gray-300">Employment Type:</strong> <span className="text-white">{selectedJob.employment}</span></p>
                    <p><strong className="text-gray-300">Date Analyzed:</strong> <span className="text-white">{selectedJob.analysisDate.toLocaleString()}</span></p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h4 className="text-lg font-bold text-cyan-300 mb-4">Job Post Content:</h4>
                <pre className="bg-black/30 rounded-xl p-4 text-gray-300 whitespace-pre-wrap overflow-x-auto border border-white/10">
                  {selectedJob.jobPost}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}