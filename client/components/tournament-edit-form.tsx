"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Clock,
  Info,
  MapPin,
  Plus,
  Save,
  Shield,
  Trash2,
  Trophy,
  Users,
  X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Game options
const gameOptions = [
  { value: "valorant", label: "Valorant" },
  { value: "counterStrike2", label: "CS2" },
  { value: "bgmi", label: "BGMI" },
  { value: "freeFire", label: "Free Fire" },
]

// Mock existing tournament data


// Form steps
const steps = [
  { id: "basic", label: "Basic Info" },
  { id: "details", label: "Tournament Details" },
  { id: "rules", label: "Rules & Schedule" },
  { id: "review", label: "Review & Save" },
]

export function TournamentEditForm({ id }: { id: string }) {
  const [currentStep, setCurrentStep] = useState("basic")
  const router = useRouter()
    const [formData, setFormData] = useState({
      title: "",
      game: "",
      description: "",
      date: "",
      maxPlayers: "",
      prizePool: "",
      trustScoreThreshold: "750",
      registrationDeadline: "",
      location: "Online",
      rules: ["", ""],
      schedule: [
        { stage: "Qualifiers", date: "", teams: "" },
        { stage: "Finals", date: "", teams: "" },
      ],
      entryFee: "0",
      hasFee: false,
      tags: ["competitive", "official"],
    })
  const [isLoading, setIsLoading] = useState(false)

  // In a real app, you would fetch the tournament data based on the ID
  useEffect(() => {
    // Simulate loading existing tournament data
     async function fetchTournament() {
          try {
            const res = await apiClient.get(`/api/tournament/${id}`)
            
               setFormData(res.data)
          } catch (err) {
            console.error(err)
          }
        }
    
        if (id) fetchTournament()

  }, [id])

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle rules change
  const handleRuleChange = (index: number, value: string) => {
    const newRules = [...formData.rules]
    newRules[index] = value
    setFormData((prev) => ({ ...prev, rules: newRules }))
  }

  // Add new rule
  const addRule = () => {
    setFormData((prev) => ({ ...prev, rules: [...prev.rules, ""] }))
  }

  // Remove rule
  const removeRule = (index: number) => {
    const newRules = [...formData.rules]
    newRules.splice(index, 1)
    setFormData((prev) => ({ ...prev, rules: newRules }))
  }

  // Handle schedule change
  const handleScheduleChange = (index: number, field: string, value: string) => {
    const newSchedule = [...formData.schedule]
    newSchedule[index] = { ...newSchedule[index], [field]: value }
    setFormData((prev) => ({ ...prev, schedule: newSchedule }))
  }

  // Add new schedule item
  const addScheduleItem = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [...prev.schedule, { stage: "", date: "", teams: "" }],
    }))
  }

  // Remove schedule item
  const removeScheduleItem = (index: number) => {
    const newSchedule = [...formData.schedule]
    newSchedule.splice(index, 1)
    setFormData((prev) => ({ ...prev, schedule: newSchedule }))
  }

  // Toggle entry fee
  const toggleEntryFee = () => {
    setFormData((prev) => ({
      ...prev,
      hasFee: !prev.hasFee,
      entryFee: !prev.hasFee ? prev.entryFee : "0",
    }))
  }

  // Handle tag toggle
  const toggleTag = (tag: string) => {
    const newTags = formData.tags.includes(tag) ? formData.tags.filter((t) => t !== tag) : [...formData.tags, tag]
    setFormData((prev) => ({ ...prev, tags: newTags }))
  }

  // Navigate to next step
  const nextStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id)
      window.scrollTo(0, 0)
    }
  }

  // Navigate to previous step
  const prevStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id)
      window.scrollTo(0, 0)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    try {
    const payload = {
      ...formData,
      maxPlayers: parseInt(formData.maxPlayers),
      trustScoreThreshold: parseInt(formData.trustScoreThreshold),
      date: new Date(formData.date),
      registrationDeadline: new Date(formData.registrationDeadline),
      schedule: formData.schedule.map((s: any) => ({
        ...s,
        date: new Date(s.date)
      })),
      entryFee: formData.hasFee ? formData.entryFee : "0"
    };

    const res = await apiClient.put(`/api/tournament/edit/${id}`, payload);

    toast.success("Tournament created successfully!");
    console.log("Tournament response:", res.data);

    // Optional: redirect or reset
    router.push(`/tournaments/${id}`);
  } catch (err: any) {
    console.error("Tournament creation failed:", err.response?.data || err.message);
    toast.error(err.response?.data?.error || "Failed to create tournament.");
  }   
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
          <h1 className="text-2xl font-bold tracking-tight">Edit Tournament</h1>
          <p className="text-muted-foreground">Update your tournament details</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />}
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium cursor-pointer",
                  currentStep === step.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setCurrentStep(step.id)}
              >
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-xs",
                    currentStep === step.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {index + 1}
                </div>
                <span>{step.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Info */}
        {currentStep === "basic" && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update the basic details of your tournament</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Tournament Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter tournament title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="game">Game</Label>
                  <Select value={formData.game} onValueChange={(value) => handleSelectChange("game", value)} required>
                    <SelectTrigger id="game">
                      <SelectValue placeholder="Select a game" />
                    </SelectTrigger>
                    <SelectContent>
                      {gameOptions.map((game) => (
                        <SelectItem key={game.value} value={game.value}>
                          {game.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter tournament description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">Tournament Start Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="pl-8"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        name="location"
                        placeholder="Online or physical location"
                        value={formData.location}
                        onChange={handleChange}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {["competitive", "casual", "official", "community", "beginner", "advanced"].map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className={cn(
                          "cursor-pointer hover:bg-accent",
                          formData.tags.includes(tag) && "bg-primary/10 text-primary border-primary/20",
                        )}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={`/tournaments/${id}`}>
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button onClick={nextStep}>Continue</Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 2: Tournament Details */}
        {currentStep === "details" && (
          <Card>
            <CardHeader>
              <CardTitle>Tournament Details</CardTitle>
              <CardDescription>Update the tournament parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxPlayers">Maximum Players/Teams</Label>
                  <div className="relative">
                    <Users className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="maxPlayers"
                      name="maxPlayers"
                      type="number"
                      placeholder="Enter max players"
                      value={formData.maxPlayers}
                      onChange={handleChange}
                      className="pl-8"
                      min="2"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prizePool">Prize Pool</Label>
                  <div className="relative">
                    <Trophy className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="prizePool"
                      name="prizePool"
                      placeholder="e.g. $1,000"
                      value={formData.prizePool}
                      onChange={handleChange}
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="trustScoreThreshold">Trust Score Threshold</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Minimum trust score required for players to join</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <Shield className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="trustScoreThreshold"
                      name="trustScoreThreshold"
                      type="number"
                      placeholder="750"
                      value={formData.trustScoreThreshold}
                      onChange={handleChange}
                      className="pl-8"
                      min="0"
                      max="1000"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="registrationDeadline"
                      name="registrationDeadline"
                      type="date"
                      value={formData.registrationDeadline}
                      onChange={handleChange}
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Entry Fee</Label>
                  <Button type="button" variant="outline" size="sm" onClick={toggleEntryFee}>
                    {formData.hasFee ? "Remove Fee" : "Add Entry Fee"}
                  </Button>
                </div>

                {formData.hasFee && (
                  <div className="space-y-2">
                    <Input
                      name="entryFee"
                      type="number"
                      placeholder="Enter entry fee amount"
                      value={formData.entryFee}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep}>Continue</Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 3: Rules & Schedule */}
        {currentStep === "rules" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Rules</CardTitle>
                <CardDescription>Update the rules that participants must follow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.rules.map((rule, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder={`Rule ${index + 1}`}
                        value={rule}
                        onChange={(e) => handleRuleChange(index, e.target.value)}
                      />
                    </div>
                    {formData.rules.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeRule(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addRule} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Rule
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tournament Schedule</CardTitle>
                <CardDescription>Update the stages and timeline of your tournament</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.schedule.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Label>Stage Name</Label>
                      <Input
                        placeholder="e.g. Qualifiers"
                        value={item.stage}
                        onChange={(e) => handleScheduleChange(index, "stage", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={item.date}
                        onChange={(e) => handleScheduleChange(index, "date", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Number of Teams</Label>
                        {formData.schedule.length > 1 && (
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeScheduleItem(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <Input
                        type="number"
                        placeholder="e.g. 16"
                        value={item.teams}
                        onChange={(e) => handleScheduleChange(index, "teams", e.target.value)}
                        min="1"
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addScheduleItem} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Stage
                </Button>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button onClick={nextStep}>Continue</Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Step 4: Review & Save */}
        {currentStep === "review" && (
          <Card>
            <CardHeader>
              <CardTitle>Review Changes</CardTitle>
              <CardDescription>Review all changes before saving your tournament</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Tournament Title</h3>
                    <p className="font-medium">{formData.title}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Game</h3>
                    <p className="font-medium">{gameOptions.find((g) => g.value === formData.game)?.label}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Description</h3>
                    <p className="text-sm">{formData.description}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Location</h3>
                    <p className="font-medium">{formData.location}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Start Date</h3>
                    <p className="font-medium">{new Date(formData.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Max Players</h3>
                    <p className="font-medium">{formData.maxPlayers}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Prize Pool</h3>
                    <p className="font-medium">{formData.prizePool}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Trust Score Threshold</h3>
                    <p className="font-medium">{formData.trustScoreThreshold}+</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Registration Deadline</h3>
                    <p className="font-medium">{new Date(formData.registrationDeadline).toLocaleDateString()}</p>
                  </div>
                  {formData.hasFee && (
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Entry Fee</h3>
                      <p className="font-medium">${formData.entryFee}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Rules</h3>
                <ul className="list-disc pl-6 space-y-1">
                  {formData.rules
                    .filter((rule) => rule.trim())
                    .map((rule, index) => (
                      <li key={index} className="text-sm">
                        {rule}
                      </li>
                    ))}
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Schedule</h3>
                <div className="space-y-2">
                  {formData.schedule
                    .filter((item) => item.stage && item.date)
                    .map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="font-medium">{item.stage}</span>
                        <span className="text-muted-foreground">
                          {new Date(item.date).toLocaleDateString()} • {item.teams} teams
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </form>
    </div>
  )
}
