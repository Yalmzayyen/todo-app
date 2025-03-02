"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FilterIcon } from "lucide-react"

interface FilterDialogProps {
  onFilterChange: (filters: FilterOptions) => void
}

export interface FilterOptions {
  search: string
  priority: string
  assignee: string
  location: string
  completed: string
}

export function FilterDialog({ onFilterChange }: FilterDialogProps) {
  const [filters, setFilters] = React.useState<FilterOptions>({
    search: "",
    priority: "all",
    assignee: "",
    location: "",
    completed: "all"
  })

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FilterIcon className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Tasks</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="search">Search by task name</Label>
            <Input
              id="search"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search tasks..."
            />
          </div>
          <div className="grid gap-2">
            <Label>Priority</Label>
            <Select
              value={filters.priority}
              onValueChange={(value) => handleFilterChange("priority", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Status</Label>
            <Select
              value={filters.completed}
              onValueChange={(value) => handleFilterChange("completed", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Input
              id="assignee"
              value={filters.assignee}
              onChange={(e) => handleFilterChange("assignee", e.target.value)}
              placeholder="Filter by assignee"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              placeholder="Filter by location"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 