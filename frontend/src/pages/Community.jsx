import React from 'react';
import { MessageSquare, Heart, Share2, Award } from 'lucide-react';

const Community = () => {
  const posts = [
    {
      id: 1,
      author: 'Sarah Jenkins',
      avatar: 'SJ',
      role: 'Top Contributor',
      time: '2 hours ago',
      content: 'Just discovered that if you wrap celery in aluminum foil before putting it in the fridge, it lasts up to 4 weeks! No more limp celery for my soups! 🥬✨',
      likes: 45,
      comments: 12,
      tags: ['#StorageHack', '#Vegetables', '#ZeroWaste']
    },
    {
      id: 2,
      author: 'Mike Chen',
      avatar: 'MC',
      role: 'Eco Chef',
      time: '5 hours ago',
      content: 'Made an incredible pesto using carrot tops instead of basil today. Don\'t throw away those greens! Mixed with some walnuts and parmesan, it was perfect.',
      likes: 128,
      comments: 34,
      tags: ['#RecipeShare', '#RootToStem', '#Cooking']
    },
    {
      id: 3,
      author: 'Emma Wilson',
      avatar: 'EW',
      role: 'Member',
      time: '1 day ago',
      content: 'I managed to reduce my monthly food waste to absolute zero this month using this app! Thank you to everyone for the amazing recipes for overripe bananas.',
      likes: 89,
      comments: 8,
      tags: ['#Milestone', '#Success', '#AntiGaspi']
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight m-0">Community</h1>
          <p className="text-muted-foreground mt-1">Share tips, recipes, and success stories.</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity">
          Create Post
        </button>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                  {post.avatar}
                </div>
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    {post.author}
                    {post.role !== 'Member' && (
                      <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Award size={10} /> {post.role}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-muted-foreground">{post.time}</p>
                </div>
              </div>
            </div>
            
            <p className="text-foreground/90 leading-relaxed mb-4">
              {post.content}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-6 pt-4 border-t border-border/50 text-muted-foreground">
              <button className="flex items-center gap-2 hover:text-warning transition-colors">
                <Heart size={18} /> <span>{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-primary transition-colors">
                <MessageSquare size={18} /> <span>{post.comments}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-foreground transition-colors ml-auto">
                <Share2 size={18} /> <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
