import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getUserName,
  getProfilePicUrl,
  postQuerySnapshot
} from "../Scripts/firebase";
import { POST_CATEGORIES } from './Create';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('JOBS');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    MAIN: ['Feed', 'My Company'],
    POSTS: [...POST_CATEGORIES.map(cat => cat.id), 'OTHER'],
    FEATURES: ['Featured Content', 'Trending']
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
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3',
      description: 'Ace your next interview',
      category: 'SKILLS'
    }
  ];

  const getCategoryLabel = (categoryId) => {
    if (categoryId === 'OTHER') return 'Other';
    const category = POST_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.label : 'Other';
  };

  const getCategoryClass = (categoryId) => {
    return `badge-${(categoryId || 'other').toLowerCase()}`;
  };

  const CategorySection = ({ title, items }) => (
    <div className="mb-4">
      <h6 className="text-muted mb-2">{title}</h6>
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

  const filteredPosts = posts.filter(post => {
    if (selectedCategory === 'Feed') return true;
    return post.category === selectedCategory;
  });

  const trendingPosts = posts
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Left Sidebar */}
        <div className="col-md-2 dashboard-sidebar p-3">
          {Object.entries(categories).map(([title, items]) => (
            <CategorySection key={title} title={title} items={items} />
          ))}
        </div>

        {/* Main Content */}
        <div className="col-md-7 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>{getCategoryLabel(selectedCategory)}</h4>
            <Link to="/create" className="btn btn-primary">Create Post</Link>
          </div>

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
          <div className="posts-list">
            {loading ? (
              <div className="text-center">
                <div className="spinner">Loading posts...</div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center">
                <p>No posts found in this category.</p>
                <Link to="/create" className="btn btn-primary">
                  Create the first post
                </Link>
              </div>
            ) : (
              filteredPosts.map(post => (
                <div key={post.key} className="post-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <span className={`badge ${getCategoryClass(post.category)}`}>
                          {getCategoryLabel(post.category)}
                        </span>
                        <small className="text-muted ml-2">
                          {post.author} • {post.company || 'General'}
                        </small>
                      </div>
                    </div>
                    <Link to={`/post/${post.key}`} className="text-decoration-none">
                      <h5 className="mt-2 cursor-pointer text-dark">{post.title}</h5>
                    </Link>
                    <p className="text-muted">{post.plainText}</p>
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
        </div>

        {/* Right Sidebar - Most Read */}
        <div className="col-md-3 p-3">
          <div className="most-read-card">
            <div className="card-body">
              <h5 className="card-title mb-4">Trending Posts</h5>
              {trendingPosts.map(post => (
                <Link 
                  key={post.key} 
                  to={`/post/${post.key}`}
                  className="text-decoration-none"
                >
                  <div className="most-read-item cursor-pointer">
                    <div className="d-flex justify-content-between mb-1">
                      <small className="text-muted">
                        <span className={`badge ${getCategoryClass(post.category)}`}>
                          {getCategoryLabel(post.category)}
                        </span>
                      </small>
                      <small className="text-muted">{post.views || 0} views</small>
                    </div>
                    <div className="font-weight-medium text-dark">{post.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 