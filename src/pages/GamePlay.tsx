import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Trophy, Clock, Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GamePlay = () => {
  const [currentRound, setCurrentRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answer, setAnswer] = useState("");
  const [teamScore, setTeamScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wagerAmount, setWagerAmount] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const teamName = localStorage.getItem("teamName") || "Unknown Team";

  // Round configurations
  const rounds = [
    { number: 1, points: 1, questions: 5, name: "Round 1" },
    { number: 2, points: 2, questions: 5, name: "Round 2" },
    { number: 3, points: 3, questions: 5, name: "Round 3" },
    { number: 4, points: 0, questions: 1, name: "Final Question" }
  ];

  const currentRoundConfig = rounds[currentRound - 1];
  const isFinalQuestion = currentRound === 4;

  useEffect(() => {
    if (!localStorage.getItem("teamName")) {
      navigate("/");
      return;
    }

    // Timer countdown
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isSubmitted, navigate]);

  const submitAnswer = () => {
    if (isFinalQuestion && !wagerAmount) {
      toast({
        title: "Wager Required",
        description: "Please enter your wager for the final question.",
        variant: "destructive",
      });
      return;
    }

    if (!answer.trim() && !isFinalQuestion) {
      toast({
        title: "Answer Required",
        description: "Please enter your answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitted(true);
    
    // Simulate scoring (in real app, this would be handled by host)
    const pointsEarned = Math.random() > 0.5 ? currentRoundConfig.points : 0;
    setTeamScore(prev => prev + pointsEarned);

    toast({
      title: "Answer Submitted!",
      description: `Your answer has been recorded for ${currentRoundConfig.name}.`,
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < currentRoundConfig.questions) {
      setCurrentQuestion(prev => prev + 1);
      setAnswer("");
      setIsSubmitted(false);
      setTimeLeft(60);
    } else if (currentRound < 4) {
      setCurrentRound(prev => prev + 1);
      setCurrentQuestion(1);
      setAnswer("");
      setIsSubmitted(false);
      setTimeLeft(60);
    } else {
      // Game complete
      navigate("/results");
    }
  };

  const reportCheat = () => {
    toast({
      title: "Cheat Report Submitted",
      description: "Host has been notified of suspected cheating.",
      variant: "destructive",
    });
  };

  if (!localStorage.getItem("teamName")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{teamName}</h1>
            <p className="text-muted-foreground">Current Score: {teamScore} points</p>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {currentRoundConfig.name}
          </Badge>
        </div>

        {/* Question Card */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent" />
                Question {currentQuestion} of {currentRoundConfig.questions}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className={`font-mono ${timeLeft <= 10 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-accent text-accent-foreground">
                {isFinalQuestion ? "Wager Question" : `${currentRoundConfig.points} point${currentRoundConfig.points !== 1 ? 's' : ''}`}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Question Display */}
            <div className="bg-secondary/50 p-4 rounded-lg">
              <p className="text-center text-muted-foreground text-lg">
                {isFinalQuestion 
                  ? "🎯 FINAL QUESTION: Wait for host to reveal the question..."
                  : "📋 Wait for host to reveal the question..."}
              </p>
            </div>

            {/* Wager Input (Final Question Only) */}
            {isFinalQuestion && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Enter Your Wager (0 to {teamScore} points):
                </label>
                <Input
                  type="number"
                  placeholder="Enter wager amount..."
                  value={wagerAmount}
                  onChange={(e) => setWagerAmount(e.target.value)}
                  min="0"
                  max={teamScore}
                  className="text-lg p-3 h-12"
                  disabled={isSubmitted}
                />
              </div>
            )}

            {/* Answer Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Your Answer:
              </label>
              <Input
                type="text"
                placeholder="Enter your answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="text-lg p-3 h-12"
                disabled={isSubmitted}
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {!isSubmitted ? (
                <Button 
                  onClick={submitAnswer}
                  className="w-full h-12 text-lg font-semibold bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={timeLeft === 0}
                >
                  Submit Answer
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-success/20 border border-success/30 rounded-lg p-3 text-center">
                    <p className="text-success font-medium">Answer submitted! Waiting for next question...</p>
                  </div>
                  <Button 
                    onClick={nextQuestion}
                    variant="outline"
                    className="w-full h-12 text-lg"
                  >
                    {currentQuestion < currentRoundConfig.questions 
                      ? "Next Question" 
                      : currentRound < 4 
                        ? "Next Round" 
                        : "View Results"}
                  </Button>
                </div>
              )}

              {/* Cheat Report Button */}
              <Button 
                onClick={reportCheat}
                variant="destructive"
                className="w-full h-10 text-sm"
              >
                <Flag className="h-4 w-4 mr-2" />
                Report Suspected Cheating
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Game Progress */}
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="grid grid-cols-4 gap-2">
              {rounds.map((round) => (
                <div 
                  key={round.number}
                  className={`text-center p-2 rounded-lg border ${
                    currentRound === round.number 
                      ? 'border-accent bg-accent/20' 
                      : currentRound > round.number 
                        ? 'border-success bg-success/20' 
                        : 'border-border bg-card'
                  }`}
                >
                  <div className="text-sm font-medium">{round.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {round.number < 4 ? `${round.points}pt each` : 'Wager'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GamePlay;