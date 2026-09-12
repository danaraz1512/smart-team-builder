import React, { useState } from 'react';
import { X, Send, UserCheck, ShieldCheck } from 'lucide-react';
import { Employee } from '../types';

interface MessageBuddyModalProps {
  isOpen: boolean;
  onClose: () => void;
  buddy: Employee;
  firstShiftInfo: {
    day: string;
    date: string;
    time: string;
    location: string;
  };
}

export const MessageBuddyModal: React.FC<MessageBuddyModalProps> = ({
  isOpen,
  onClose,
  buddy,
  firstShiftInfo,
}) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<
    { sender: 'buddy' | 'noa'; text: string; time: string }[]
  >([
    {
      sender: 'buddy',
      text: `Hi Noa! Welcome to Bean & Bloom! 🎉 I saw you're scheduled for your first shift on ${firstShiftInfo.day} (${firstShiftInfo.time}) at ${firstShiftInfo.location}.`,
      time: '9:42 AM',
    },
    {
      sender: 'buddy',
      text: "I'll meet you right by the main counter 10 minutes before we start to show you the espresso machine and café opening checklist. Feel free to ask me anything!",
      time: '9:43 AM',
    },
  ]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [
      ...prev,
      { sender: 'noa', text: inputText, time: 'Just now' },
    ]);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
      <div
        id="message-buddy-preview-modal"
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#E1E5E9] overflow-hidden flex flex-col h-[520px] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E1E5E9] bg-[#F6F7F8]">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-xs"
              style={{ backgroundColor: buddy.avatarBg || '#2F95F8' }}
            >
              {buddy.initials}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] font-semibold text-[#202A36]">
                  {buddy.name}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#37B77D]" />
              </div>
              <p className="text-[11px] text-[#77818D]">
                {buddy.role} · Onboarding Mentor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#77818D] hover:text-[#202A36] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F9FAFB]">
          <div className="text-center">
            <span className="text-[10px] text-[#77818D] bg-white px-2.5 py-1 rounded-full border border-[#E1E5E9]">
              Shift Pairing: {firstShiftInfo.day}, {firstShiftInfo.date}
            </span>
          </div>

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.sender === 'noa' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  msg.sender === 'noa'
                    ? 'bg-[#2F95F8] text-white rounded-br-none shadow-xs'
                    : 'bg-white text-[#202A36] border border-[#E1E5E9] rounded-bl-none shadow-xs'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-[#A0AEC0] mt-1 px-1">
                {msg.time}
              </span>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-white border-t border-[#E1E5E9] flex gap-1.5 overflow-x-auto text-[11px]">
          <button
            onClick={() =>
              setInputText(
                `Thank you ${buddy.name.split(' ')[0]}! Looking forward to it.`
              )
            }
            className="px-2.5 py-1 rounded-full bg-[#F6F7F8] hover:bg-[#EAF5FF] text-[#202A36] hover:text-[#2F95F8] border border-[#E1E5E9] whitespace-nowrap transition-colors"
          >
            Thank you! Looking forward to it 👍
          </button>
          <button
            onClick={() =>
              setInputText('Should I bring my own coffee apron?')
            }
            className="px-2.5 py-1 rounded-full bg-[#F6F7F8] hover:bg-[#EAF5FF] text-[#202A36] hover:text-[#2F95F8] border border-[#E1E5E9] whitespace-nowrap transition-colors"
          >
            Should I bring an apron?
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#E1E5E9] flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${buddy.name.split(' ')[0]}...`}
            className="flex-1 px-3 py-2 bg-[#F6F7F8] border border-transparent rounded-xl text-[13px] text-[#202A36] focus:bg-white focus:border-[#2F95F8] focus:outline-none transition-all"
          />
          <button
            onClick={handleSend}
            className="p-2 rounded-xl bg-[#2F95F8] text-white hover:bg-[#168FF5] transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
