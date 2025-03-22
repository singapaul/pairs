'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react'
import { CardPair, DeckMetadata, SUBJECTS, YEAR_GROUPS } from '@/types/deck'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Card } from '@/types/deck'

const PAIR_OPTIONS = [8, 12, 16, 20] as const

export default function CreateDeckPage() {
  const [step, setStep] = useState(1)
  const [numPairs, setNumPairs] = useState<typeof PAIR_OPTIONS[number]>(8)
  const [pairs, setPairs] = useState<CardPair[]>([])
  const [metadata, setMetadata] = useState<DeckMetadata>({
    title: '',
    description: '',
    subject: SUBJECTS[0],
    yearGroup: YEAR_GROUPS[0],
    topic: '',
    isPublic: true
  })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const updatePair = (id: string, field: 'question' | 'answer', value: string) => {
    setPairs(prev => prev.map(pair => 
      pair.id === id ? { ...pair, [field]: value } : pair
    ))
  }

  const initializePairs = (count: number) => {
    const newPairs = Array.from({ length: count }, () => ({
      id: uuidv4(),
      question: '',
      answer: ''
    }))
    setPairs(newPairs)
  }

  const handleNext = () => {
    if (step === 1) {
      initializePairs(numPairs)
      setStep(2)
    } else if (step === 2) {
      // Validate all pairs are filled
      const isValid = pairs.every(pair => 
        pair.question.trim() && pair.answer.trim()
      )
      if (!isValid) {
        toast.error('Please fill in all question-answer pairs')
        return
      }
      setStep(3)
    }
  }

  const handleBack = () => {
    setStep(prev => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('You must be signed in to create a deck')
      router.push('/auth')
      return
    }

    if (!metadata.title.trim() || !metadata.description.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)

      // Convert pairs to cards array
      const cards: Card[] = pairs.flatMap(pair => [
        { id: uuidv4(), content: `Q: ${pair.question}`, pairId: pair.id },
        { id: uuidv4(), content: `A: ${pair.answer}`, pairId: pair.id }
      ])

      const deck = {
        ...metadata,
        cards: cards.sort(() => Math.random() - 0.5), // Shuffle cards
        userId: user.uid,
        createdAt: new Date(),
        plays: 0 // Initialize plays count
      }

      await addDoc(collection(db, 'decks'), deck)
      toast.success('Deck created successfully!')
      router.push('/decks')
    } catch (error) {
      console.error('Error creating deck:', error)
      toast.error('Failed to create deck. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 mt-16">
      <div className="mb-8">
        <Progress value={step * 33.33} className="h-2" />
        <p className="text-sm text-gray-500 mt-2">Step {step} of 3</p>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">How many pairs?</h1>
          <RadioGroup
            value={numPairs.toString()}
            onValueChange={(value) => setNumPairs(Number(value) as typeof PAIR_OPTIONS[number])}
            className="grid grid-cols-2 gap-4"
          >
            {PAIR_OPTIONS.map((num) => (
              <div key={num}>
                <RadioGroupItem
                  value={num.toString()}
                  id={`pairs-${num}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`pairs-${num}`}
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span className="text-2xl font-bold">{num}</span>
                  <span className="text-sm text-muted-foreground">pairs</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Enter Card Pairs</h1>
          <div className="space-y-4">
            {pairs.map((pair, index) => (
              <div
                key={pair.id}
                className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-none w-6 text-gray-400 font-medium">
                  {index + 1}.
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    value={pair.question}
                    onChange={(e) => updatePair(pair.id, 'question', e.target.value)}
                    placeholder="Question"
                    className="bg-white"
                  />
                  <Input
                    value={pair.answer}
                    onChange={(e) => updatePair(pair.id, 'answer', e.target.value)}
                    placeholder="Answer"
                    className="bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-2xl font-bold">Deck Details</h1>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={metadata.title}
                onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter deck title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={metadata.description}
                onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter deck description"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={metadata.subject}
                  onValueChange={(value) => setMetadata(prev => ({ ...prev, subject: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearGroup">Year Group</Label>
                <Select
                  value={metadata.yearGroup}
                  onValueChange={(value) => setMetadata(prev => ({ ...prev, yearGroup: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year group" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEAR_GROUPS.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={metadata.topic}
                onChange={(e) => setMetadata(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="Enter topic"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="public"
                checked={metadata.isPublic}
                onCheckedChange={(checked) => 
                  setMetadata(prev => ({ ...prev, isPublic: checked }))
                }
              />
              <Label htmlFor="public">Make deck public</Label>
            </div>
          </div>
        </form>
      )}

      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <Button type="button" variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        ) : (
          <div ></div> 
        )}

        {step < 3 ? (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              'Create Deck'
            )}
          </Button>
        )}
      </div>
    </div>
  )
} 