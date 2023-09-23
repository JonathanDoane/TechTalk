const mongoose = require('mongoose');

const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
        validate: {
            validator: function (value) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(value);
            },
            message: "Please enter a valid email"
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"]
    },
    name: {
        type: String,
        required: [true, "Full Name is required"],
        minlength: [2, "Full Name must at least be 2 characters long"]
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    last_post: {
        type: Date
    },
}, {
    timestamps: true
});

userSchema.virtual('confirmPass')
    .get(() => this._confirmPass)
    .set(value => this._confirmPass = value);
    
    userSchema.pre('validate', function (next) {
        if (this.password !== this.confirmPass) {
            this.invalidate('confirmPass', 'Password must match confirm password');
        }
        next();
    });
    
    userSchema.pre('save', function (next) {
        bcrypt.hash(this.password, 10)
        .then(hash => {
            this.password = hash;
            next();
        });
    });
    
    module.exports = mongoose.model('User', userSchema);
   