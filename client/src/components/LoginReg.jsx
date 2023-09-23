import React, { useState } from 'react'
import logo from '../img/logo2-5.jpg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



const LoginReg = ({ currentUser, setCurrentUser }) => {

    const [userLogin, setUserLogin] = useState({
        email: "",
        password: ""
    })
    const [errors, setErrors] = useState([])



    const navigate = useNavigate();

    function onChangeHandler(e) {
        setUserLogin({
            ...userLogin,
            [e.target.name]: e.target.value
        })
    }

    function loginSubmit(e) {
        e.preventDefault();
        axios.post('http://localhost:8000/api/users/login', userLogin, { withCredentials: true })
            .then(res => {
                console.log(res)
                setCurrentUser(res.data.user);
                navigate("/home")
            })
            .catch(err => {
                console.log(err)
                const errors = err.response.data.msg;
                setErrors({ errors })
            })
    }

    const [userReg, setUserReg] = useState({
        name: "",
        email: "",
        password: "",
        confirmPass: ""
    })
    const payload = { userReg }

    const [regErrors, setRegErrors] = useState([])

    const regChangeHandler = (e) => {
        setUserReg({
            ...userReg,
            [e.target.name]: e.target.value
        })
    }

    function regSubmit(e) {
        e.preventDefault();
        axios.post('http://localhost:8000/api/users/register', userReg, { withCredentials: true })
            .then(res => {
                console.log("response^^^", res);
                setCurrentUser(res.data.user);
                navigate("/home")
            })
            .catch(err => {
                console.log(err);
                if (err.response && err.response.data) {
                    if (err.response.data.msg) {
                        setRegErrors([err.response.data.msg]);
                    } else if (err.response.data.errors) {
                        const errors = err.response.data.errors;
                        const errorArr = [];
                        for (const key of Object.keys(errors)) {
                            errorArr.push(errors[key].message);
                        }
                        setRegErrors(errorArr);
                    }
                } else {
                    setRegErrors(["An error occurred while processing your request."]);
                }
            })
    }



    return (
        <div className='logregmain'>


            <div className='mainCont'>

                <div className='logLeft'>
                    <img src={logo} alt='Logo' id='logo1' /> <br />

                    <form className='logForm' onSubmit={loginSubmit}>
                        {errors.errors && <p className="error">{errors.errors}</p>}
                        <div className="form-floating mb-3">
                            <input type="email" className="form-control" id="floatingInput" name="email" placeholder="name@example.com" value={userLogin.email} onChange={onChangeHandler} />
                            <label htmlFor="email">Email address</label>
                        </div>

                        <div className="form-floating">
                            <input type="password" className="form-control" id="floatingPassword" name="password" placeholder="Password" value={userLogin.password} onChange={onChangeHandler} />
                            <label htmlFor="password">Password</label>
                        </div>
                        <br />
                        <button type='submit' className='btn btn-dark'>Login</button>
                    </form>
                </div>

                <div className='regRight'>

                    <h1 className='regText'>Create a Free Account Now</h1>
                    <form className='logForm' onSubmit={regSubmit}>
                        {errors.error && <p className="error">{errors.error}</p>}
                        {regErrors && regErrors.map((item, idx) => (
                            <p key={idx} style={{ color: 'white' }}>**{item}</p>
                        ))}

                        <div className="form-floating mb-3">
                            <input type="text" value={userReg.name} className="form-control" id="floatingInput" name="name" placeholder="Full Name" onChange={regChangeHandler} />
                            <label htmlFor="name">Full Name</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input type="email" className="form-control" value={userReg.email} id="floatingInput" name="email" placeholder="name@example.com" onChange={regChangeHandler} />
                            <label htmlFor="email">Email address</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input type="password" className="form-control" value={userReg.password} id="floatingPassword" name="password" placeholder="Password" onChange={regChangeHandler} />
                            <label htmlFor="password">Password</label>
                        </div>

                        <div className="form-floating">
                            <input type="password" className="form-control" id="floatingPassword" value={userReg.confirmPass} name="confirmPass" placeholder="Password" onChange={regChangeHandler} />
                            <label htmlFor="confirmPass">Confirm Password</label>
                        </div>
                        <br />
                        <button type='submit' className='btn btn-dark'>Register</button>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default LoginReg;