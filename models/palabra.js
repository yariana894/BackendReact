import mongoose from 'mongoose';

const { Schema } = mongoose;

//creo el esquema que va a estar relacionado con mi base de datos
let PalabraSchema = new Schema({
        //aqui dentro coloco los campos que va a tener la tabla
        _id: { type: Schema.ObjectId, auto: true },
        palabra: String,
        fecha: Date,
    })
    //score es el nombre de la tabla
    //la tabla hay que ponerla en singular, es recomendable la tabla en inglés
const Palabra = mongoose.model("Word", PalabraSchema);

export { Palabra };