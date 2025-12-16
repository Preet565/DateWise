import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Video, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

const Connect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { compatibilityResult } = useAppStore();

  useEffect(() => {
    if (!compatibilityResult) {
      navigate('/profile');
    }
  }, [compatibilityResult, navigate]);

  const handleStartChat = () => {
    toast({
      title: 'Chat Initiated',
      description: 'This is a demo. In the full version, you would begin a conversation here.',
    });
  };

  const handleScheduleCall = () => {
    toast({
      title: 'Call Request Sent',
      description: 'This is a demo. In the full version, you would schedule a call here.',
    });
  };

  if (!compatibilityResult) {
    return null;
  }

  const { matchedProfile } = compatibilityResult;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16">
          <button
            onClick={() => navigate('/results')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Results</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">DW</span>
            </div>
            <span className="font-semibold text-foreground">DateWise</span>
          </div>
          <div className="w-28" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
            Choose How to Connect
          </h1>
          <p className="text-muted-foreground text-center mb-8 max-w-md mx-auto">
            Based on compatibility insights, you may proceed to interact if you feel comfortable.
          </p>

          {/* Profile Summary */}
          <div className="bg-card rounded-2xl shadow-card p-4 mb-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Connecting with</p>
              <p className="font-semibold text-card-foreground">{matchedProfile.name}, {matchedProfile.age}</p>
            </div>
          </div>

          {/* Connection Options */}
          <div className="space-y-4">
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={handleStartChat}
              className="w-full bg-card rounded-2xl shadow-card p-6 text-left hover:shadow-card-hover transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-card-foreground mb-1">Start Chat</h2>
                  <p className="text-muted-foreground text-sm">
                    Begin a text-based conversation with this profile.
                  </p>
                </div>
              </div>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={handleScheduleCall}
              className="w-full bg-card rounded-2xl shadow-card p-6 text-left hover:shadow-card-hover transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Video className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-card-foreground mb-1">Schedule Call</h2>
                  <p className="text-muted-foreground text-sm">
                    Request a voice or video interaction at a mutually convenient time.
                  </p>
                </div>
              </div>
            </motion.button>
          </div>

          {/* Note */}
          <p className="text-sm text-muted-foreground text-center mt-8">
            These options are optional and user-initiated.
          </p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-4 border-t border-border bg-background">
        <div className="container">
          <p className="text-xs text-muted-foreground text-center max-w-lg mx-auto">
            DateWise provides compatibility insights for clarity and reflection. It does not replace real conversations or personal judgment.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Connect;
