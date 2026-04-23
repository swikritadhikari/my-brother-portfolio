'use server';

import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import { Conversation as ConversationType, ChatMessage } from '@/lib/portfolioStore';

export async function getConversations() {
  await dbConnect();
  try {
    const conversations = await Conversation.find({}).sort({ lastUpdate: -1 }).lean();
    return JSON.parse(JSON.stringify(conversations)) as ConversationType[];
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
    return [];
  }
}

export async function saveMessage(conversationId: string, message: ChatMessage) {
  await dbConnect();
  try {
    const updated = await Conversation.findOneAndUpdate(
      { _id: conversationId },
      { 
        $push: { messages: message },
        $set: { lastUpdate: message.timestamp, status: message.sender === 'visitor' ? 'new' : 'replied' }
      },
      { new: true }
    );
    return { success: true, conversation: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error('Failed to save message:', error);
    return { success: false, error: 'Failed to save message' };
  }
}

export async function startConversation(visitorName: string, visitorEmail: string, initialMessage: ChatMessage) {
  await dbConnect();
  try {
    const newConv = await Conversation.create({
      visitorName,
      visitorEmail,
      status: 'new',
      lastUpdate: initialMessage.timestamp,
      messages: [initialMessage]
    });
    return { success: true, conversation: JSON.parse(JSON.stringify(newConv)) };
  } catch (error) {
    console.error('Failed to start conversation:', error);
    return { success: false, error: 'Failed to start conversation' };
  }
}

export async function deleteConversation(conversationId: string) {
  await dbConnect();
  try {
    await Conversation.findByIdAndDelete(conversationId);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete conversation:', error);
    return { success: false, error: 'Failed to delete conversation' };
  }
}
