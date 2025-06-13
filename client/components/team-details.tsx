
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Check, Clock, Crown, Flag, Mail, Shield, User, Users, X, Loader2, AlertCircle } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { apiClient } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import Image from "next/image"

// Team interface matching your model
interface Team {
  _id: string
  teamName: string
  captainId: {
    _id: string
    fullName: string
    email: string
    trustScore?: number
    profileUrl: string
  }
  players: Array<{
    _id: string
    fullName: string
    email: string
    trustScore?: number
     profileUrl: string
  }>
  game: 'bgmi' | 'valorant' | 'freeFire' | 'counterStrike2'
  inviteCode?: string
  createdAt: string
  updatedAt: string
  status?: 'pending' | 'approved' | 'rejected' | 'flagged'
  averageTrustScore?: number
}

// Status color mapping
const statusColors: Record<string, string> = {
  pending: "bg-blue-500/20 text-blue-500 border-blue-500/20",
  approved: "bg-green-500/20 text-green-500 border-green-500/20",
  rejected: "bg-red-500/20 text-red-500 border-red-500/20",
  flagged: "bg-yellow-500/20 text-yellow-500 border-yellow-500/20",
}



// Game display names
const gameNames: Record<string, string> = {
  bgmi: "BGMI",
  valorant: "Valorant",
  freeFire: "Free Fire",
  counterStrike2: "Counter-Strike 2",
}

export function TeamDetails({ tournamentId, teamId }: { tournamentId: string; teamId: string }) {
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const { toast } = useToast()

  // Fetch team data
  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get(`/api/tournament/${tournamentId}/applicants/teams/${teamId}`)
        console.log(response.data)
        setTeam(response.data)
      } catch (error) {
        console.error('Error fetching team details:', error)
        toast({
          title: "Error",
          description: "Failed to load team details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (tournamentId && teamId) {
      fetchTeamDetails()
    }
  }, [tournamentId, teamId, toast])

  // Update team status
  const updateTeamStatus = async (newStatus: 'approved' | 'rejected' | 'flagged') => {
    if (!team) return

    try {
      setUpdating(true)
      const response = await apiClient.patch(`/api/tournament/${tournamentId}/applicants/${team._id}/status`, {
        status: newStatus
      })

      if (response.status === 200) {
        setTeam(prev => prev ? { ...prev, status: newStatus } : null)
        toast({
          title: "Success",
          description: `Team ${newStatus === 'approved' ? 'approved' : newStatus === 'rejected' ? 'rejected' : 'flagged'} successfully.`,
        })
      }
    } catch (error) {
      console.error('Error updating team status:', error)
      toast({
        title: "Error",
        description: "Failed to update team status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  // Calculate average trust score
  // const calculateAverageTrustScore = (team: Team): number => {
  //   if (team.averageTrustScore) return team.averageTrustScore
    
  //   const allPlayers = [team.captainId, ...team.players]
  //   const validScores = allPlayers
  //     .map(player => player.trustScore)
  //     .filter(score => typeof score === 'number' && score > 0)
    
  //   if (validScores.length === 0) return 0
  //   return Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length)
  // }

  // Send contact email
  const contactTeam = async () => {
    if (!team) return
    
    try {
      await apiClient.post(`/api/teams/${team._id}/contact`, {
        subject: "Tournament Application Update",
        tournamentId
      })
      
      toast({
        title: "Success",
        description: "Contact email sent to team captain.",
      })
    } catch (error) {
      console.error('Error sending contact email:', error)
      toast({
        title: "Error",
        description: "Failed to send contact email. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading team details...</span>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Team not found</h3>
          <p className="text-muted-foreground">The requested team could not be found.</p>
        </div>
      </div>
    )
  }

  const averageTrustScore = team.averageTrustScore||0
  const totalPlayers = team.players.length + 1 // +1 for captain

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
          <Button variant="outline" onClick={contactTeam}>
            <Mail className="mr-2 h-4 w-4" />
            Contact Team
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => updateTeamStatus('flagged')}
            disabled={updating}
          >
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
                  Led by {team.captainId.fullName} • {totalPlayers} players • {gameNames[team.game]}
                </CardDescription>
              </div>
              <Badge className={statusColors[team.status || 'pending']}>
                {(team.status || 'pending').charAt(0).toUpperCase() + (team.status || 'pending').slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">

            <Separator />

            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h3 className="font-medium">Team Actions</h3>
                <p className="text-sm text-muted-foreground">Manage this team's application status</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  disabled={team.status === "approved" || updating}
                  onClick={() => updateTeamStatus('approved')}
                >
                  {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                  Accept Team
                </Button>
                <Button 
                  variant="destructive" 
                  disabled={team.status === "rejected" || updating}
                  onClick={() => updateTeamStatus('rejected')}
                >
                  {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
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
                      averageTrustScore >= 800
                        ? "text-green-500"
                        : averageTrustScore >= 750
                          ? "text-yellow-500"
                          : "text-red-500"
                    }
                  >
                    {averageTrustScore}
                  </span>
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Game</span>
                <span className="font-medium">{gameNames[team.game]}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Team Created</span>
                <span className="font-medium flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(team.createdAt).toLocaleDateString()}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Team Size</span>
                <span className="font-medium flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {totalPlayers}
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
                  <TableHead>Trust Score</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Captain */}
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{team.captainId.fullName}</span>
                          <Crown className="h-4 w-4 text-yellow-500" />
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">Captain</Badge>
                  </TableCell>
                  <TableCell>
               <div className="flex items-center gap-1">
  <Shield className="h-4 w-4" />
  {typeof team?.captainId?.trustScore === 'number' ? (
    <span
      className={
        team.captainId.trustScore >= 800
          ? "text-green-500"
          : team.captainId.trustScore >= 750
          ? "text-yellow-500"
          : "text-red-500"
      }
    >
      {team.captainId.trustScore}
    </span>
  ) : (
    <span className="text-red-500">N/A</span>
  )}
</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{team.captainId.email}</span>
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
                    </div>
                  </TableCell>
                </TableRow>

                {/* Players */}
                {team.players.map((player) => (
                  <TableRow key={player._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                   
                        <div>
                          <span>{player.fullName}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Player</Badge>
                    </TableCell>
                    <TableCell>
                 <div className="flex items-center gap-1">
  <Shield className="h-4 w-4" />
  {typeof player.trustScore === 'number' ? (
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
  ) : (
    <span className="text-red-500">N/A</span>
  )}
</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{player.email}</span>
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

                {team.players.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No additional players in this team.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}