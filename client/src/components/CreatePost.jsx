import React, { useEffect, useState } from 'react'
import axios from "axios"
import logo from '../img/logo2-4.jpg';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const CreatePost = ({ setOnePost }) => {
    const navigate = useNavigate()
    const [errors, setErrors] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [postInfo, setPostInfo] = useState({
        title: '',
        content: '',
        user_name: currentUser.name,
        date: Date.now(),
    })
    console.log(errors);


    console.log(currentUser);
    const changeHandler = (e) => {
        setPostInfo({ 
            ...postInfo,
            [e.target.name]: e.target.value,
            user_name: currentUser.name, 
            user: currentUser._id })
    }
    const submitHandler = (e) => {
        e.preventDefault()
        const lastPostDate = new Date(currentUser.last_post);
        const currentDate = new Date();

        if (
            lastPostDate.getDate() === currentDate.getDate() &&
            lastPostDate.getMonth() === currentDate.getMonth() &&
            lastPostDate.getFullYear() === currentDate.getFullYear()
        ) {
            setErrors({
                ...errors,
                day: "You can only post once every 24 hours."
            });
            console.log("You can only post once every 24 hours.");
            console.log(errors);
            return;
        }



        axios.patch(`http://localhost:8000/api/users/${currentUser._id}`, { last_post: Date.now() }, { withCredentials: true })
            .then(res => {
                console.log(res);
                console.log("^res^");
                console.log(res.data);
                console.log("^res.data^");
            })
            .catch(err => {
                console.log(err)
            })

        axios.post("http://localhost:8000/api/post/create", postInfo, { withCredentials: true })
            .then(res => {
                console.log('FRONT END CREATE', res);
                console.log('FRONT END CREATE RES DATA', res.data)
                setOnePost(res.data)
                //patch currentUser posts array to include new post
                axios.patch(`http://localhost:8000/api/users/${currentUser._id}`, { posts: [...currentUser.posts, res.data.post._id] }, { withCredentials: true })
                    .then(res => {
                        console.log(res);
                        console.log("^res^");
                        console.log(res.data);
                        console.log("^res.data^");
                    })
                    .catch(err => {
                        console.log(err)
                    })
                
                navigate("/home")
            })
            .catch(err => {
                console.log("something went wrong FRONT END CREATE", err);
                setErrors(err.response.data.errors)
            })
    }

    useEffect(() => {
        axios.get('http://localhost:8000/api/users/me', { withCredentials: true })
            .then(res => {
                setCurrentUser(res.data.user);
            })
            .catch(err => {
                console.log(err)
            })
    }
        , []);

        function logOut() {
            axios.post('http://localhost:8000/api/users/logout', {}, { withCredentials: true })
              .then(res => {
                setCurrentUser()
                navigate("/")
              })
              .catch(err => {
                console.log(err)
              })
          }
    return (


         <div className='mainAddPost'>
        <div className='navBar'>
          <img src={logo} alt='Logo' id='logo2' />
        <div className='navLinks'>
             <a href="/home"><button className='allP'>All Posts</button></a>
             <Link to={`/user/${currentUser._id}`}><button className='myP'>My Post</button></Link>
        </div>

         <div className='userLink'>
                      <p>Welcome <b>"{currentUser.name}"</b></p>
                         <a href="/editUser"><button className='accInfo'>User Info</button></a>  <button onClick={logOut} className='logbutton'>Logout</button>
                     </div>
               </div>

                             <div className="addPostDiv">

                                     <h1>Add a Post {currentUser.name}?</h1>
                                     <p className='sign24'><i>"Post once every 24 hours"</i></p>

                                 <form onSubmit={submitHandler} >
                                     <div>
                                         <div>
                                         {errors.day ? <p> {errors.day} </p> : null}
                                            {errors.title ? <p> {errors.title?.message} </p> : null}
                                            {errors.content && <p> {errors.content?.message}  </p>}
                                             <div  id='topTitle'>
                                                 <input type="text" id='inputTitle' name="title" placeholder='Add Title Here' className="form-control"onChange={changeHandler} />
                                             </div>

                                             <div>
                                                 <textarea name="content" id='addPpost' placeholder='Add Post Here' rows="50" cols="50" className="form-control" onChange={changeHandler} />
                                             </div>


                                             <button className="btn btn-dark" type="submit" >Add a Post</button>
                                         </div>
                                         </div>
                                         </form> 
                                         </div> 
                                                                               
        
</div>       
    )
}

export default CreatePost