// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { Calendar, ChevronDown, Edit, Eye, Filter, Plus, Search, Trophy, Users } from "lucide-react"

// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Separator } from "@/components/ui/separator"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { cn } from "@/lib/utils"

// // Mock data for tournaments
// const tournaments = [
//   {
//     id: "1",
//     title: "Summer Valorant Championship",
//     game: "Valorant",
//     status: "open",
//     date: "2025-07-15",
//     maxPlayers: 64,
//     prizePool: "$5,000",
//     trustScoreThreshold: 750,
//     registrationDeadline: "2025-07-01",
//     currentRegistrations: 42,
//   },
//   {
//     id: "2",
//     title: "CS2 Pro League Season 5",
//     game: "CS2",
//     status: "upcoming",
//     date: "2025-08-10",
//     maxPlayers: 32,
//     prizePool: "$10,000",
//     trustScoreThreshold: 850,
//     registrationDeadline: "2025-07-25",
//     currentRegistrations: 28,
//   },
//   {
//     id: "3",
//     title: "Rocket League Cup",
//     game: "Rocket League",
//     status: "ongoing",
//     date: "2025-06-01",
//     maxPlayers: 24,
//     prizePool: "$3,000",
//     trustScoreThreshold: 700,
//     registrationDeadline: "2025-05-20",
//     currentRegistrations: 24,
//   },
//   {
//     id: "4",
//     title: "League of Legends Winter Tournament",
//     game: "League of Legends",
//     status: "closed",
//     date: "2025-01-15",
//     maxPlayers: 16,
//     prizePool: "$7,500",
//     trustScoreThreshold: 800,
//     registrationDeadline: "2024-12-31",
//     currentRegistrations: 16,
//   },
// ]

// // Game color mapping
// const gameColors: Record<string, string> = {
//   Valorant: "bg-red-500/20 text-red-500 border-red-500/20",
//   CS2: "bg-orange-500/20 text-orange-500 border-orange-500/20",
//   "Rocket League": "bg-blue-500/20 text-blue-500 border-blue-500/20",
//   "League of Legends": "bg-purple-500/20 text-purple-500 border-purple-500/20",
// }

// // Status color mapping
// const statusColors: Record<string, string> = {
//   open: "bg-green-500/20 text-green-500 border-green-500/20",
//   closed: "bg-red-500/20 text-red-500 border-red-500/20",
//   upcoming: "bg-blue-500/20 text-blue-500 border-blue-500/20",
//   ongoing: "bg-yellow-500/20 text-yellow-500 border-yellow-500/20",
// }

// export function TournamentDashboard() {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [statusFilter, setStatusFilter] = useState<string | null>(null)
//   const [gameFilter, setGameFilter] = useState<string | null>(null)

//   // Filter tournaments based on search query and filters
//   const filteredTournaments = tournaments.filter((tournament) => {
//     const matchesSearch = tournament.title.toLowerCase().includes(searchQuery.toLowerCase())
//     const matchesStatus = statusFilter ? tournament.status === statusFilter : true
//     const matchesGame = gameFilter ? tournament.game === gameFilter : true
//     return matchesSearch && matchesStatus && matchesGame
//   })

//   // Get unique games and statuses for filters
//   const games = Array.from(new Set(tournaments.map((t) => t.game)))
//   const statuses = Array.from(new Set(tournaments.map((t) => t.status)))

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight">Tournaments</h1>
//           <p className="text-muted-foreground">Manage your gaming tournaments</p>
//         </div>
//         <Link href="/tournaments/create">
//           <Button>
//             <Plus className="mr-2 h-4 w-4" />
//             Create Tournament
//           </Button>
//         </Link>
//       </div>

//       <div className="flex items-center gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search tournaments..."
//             className="pl-8"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="gap-2">
//               <Filter className="h-4 w-4" />
//               Game
//               <ChevronDown className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuItem onClick={() => setGameFilter(null)}>All Games</DropdownMenuItem>
//             <DropdownMenuSeparator />
//             {games.map((game) => (
//               <DropdownMenuItem key={game} onClick={() => setGameFilter(game)}>
//                 {game}
//               </DropdownMenuItem>
//             ))}
//           </DropdownMenuContent>
//         </DropdownMenu>

//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="gap-2">
//               <Filter className="h-4 w-4" />
//               Status
//               <ChevronDown className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Statuses</DropdownMenuItem>
//             <DropdownMenuSeparator />
//             {statuses.map((status) => (
//               <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
//                 {status.charAt(0).toUpperCase() + status.slice(1)}
//               </DropdownMenuItem>
//             ))}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredTournaments.map((tournament) => (
//           <Card key={tournament.id} className="overflow-hidden">
//             <CardHeader className="pb-3">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <Badge className={cn("mb-2", gameColors[tournament.game])}>{tournament.game}</Badge>
//                   <CardTitle className="text-xl">{tournament.title}</CardTitle>
//                 </div>
//                 <Badge className={statusColors[tournament.status]}>
//                   {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
//                 </Badge>
//               </div>
//             </CardHeader>
//             <CardContent className="pb-3">
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div className="flex flex-col">
//                   <span className="text-muted-foreground">Date</span>
//                   <span className="font-medium flex items-center gap-1">
//                     <Calendar className="h-3.5 w-3.5" />
//                     {new Date(tournament.date).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-muted-foreground">Prize Pool</span>
//                   <span className="font-medium flex items-center gap-1">
//                     <Trophy className="h-3.5 w-3.5" />
//                     {tournament.prizePool}
//                   </span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-muted-foreground">Players</span>
//                   <span className="font-medium flex items-center gap-1">
//                     <Users className="h-3.5 w-3.5" />
//                     {tournament.currentRegistrations}/{tournament.maxPlayers}
//                   </span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-muted-foreground">Trust Score</span>
//                   <span className="font-medium">{tournament.trustScoreThreshold}+</span>
//                 </div>
//               </div>
//             </CardContent>
//             <Separator />
//             <CardFooter className="pt-3 flex justify-between">
//               <Link href={`/tournaments/${tournament.id}`}>
//                 <Button variant="outline" size="sm" className="gap-1">
//                   <Eye className="h-3.5 w-3.5" />
//                   View Details
//                 </Button>
//               </Link>
//               <div className="flex gap-2">
//                 <Link href={`/tournaments/${tournament.id}/edit`}>
//                   <Button variant="ghost" size="sm" className="gap-1">
//                     <Edit className="h-3.5 w-3.5" />
//                     Edit
//                   </Button>
//                 </Link>
//                 <Link href={`/tournaments/${tournament.id}/applicants`}>
//                   <Button variant="ghost" size="sm" className="gap-1">
//                     <Users className="h-3.5 w-3.5" />
//                     Applicants
//                   </Button>
//                 </Link>
//               </div>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>

