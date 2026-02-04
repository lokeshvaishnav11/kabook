import mongoose, { Document, Schema } from "mongoose";

// Define the TypeScript interface for an Operation
export interface IOperation extends Document {
  username: string;
  date: Date;
  operation: string;
  doneBy: string;
  description: string;
}

// Define the Mongoose schema
const OperationSchema: Schema = new Schema(
  {
    username:{
        type:String,
        default:""
    },
    date: {
      type: Date,
      default: Date.now,
    },
    operation: {
      type: String,
      default: "",
    },
    doneBy: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Export the model
export default mongoose.model<IOperation>("Operation", OperationSchema);
