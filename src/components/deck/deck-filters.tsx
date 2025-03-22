'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SUBJECTS, YEAR_GROUPS } from '@/types/deck'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'

const PAIR_COUNTS = [8, 12, 16, 20]

interface DeckFilters {
  yearGroup: string | null
  subject: string | null
  topic: string
  pairCount: number | null
}

interface DeckFiltersProps {
  filters: DeckFilters
  onChange: (filters: DeckFilters) => void
  onReset: () => void
  totalDecks: number
}

export function DeckFilters({ filters, onChange, onReset, totalDecks }: DeckFiltersProps) {
  const handleChange = (key: keyof DeckFilters, value: string | number | null) => {
    onChange({
      ...filters,
      [key]: value
    })
  }

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{totalDecks} decks found</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="w-full md:w-auto space-y-2">
          <Label>Year Group</Label>
          <Select
            value={filters.yearGroup || undefined}
            onValueChange={(value) => handleChange('yearGroup', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All year groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All year groups</SelectItem>
              {YEAR_GROUPS.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-auto space-y-2">
          <Label>Subject</Label>
          <Select
            value={filters.subject || undefined}
            onValueChange={(value) => handleChange('subject', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All subjects</SelectItem>
              {SUBJECTS.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-auto space-y-2">
          <Label>Topic</Label>
          <Input
            placeholder="Filter by topic"
            value={filters.topic}
            onChange={(e) => handleChange('topic', e.target.value)}
            className="w-full"
          />
        </div>

        <div className="w-full md:w-auto space-y-2">
          <Label>Number of Pairs</Label>
          <Select
            value={filters.pairCount?.toString() || undefined}
            onValueChange={(value) => handleChange('pairCount', value === 'all' ? null : parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Any number" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any number</SelectItem>
              {PAIR_COUNTS.map((count) => (
                <SelectItem key={count} value={count.toString()}>
                  {count} pairs
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
} 