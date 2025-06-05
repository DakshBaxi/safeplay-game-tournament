"use client"

import { useState } from "react"
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

// Mock data for tournament
const tournamentInfo = {
  id: "1",
  title: "Summer Valorant Championship",
  game: "Valorant",
  status: "open",
  currentRegistrations: 42,
  maxPlayers: 64,
}

// Mock data for teams
const teams = [
  {
    id: "team1",
    teamName: "Phantom Squad",
    captain: "ProGamer123",
    playerCount: 5,
    averageTrustScore: 850,
    kycStatus: "verified",
    status: "applied",
    joinedAt: "2025-06-10T14:30:00Z",
    players: [
      { id: "p1", name: "ProGamer123", role: "Captain", trustScore: 850, kycStatus: "verified" },
      { id: "p2", name: "AimBot2000", role: "Player", trustScore: 820, kycStatus: "verified" },
      { id: "p3", name: "FlashMaster", role: "Player", trustScore: 880, kycStatus: "verified" },
      { id: "p4", name: "SmokeKing", role: "Player", trustScore: 840, kycStatus: "pending" },
      { id: "p5", name: "ClutchGod", role: "Player", trustScore: 860, kycStatus: "verified" },
    ],
  },
  {
    id: "team2",
    teamName: "Valorant Masters",
    captain: "ValorantMaster",
    playerCount: 5,
    averageTrustScore: 920,
    kycStatus: "verified",
    status: "accepted",
    joinedAt: "2025-06-09T10:15:00Z",
    players: [
      { id: "p6", name: "ValorantMaster", role: "Captain", trustScore: 920, kycStatus: "verified" },
      { id: "p7", name: "HeadshotKing", role: "Player", trustScore: 900, kycStatus: "verified" },
      { id: "p8", name: "TacticalMind", role: "Player", trustScore: 940, kycStatus: "verified" },
      { id: "p9", name: "ReflexGod", role: "Player", trustScore: 910, kycStatus: "verified" },
      { id: "p10", name: "StrategyMaster", role: "Player", trustScore: 930, kycStatus: "verified" },
    ],
  },
  {
    id: "team3",
    teamName: "Headshot Heroes",
    captain: "HeadshotKing",
    playerCount: 5,
    averageTrustScore: 780,
    kycStatus: "pending",
    status: "applied",
    joinedAt: "2025-06-11T09:45:00Z",
    players: [
      { id: "p11", name: "HeadshotKing", role: "Captain", trustScore: 780, kycStatus: "pending" },
      { id: "p12", name: "QuickScope", role: "Player", trustScore: 760, kycStatus: "verified" },
      { id: "p13", name: "PrecisionAim", role: "Player", trustScore: 800, kycStatus: "verified" },
      { id: "p14", name: "FastReaction", role: "Player", trustScore: 770, kycStatus: "not_started" },
      { id: "p15", name: "SharpShooter", role: "Player", trustScore: 790, kycStatus: "verified" },
    ],
  },
  {
    id: "team4",
    teamName: "Tactical Legends",
    captain: "TacticalPlayer",
    playerCount: 5,
    averageTrustScore: 810,
    kycStatus: "verified",
    status: "accepted",
    joinedAt: "2025-06-08T16:20:00Z",
    players: [
      { id: "p16", name: "TacticalPlayer", role: "Captain", trustScore: 810, kycStatus: "verified" },
      { id: "p17", name: "StrategyKing", role: "Player", trustScore: 800, kycStatus: "verified" },
      { id: "p18", name: "TeamLeader", role: "Player", trustScore: 820, kycStatus: "verified" },
      { id: "p19", name: "SupportMaster", role: "Player", trustScore: 790, kycStatus: "verified" },
      { id: "p20", name: "EntryFragger", role: "Player", trustScore: 830, kycStatus: "verified" },
    ],
  },
]

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

export function ApplicantsManagement({ id }: { id: string }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [kycFilter, setKycFilter] = useState<string | null>(null)

  // Filter teams based on search query and filters
  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.captain.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter ? team.status === statusFilter : true
    const matchesKyc = kycFilter ? team.kycStatus === kycFilter : true
    return matchesSearch && matchesStatus && matchesKyc
  })

  // Get unique statuses and KYC statuses for filters
  const statuses = Array.from(new Set(teams.map((t) => t.status)))
  const kycStatuses = Array.from(new Set(teams.map((t) => t.kycStatus)))

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
            {tournamentInfo.title} • {teams.length} Teams Applied
          </p>
        </div>
        <div className="ml-auto">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export List
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Management</CardTitle>
          <CardDescription>Review and manage team applications</CardDescription>
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  KYC Status
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setKycFilter(null)}>All KYC Statuses</DropdownMenuItem>
                <DropdownMenuSeparator />
                {kycStatuses.map((status) => (
                  <DropdownMenuItem key={status} onClick={() => setKycFilter(status)}>
                    {status
                      .split("_")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
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
                  <TableHead>Players</TableHead>
                  <TableHead>Avg Trust Score</TableHead>
                  <TableHead>KYC Status</TableHead>
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
                            <div className="text-xs text-muted-foreground">{team.playerCount} players</div>
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
                        <span>{team.playerCount}/5</span>
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
                      <Badge className={kycColors[team.kycStatus]}>
                        {team.kycStatus
                          .split("_")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </Badge>
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
                              <Button variant="ghost" size="icon" disabled={team.status === "accepted"}>
                                <Check className="h-4 w-4" />
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
                              <Button variant="ghost" size="icon" disabled={team.status === "rejected"}>
                                <X className="h-4 w-4" />
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
                              <Button variant="ghost" size="icon" disabled={team.status === "flagged"}>
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
                      No teams found.
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
