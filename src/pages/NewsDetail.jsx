// frontend-user/src/pages/NewsDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FiCalendar, FiEye, FiArrowLeft, FiShare2, FiHeart, 
  FiMessageCircle, FiUser, FiClock, FiChevronRight,
  FiImage, FiZoomIn, FiX
} from 'react-icons/fi';
import { format } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';
import { getNewsById } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const NewsDetail = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    fetchNews();
    const savedLike = localStorage.getItem(`news_liked_${id}`);
    if (savedLike === 'true') {
      setLiked(true);
    }
  }, [id]);

  const fetchNews = async () => {
    try {
      const response = await getNewsById(id);
      setNews(response.data);
      const randomLikes = Math.floor(Math.random() * 100) + 20;
      setLikesCount(randomLikes);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikesCount(likesCount + 1);
      localStorage.setItem(`news_liked_${id}`, 'true');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news?.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Fixed getImageUrl function - no dependency on env variable
  const getImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') return null;
    
    // If already an external URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Clean the path
    let cleanPath = imagePath;
    
    // Replace spaces with %20
    if (cleanPath.includes(' ')) {
      cleanPath = cleanPath.replace(/ /g, '%20');
    }
    
    // Remove duplicate slashes
    cleanPath = cleanPath.replace(/\/+/g, '/');
    
    // Ensure path starts with /
    if (!cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath;
    }
    
    // Add timestamp to bypass cache
    const timestamp = new Date().getTime();
    const separator = cleanPath.includes('?') ? '&' : '?';
    
    return `http://localhost:8000${cleanPath}${separator}t=${timestamp}`;
  };

  // Get translated content
  const getTranslatedTitle = () => {
    if (!news) return '';
    if (language === 'kh' && news.title_kh) {
      return news.title_kh;
    }
    return news.title;
  };

  const getTranslatedContent = () => {
    if (!news) return '';
    if (language === 'kh' && news.content_kh) {
      return news.content_kh;
    }
    return news.content;
  };

  if (loading) return <LoadingSpinner />;
  
  if (!news) return (
    <div className="pt-32 text-center min-h-screen bg-gray-50">
      <div className="container-custom">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <FiImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">{t('newsNotFound') || 'News Not Found'}</h2>
          <p className="text-gray-500 mb-6">{t('newsNotFoundDesc') || 'The article you\'re looking for doesn\'t exist or has been removed.'}</p>
          <Link to="/news" className="btn-primary inline-flex items-center">
            <FiArrowLeft className="mr-2" /> {t('backToNews') || 'Back to News'}
          </Link>
        </div>
      </div>
    </div>
  );

  const title = getTranslatedTitle();
  const content = getTranslatedContent();
  const coverImage = news.images && news.images[0] ? getImageUrl(news.images[0].image_url) : null;
  const additionalImages = news.images ? news.images.slice(1) : [];

  return (
    <div className="pt-20 pb-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom max-w-5xl">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary-600 transition-colors">{t('home') || 'Home'}</Link>
          <FiChevronRight className="w-4 h-4" />
          <Link to="/news" className="hover:text-primary-600 transition-colors">{t('news') || 'News'}</Link>
          <FiChevronRight className="w-4 h-4" />
          <span className="text-gray-800 truncate max-w-md">{title}</span>
        </nav>

        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {coverImage && (
            <div className="relative h-96 md:h-[500px] overflow-hidden group">
              <img 
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Cover image failed to load:', coverImage);
                  e.target.style.display = 'none';
                  const parent = e.target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center';
                    fallback.innerHTML = '<svg class="w-16 h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><p class="text-white mt-2">No Image</p>';
                    parent.appendChild(fallback);
                    e.target.remove();
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <button
                onClick={() => setSelectedImage(coverImage)}
                className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
              >
                <FiZoomIn className="w-5 h-5 text-gray-800" />
              </button>
            </div>
          )}

          <div className="p-6 md:p-8 lg:p-10">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-6 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">{news.author || 'Admin'}</p>
                    <p className="text-xs">{t('author') || 'Author'}</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="flex items-center space-x-2">
                  <FiCalendar className="w-4 h-4" />
                  <span>{format(new Date(news.created_at), 'MMMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiClock className="w-4 h-4" />
                  <span>{format(new Date(news.created_at), 'h:mm a')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiEye className="w-4 h-4" />
                  <span>{news.view_count} {t('views') || 'views'}</span>
                </div>
              </div>
            </div>

            <div className="prose prose-lg prose-primary max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line space-y-6">
                {content.split('\n').map((paragraph, idx) => (
                  paragraph.trim() && (
                    <p key={idx} className="mb-4">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </div>

            {additionalImages.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiImage className="mr-2 text-primary-600" />
                  {t('morePhotos') || 'More Photos'} ({additionalImages.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {additionalImages.map((img, idx) => (
                    <div 
                      key={idx}
                      className="relative group cursor-pointer overflow-hidden rounded-xl aspect-square"
                      onClick={() => setSelectedImage(getImageUrl(img.image_url))}
                    >
                      <img 
                        src={getImageUrl(img.image_url)}
                        alt={`${title} - ${idx + 2}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          console.error('Additional image failed to load:', getImageUrl(img.image_url));
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          if (parent) {
                            const fallback = document.createElement('div');
                            fallback.className = 'w-full h-full bg-gray-200 flex items-center justify-center';
                            fallback.innerHTML = '<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                            parent.appendChild(fallback);
                            e.target.remove();
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <FiZoomIn className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  disabled={liked}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    liked 
                      ? 'bg-red-50 text-red-500 cursor-default' 
                      : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                  }`}
                >
                  <FiHeart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  <span>{likesCount}</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-all duration-300">
                  <FiMessageCircle className="w-5 h-5" />
                  <span>{t('leaveComment') || 'Leave a comment'}</span>
                </button>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-all duration-300"
              >
                <FiShare2 className="w-5 h-5" />
                <span>{t('share') || 'Share'}</span>
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-xs text-gray-500">{t('tags') || 'Tags'}:</span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">Education</span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">{t('schoolNews') || 'School News'}</span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">{t('announcement') || 'Announcement'}</span>
            </div>
          </div>
        </article>

        <div className="flex justify-between mt-8">
          <Link to="/news" className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors">
            <FiArrowLeft className="mr-2" /> {t('backToNews') || 'Back to News'}
          </Link>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            {t('backToTop') || 'Back to Top'} ↑
          </button>
        </div>
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <FiX className="w-8 h-8" />
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default NewsDetail;