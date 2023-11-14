import { Schema, model, models } from "mongoose";

const PabellonSchema = new Schema({
    ap: {
        type: String,
        required: true,
        unique: true,
        
    },
    np: {
        type: String,
        required: true,
        unique: true,
    },
});

export default models.Pabellon || model("Pabellon", PabellonSchema);