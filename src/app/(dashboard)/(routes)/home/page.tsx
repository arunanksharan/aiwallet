import ChatInput from '@/components/chat-input';
import React from 'react';
import { ChatHistory } from '@/components/chat-history';

const DashboardHome = () => {
  return (
    <div className="sm:w-screen">
      <div className="w-[400px] sm:w-2/3">
        <div className="pl-4">Ask Nomy</div>
        <ChatHistory />
        <ChatInput />
      </div>
    </div>
  );
};

export default DashboardHome;
