import React, { useEffect } from 'react'
import "../style/feed.scss"
import Post from '../components/Post';
import { usePost } from '../hook/usePost';

const Feed = () => {
  const { loading, feed, handleGetFeed } = usePost();

  useEffect(() => {
    handleGetFeed();
  }, []);

if (loading || !feed) {
  return (<main><h1>Feed Loding...</h1></main>)
}

console.log(feed);

  return (
    <main className="feed-page">
      <div className="feed">
        <div className="posts">
          {feed.map(post =>{
            return <Post key={post._id}  post={post} />
          })}
     
        </div>
      </div>
    </main>
  );
}

export default Feed