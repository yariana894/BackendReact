import mongoose from 'mongoose';

const {Schema} = mongoose;

//creo el esquema que va a estar relacionado con mi base de datos
let ProductoSchema = new Schema({
    //aqui dentro coloco los campos que va a tener la tabla
    _id: {type: Schema.ObjectId, auto: true},
    nombre: String,
    dataEntrada: Date,
    //relación ocn el usuario para saber cual de los usuarios colocó esa puntuación
    //relacion 1-N una puntuación está relacionada a un usuario
    usuario: {type: Schema.ObjectId, ref: 'User'},
    puntuaciones: [{
        type: Schema.ObjectId, ref: 'Score'
    }]

})
//score es el nombre de la tabla
//la tabla hay que ponerla en singular, es recomendable la tabla en inglés
const Producto = mongoose.model("Product", ProductoSchema);

export {Producto};