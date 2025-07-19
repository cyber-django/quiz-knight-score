import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Trophy, 
  AlertTriangle, 
  Play, 
  Pause, 
  SkipForward,
  Flag,
  Settings,
  Timer
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Team {
  id: string;
  name: string;
  score: number;
  answers: string[];
  lastSubmitted: Date;
}

interface CheatReport {
  id: string;
  reporterTeam: string;
  suspectedTeam: string;
  round: number;
  question: number;
  timestamp: Date;
}

const HostDashboard = () => {
  const [teams, setTeams] = useState<Team[]>([
    { id: "1", name: "Quiz Masters", score: 15, answers: [], lastSubmitted: new Date() },
    { id: "2", name: "Brain Trust", score: 12, answers: [], lastSubmitted: new Date() },
    { id: "3", name: "Know-It-Alls", score: 18, answers: [], lastSubmitted: new Date() },
    { id: "4", name: "Trivia Titans", score: 9, answers: [], lastSubmitted: new Date() },
  ]);
  
  const [cheatReports, setCheatReports] = useState<CheatReport[]>([
    {
      id: "1",
      reporterTeam: "Quiz Masters",
      suspectedTeam: "Brain Trust",
      round: 2,
      question: 3,
      timestamp: new Date(Date.now() - 300000)
    }
  ]);

  const [currentRound, setCurrentRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'active' | 'paused'>('waiting');
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedTeamScore, setSelectedTeamScore] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");

  const { toast } = useToast();

  const rounds = [
    { number: 1, points: 1, questions: 5, name: "Round 1" },
    { number: 2, points: 2, questions: 5, name: "Round 2" },
    { number: 3, points: 3, questions: 5, name: "Round 3" },
    { number: 4, points: 0, questions: 1, name: "Final Question" }
  ];

  const currentRoundConfig = rounds[currentRound - 1];
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  useEffect(() => {
    if (gameStatus === 'active' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, gameStatus]);

  const startQuestion = () => {
    setGameStatus('active');
    setTimeLeft(60);
    toast({
      title: "Question Started",
      description: `Round ${currentRound}, Question ${currentQuestion} is now active.`,
    });
  };

  const pauseGame = () => {
    setGameStatus('paused');
    toast({
      title: "Game Paused",
      description: "Teams can no longer submit answers.",
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < currentRoundConfig.questions) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentRound < 4) {
      setCurrentRound(prev => prev + 1);
      setCurrentQuestion(1);
    }
    setGameStatus('waiting');
    setTimeLeft(60);
  };

  const adjustTeamScore = (teamId: string, newScore: number) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId ? { ...team, score: Math.max(0, newScore) } : team
    ));
    toast({
      title: "Score Updated",
      description: "Team score has been manually adjusted.",
    });
  };

  const dismissCheatReport = (reportId: string) => {
    setCheatReports(prev => prev.filter(report => report.id !== reportId));
    toast({
      title: "Report Dismissed",
      description: "Cheat report has been removed.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Host Dashboard</h1>
            <p className="text-muted-foreground">Pub Trivia Game Control</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {currentRoundConfig.name} - Q{currentQuestion}
          </Badge>
        </div>

        {/* Game Controls */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-accent" />
              Game Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  <span className={`font-mono text-xl ${timeLeft <= 10 ? 'text-destructive' : 'text-foreground'}`}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Time Remaining</div>
              </div>
              
              <div className="flex gap-2">
                {gameStatus === 'waiting' ? (
                  <Button onClick={startQuestion} className="bg-success hover:bg-success/90">
                    <Play className="h-4 w-4 mr-2" />
                    Start Question
                  </Button>
                ) : (
                  <Button onClick={pauseGame} variant="destructive">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                )}
                <Button onClick={nextQuestion} variant="outline">
                  <SkipForward className="h-4 w-4 mr-2" />
                  Next
                </Button>
              </div>

              <div className="text-right">
                <div className="text-xl font-bold text-accent">{teams.length}</div>
                <div className="text-sm text-muted-foreground">Active Teams</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leaderboard */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent" />
                Live Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedTeams.map((team, index) => (
                  <div 
                    key={team.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      index === 0 ? 'border-accent bg-accent/10' : 'border-border bg-card'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'
                      }`}>
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{team.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Last active: {team.lastSubmitted.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xl font-bold text-foreground">{team.score}</div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => adjustTeamScore(team.id, team.score + 1)}
                        >
                          +1
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => adjustTeamScore(team.id, team.score - 1)}
                        >
                          -1
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cheat Reports */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-destructive" />
                Cheat Reports
                {cheatReports.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {cheatReports.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cheatReports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No cheat reports</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cheatReports.map((report) => (
                    <div 
                      key={report.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-destructive/30 bg-destructive/10"
                    >
                      <div>
                        <div className="font-medium text-foreground">
                          {report.reporterTeam} reported {report.suspectedTeam}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Round {report.round}, Q{report.question} • {report.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => dismissCheatReport(report.id)}
                      >
                        Dismiss
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Round Progress */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Game Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {rounds.map((round) => (
                <div 
                  key={round.number}
                  className={`text-center p-4 rounded-lg border ${
                    currentRound === round.number 
                      ? 'border-accent bg-accent/20' 
                      : currentRound > round.number 
                        ? 'border-success bg-success/20' 
                        : 'border-border bg-card'
                  }`}
                >
                  <div className="text-lg font-bold">{round.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {round.number < 4 ? `${round.points} point${round.points !== 1 ? 's' : ''} each` : 'Wager Round'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {round.questions} question{round.questions !== 1 ? 's' : ''}
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

export default HostDashboard;