// frontend-user/src/pages/Results.jsx
import React, { useState } from 'react';
import { FiSearch, FiAward, FiTrendingUp, FiBookOpen, FiUser, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';
import { searchResults } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Results = () => {
  const { t, language } = useLanguage();
  const [studentName, setStudentName] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmedName = studentName.trim();
    
    console.log('========================================');
    console.log('🔍 Form submitted with name:', trimmedName);
    console.log('========================================');
    
    if (!trimmedName) {
      setError('Please enter a student name');
      return;
    }
    
    setError('');
    setLoading(true);
    setSearched(true);
    
    try {
      console.log('📤 Calling API with:', trimmedName);
      const response = await searchResults(trimmedName);
      
      console.log('📥 Full API Response:', response);
      console.log('📊 Response Status:', response.status);
      console.log('📊 Response Data:', response.data);
      console.log('📊 Response Data Type:', typeof response.data);
      console.log('📊 Is Array:', Array.isArray(response.data));
      console.log('📊 Data Length:', response.data?.length);
      
      if (response.data && Array.isArray(response.data)) {
        setResults(response.data);
        console.log(`✅ Found ${response.data.length} results`);
        if (response.data.length === 0) {
          setError(`No results found for "${trimmedName}"`);
        }
      } else {
        console.error('❌ Invalid response format:', response.data);
        setResults([]);
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('========================================');
      console.error('❌ Search error details:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
      console.error('========================================');
      
      setError(error.response?.data?.detail || 'Failed to fetch results. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
      console.log('🏁 Search completed');
      console.log('========================================\n');
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A': 'bg-green-100 text-green-800 border-green-200',
      'B': 'bg-blue-100 text-blue-800 border-blue-200',
      'C': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'D': 'bg-orange-100 text-orange-800 border-orange-200',
      'F': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[grade] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getGradeIcon = (grade) => {
    switch(grade) {
      case 'A': return <FiAward className="w-4 h-4" />;
      case 'B': return <FiTrendingUp className="w-4 h-4" />;
      default: return <FiBookOpen className="w-4 h-4" />;
    }
  };

  const getPercentage = (score, total) => {
    return ((score / total) * 100).toFixed(1);
  };

  // Sample suggestions
  const suggestions = ['John', 'Mary', 'Sokha', 'Dara'];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
            <FiAward className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t('results') || 'Exam Results'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('searchResults') || 'Search for exam results by student name'}
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-100">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder={t('enterStudentName') || 'Enter student name...'}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <FiSearch className="w-5 h-5" />
                  <span>{t('search') || 'Search'}</span>
                </>
              )}
            </button>
          </form>
          
          {/* Suggestions */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-gray-500">Try:</span>
            {suggestions.map((name) => (
              <button
                key={name}
                onClick={() => setStudentName(name)}
                className="text-xs px-3 py-1 bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 rounded-full transition-colors duration-200"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && !loading && searched && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <FiAlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for results...</p>
          </div>
        )}

        {/* Results Display */}
        {searched && !loading && results.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <FiUser className="w-5 h-5 text-white/80" />
                    <h2 className="text-xl font-semibold text-white">
                      {studentName}
                    </h2>
                  </div>
                  <p className="text-primary-100 text-sm mt-1">
                    Found {results.length} result(s)
                  </p>
                </div>
                <div className="bg-white/20 rounded-full p-2">
                  <FiCheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t('examName') || 'Exam Name'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t('subject') || 'Subject'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t('score') || 'Score'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t('grade') || 'Grade'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {results.map((result, index) => {
                    const examName = language === 'kh' && result.exam_name_kh 
                      ? result.exam_name_kh 
                      : result.exam_name;
                    const percentage = getPercentage(result.score, result.total_score);
                    
                    return (
                      <tr key={result.id || index} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 text-sm font-bold">{index + 1}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{examName}</span>
                            {result.exam_name_kh && language === 'en' && (
                              <span className="text-xs text-gray-500 khmer-text mt-0.5">{result.exam_name_kh}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">{result.subject}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="flex items-baseline space-x-1">
                              <span className="text-lg font-bold text-gray-900">{result.score}</span>
                              <span className="text-sm text-gray-500">/ {result.total_score}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary-500 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500 ml-2">{percentage}%</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-bold border ${getGradeColor(result.grade)}`}>
                            {getGradeIcon(result.grade)}
                            <span>{result.grade}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FiAward className="w-4 h-4 text-primary-500" />
                  <span className="text-sm text-gray-600">
                    Average Score: 
                    <strong className="text-gray-800 ml-1">
                      {(results.reduce((sum, r) => sum + (r.score / r.total_score * 100), 0) / results.length).toFixed(1)}%
                    </strong>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Top Grade:</span>
                  <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-bold ${getGradeColor(results.reduce((best, r) => {
                    const grades = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 };
                    return grades[r.grade] > grades[best.grade] ? r : best;
                  }, results[0]).grade)}`}>
                    {results.reduce((best, r) => {
                      const grades = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 };
                      return grades[r.grade] > grades[best.grade] ? r : best;
                    }, results[0]).grade}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {searched && !loading && results.length === 0 && !error && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Found</h3>
            <p className="text-gray-500">
              No exam results found for "{studentName}"
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Please check the spelling or try a different name
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FiTrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-800 mb-1">How to Find Results</h4>
              <p className="text-sm text-blue-700">
                Enter the student's full name or partial name as registered in our system. 
                Results are available for recent exams. If you cannot find your results, 
                please contact the administration office at <strong className="font-semibold">+855 12 345 678</strong> or 
                email <strong className="font-semibold">info@school.edu.kh</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;