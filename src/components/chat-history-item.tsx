import { Message } from '@/lib/types/chat';
import clsx from 'clsx';

interface ChatHistoryItemProps {
  message: Message;
}

export const ChatHistoryItem = ({ message }: ChatHistoryItemProps) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={clsx(
        'max-w-[80%] rounded-lg p-4 mb-4',
        isUser ? 'bg-blue-100 self-start' : 'bg-gray-100 self-end'
      )}
    >
      <p className="text-sm">{message.content}</p>
    </div>
  );
};
