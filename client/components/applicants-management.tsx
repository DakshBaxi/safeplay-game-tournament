
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronDown,
  Clock,
  Download,
  Filter,
  Flag,
  Search,
  Shield,
  User,
  Users,
  X,
  Loader2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { apiClient } from "@/lib/api-client"

// Team interface
interface Team {
  id: string
  teamName: string
  game: string
  captain: string
  playerCount: number
  averageTrustScore: number
  status: 'pending' | 'approved' | 'rejected' | 'flagged'
  joinedAt: string
}

// Tournament interface
interface Tournament {
  id: string
  title: string
  game: string
  status: string
  maxPlayers: number
  currentRegistrations: number
}

// Status color mapping
const statusColors: Record<string, string> = {
  pending: "bg-blue-500/20 text-blue-500 border-blue-500/20",
  approved: "bg-green-500/20 text-green-500 border-green-500/20",
  rejected: "bg-red-500/20 text-red-500 border-red-500/20",
  flagged: "bg-yellow-500/20 text-yellow-500 border-yellow-500/20",
}



export function ApplicantsManagement({ id }: { id: string }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [tournamentData, setTournamentData] = useState<Tournament | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingTeams, setUpdatingTeams] = useState(new Set<string>())
  const { toast } = useToast()

  // Fetch tournament and applicants data
  useEffect(() => {
    const fetchTournamentApplicants = async () => {
      try {
        setLoading(true)
        
        // Fetch tournament details and applicants in parallel
        const [tournamentResponse, applicantsResponse] = await Promise.all([
          apiClient.get(`/api/tournament/${id}`),
          apiClient.get(`/api/tournament/${id}/applicants`)
        ])
        
        setTournamentData(tournamentResponse.data)
        setTeams(applicantsResponse.data.teams || applicantsResponse.data)
        
      } catch (error) {
        console.error('Error fetching tournament applicants:', error)
        toast({
          title: "Error",
          description: "Failed to load tournament applicants. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTournamentApplicants()
    }
  }, [id, toast])

  // Update team status
  const updateTeamStatus = async (teamId: string, newStatus: 'approved' | 'rejected' | 'flagged') => {
    try {
      setUpdatingTeams(prev => new Set([...prev, teamId]))
      
      const response = await apiClient.patch(`/api/tournament/${id}/applicants/${teamId}/status`, {
        status: newStatus
      })

      if (response.status === 200) {
        // Update local state
        setTeams(prevTeams => 
          prevTeams.map(team => 
            team.id === teamId ? { ...team, status: newStatus } : team
          )
        )

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
      setUpdatingTeams(prev => {
        const updated = new Set(prev)
        updated.delete(teamId)
        return updated
      })
    }
  }

  // Filter teams based on search query and filters
  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.captain.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter ? team.status === statusFilter : true
    return matchesSearch && matchesStatus 
  })

  // Get unique statuses  for filters
  const statuses = Array.from(new Set(teams.map((t) => t.status)))
  

  // Export teams data
  const exportTeamsList = async () => {
    try {
      const response = await apiClient.get(`/api/tournament/${id}/applicants/export`, {
        responseType: 'blob'
      })
      
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${tournamentData?.title || 'tournament'}_teams.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "Success",
        description: "Teams list exported successfully.",
      })
    } catch (error) {
      console.error('Error exporting teams list:', error)
      
      // Fallback to client-side CSV generation
      const csvContent = [
        ['Team Name', 'Game', 'Captain', 'Members', 'Avg Trust Score', 'Status', 'Applied At'],
        ...filteredTeams.map(team => [
          team.teamName,
          team.game,
          team.captain,
          team.playerCount.toString(),
          team.averageTrustScore.toString(),
          team.status,
          new Date(team.joinedAt).toLocaleDateString()
        ])
      ].map(row => row.join(',')).join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${tournamentData?.title || 'tournament'}_teams.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "Success",
        description: "Teams list exported successfully (offline mode).",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading tournament applicants...</span>
      </div>
    )
  }

  if (!tournamentData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Tournament not found</h3>
          <p className="text-muted-foreground">The requested tournament could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/tournaments/${id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Applications</h1>
          <p className="text-muted-foreground">
            {tournamentData.title} • {teams.length} Teams Registered
          </p>
        </div>
        <div className="ml-auto">
          <Button variant="outline" onClick={exportTeamsList}>
            <Download className="mr-2 h-4 w-4" />
            Export List
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Management</CardTitle>
          <CardDescription>Review and manage registered teams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teams or captains..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Status
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Statuses</DropdownMenuItem>
                <DropdownMenuSeparator />
                {statuses.map((status) => (
                  <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team</TableHead>
                  <TableHead>Captain</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Avg Trust Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeams.map((team) => (
                  <TableRow key={team.id} className="cursor-pointer hover:bg-accent/50">
                    <TableCell className="font-medium">
                      <Link href={`/tournaments/${id}/applicants/teams/${team.id}`}>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{team.teamName}</div>
                            <div className="text-xs text-muted-foreground">
                              {team.game} • {team.playerCount} members
                            </div>
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{team.captain}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{team.playerCount}</span>
                        <span className="text-xs text-muted-foreground ml-1">
                          ({team.game === 'valorant' || team.game === 'counterStrike2' ? '5' : 
                            team.game === 'bgmi' ? '4' : '4'} max)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4" />
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
                      </div>
                    </TableCell>
                   
                    <TableCell>
                      <Badge className={statusColors[team.status]}>
                        {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(team.joinedAt).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                disabled={team.status === "approved" || updatingTeams.has(team.id)}
                                onClick={() => updateTeamStatus(team.id, 'approved')}
                              >
                                {updatingTeams.has(team.id) ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Approve Team</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                disabled={team.status === "rejected" || updatingTeams.has(team.id)}
                                onClick={() => updateTeamStatus(team.id, 'rejected')}
                              >
                                {updatingTeams.has(team.id) ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <X className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Reject Team</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                disabled={updatingTeams.has(team.id)}
                                onClick={() => updateTeamStatus(team.id, 'flagged')}
                              >
                                <Flag className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Flag Team</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link href={`/tournaments/${id}/applicants/teams/${team.id}`}>
                                <Button variant="ghost" size="icon">
                                  <AlertCircle className="h-4 w-4" />
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Team Details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredTeams.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      {teams.length === 0 ? "No teams registered yet." : "No teams found matching your filters."}
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