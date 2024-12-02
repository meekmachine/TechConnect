import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getUserName,
  getProfilePicUrl,
  postQuerySnapshot,
} from "../Scripts/firebase";
import { POST_CATEGORIES,FEATURE_CATEGORIES } from './Create';
import '../styles/Dashboard.css';
import MarketAnalysis from './MarketAnalysis';

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('JOBS');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const getRelativeTime = (timestamp) => {
    if (!timestamp) return '';
    
    // Convert Firestore Timestamp to Date if necessary
    const date = timestamp && typeof timestamp.toDate === 'function' 
      ? timestamp.toDate() 
      : new Date(timestamp);

    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) {
      return diffInSeconds === 1 ? '1 second ago' : `${diffInSeconds} seconds ago`;
    } else if (diffInMinutes < 60) {
      return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    } else if (diffInDays < 30) {
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    } else if (diffInMonths < 12) {
      return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
    } else {
      return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
    }
  };

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        await postQuerySnapshot((snapshot) => {
          const loadedPosts = [];
          snapshot.forEach((doc) => {
            const postData = doc.data();
            if (!postData.category) {
              postData.category = 'OTHER';
            }
            loadedPosts.push({ ...postData, key: doc.id });
          });
          setPosts(loadedPosts);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error loading posts:", error);
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const categories = {
    MAIN: ['Home'],
    POSTS: [...POST_CATEGORIES.map(cat => cat.id), 'OTHER'],
    FEATURES: [...FEATURE_CATEGORIES.map(cat => cat.id), 'OTHER']
  };

  const featuredCards = [
    {
      title: 'Job Market',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3',
      description: 'Latest trends in tech job market',
      category: 'JOBS'
    },
    {
      title: 'Career Growth',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3',
      description: 'Tips for career advancement',
      category: 'CAREER'
    },
    {
      title: 'Interview Prep',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3',
      description: 'Ace your next interview',
      category: 'SKILLS'
    }
  ];

  const getCategoryLabel = (categoryId) => {
    if (categoryId === 'Home') return 'Home';
    if (categoryId === 'OTHER') return 'Other';
    const postCategory = POST_CATEGORIES.find(cat => cat.id === categoryId);
    const featureCategory = FEATURE_CATEGORIES.find(cat => cat.id === categoryId);
    return postCategory ? postCategory.label : featureCategory ? featureCategory.label : 'Other';
  };

  const getCategoryClass = (categoryId) => {
    return `badge-${(categoryId || 'other').toLowerCase()}`;
  };

  const CategorySection = ({ title, items }) => (
    <div className="mb-4">
      <h6 className="text-muted mb-3">{title}</h6>
      {items.map((item, index) => (
        <div
          key={index}
          className={`category-item ${selectedCategory === item ? 'active' : ''}`}
          onClick={() => setSelectedCategory(item)}
        >
          {getCategoryLabel(item)}
        </div>
      ))}
    </div>
  );

  const filteredPosts = posts
    .filter(post => {
      const matchesCategory = selectedCategory === 'Home' || post.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.plainText?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  const trendingPosts = posts
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Left Sidebar */}
        <div className="col-md-2 dashboard-sidebar">
          {Object.entries(categories).map(([title, items]) => (
            <CategorySection key={title} title={title} items={items} />
          ))}
        </div>

        {/* Main Content */}
        <div className="col-md-7 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">{getCategoryLabel(selectedCategory)}</h4>
            <div className="d-flex gap-3 align-items-center">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    paddingLeft: '2.5rem',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0'
                  }}
                />
                <i className="material-icons position-absolute" 
                   style={{ left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#718096' }}>
                  search
                </i>
              </div>
              <Link to="/create" className="btn btn-primary">
                Create Post
              </Link>
            </div>
          </div>
          {selectedCategory === 'MARKET_ANALYSIS' && (
            <MarketAnalysis />
            )}

          {/* Featured Cards */}
          {selectedCategory === 'Feed' && (
            <div className="row mb-4">
              {featuredCards.map((card, index) => (
                <div key={index} className="col-md-4">
                  <div 
                    className="featured-card"
                    style={{ backgroundImage: `url(${card.image})` }}
                    onClick={() => setSelectedCategory(card.category)}
                  >
                    <div className="featured-card-overlay">
                      <h5 className="mb-1">{card.title}</h5>
                      <small>{card.description}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Posts List */}
          {selectedCategory !== 'MARKET_ANALYSIS' && (
            <div className="posts-list">
            {loading ? (
              <div className="text-center">
                <div className="spinner" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center mt-5">
                <i className="material-icons" style={{ fontSize: '48px', color: '#718096' }}>
                  search_off
                </i>
                <p className="mt-3 text-muted">No posts found in this category.</p>
                <Link to="/create" className="btn btn-primary mt-2">
                  Create the first post
                </Link>
              </div>
            ) : (
              filteredPosts.map(post => (
                <div key={post.key} className="post-card">
                  <div className="card-body p-0">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <span className={`badge ${getCategoryClass(post.category)}`}>
                          {getCategoryLabel(post.category)}
                        </span>
                        <small className="text-muted">
                          {post.author} • {post.company || 'General'}
                        </small>
                      </div>
                      <small className="text-muted">
                        {getRelativeTime(post.timestamp)}
                      </small>
                    </div>
                    <Link to={`/post/${post.key}`} className="text-decoration-none">
                      <h5 className="mb-2 text-dark">{post.title}</h5>
                    </Link>
                    <p className="text-muted mb-3">{post.plainText}</p>
                    <div className="post-stats">
                      <span>👍 {post.likes || 0}</span>
                      <span>💬 {(post.comments || 1) - 1}</span>
                      <span>👁️ {post.views || 0}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          )}
          
        </div>

        {selectedCategory !== 'MARKET_ANALYSIS' && (

          <div className="col-md-3 p-4">
            <div className="most-read-card">
              <h5 className="card-title mb-4">Trending Posts</h5>
              {trendingPosts.map(post => (
                <Link
                  key={post.key}
                  to={`/post/${post.key}`}
                  className="text-decoration-none"
                >
                  <div className="most-read-item">
                    <h6 className="mb-2 text-dark">{post.title}</h6>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className={`badge ${getCategoryClass(post.category)}`}>
                        {getCategoryLabel(post.category)}
                      </span>
                      <small className="text-muted">
                        👁️ {post.views || 0}
                      </small>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default Dashboard; 