//       {filteredTournaments.length === 0 && (
//         <div className="flex flex-col items-center justify-center py-12 text-center">
//           <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
//           <h3 className="text-lg font-medium">No tournaments found</h3>
//           <p className="text-muted-foreground mt-1">
//             {searchQuery || statusFilter || gameFilter
//               ? "Try adjusting your filters or search query"
//               : "Create your first tournament to get started"}
//           </p>
//           {!searchQuery && !statusFilter && !gameFilter && (
//             <Link href="/tournaments/create" className="mt-4">
//               <Button>
//                 <Plus className="mr-2 h-4 w-4" />
//                 Create Tournament
//               </Button>
//             </Link>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import {
  Calendar,
  ChevronDown,
  Edit,
  Eye,
  Filter,
  Plus,
  Search,
  Trophy,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api-client"

type Tournament = {
  _id: string
  title: string
  game: string
  status: string
  date: string
  maxPlayers: number
  prizePool: string
  trustScoreThreshold: number
  registrationDeadline: string
  currentRegistrations: number
}

const gameColors: Record<string, string> = {
  Valorant: "bg-red-500/20 text-red-500 border-red-500/20",
  CS2: "bg-orange-500/20 text-orange-500 border-orange-500/20",
  "Rocket League": "bg-blue-500/20 text-blue-500 border-blue-500/20",
  "League of Legends": "bg-purple-500/20 text-purple-500 border-purple-500/20",
}

const statusColors: Record<string, string> = {
  open: "bg-green-500/20 text-green-500 border-green-500/20",
  closed: "bg-red-500/20 text-red-500 border-red-500/20",
  upcoming: "bg-blue-500/20 text-blue-500 border-blue-500/20",
  ongoing: "bg-yellow-500/20 text-yellow-500 border-yellow-500/20",
}

export function TournamentDashboard() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [gameFilter, setGameFilter] = useState<string | null>(null)

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await apiClient.get("/api/tournament")
        setTournaments(res.data)
      } catch (error) {
        console.error("Error fetching tournaments:", error)
      }
    }

    fetchTournaments()
  }, [])

  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch = tournament.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter ? tournament.status === statusFilter : true
    const matchesGame = gameFilter ? tournament.game === gameFilter : true
    return matchesSearch && matchesStatus && matchesGame
  })

  const games = Array.from(new Set(tournaments.map((t) => t.game)))
  const statuses = Array.from(new Set(tournaments.map((t) => t.status)))

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tournaments</h1>
          <p className="text-muted-foreground">Manage your gaming tournaments</p>
        </div>
        <Link href="/tournaments/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Tournament
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tournaments..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Game Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Game
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setGameFilter(null)}>All Games</DropdownMenuItem>
            <DropdownMenuSeparator />
            {games.map((game) => (
              <DropdownMenuItem key={game} onClick={() => setGameFilter(game)}>
                {game}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Filter */}
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

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTournaments.map((tournament) => (
          <Card key={tournament._id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <Badge className={cn("mb-2", gameColors[tournament.game])}>
                    {tournament.game}
                  </Badge>
                  <CardTitle className="text-xl">{tournament.title}</CardTitle>
                </div>
                <Badge className={statusColors[tournament.status]}>
                  {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(tournament.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Prize Pool</span>
                  <span className="font-medium flex items-center gap-1">
                    <Trophy className="h-3.5 w-3.5" />
                    {tournament.prizePool}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Players</span>
                  <span className="font-medium flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {tournament.currentRegistrations}/{tournament.maxPlayers}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Trust Score</span>
                  <span className="font-medium">{tournament.trustScoreThreshold}+</span>
                </div>
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="pt-3 flex justify-between">
              <Link href={`/tournaments/${tournament._id}`}>
                <Button variant="outline" size="sm" className="gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  View Details
                </Button>
              </Link>
              <div className="flex gap-2">
                <Link href={`/tournaments/${tournament._id}/edit`}>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                </Link>
                <Link href={`/tournaments/${tournament._id}/applicants`}>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Users className="h-3.5 w-3.5" />
                    Applicants
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTournaments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No tournaments found</h3>
          <p className="text-muted-foreground mt-1">
            {searchQuery || statusFilter || gameFilter
              ? "Try adjusting your filters or search query"
              : "Create your first tournament to get started"}
          </p>
          {!searchQuery && !statusFilter && !gameFilter && (
            <Link href="/tournaments/create" className="mt-4">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Tournament
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

