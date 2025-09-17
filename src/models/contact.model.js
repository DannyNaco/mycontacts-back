const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ContactSchema = new Schema(
    {
        firstName: {
            type : String,
            required : true,
            trim : true,
        },
        lastName: {
            type : String,
            required : true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 20,
            match: [/^\+?[0-9\s\-]+$/, 'Le numéro de téléphone doit contenir uniquement des chiffres, espaces, tirets et peut commencer par +'],
        },
        anneeNaissance: {
            type: Number,
            required : false,
            min: 1900,
            max: new Date().getFullYear(),
        },
        AjoutPar: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    },
    {
        timestamps: true
    }

)

// Au lieu de unique: true sur phone, on crée un index composé qui permet que plusieurs contacts aient le même numéro de téléphone, 
// mais pas pour un même utilisateur (AjoutPar)

ContactSchema.index({ AjoutPar: 1, phone: 1 }, { unique: true }); // Cela renvoie une erreur avec un message indiquant que le contact existe déjà pour cet utilisateur.


ContactSchema.path('AjoutPar').immutable(true); // Interdire la modification du champ AjoutPar après la création du document

ContactSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    },
});

//hook pour interdire la modification du champ AjoutPar lors d'une mise à jour
ContactSchema.pre('findOneAndUpdate', function(next) {
  const upd = this.getUpdate() || {};
  const $set = upd.$set || {};

  if ('AjoutPar' in upd || 'AjoutPar' in $set) {
    return next(new Error('Modification du propriétaire interdite'));
  }
  next();
});

//hook pour enlever les espaces du numéro de téléphone avant la sauvegarde
ContactSchema.pre('save', function(next) {
    if (this.isModified('phone')) {
        this.phone = this.phone.replace(/\s+/g, ''); // Enlever tous les espaces
    }
    next();
});

module.exports = model('Contact', ContactSchema);