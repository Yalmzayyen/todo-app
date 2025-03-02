"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"

interface Task {
  id: number
  title: string
  description?: string
  assignee?: string
  date: string
  priority?: string
  location?: string
  comments: number
  attachments: number
  completed: boolean
  tags: string[]
}

interface TaskDialogProps {
  task?: Task
  onTaskCreate: (task: Task) => void
  onTaskUpdate?: (task: Task) => void
  children?: React.ReactNode
  trigger?: React.ReactNode
}

export function TaskDialog({ task, onTaskCreate, onTaskUpdate, children, trigger }: TaskDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState(task?.title ?? "")
  const [description, setDescription] = React.useState(task?.description ?? "")
  const [assignee, setAssignee] = React.useState(task?.assignee ?? "")
  const [priority, setPriority] = React.useState(task?.priority ?? "")
  const [location, setLocation] = React.useState(task?.location ?? "")
  const [tags, setTags] = React.useState(task?.tags?.join(", ") ?? "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedTask: Task = {
      id: task?.id ?? Date.now(),
      title,
      description,
      assignee,
      date: format(new Date(), "MMM d, yyyy"),
      priority,
      location,
      comments: task?.comments ?? 0,
      attachments: task?.attachments ?? 0,
      completed: task?.completed ?? false,
      tags: tags.split(",").map(tag => tag.trim()).filter(Boolean)
    }

    if (task && onTaskUpdate) {
      onTaskUpdate(updatedTask)
    } else {
      onTaskCreate(updatedTask)
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || trigger || (
          <Button size="sm">
            {task ? "Edit Task" : "New Task"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle>
            <DialogDescription>
              {task ? "Make changes to your task here." : "Add a new task to your list."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="assignee" className="text-sm font-medium">
                Assignee
              </label>
              <Input
                id="assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Task assignee"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Priority
              </label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Task location"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags
              </label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Comma-separated tags"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{task ? "Save changes" : "Create task"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 