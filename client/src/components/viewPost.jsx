//Made by Jonathan
//this is the page that displays the individual post and the ability to make a comment on it
import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../img/logo2-4.jpg';
import { useNavigate, Link } from 'react-router-dom';


const ViewPost = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [currentUser, setCurrentUser] = useState({});
    const [post, setPost] = useState({});
    const [comment, setComment] = useState({
        content: '',
        date: Date.now(),
        user_name: currentUser.name,
        user: currentUser._id,
    });
    const [commentList, setCommentList] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/users/me', { withCredentials: true })
            .then(res => {
                console.log(res)
                setCurrentUser(res.data.user);
            })
            .catch(err => {
                console.log(err)
            })
    }, []);

    function logOut() {
        axios.post('http://localhost:8000/api/users/logout', {}, { withCredentials: true })
            .then(res => {
                console.log(res)
                setCurrentUser()
                navigate("/")
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        axios.get(`http://localhost:8000/api/post/${id}`)
            .then(res => {
                setPost(res.data.post)
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        axios.get("http://localhost:8000/api/comment")
            .then(res => {
                setCommentList(res.data.comments)
            })
            .catch(err => console.log(err))
    }, [])

    function onChangeHandler(e) {
        setComment({
            ...comment,
            [e.target.name]: e.target.value,
            user_name: currentUser.name,
            user: currentUser._id,
            date: Date.now(),
        })
    }


    function submitComment(e) {
        e.preventDefault();
        axios.post("http://localhost:8000/api/comment", comment)
            .then(res => {
                setCommentList(prevComments => [...prevComments, res.data.comment]);
                window.location.reload();
            })
            .catch(err => console.log(err))
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    


    return (
        <div className='vpMain'>
            <div className='navBar'>
                <img src={logo} alt='Logo' id='logo2' />
                <div className='navLinks'>

                    <a href="/create"><button className='addP'>Add a Post</button></a>
                    <a href="/home"><button className='allP'>All Posts</button></a>
                    <Link to={`/user/${currentUser._id}`}><button className='myP'>My Post</button></Link>
                </div>
                <div className='userLink'>
                    <p>Welcome <b>"{currentUser.name}"</b></p>
                    <a href="/editUser"><button className='accInfo'>User Info</button></a>  <button onClick={logOut} className='logbutton'>Logout</button>

                </div>
            </div>



            <div className='viewCont'>
                <div className='friendPost'>
                    <div className='fpTitle'>
                        <h5>
                            {post.title}<br />
                        </h5></div>
                    <div className='fpost'>
                        <p className='postInfo'>Post by: "{post.user_name}" </p>
                        <p className='postInfo2'>{formatDate(post.date)}</p>
                        <p className='iPost'>{post.content}</p>
                    </div>
                </div>
                <p className='coms'>Comments:</p>
                <div className='comments'>
                    {/* this is where the comments will be displayed in a potential for loop */}
                    {/*for loop */}

                    {
                        commentList?.map((comment, commentidx) => (
                            <div key={commentidx}>
                                <div className='comnts'><p className='icom'>{comment.content}</p></div>
                                <div className='comUser'>
                                    Comment by: {comment.user_name} <br />
                                    {formatDate(comment.date)}
                                </div> <br />
                            </div>
                        ))
                    }

                    {/* <div className='comnts'><p className='icom'>{comment.content}</p></div>
                    <div className='comUser'>
                        Comment by: {comment.user_name} <br />
                        09/23/2023 at 1:45 PM
                    </div> <br />
                    {/* just to see how it looks like when theres more comments */}
                    {/* <div className='comnts'><p className='icom'>ce! comment tntr text Here! comment text Here!</p></div>
                    <div className='comUser'>
                        Comment by: "comment's owner" <br />
                        09/23/2023 at 1:45 PM
                    </div> <br /> */}


                    {/*end for loop */}
                </div>
                <div >
                    <form onSubmit={submitComment}>
                        <div className='form-floating mb-3'>
                            <input type="text" name="content" className="form-control" id='postComment' onChange={onChangeHandler} />
                            <label htmlFor="content">Comment:</label>
                        </div>
                        <button type='submit' className='btn btn-dark'>Post Comment</button>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default ViewPost;