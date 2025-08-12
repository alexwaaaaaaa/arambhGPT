'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMoodTracking } from './useMoodTracking';
import { apiClient } from '@/lib/api';

interface AIContext {
  userId: string;
  recentMoods: Array<{
    date: string;
    mood: number;
    emotions: string[];
  }>;
  preferences: {
    communicationStyle: 'formal' | 'casual' | 'empathetic';
    language: 'english' | 'hindi' | 'hinglish';
    topics: string[];
  };
  conversationHistory: Array<{
    topic: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    timestamp: string;
  }>;
  personalInsights: {
    stressors: string[];
    copingMechanisms: string[];
    goals: string[];
  };
}

interface UseAIContextReturn {
  context: AIContext | null;
  updateContext: (updates: Partial<AIContext>) => Promise<void>;
  getPersonalizedPrompt: (userMessage: string) => Promise<string>;
  analyzeMessage: (message: string) => Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    topics: string[];
    urgency: 'low' | 'medium' | 'high';
  }>;
}

export function useAIContext(): UseAIContextReturn {
  const { user } = useAuth();
  const { moodHistory, todaysMood } = useMoodTracking();
  const [context, setContext] = useState<AIContext | null>(null);

  // Load AI context from API
  const loadContext = useCallback(async () => {
    if (!user || !apiClient.isAuthenticated()) return;

    try {
      const data = await apiClient.getAIContext();
      
      const apiContext: AIContext = {
        userId: user.id,
        recentMoods: moodHistory.slice(-7).map(entry => ({
          date: entry.date,
          mood: entry.mood,
          emotions: entry.emotions
        })),
        preferences: {
          communicationStyle: data.communication_style as 'formal' | 'casual' | 'empathetic',
          language: data.language as 'english' | 'hindi' | 'hinglish',
          topics: data.topics || []
        },
        conversationHistory: [],
        personalInsights: {
          stressors: data.stressors || [],
          copingMechanisms: data.coping_mechanisms || [],
          goals: data.goals || []
        }
      };
      
      setContext(apiContext);
    } catch (err) {
      console.error('Failed to load AI context from API:', err);
      
      // Fallback to localStorage
      try {
        const savedContext = localStorage.getItem(`ai-context-${user.id}`);
        if (savedContext) {
          setContext(JSON.parse(savedContext));
        } else {
          // Initialize default context
          const defaultContext: AIContext = {
            userId: user.id,
            recentMoods: [],
            preferences: {
              communicationStyle: 'empathetic',
              language: 'hinglish',
              topics: []
            },
            conversationHistory: [],
            personalInsights: {
              stressors: [],
              copingMechanisms: [],
              goals: []
            }
          };
          setContext(defaultContext);
        }
      } catch (localError) {
        console.error('Failed to load from localStorage:', localError);
      }
    }
  }, [user, moodHistory]);

  // Save context to localStorage
  const saveContext = useCallback((newContext: AIContext) => {
    if (!user) return;
    localStorage.setItem(`ai-context-${user.id}`, JSON.stringify(newContext));
  }, [user]);

  // Update context
  const updateContext = useCallback(async (updates: Partial<AIContext>) => {
    if (!context) return;

    try {
      const updatedContext = { ...context, ...updates };
      
      // Update API if preferences changed
      if (updates.preferences || updates.personalInsights) {
        const apiData = {
          communication_style: updatedContext.preferences.communicationStyle,
          language: updatedContext.preferences.language,
          topics: updatedContext.preferences.topics,
          stressors: updatedContext.personalInsights.stressors,
          coping_mechanisms: updatedContext.personalInsights.copingMechanisms,
          goals: updatedContext.personalInsights.goals
        };

        await apiClient.updateAIContext(apiData);
      }
      
      setContext(updatedContext);
      saveContext(updatedContext);
    } catch (err) {
      console.error('Failed to update AI context:', err);
      
      // Update locally anyway for better UX
      const updatedContext = { ...context, ...updates };
      setContext(updatedContext);
      saveContext(updatedContext);
    }
  }, [context, saveContext]);

  // Analyze message sentiment and topics
  const analyzeMessage = useCallback(async (message: string) => {
    try {
      const analysis = await apiClient.analyzeMessage(message);
      return {
        sentiment: analysis.sentiment as 'positive' | 'negative' | 'neutral',
        topics: analysis.topics,
        urgency: analysis.urgency as 'low' | 'medium' | 'high'
      };
    } catch (err) {
      console.error('Failed to analyze message via API:', err);
      
      // Fallback to local analysis
      const lowerMessage = message.toLowerCase();
      
      // Simple sentiment analysis
      const positiveWords = ['happy', 'good', 'great', 'excellent', 'wonderful', 'amazing', 'better', 'khush', 'accha', 'badhiya'];
      const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'worse', 'depressed', 'anxious', 'udas', 'bura', 'pareshaan'];
      
      const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
      const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
      
      let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
      if (positiveCount > negativeCount) sentiment = 'positive';
      else if (negativeCount > positiveCount) sentiment = 'negative';

      // Topic extraction
      const topicKeywords = {
        work: ['work', 'job', 'office', 'boss', 'colleague', 'kaam', 'naukri'],
        family: ['family', 'parents', 'mother', 'father', 'sister', 'brother', 'ghar', 'maa', 'papa'],
        health: ['health', 'sick', 'doctor', 'medicine', 'sehat', 'bimari'],
        relationships: ['friend', 'relationship', 'love', 'partner', 'dost', 'pyaar'],
        stress: ['stress', 'pressure', 'tension', 'worried', 'chinta', 'pareshani']
      };

      const topics = Object.entries(topicKeywords)
        .filter(([_, keywords]) => keywords.some(keyword => lowerMessage.includes(keyword)))
        .map(([topic]) => topic);

      // Urgency detection
      const urgentWords = ['emergency', 'crisis', 'help', 'urgent', 'suicide', 'harm', 'danger'];
      const urgency: 'low' | 'medium' | 'high' = urgentWords.some(word => lowerMessage.includes(word)) ? 'high' : 
                     negativeCount > 2 ? 'medium' : 'low';

      return { sentiment, topics, urgency };
    }
  }, []);

  // Generate personalized prompt for AI
  const getPersonalizedPrompt = useCallback(async (userMessage: string): Promise<string> => {
    if (!context) return userMessage;

    const analysis = await analyzeMessage(userMessage);
    
    let systemPrompt = `You are ArambhGPT, a compassionate AI mental health companion. `;
    
    // Add mood context
    if (todaysMood) {
      systemPrompt += `The user's current mood is ${todaysMood.mood}/5 with emotions: ${todaysMood.emotions.join(', ')}. `;
    }

    // Add recent mood trends
    if (context.recentMoods.length > 0) {
      const recentAvg = context.recentMoods.reduce((sum, m) => sum + m.mood, 0) / context.recentMoods.length;
      systemPrompt += `Their recent mood average is ${recentAvg.toFixed(1)}/5. `;
    }

    // Add communication style
    switch (context.preferences.communicationStyle) {
      case 'formal':
        systemPrompt += `Use a professional, respectful tone. `;
        break;
      case 'casual':
        systemPrompt += `Use a friendly, casual tone. `;
        break;
      case 'empathetic':
        systemPrompt += `Use a warm, empathetic, and understanding tone. `;
        break;
    }

    // Add language preference
    switch (context.preferences.language) {
      case 'hindi':
        systemPrompt += `Respond primarily in Hindi. `;
        break;
      case 'hinglish':
        systemPrompt += `You can mix Hindi and English (Hinglish) naturally. `;
        break;
      default:
        systemPrompt += `Respond in English, but feel free to use Hindi words when appropriate. `;
    }

    // Add urgency context
    if (analysis.urgency === 'high') {
      systemPrompt += `IMPORTANT: The user seems to be in distress. Provide immediate support and consider suggesting professional help. `;
    }

    // Add personal insights
    if (context.personalInsights.stressors.length > 0) {
      systemPrompt += `Known stressors: ${context.personalInsights.stressors.join(', ')}. `;
    }

    if (context.personalInsights.copingMechanisms.length > 0) {
      systemPrompt += `Effective coping mechanisms: ${context.personalInsights.copingMechanisms.join(', ')}. `;
    }

    // Add conversation history context
    const recentTopics = context.conversationHistory.slice(-3).map(h => h.topic);
    if (recentTopics.length > 0) {
      systemPrompt += `Recent conversation topics: ${recentTopics.join(', ')}. `;
    }

    systemPrompt += `\n\nUser message: ${userMessage}`;

    return systemPrompt;
  }, [context, todaysMood, analyzeMessage]);

  // Update context with mood data
  useEffect(() => {
    if (context && moodHistory.length > 0) {
      const recentMoods = moodHistory.slice(-7).map(entry => ({
        date: entry.date,
        mood: entry.mood,
        emotions: entry.emotions
      }));

      // Only update if recentMoods actually changed
      const currentRecentMoods = context.recentMoods || [];
      if (JSON.stringify(currentRecentMoods) !== JSON.stringify(recentMoods)) {
        updateContext({ recentMoods });
      }
    }
  }, [moodHistory, context?.recentMoods]); // Removed updateContext from dependencies

  // Load context on mount
  useEffect(() => {
    if (user && apiClient.isAuthenticated()) {
      loadContext();
    }
  }, [user, loadContext]);

  return {
    context,
    updateContext,
    getPersonalizedPrompt,
    analyzeMessage
  };
}