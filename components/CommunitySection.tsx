
import React, { useState } from 'react';
import { MessageCircle, Heart, Share2, Users, Trophy } from 'lucide-react';

const POSTS = [
  {
    id: 1,
    user: 'Sarah Miller',
    role: 'Student',
    time: '2h ago',
    content: 'Just finished Module 2! The city vocabulary was so fun. Does anyone want to practice speaking tonight?',
    likes: 12,
    comments: 4
  },
  {
    id: 2,
    user: 'Prof. Ana García',
    role: 'Teacher',
    time: '5h ago',
    content: 'Tip of the day: In Spanish, we use "Ser" for permanent things and "Estar" for temporary locations or states. Remember: "How you feel and where you are, always use the verb Estar!"',
    likes: 45,
    comments: 8
  }
];

export const CommunitySection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
           <div className="flex gap-4">
              <img src="https://picsum.photos/seed/me/100/100" className="w-12 h-12 rounded-full border-2 border-spanish-yellow" />
              <textarea 
                placeholder="Share a tip, a doubt, or your progress with the community..."
                className="flex-1 bg-gray-50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-spanish-yellow transition-all border-none resize-none h-24"
              ></textarea>
           </div>
           <div className="flex justify-end mt-4">
              <button className="bg-spanish-gold text-white px-8 py-2.5 rounded-full font-brand font-bold text-sm uppercase tracking-widest shadow-lg shadow-yellow-100">
                Post Now
              </button>
           </div>
        </div>

        {POSTS.map(post => (
          <div key={post.id} className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-50 hover:border-spanish-gold transition-all group">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                   <img src={`https://picsum.photos/seed/${post.user}/100/100`} className="w-14 h-14 rounded-2xl border-2 border-gray-50" />
                   <div>
                      <h4 className="font-brand font-black text-gray-800">{post.user}</h4>
                      <div className="flex items-center gap-2">
                         <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${post.role === 'Teacher' ? 'bg-spanish-gold text-white' : 'bg-spanish-gold/20 text-spanish-gold'}`}>
                           {post.role}
                         </span>
                         <span className="text-[10px] text-gray-400 font-bold uppercase">{post.time}</span>
                      </div>
                   </div>
                </div>
                <button className="text-gray-300 hover:text-spanish-gold"><Share2 size={18} /></button>
             </div>
             <p className="text-gray-600 leading-relaxed mb-8">{post.content}</p>
             <div className="flex items-center gap-6 border-t border-gray-50 pt-6">
                <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">
                   <Heart size={18} /> {post.likes} Likes
                </button>
                <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-spanish-gold transition-colors">
                   <MessageCircle size={18} /> {post.comments} Comments
                </button>
             </div>
          </div>
        ))}
      </div>

      <div className="space-y-8">
         <div className="bg-gradient-to-br from-spanish-red to-spanish-gold p-8 rounded-[2.5rem] text-white shadow-2xl">
            <h3 className="font-brand font-black text-2xl mb-2 flex items-center gap-3">
               <Trophy /> Hall of Fame
            </h3>
            <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-6">Weekly Top Learners</p>
            <div className="space-y-4">
               {[1,2,3].map(i => (
                 <div key={i} className="flex items-center justify-between bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-3">
                       <span className="font-black italic opacity-50 text-xl">{i}</span>
                       <img src={`https://picsum.photos/seed/top${i}/50/50`} className="w-10 h-10 rounded-full border-2 border-white/20" />
                       <span className="font-bold text-sm">User_{i*42}</span>
                    </div>
                    <span className="text-xs font-black">{1200 - i*100} XP</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl">
            <h4 className="font-brand font-black text-gray-800 mb-6 flex items-center gap-3">
               <Users size={20} className="text-spanish-gold" /> Online Now
            </h4>
            <div className="flex flex-wrap gap-3">
               {[...Array(8)].map((_, i) => (
                 <div key={i} className="relative">
                    <img src={`https://picsum.photos/seed/online${i}/100/100`} className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};