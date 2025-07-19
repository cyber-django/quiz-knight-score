import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Home, RotateCcw } from "lucide-react";

const Results = () => {
  const [teamScore] = useState(localStorage.getItem("teamScore") || "0");
  const [teamName] = useState(localStorage.getItem("teamName") || "Unknown Team");
  const navigate = useNavigate();

  // Mock leaderboard data
  const finalLeaderboard = [
    { name: "Know-It-Alls", score: 24, position: 1 },
    { name: teamName, score: parseInt(teamScore), position: 2 },
    { name: "Quiz Masters", score: 19, position: 3 },
    { name: "Brain Trust", score: 16, position: 4 },
    { name: "Trivia Titans", score: 14, position: 5 },
  ].sort((a, b) => b.score - a.score).map((team, index) => ({ ...team, position: index + 1 }));

  const userTeam = finalLeaderboard.find(team => team.name === teamName);
  const userPosition = userTeam?.position || 0;

  useEffect(() => {
    if (!localStorage.getItem("teamName")) {
      navigate("/");
    }
  }, [navigate]);

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-amber-600" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-lg font-bold">#{position}</span>;
    }
  };

  const getPositionMessage = (position: number) => {
    switch (position) {
      case 1: return "🎉 Congratulations! You're the Trivia Champions!";
      case 2: return "🥈 Excellent work! Second place finish!";
      case 3: return "🥉 Great job! Third place podium finish!";
      case 4:
      case 5: return "👏 Well played! Thanks for participating!";
      default: return "Thanks for playing Pub Trivia!";
    }
  };

  const playAgain = () => {
    localStorage.removeItem("teamScore");
    navigate("/game");
  };

  const newGame = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Game Complete!</h1>
          <p className="text-xl text-muted-foreground">Final Results</p>
        </div>

        {/* User Team Result */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Team: {teamName}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              {getPositionIcon(userPosition)}
              <div>
                <div className="text-3xl font-bold text-accent">{teamScore} Points</div>
                <div className="text-lg text-muted-foreground">Final Score</div>
              </div>
            </div>
            <div className="bg-accent/20 border border-accent/30 rounded-lg p-4">
              <p className="text-lg font-medium text-foreground">
                {getPositionMessage(userPosition)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Final Leaderboard */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              Final Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {finalLeaderboard.map((team) => (
                <div 
                  key={team.name}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    team.name === teamName 
                      ? 'border-accent bg-accent/20' 
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {getPositionIcon(team.position)}
                    <div>
                      <div className={`font-medium ${team.name === teamName ? 'text-accent' : 'text-foreground'}`}>
                        {team.name}
                        {team.name === teamName && (
                          <Badge className="ml-2 bg-accent text-accent-foreground">You</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Position #{team.position}
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {team.score}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-accent">3</div>
              <div className="text-sm text-muted-foreground">Rounds Completed</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-accent">16</div>
              <div className="text-sm text-muted-foreground">Questions Answered</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-accent">{finalLeaderboard.length}</div>
              <div className="text-sm text-muted-foreground">Teams Participated</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={playAgain}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Play Another Round
          </Button>
          <Button 
            onClick={newGame}
            variant="outline"
          >
            <Home className="h-4 w-4 mr-2" />
            New Game
          </Button>
        </div>

        {/* Thank You Message */}
        <Card className="border-border">
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Thanks for Playing Pub Trivia!
            </h3>
            <p className="text-muted-foreground">
              We hope you had a great time testing your knowledge. 
              Come back next week for another exciting trivia night!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Results;