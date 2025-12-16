import { motion } from 'framer-motion';
import { ArrowRight, Shield, Brain, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Understand compatibility through values and communication styles, not surface-level attributes.',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data stays with you. We analyze, explain, and let you decide.',
    },
    {
      icon: Heart,
      title: 'User-Driven',
      description: 'Connection is always optional and initiated by you. No pressure, no surprises.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">DW</span>
            </div>
            <span className="font-semibold text-foreground">DateWise</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-16">
        <section className="gradient-hero min-h-[calc(100vh-4rem)] flex items-center">
          <div className="container py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
                DateWise
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-medium">
                Before you match, understand compatibility.
              </p>
              <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                A clarity tool that explains compatibility using values and communication styles — not appearances.
              </p>
              <Button
                variant="hero"
                size="xl"
                onClick={() => navigate('/profile')}
                className="group"
              >
                Start Compatibility Check
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Simple, transparent, and respectful of your autonomy.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-12 text-center">
                The Process
              </h2>

              <div className="space-y-8">
                {[
                  { step: '01', title: 'Share Your Values', description: 'Answer 5 simple questions about what matters to you.' },
                  { step: '02', title: 'AI Analysis', description: 'Our system finds the most compatible profile from our database.' },
                  { step: '03', title: 'Understand Results', description: 'Get clear explanations with green, yellow, and red signals.' },
                  { step: '04', title: 'Your Choice', description: 'Decide whether to proceed or explore other options.' },
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex gap-6 items-start"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">{item.step}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container">
          <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto">
            DateWise provides compatibility insights for clarity and reflection. It does not replace real conversations or personal judgment.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
