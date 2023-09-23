// const { model } = require('mongoose');
const User = require('../models/users.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// module.exports.createNewUser = (req, res) => {
//     User.create(req.body)
//     .then(newlyCreatedUser => res.json({user: newlyCreatedUser}))
//     .catch(err => res.json({message: "Something went wrong", error: err}));
// }
module.exports = {
    findAllUsers: (req, res) => {
        User.find()
            .then((allUsers) => res.json({ users: allUsers }))
            .catch(err => res.json({ message: "Something went wrong", error: err }));
    },

    findOneSingleUserById: (req, res) => {
        User.findOne({ _id: req.params.id })
            .then((oneSingleUser) => res.json({ user: oneSingleUser }))
            .catch(err => res.json({ message: "Something went wrong", error: err }));
    },

    register: async (req, res) => {
        try {
            const potentialUser = await User.findOne({ email: req.body.email });
            if (potentialUser) {
                return res.status(400).json({ msg: "Email already exists" });
            } else {
                const newUser = await User.create(req.body);

                const userToken = jwt.sign({
                    _id: newUser.id,
                    email: newUser.email,
                    name: newUser.name,
                }, process.env.SECRET_KEY, { expiresIn: "1d" });

                res.cookie("userToken", userToken, { httpOnly: true })
                    .json({ msg: "success!", user: { id: newUser._id, name: newUser.name, email: newUser.email, jwt: userToken } });
            }

        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },

    login: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                const passwordMatch = await bcrypt.compare(req.body.password, user.password);
                if (passwordMatch) {
                    const userToken = jwt.sign({
                        _id: user._id,
                        email: user.email,
                        name: user.name,
                    }, process.env.SECRET_KEY, { expiresIn: "1d" });
                    res.cookie("userToken", userToken, { httpOnly: true })
                        .json({ msg: "success!", user: { id: user._id, name: user.name, email: user.email, jwt: userToken } });
                } else {
                    res.status(400).json({ msg: "Invalid Login Attempt" });
                }
            } else {
                res.status(400).json({ msg: "Invalid Login Attempt" });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },


    logout: (req, res) => {
        res.clearCookie('userToken');
        res.sendStatus(200);
    },


    findOneSingleUser: async (req, res) => {
        const token = req.cookies.userToken;
        if (!token) {
            return res.status(501).json({ msg: "No Token Found" });
        }
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const user = await User.findById(decoded._id)
            if (!user) {
                return res.status(501).json({ msg: "No User Found" });
            }
            res.json({ msg: "success on grab!", user: user });
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },

    updateExistingUser: async (req, res) => {
        const token = req.cookies.userToken;
        if (!token) {
            return res.status(501).json({ msg: "No Token Found" });
        }
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const user = await User.findById(decoded._id)
            if (!user) {
                return res.status(501).json({ msg: "No User Found" });
            }
            const updatedUser = await User.findByIdAndUpdate(user._id, req.body, { new: true, runValidators: true });

            const userToken = jwt.sign({
                _id: updatedUser._id,
                email: updatedUser.email,
                name: updatedUser.name,
            }, process.env.SECRET_KEY, { expiresIn: "1d" });
            res.cookie("userToken", userToken, { httpOnly: true })
                .json({ msg: "success!", user: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, jwt: userToken } });
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }


    },

    updateExistingUserById: async (req, res) => {
        User.findOneAndUpdate(
            { _id: req.params.id },

            req.body,

            { new: true, runValidators: true }
        )

            .then(updatedUser => res.json({ user: updatedUser }))
            .catch(err => res.json({ message: "Something went wrong", error: err }));
        },

    deleteAnExistingUser: (req, res) => {
        User.deleteOne({ _id: req.params.id })
            .then(result => res.json({ result: result }))
            .catch(err => res.json({ message: "Something went wrong", error: err }));
    },
    findUserByEmail: (req, res) => {
        User.findOne({ email: req.params.email })
            .then(user => res.json({ user: user }))
            .catch(err => res.json({ message: "Something went wrong", error: err }));
    }

}