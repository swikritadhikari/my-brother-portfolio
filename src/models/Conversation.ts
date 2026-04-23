import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  id: string;
  sender: 'bot' | 'visitor';
  text: string;
  timestamp: string;
}

export interface IConversation extends Document {
  visitorName: string;
  visitorEmail: string;
  status: 'new' | 'read' | 'replied';
  messages: IMessage[];
  lastUpdate: string;
}

const MessageSchema = new Schema<IMessage>({
  id: { type: String, required: true },
  sender: { type: String, enum: ['bot', 'visitor'], required: true },
  text: { type: String, required: true },
  timestamp: { type: String, required: true },
});

const ConversationSchema = new Schema<IConversation>({
  visitorName: { type: String, required: true },
  visitorEmail: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  messages: [MessageSchema],
  lastUpdate: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);
