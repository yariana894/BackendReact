import mongoose from 'mongoose';

const {Schema} = mongoose;

let UsuarioSchema = new Schema(
    {
        _id: {type: Schema.ObjectId, auto: true},
        nombre: String,
        email: String,
        password: String,
        //relacion 1-N un usuario puede tener una o varias puntuaciones
        // le paso la referencia score relacionada con las puntuaciones
        puntuaciones: [{
            type: Schema.ObjectId, ref: 'Score'
        }]
    }
)

//nombre del documento
const Usuario = mongoose.model("User", UsuarioSchema);

export {Usuario};