"use client"

import Link from "next/link"
import { ArrowLeft, Calendar, Check, Clock, Crown, Flag, Mail, Shield, Star, User, Users, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Mock team data
const teamData = {
  id: "team1",
  teamName: "Phantom Squad",
  captain: "ProGamer123",
  playerCount: 5,
  averageTrustScore: 850,
  kycStatus: "verified",
  status: "applied",
  joinedAt: "2025-06-10T14:30:00Z",
  description:
    "A competitive Valorant team with years of experience in tactical FPS games. We focus on strategic gameplay and team coordination.",
  achievements: [
    "1st Place - Regional Valorant Championship 2024",
    "3rd Place - Summer League Tournament",
    "Top 8 - National Esports Cup",
  ],
  players: [
    {
      id: "p1",
      name: "ProGamer123",
      role: "Captain",
      position: "Duelist",
      trustScore: 850,
      kycStatus: "verified",
      joinedTeam: "2024-01-15",
      gamesPlayed: 245,
      winRate: 78,
      email: "progamer123@email.com",
    },
    {
      id: "p2",
      name: "AimBot2000",
      role: "Player",
      position: "Sentinel",
      trustScore: 820,
      kycStatus: "verified",
      joinedTeam: "2024-02-20",
      gamesPlayed: 198,
      winRate: 72,
      email: "aimbot2000@email.com",
    },
    {
      id: "p3",
      name: "FlashMaster",
      role: "Player",
      position: "Initiator",
      trustScore: 880,
      kycStatus: "verified",
      joinedTeam: "2024-01-20",
      gamesPlayed: 267,
      winRate: 81,
      email: "flashmaster@email.com",
    },
    {
      id: "p4",
      name: "SmokeKing",
      role: "Player",
      position: "Controller",
      trustScore: 840,
      kycStatus: "pending",
      joinedTeam: "2024-03-10",
      gamesPlayed: 156,
      winRate: 75,
      email: "smokeking@email.com",
    },
    {
      id: "p5",
      name: "ClutchGod",
      role: "Player",
      position: "Duelist",
      trustScore: 860,
      kycStatus: "verified",
      joinedTeam: "2024-02-05",
      gamesPlayed: 223,
      winRate: 79,
      email: "clutchgod@email.com",
    },
  ],
}

// Status color mapping
const statusColors: Record<string, string> = {
  applied: "bg-blue-500/20 text-blue-500 border-blue-500/20",
  accepted: "bg-green-500/20 text-green-500 border-green-500/20",
  rejected: "bg-red-500/20 text-red-500 border-red-500/20",
  flagged: "bg-yellow-500/20 text-yellow-500 border-yellow-500/20",
}

// KYC status color mapping
const kycColors: Record<string, string> = {
  verified: "bg-green-500/20 text-green-500 border-green-500/20",
  pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/20",
  not_started: "bg-gray-500/20 text-gray-500 border-gray-500/20",
}

// Position color mapping
const positionColors: Record<string, string> = {
  Duelist: "bg-red-500/20 text-red-500 border-red-500/20",
  Sentinel: "bg-blue-500/20 text-blue-500 border-blue-500/20",
  Initiator: "bg-orange-500/20 text-orange-500 border-orange-500/20",
  Controller: "bg-purple-500/20 text-purple-500 border-purple-500/20",
}

export function TeamDetails({ tournamentId, teamId }: { tournamentId: string; teamId: string }) {
  // In a real app, you would fetch the team data based on the IDs
  const team = teamData

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/tournaments/${tournamentId}/applicants`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{team.teamName}</h1>
          <p className="text-muted-foreground">Team Details & Player Information</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Contact Team
          </Button>
          <Button variant="destructive">
            <Flag className="mr-2 h-4 w-4" />
            Flag Team
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {team.teamName}
                </CardTitle>
                <CardDescription>
                  Led by {team.captain} • {team.playerCount} players
                </CardDescription>
              </div>
              <Badge className={statusColors[team.status]}>
                {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Team Description</h3>
              <p className="text-sm text-muted-foreground">{team.description}</p>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3">Team Achievements</h3>
              <ul className="space-y-2">
                {team.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h3 className="font-medium">Team Actions</h3>
                <p className="text-sm text-muted-foreground">Manage this team's application status</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" disabled={team.status === "accepted"}>
                  <Check className="mr-2 h-4 w-4" />
                  Accept Team
                </Button>
                <Button variant="destructive" disabled={team.status === "rejected"}>
                  <X className="mr-2 h-4 w-4" />
                  Reject Team
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Team Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Trust Score</span>
                <span className="font-medium flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  <span
                    className={
                      team.averageTrustScore >= 800
                        ? "text-green-500"
                        : team.averageTrustScore >= 750
                          ? "text-yellow-500"
                          : "text-red-500"
                    }
                  >
                    {team.averageTrustScore}
                  </span>
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Team KYC Status</span>
                <Badge className={kycColors[team.kycStatus]}>
                  {team.kycStatus
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Application Date</span>
                <span className="font-medium flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(team.joinedAt).toLocaleDateString()}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Team Size</span>
                <span className="font-medium flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {team.playerCount}/5
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Players Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Detailed information about each team member</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Trust Score</TableHead>
                  <TableHead>KYC Status</TableHead>
                  <TableHead>Games Played</TableHead>
                  <TableHead>Win Rate</TableHead>
                  <TableHead>Joined Team</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.players.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>{player.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span>{player.name}</span>
                            {player.role === "Captain" && <Crown className="h-4 w-4 text-yellow-500" />}
                          </div>
                          <div className="text-xs text-muted-foreground">{player.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={player.role === "Captain" ? "default" : "outline"}>{player.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={positionColors[player.position]}>{player.position}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4" />
                        <span
                          className={
                            player.trustScore >= 800
                              ? "text-green-500"
                              : player.trustScore >= 750
                                ? "text-yellow-500"
                                : "text-red-500"
                          }
                        >
                          {player.trustScore}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={kycColors[player.kycStatus]}>
                        {player.kycStatus
                          .split("_")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{player.gamesPlayed}</span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "font-medium",
                          player.winRate >= 75
                            ? "text-green-500"
                            : player.winRate >= 60
                              ? "text-yellow-500"
                              : "text-red-500",
                        )}
                      >
                        {player.winRate}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(player.joinedTeam).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Mail className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Contact Player</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <User className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Profile</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Flag className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Flag Player</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
