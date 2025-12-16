import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { findBestMatch } from '@/lib/compatibilityEngine';

interface Question {
  id: keyof Omit<import('@/lib/store').UserProfile, 'nonNegotiable'> | 'nonNegotiable';
  title: string;
  options?: { value: string; label: string }[];
  type: 'choice' | 'text';
}

const questions: Question[] = [
  {
    id: 'lookingFor',
    title: 'What are you looking for right now?',
    type: 'choice',
    options: [
      { value: 'casual', label: 'Casual' },
      { value: 'serious', label: 'Serious' },
      { value: 'not-sure', label: 'Not sure' },
    ],
  },
  {
    id: 'communicationStyle',
    title: 'How do you usually communicate?',
    type: 'choice',
    options: [
      { value: 'text-a-lot', label: 'Text a lot' },
      { value: 'balanced', label: 'Balanced' },
      { value: 'only-when-needed', label: 'Only when needed' },
    ],
  },
  {
    id: 'conflictHandling',
    title: 'How do you handle conflict?',
    type: 'choice',
    options: [
      { value: 'talk-immediately', label: 'Talk it out immediately' },
      { value: 'take-time', label: 'Take time then talk' },
      { value: 'avoid', label: 'Avoid' },
    ],
  },
  {
    id: 'corePriority',
    title: 'What matters most to you in a connection?',
    type: 'choice',
    options: [
      { value: 'trust', label: 'Trust' },
      { value: 'fun', label: 'Fun' },
      { value: 'stability', label: 'Stability' },
      { value: 'growth', label: 'Growth' },
    ],
  },
  {
    id: 'nonNegotiable',
    title: 'One thing you cannot compromise on',
    type: 'text',
  },
];

const Profile = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const { userProfile, setUserProfile, setCompatibilityResult, setIsAnalyzing } = useAppStore();

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleSelect = (value: string) => {
    setUserProfile({ [currentQuestion.id]: value });
  };

  const handleTextChange = (value: string) => {
    setUserProfile({ nonNegotiable: value });
  };

  const getCurrentValue = () => {
    return userProfile[currentQuestion.id as keyof typeof userProfile];
  };

  const canProceed = () => {
    const value = getCurrentValue();
    if (currentQuestion.type === 'text') {
      return typeof value === 'string' && value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    navigate('/results');
    
    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const result = findBestMatch(userProfile);
    setCompatibilityResult(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-16">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">DW</span>
            </div>
            <span className="font-semibold text-foreground">DateWise</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-muted">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <span className="text-sm text-muted-foreground font-medium">
              Question {currentStep + 1} of {questions.length}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                {currentQuestion.title}
              </h1>

              {currentQuestion.type === 'choice' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const isSelected = getCurrentValue() === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleSelect(option.value)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border bg-card hover:border-primary/50 hover:bg-accent/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-medium ${
                              isSelected ? 'text-primary' : 'text-card-foreground'
                            }`}
                          >
                            {option.label}
                          </span>
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-4 h-4 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'text' && (
                <div>
                  <Input
                    value={(getCurrentValue() as string) || ''}
                    onChange={(e) => handleTextChange(e.target.value)}
                    placeholder="e.g., Honesty in all situations"
                    className="h-14 text-base px-4"
                    maxLength={100}
                  />
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Keep it brief and specific
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex justify-center">
            <Button
              variant="hero"
              size="lg"
              onClick={handleNext}
              disabled={!canProceed()}
              className="min-w-[200px]"
            >
              {currentStep === questions.length - 1 ? 'Continue' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
