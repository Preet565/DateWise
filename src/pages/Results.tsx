import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, ArrowRight, CheckCircle2, AlertCircle, XCircle, Lightbulb, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { findAlternativeMatch } from '@/lib/compatibilityEngine';

const Results = () => {
  const navigate = useNavigate();
  const { userProfile, compatibilityResult, isAnalyzing, setCompatibilityResult, setIsAnalyzing } = useAppStore();

  useEffect(() => {
    if (!userProfile.lookingFor && !isAnalyzing) {
      navigate('/profile');
    }
  }, [userProfile, isAnalyzing, navigate]);

  const handleExploreAnother = async () => {
    if (!compatibilityResult) return;
    
    setIsAnalyzing(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const newResult = findAlternativeMatch(userProfile, compatibilityResult.matchedProfile.id);
    setCompatibilityResult(newResult);
    setIsAnalyzing(false);
  };

  const handleProceed = () => {
    navigate('/connect');
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="container flex items-center justify-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">DW</span>
              </div>
              <span className="font-semibold text-foreground">DateWise</span>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"
            />
            <h2 className="text-xl font-semibold text-foreground mb-2">Analyzing Compatibility</h2>
            <p className="text-muted-foreground">Finding the most compatible profile for you...</p>
          </motion.div>
        </main>
      </div>
    );
  }

  if (!compatibilityResult) {
    return null;
  }

  const { matchedProfile, score, whySelected, greenSignals, yellowSignals, redSignals, suggestion } = compatibilityResult;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Edit Profile</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">DW</span>
            </div>
            <span className="font-semibold text-foreground">DateWise</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            Compatibility Overview
          </h1>

          {/* Profile Card */}
          <div className="bg-card rounded-2xl shadow-card p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    Most Compatible Profile
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-card-foreground">
                  {matchedProfile.name}, {matchedProfile.age}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">{matchedProfile.bio}</p>
              </div>
            </div>
          </div>

          {/* Score */}
          <div className="bg-card rounded-2xl shadow-card p-6 mb-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Overall Compatibility Score</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-5xl font-bold text-primary">{score}</span>
              <span className="text-2xl text-muted-foreground">/10</span>
            </div>
          </div>

          {/* Why Selected */}
          <div className="bg-card rounded-2xl shadow-card p-6 mb-6">
            <h3 className="font-semibold text-card-foreground mb-3">Why this profile was selected</h3>
            <p className="text-muted-foreground">{whySelected}</p>
          </div>

          {/* Signals */}
          <div className="space-y-4 mb-6">
            {/* Green Signals */}
            {greenSignals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-success/10 rounded-2xl p-6 border border-success/20"
              >
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <h3 className="font-semibold text-success">Green Signals</h3>
                </div>
                <ul className="space-y-2">
                  {greenSignals.map((signal, index) => (
                    <li key={index} className="text-foreground text-sm flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 flex-shrink-0" />
                      {signal}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Yellow Signals */}
            {yellowSignals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-warning/10 rounded-2xl p-6 border border-warning/20"
              >
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  <h3 className="font-semibold text-warning">Yellow Signals</h3>
                </div>
                <ul className="space-y-2">
                  {yellowSignals.map((signal, index) => (
                    <li key={index} className="text-foreground text-sm flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 flex-shrink-0" />
                      {signal}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Red Signals */}
            {redSignals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-destructive/10 rounded-2xl p-6 border border-destructive/20"
              >
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="w-5 h-5 text-destructive" />
                  <h3 className="font-semibold text-destructive">Red Signals</h3>
                </div>
                <ul className="space-y-2">
                  {redSignals.map((signal, index) => (
                    <li key={index} className="text-foreground text-sm flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 flex-shrink-0" />
                      {signal}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Suggestion */}
          <div className="bg-accent rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-accent-foreground mt-0.5" />
              <div>
                <h3 className="font-semibold text-accent-foreground mb-1">Suggestion</h3>
                <p className="text-foreground text-sm">{suggestion}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleExploreAnother}
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4" />
              Explore Another Profile
            </Button>
            <Button
              variant="hero"
              size="lg"
              onClick={handleProceed}
              className="flex-1"
            >
              Proceed to Connect
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Note */}
          <p className="text-sm text-muted-foreground text-center mt-6">
            You choose whether to proceed. This tool provides insights, not decisions.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Results;
