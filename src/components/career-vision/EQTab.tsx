
import React from 'react';
import { Card } from '@/components/ui/card';
import { CircularProgressIndicator } from './ChartComponents';
import { eqLevelDescriptions } from './DataTypes';
import { Briefcase, Heart, Brain, Users, Star } from 'lucide-react';

interface EQTabProps {
  eqScore: number;
}

const EQTab: React.FC<EQTabProps> = ({ eqScore }) => {
  const eqLevel = eqScore < 25 ? "low" : eqScore < 35 ? "medium" : "high";
  
  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Your EQ Navigator Results</h2>
        <p className="text-muted-foreground">
          The EQ Navigator measures your emotional intelligence across different dimensions, including self-awareness, empathy, social skills, and emotional management.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48">
            <CircularProgressIndicator value={eqScore} max={40} size="lg" />
          </div>
          <p className="text-center mt-4 text-muted-foreground">
            EQ Score: <span className="font-semibold">{eqScore}/40</span>
          </p>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="max-w-xs">
            <img 
              src="/lovable-uploads/75c5f36e-61c3-4ec9-bdb0-96518285a821.png" 
              alt="EQ Navigator" 
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
      
      <Card className={`p-6 ${
        eqLevel === "high" ? "bg-green-50 border-green-200" :
        eqLevel === "medium" ? "bg-yellow-50 border-yellow-200" :
        "bg-red-50 border-red-200"
      } mb-8`}>
        <h3 className="text-xl font-semibold mb-2">
          {eqLevelDescriptions[eqLevel as keyof typeof eqLevelDescriptions].title}
        </h3>
        <p className="mb-4">
          {eqLevelDescriptions[eqLevel as keyof typeof eqLevelDescriptions].description}
        </p>
        <div>
          <h4 className="font-medium mb-2">Development Tips:</h4>
          <p className="text-sm">
            {eqLevelDescriptions[eqLevel as keyof typeof eqLevelDescriptions].tips}
          </p>
        </div>
      </Card>
      
      <h3 className="text-xl font-semibold mb-4">How EQ Benefits Your Career</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="p-5">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-red/10 flex items-center justify-center mr-3">
              <Users className="h-4 w-4 text-brand-red" />
            </div>
            <h4 className="font-medium">Leadership Potential</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            High emotional intelligence correlates with stronger leadership abilities, as it enables you to understand team dynamics, motivate others, and navigate workplace challenges.
          </p>
        </Card>
        
        <Card className="p-5">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center mr-3">
              <Heart className="h-4 w-4 text-brand-blue" />
            </div>
            <h4 className="font-medium">Team Collaboration</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            EQ helps you work effectively in teams, resolve conflicts, and build positive relationships with colleagues, clients, and stakeholders.
          </p>
        </Card>
        
        <Card className="p-5">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center mr-3">
              <Star className="h-4 w-4 text-brand-green" />
            </div>
            <h4 className="font-medium">Adaptability</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Strong emotional intelligence helps you adapt to change, manage stress, and remain resilient in the face of challenges and uncertainty.
          </p>
        </Card>
        
        <Card className="p-5">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-purple/10 flex items-center justify-center mr-3">
              <Brain className="h-4 w-4 text-brand-purple" />
            </div>
            <h4 className="font-medium">Decision Making</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            EQ supports better decision-making by helping you understand others' perspectives and consider the emotional implications of different choices.
          </p>
        </Card>
      </div>
    </>
  );
};

export default EQTab;
