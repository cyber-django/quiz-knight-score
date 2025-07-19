import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TeamLogin = () => {
  const [teamName, setTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      toast({
        title: "Team name required",
        description: "Please enter your team name to join the game.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate team registration
    setTimeout(() => {
      localStorage.setItem("teamName", teamName.trim());
      localStorage.setItem("teamId", Date.now().toString());
      toast({
        title: "Welcome to Pub Trivia!",
        description: `Team "${teamName}" is ready to play.`,
      });
      navigate("/game");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Trophy className="h-12 w-12 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Pub Trivia</h1>
          <p className="text-muted-foreground">Join the game and test your knowledge!</p>
        </div>

        {/* Login Form */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Join Game
            </CardTitle>
            <CardDescription>
              Enter your team name to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoinGame} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter team name..."
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="text-lg p-3 h-12"
                  maxLength={20}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={isLoading}
              >
                {isLoading ? "Joining..." : "Join Game"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Host Login */}
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate("/host")}
            className="text-muted-foreground hover:text-foreground"
          >
            Host Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeamLogin;