const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const bcrypt = require('bcrypt');

const UserSchema = new Schema(
    {
    nomprenom: {
      type: String,
      required: true,
    }, 
    email: { 
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true, // enlève les espaces avant/après
      index: true, 
      match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    }
 
    },
    

    { 
        timestamps: true 
    }

);

UserSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        return ret;
    },
});

UserSchema.pre('save', async function(next) { 

    if(this.isModified('password') || this.isNew) {
       try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = model('User', UserSchema); // export du modèle User basé sur le schéma UserSchema

