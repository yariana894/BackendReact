import mongoose from 'mongoose';

const {Schema} = mongoose;

//creo el esquema que va a estar relacionado con mi base de datos
let PuntuacionSchema = new Schema(
    {
        //aqui dentro coloco los campos que va a tener la tabla
        _id: {type: Schema.ObjectId, auto: true},
        puntuacion: {
            type: Number,
            required: true,
            min: 0,
            max: 5
        },
        date: Date,
        //relación ocn el usuario para saber cual de los usuarios colocó esa puntuación
        //relacion 1-N una puntuación está relacionada a un usuario
        usuario: {type: Schema.ObjectId, ref: 'User'}
    }
)
//score es el nombre de la tabla
//la tabla hay que ponerla en singular, es recomendable la tabla en inglés
const Puntuacion = mongoose.model("Score", PuntuacionSchema);

export {Puntuacion};