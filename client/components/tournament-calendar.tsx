"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, ChevronLeft, ChevronRight, Plus, Trophy } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Mock tournament data with dates
const tournaments = [
  {
    id: "1",
    title: "Summer Valorant Championship",
    game: "Valorant",
    status: "open",
    date: "2025-07-15",
    prizePool: "$5,000",
  },
  {
    id: "2",
    title: "CS2 Pro League Season 5",
    game: "CS2",
    status: "upcoming",
    date: "2025-08-10",
    prizePool: "$10,000",
  },
  {
    id: "3",
    title: "Rocket League Cup",
    game: "Rocket League",
    status: "ongoing",
    date: "2025-06-01",
    prizePool: "$3,000",
  },
  {
    id: "4",
    title: "League of Legends Winter Tournament",
    game: "League of Legends",
    status: "closed",
    date: "2025-01-15",
    prizePool: "$7,500",
  },
  {
    id: "5",
    title: "Apex Legends Championship",
    game: "Apex Legends",
    status: "upcoming",
    date: "2025-07-22",
    prizePool: "$4,000",
  },
  {
    id: "6",
    title: "Fortnite Battle Royale",
    game: "Fortnite",
    status: "open",
    date: "2025-07-08",
    prizePool: "$2,500",
  },
]

// Game color mapping
const gameColors: Record<string, string> = {
  Valorant: "bg-red-500/20 text-red-500 border-red-500/20",
  CS2: "bg-orange-500/20 text-orange-500 border-orange-500/20",
  "Rocket League": "bg-blue-500/20 text-blue-500 border-blue-500/20",
  "League of Legends": "bg-purple-500/20 text-purple-500 border-purple-500/20",
  "Apex Legends": "bg-green-500/20 text-green-500 border-green-500/20",
  Fortnite: "bg-yellow-500/20 text-yellow-500 border-yellow-500/20",
}

// Status color mapping
const statusColors: Record<string, string> = {
  open: "bg-green-500/20 text-green-500 border-green-500/20",
  closed: "bg-red-500/20 text-red-500 border-red-500/20",
  upcoming: "bg-blue-500/20 text-blue-500 border-blue-500/20",
  ongoing: "bg-yellow-500/20 text-yellow-500 border-yellow-500/20",
}

export function TournamentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Get the first day of the month and the number of days in the month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  // Generate calendar days
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Get tournaments for a specific date
  const getTournamentsForDate = (day: number) => {
    const dateString = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split("T")[0]
    return tournaments.filter((tournament) => tournament.date === dateString)
  }

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tournament Calendar</h1>
          <p className="text-muted-foreground">View and manage your tournament schedule</p>
        </div>
        <Link href="/tournaments/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Tournament
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <CardDescription>
                {
                  tournaments.filter((t) => {
                    const tournamentDate = new Date(t.date)
                    return (
                      tournamentDate.getMonth() === currentDate.getMonth() &&
                      tournamentDate.getFullYear() === currentDate.getFullYear()
                    )
                  }).length
                }{" "}
                tournaments this month
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={cn(
                  "min-h-[120px] p-2 border rounded-lg",
                  day ? "bg-card hover:bg-accent/50" : "bg-muted/20",
                  day === new Date().getDate() &&
                    currentDate.getMonth() === new Date().getMonth() &&
                    currentDate.getFullYear() === new Date().getFullYear() &&
                    "ring-2 ring-primary/20 bg-primary/5",
                )}
              >
                {day && (
                  <>
                    <div className="text-sm font-medium mb-2">{day}</div>
                    <div className="space-y-1">
                      {getTournamentsForDate(day).map((tournament) => (
                        <Link key={tournament.id} href={`/tournaments/${tournament.id}`}>
                          <div className="p-1 rounded text-xs bg-background border hover:bg-accent cursor-pointer">
                            <div className="flex items-center gap-1 mb-1">
                              <Badge className={cn("text-xs px-1 py-0", gameColors[tournament.game])}>
                                {tournament.game}
                              </Badge>
                              <Badge className={cn("text-xs px-1 py-0", statusColors[tournament.status])}>
                                {tournament.status}
                              </Badge>
                            </div>
                            <div className="font-medium truncate">{tournament.title}</div>
                            <div className="text-muted-foreground flex items-center gap-1">
                              <Trophy className="h-3 w-3" />
                              {tournament.prizePool}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming tournaments list */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Tournaments</CardTitle>
          <CardDescription>Next tournaments in chronological order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tournaments
              .filter((t) => new Date(t.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 5)
              .map((tournament) => (
                <Link key={tournament.id} href={`/tournaments/${tournament.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <div className="font-medium">{tournament.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(tournament.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={gameColors[tournament.game]}>{tournament.game}</Badge>
                      <Badge className={statusColors[tournament.status]}>
                        {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                      </Badge>
                      <div className="text-sm font-medium">{tournament.prizePool}</div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
