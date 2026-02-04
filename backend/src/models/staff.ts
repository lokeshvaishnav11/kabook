import { Schema, model, Types, Document } from 'mongoose'

export interface IStaff extends Document {
  ParentId: Types.ObjectId
  username: string
  password: string
  role: string
}

const StaffSchema = new Schema<IStaff>(
  {
    ParentId: {
      type: Types.ObjectId,
      ref: 'User',
      index: true,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Staff = model<IStaff>('Staff', StaffSchema)

export default Staff
