"use client"

import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Edit, Flag, MapPin, Shield, Trophy, User, Users, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { apiClient } from "@/lib/api-client"

interface Tournament {
  id: string
  title: string
  game: string
  status: string
  date: string
  maxPlayers: number
  prizePool: string
  trustScoreThreshold: number
  registrationDeadline: string
  currentRegistrations: number
  description: string
  organizer: string
  location: string
  rules: string[]
  schedule: {
    stage: string
    date: string
    teams: number
  }[]
}

// Game color mapping
const gameColors: Record<string, string> = {
  Valorant: "bg-red-500/20 text-red-500 border-red-500/20",
  CS2: "bg-orange-500/20 text-orange-500 border-orange-500/20",
  "Rocket League": "bg-blue-500/20 text-blue-500 border-blue-500/20",
  "League of Legends": "bg-purple-500/20 text-purple-500 border-purple-500/20",
}

// Status color mapping
const statusColors: Record<string, string> = {
  open: "bg-green-500/20 text-green-500 border-green-500/20",
  closed: "bg-red-500/20 text-red-500 border-red-500/20",
  upcoming: "bg-blue-500/20 text-blue-500 border-blue-500/20",
  ongoing: "bg-yellow-500/20 text-yellow-500 border-yellow-500/20",
}

export function TournamentDetails({ id }: { id: string }) {
  const params = useParams()
 

  const [tournament, setTournament] = useState<Tournament | null>(null)

  useEffect(() => {
    async function fetchTournament() {
      try {
        const res = await apiClient.get(`/api/tournament/${id}`)
        
        setTournament(res.data)
      } catch (err) {
        console.error(err)
      }
    }

    if (id) fetchTournament()
  }, [id])

  if (!tournament) {
    return <div>Loading tournament details...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{tournament.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge className={cn("mt-1", gameColors[tournament.game])}>{tournament.game}</Badge>
            <span>•</span>
            <Badge className={cn("mt-1", statusColors[tournament.status])}>
              {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
            </Badge>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Link href={`/tournaments/${id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Tournament
            </Button>
          </Link>
          <Link href={`/tournaments/${id}/applicants`}>
            <Button>
              <Users className="mr-2 h-4 w-4" />
              View Applicants
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Tournament Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{tournament.description}</p>
                <div className="flex flex-wrap gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Organizer:</span> {tournament.organizer}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Location:</span> {tournament.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Prize Pool:</span> {tournament.prizePool}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                {tournament.status === "open" ? (
                  <Button variant="destructive">
                    <X className="mr-2 h-4 w-4" />
                    Close Registration
                  </Button>
                ) : (
                  <Button variant="outline" disabled>
                    Registration {tournament.status === "closed" ? "Closed" : "Not Open"}
                  </Button>
                )}
                <Button variant="outline">
                  <Flag className="mr-2 h-4 w-4" />
                  Report Issue
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tournament Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date</span>
                    <span className="font-medium flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(tournament.date).toLocaleDateString()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Players</span>
                    <span className="font-medium">{tournament.maxPlayers}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Registrations</span>
                    <span className="font-medium">{tournament.currentRegistrations}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Registration Deadline</span>
                    <span className="font-medium flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(tournament.registrationDeadline).toLocaleDateString()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trust Score Requirement</span>
                    <span className="font-medium flex items-center gap-1">
                      <Shield className="h-3.5 w-3.5" />
                      {tournament.trustScoreThreshold}+
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rules" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tournament Rules</CardTitle>
              <CardDescription>All participants must follow these rules</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                {tournament.rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tournament Schedule</CardTitle>
              <CardDescription>Timeline of tournament stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-8 relative">
                  {tournament.schedule.map((stage, index) => (
                    <div key={index} className="relative pl-10">
                      <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-card border-4 border-background flex items-center justify-center">
                        <span className="text-xs font-bold">{index + 1}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">{stage.stage}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(stage.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {stage.teams} Teams
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
