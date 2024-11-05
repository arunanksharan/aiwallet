import { Message } from '@/lib/types/chat';
import { NextResponse } from 'next/server';

export async function GET() {
  // Implement your chat history fetching logic here
  // This could be from a database or other storage
  const messages: Message[] = [
    { role: 'assistant', content: 'Hey! How are you today?' },
    // { role: 'user', content: 'Can you fetch my balance for ethereum?' },
  ]; // Fetch your messages here
  console.log(messages);

  return NextResponse.json({ messages });
}
