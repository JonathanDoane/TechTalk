import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logo from '../img/logo2-4.jpg';

const UpdatePost = ({ setOnePost }) => {

    const navigate = useNavigate()

    const { id } = useParams();
    const [errors, setErrors] = useState({})
    const [currentUser, setCurrentUser] = useState({})
    const [updatePost, setUpdatePost] = useState({
        title: "",
        content: "",
        user_name: "",
        user: ""
    })
    console.log(currentUser)
    console.log(updatePost)

    useEffect
        (() => {
            axios.get('http://localhost:8000/api/users/me', { withCredentials: true })
                .then(res => {
                    setCurrentUser(res.data.user);
                })
                .catch(err => {
                    console.log(err)
                })
        }, []);
    useEffect(() => {
        axios.get(`http://localhost:8000/api/post/${id}`)
            .then((res) => {
                console.log("FRONT END GET ONE RES", res);
                console.log("FRONT END GET ONE RES DATA", res.data)
                setUpdatePost(res.data.post)
            })
            .catch(err => console.log('Something went wrong FRONT END GET ALL', err))
    }, [id])
    const submitHandler = (e) => {
        e.preventDefault();
        axios.patch(`http://localhost:8000/api/post/${id}`, updatePost)
            .then(res => {
                console.log('FRONT END UPDATE RES', res);
                console.log('FRONT END UPDATE RES DATA', res.data)
                setOnePost(res.data)
                navigate("/home")

            })
            .catch((err) => {
                console.log("Something went wrong FRONT END UPDATE", err);
                setErrors(err.response.data.error.errors)
            })
    }

    const changeHandler = (e) => {
        setUpdatePost({ ...updatePost, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        if (currentUser && updatePost.user) {
            if (currentUser._id !== updatePost.user) {
                console.log("User and post mismatch. Redirecting...");
                navigate("/home");
            }
        } else {
            // Handle the case when either currentUser or updatePost is not available yet.
            // You might want to show a loading indicator or handle this differently.
            // For now, let's just return early without doing anything.
            return;
        }
    }, [currentUser, updatePost, navigate]);


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

                                     <h1>Update your Post </h1>
                                     <p className='sign24'><i>"Post once every 24 hours"</i></p>

                                 <form onSubmit={submitHandler} >
                                     <div>
                                         <div>
                                         {errors.day ? <p> {errors.day} </p> : null}
                                            {errors.title ? <p> {errors.title?.message} </p> : null}
                                            {errors.content && <p> {errors.content?.message}  </p>}
                                             <div  id='topTitle'>
                                                 <input type="text" value={updatePost.title} id='inputTitle' name="title" placeholder='Add Title Here' className="form-control"onChange={changeHandler} />
                                             </div>

                                             <div>
                                                 <textarea name="content" value={updatePost.content} id='addPpost' placeholder='Add Post Here' rows="50" cols="50" className="form-control" onChange={changeHandler} />
                                             </div>


                                             <button className="btn btn-dark" type="submit" >Update Post</button>

                                             {/* <p>
                                {
                                    updatePost.user_name ? <div><label> User Name :</label>
                                        <input name="user_name" placeholder='Type.......' className="form-control  "
                                            onChange={changeHandler}
                                            value={updatePost.user_name}

                                        /> </div> : "no user name"

                                }

                            </p> */}
                                         </div>
                                         </div>
                                         </form> 
                                         </div> 
                                                                               
        
</div>
      
    )
}
export default UpdatePost