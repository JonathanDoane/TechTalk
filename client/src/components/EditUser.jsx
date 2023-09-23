import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import logo from '../img/logo2-4.jpg';
import { Link } from 'react-router-dom';

const EditUser = (props) => {
    const { id } = useParams();
    const [loggedUser, setLoggedUser] = useState({
        name: "",
        email: "",
        password: "",
        confirmPass: ""
    });

    const [currentUser, setCurrentUser] = useState({
        name: "",
        email: "",
        password: "",
    })

    const [errors, setErrors] = useState([])

    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8000/api/users/me", { withCredentials: true })
            .then(res => {
                setCurrentUser(res.data.user);
            })
            .catch(err => console.log(err))
    })


    const onChangeHandler = (e) => {
        setLoggedUser({
            ...loggedUser,
            [e.target.name]: e.target.value
        })
    }

    const editUser = (e) => {
        e.preventDefault();
        axios.patch('http://localhost:8000/api/users/updateMe', loggedUser, { withCredentials: true })
            .then(res => {
                setLoggedUser(res.data.user);
                navigate("/home")
            })
            .catch(err => {
                console.log(err)
                if (err.response && err.response.data) {
                    if (err.response.data.msg) {
                        setErrors([err.response.data.msg]);
                    } else if (err.response.data.errors) {
                        const errors = err.response.data.errors;
                        const errorArr = [];
                        for (const key of Object.keys(errors)) {
                            errorArr.push(errors[key].message);
                        }
                        setErrors(errorArr);
                    }
                } else {
                    setErrors(["An error occurred while processing your request."]);
                }
            })

    }

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

    return (


        <div className='mainFormUp'>
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

            <div className='formUp'>
                <h1>UPDATE USER INFO</h1>
                <form className='logForm' onSubmit={editUser}>
                    {errors.error && <p className="error">{errors.error}</p>}
                    {errors && errors.map((item, idx) => (
                        <p key={idx} style={{ color: 'red' }}>**{item}</p>
                    ))}

                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" value={loggedUser.name} id="floatingInput" name='name' placeholder="name@example.com" onChange={onChangeHandler} />
                        <label htmlFor='name'>Full Name</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input type="email" className="form-control" value={loggedUser.email} id="floatingInput" name='email' placeholder="name@example.com" onChange={onChangeHandler} />
                        <label htmlFor="email">Email address</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input type="password" className="form-control" value={loggedUser.password} id="floatingPassword" name='password' placeholder="Password" onChange={onChangeHandler} />
                        <label htmlFor="password">Password</label>
                    </div>

                    <div className="form-floating">
                        <input type="password" className="form-control" name='confirmPass' value={loggedUser.confirmPass} id="floatingPassword" placeholder="Confirm Password" onChange={onChangeHandler} />
                        <label htmlFor="confirmPass">Confirm Password</label>
                    </div>
                    <br />
                    <button type='submit' className='btn btn-dark'>Update</button>
                </form>
            </div>
        </div>


    )
}

export default EditUser