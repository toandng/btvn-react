import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [limit, setLimit] = useState(25);
  const [posts, setPosts] = useState([]);
  const [totalPage, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterPost, setFilterPost] = useState([]);
  const [isOffline, setIsOffline] = useState(false);
  const [isShow, setShow] = useState(false);

  useEffect(() => {
    let skip = (currentPage - 1) * limit;
    fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
        setFilterPost(data.posts);
        setTotalPages(Math.ceil(data.total / limit));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentPage, limit]);

  function handleButton(e) {
    if (e.target.closest('.page-btn:not(.pre, .next)')) {
      const numberPage = +e.target.innerText;
      setCurrentPage(numberPage);
    }
    if (e.target.closest('.page-btn.pre') && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    if (e.target.closest('.page-btn.next')) {
      setCurrentPage(currentPage < totalPage ? currentPage + 1 : 1);
    }
  }

  function handleSearch(e) {
    const value = e.target.value.trim();
    if (!value) {
      setFilterPost(posts);
      setIsOffline(false);
      setShow(false);
      return;
    }
    if (value.length > 3) {
      const searchFilter = posts.filter((post) =>
        post.title.toLowerCase().includes(value.toLowerCase())
      );
      setShow(searchFilter.length === 0);
      setFilterPost(searchFilter);
      setIsOffline(true);
    }
  }

  function getPaginationButtons() {
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPage, startPage + 4);
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  return (
    <>
      <div className='app'>
        <h1>Danh sách bài viết</h1>

        <div>
          <input type='text' className='search-input' placeholder='Tìm kiếm bài viết' onInput={handleSearch} />
        </div>

        {isLoading && (
          <div className='loading-overlay'>
            <div className='loading-spinner'></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        )}

        {isShow && <p className='no-result'>Không tìm thấy bài viết nào</p>}

        <ul className='post-list'>
          {filterPost.map((post) => (
            <li className='post-item' key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
              <div className='post-meta'>
                <span className='views'>👀 {post.views} lượt xem</span>
                <span className='likes'>👍 {post.reactions?.likes || 0}</span>
                <span className='dislikes'>👎 {post.reactions?.dislikes || 0}</span>
              </div>
              <div className='tags'>
                {post.tags.map((tag, i) => (
                  <span key={i} className='tag'>
                    {tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>

        <div className='pagination-container'>
          <div>
            <label htmlFor='records-per-page'>Hiển thị:</label>
            <select
              id='records'
              className='records-select'
              onChange={(e) => {
                setLimit(+e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value='25'>25</option>
              <option value='50'>50</option>
              <option value='100'>100</option>
              <option value='150'>150</option>
            </select>
          </div>
          <div onClick={handleButton}>
            <button className='page-btn pre' disabled={currentPage === 1}>Trước</button>
            {getPaginationButtons().map((page) => (
              <button key={page} className={`page-btn ${page === currentPage ? 'active' : ''}`}>
                {page}
              </button>
            ))}
            <button className='page-btn next'>Sau</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
