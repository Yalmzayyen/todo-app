"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import {
  CalendarIcon,
  MessageSquare,
  Paperclip,
  MoreVertical,
  Pencil,
  Trash2,
  Plus,
  Search,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { TaskDialog } from "./task-dialog"
import {  FilterOptions } from "./filter-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

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

const STORAGE_KEY = 'todo-tasks'

export function TodoList() {
  const { toast } = useToast()
  const [tasks, setTasks] = React.useState<Task[]>([])
  const [isInitialized, setIsInitialized] = React.useState(false)
  const [filters, setFilters] = React.useState<FilterOptions>({
    search: "",
    priority: "all",
    assignee: "",
    location: "",
    completed: "all"
  })

  // Initialize from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsedTasks = JSON.parse(saved)
      console.log('Loaded tasks:', parsedTasks)
      setTasks(parsedTasks)
    } else {
      // Add a default task if no tasks exist
      const defaultTask = {
        id: Date.now(),
        title: "Welcome to your Todo List!",
        description: "Click 'New Task' to add more tasks, or 'Edit' to modify this one.",
        date: format(new Date(), "MMM d, yyyy"),
        priority: "medium",
        completed: false,
        comments: 0,
        attachments: 0,
        tags: ["example"]
      }
      setTasks([defaultTask])
    }
    setIsInitialized(true)
  }, [])

  // Save to localStorage when tasks change, but only after initialization
  React.useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    }
  }, [tasks, isInitialized])

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newTask = { ...task, completed: !task.completed }
        toast({
          description: `Task "${task.title}" marked as ${newTask.completed ? 'completed' : 'incomplete'}`
        })
        return newTask
      }
      return task
    }))
  }

  const handleNewTask = (task: Task) => {
    setTasks(prev => [task, ...prev])
    toast({
      description: "Task added successfully"
    })
  }

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    ))
    toast({
      description: "Task updated successfully"
    })
  }

  const handleDeleteTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId)
    setTasks(prev => prev.filter(task => task.id !== taskId))
    toast({
      variant: "destructive",
      description: `Task "${task?.title}" deleted`
    })
  }

  const markAllAsCompleted = () => {
    setTasks(prev => prev.map(task => ({ ...task, completed: true })))
    toast({
      description: "All tasks marked as completed"
    })
  }

  const deleteAllTasks = () => {
    setTasks([])
    toast({
      variant: "destructive",
      description: "All tasks deleted"
    })
  }

  const getTagVariant = (tag: string): "default" | "secondary" | "destructive" | "outline" => {
    switch(tag) {
      case 'LaunchPad':
        return 'destructive'
      case 'Dabble':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const filteredTasks = tasks.filter(task => {
    console.log('Filtering task:', task)
    console.log('Current filters:', filters)
    
    const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase())
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority
    const matchesAssignee = !filters.assignee || 
      (task.assignee?.toLowerCase().includes(filters.assignee.toLowerCase()))
    const matchesLocation = !filters.location || 
      (task.location?.toLowerCase().includes(filters.location.toLowerCase()))
    const matchesCompleted = filters.completed === 'all' || 
      (filters.completed === 'completed' ? task.completed : !task.completed)

    const matches = matchesSearch && matchesPriority && matchesAssignee && 
           matchesLocation && matchesCompleted

    console.log('Task matches filters:', matches)
    return matches
  })

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b pb-6 mb-8"
      >
        <h1 className="text-4xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          To-Do List
        </h1>
        <p className="text-muted-foreground mt-2">Organize your tasks efficiently</p>
      </motion.header>

      <div className="space-y-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <TaskDialog onTaskCreate={handleNewTask}>
            <Button size="lg" className="w-full sm:w-auto gap-2 shadow-sm">
              <Plus className="w-5 h-5" />
              New Task
            </Button>
          </TaskDialog>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-9 w-full"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <div className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Status
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filters.completed === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, completed: "all" }))}
                className="min-w-[80px]"
              >
                All
              </Button>
              <Button
                variant={filters.completed === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, completed: "pending" }))}
                className="min-w-[80px]"
              >
                Active
              </Button>
              <Button
                variant={filters.completed === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, completed: "completed" }))}
                className="min-w-[80px]"
              >
                Done
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <div className="text-sm font-medium">Priority</div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filters.priority === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, priority: "all" }))}
                className="min-w-[80px]"
              >
                All
              </Button>
              <Button
                variant={filters.priority === "high" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, priority: "high" }))}
                className={cn(
                  "min-w-[80px]",
                  filters.priority === "high" 
                    ? "bg-red-500 hover:bg-red-600 text-white border-red-500" 
                    : "hover:border-red-500 hover:text-red-500"
                )}
              >
                High
              </Button>
              <Button
                variant={filters.priority === "medium" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, priority: "medium" }))}
                className={cn(
                  "min-w-[80px]",
                  filters.priority === "medium"
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
                    : "hover:border-yellow-500 hover:text-yellow-500"
                )}
              >
                Medium
              </Button>
              <Button
                variant={filters.priority === "low" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, priority: "low" }))}
                className={cn(
                  "min-w-[80px]",
                  filters.priority === "low"
                    ? "bg-green-500 hover:bg-green-600 text-white border-green-500"
                    : "hover:border-green-500 hover:text-green-500"
                )}
              >
                Low
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <div className="text-sm font-medium">Filter by</div>
            <div className="grid gap-2">
              <Input
                placeholder="👤 Assignee"
                value={filters.assignee}
                onChange={(e) => setFilters(prev => ({ ...prev, assignee: e.target.value }))}
              />
              <Input
                placeholder="📍 Location"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </motion.div>
        </div>

        <div className="flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-md">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total
            </Badge>
            {(filters.completed !== 'all' || filters.priority !== 'all' || filters.search || filters.assignee || filters.location) && (
              <Badge variant="outline" className="rounded-md">
                {filteredTasks.length} shown
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {tasks.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsCompleted}
                  className="gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark all done
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <XCircle className="w-4 h-4" />
                      Delete all
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete all tasks?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all your tasks.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={deleteAllTasks}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete all
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
            {(filters.completed !== 'all' || filters.priority !== 'all' || filters.search || filters.assignee || filters.location) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({
                  search: "",
                  priority: "all",
                  assignee: "",
                  location: "",
                  completed: "all"
                })}
                className="gap-2"
              >
                <XCircle className="w-4 h-4" />
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/10">
            {tasks.length === 0 ? (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg font-medium">No tasks yet</p>
                <p className="text-sm text-muted-foreground mt-1">Click "New Task" to get started</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium">No matching tasks</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden transition-all hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                        className="mt-1"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-lg font-medium truncate",
                              task.completed && "line-through text-muted-foreground"
                            )}>
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-start gap-2 flex-shrink-0">
                            {task.priority && (
                              <Badge
                                variant={task.priority === 'high' ? 'destructive' : 'outline'}
                                className={cn(
                                  "capitalize",
                                  task.priority === 'medium' && "border-yellow-500 text-yellow-500",
                                  task.priority === 'low' && "border-green-500 text-green-500"
                                )}
                              >
                                {task.priority}
                              </Badge>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem asChild>
                                  <TaskDialog
                                    task={task}
                                    onTaskCreate={handleNewTask}
                                    onTaskUpdate={handleUpdateTask}
                                    trigger={
                                      <button className="w-full flex items-center">
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                      </button>
                                    }
                                  />
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <AlertDialog>
                                    <AlertDialogTrigger className="w-full flex items-center px-2 py-1.5 text-destructive">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete task?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will permanently delete "{task.title}".
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteTask(task.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          {task.assignee && (
                            <div className="flex items-center gap-1">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-medium">
                                {task.assignee[0].toUpperCase()}
                              </span>
                              <span>{task.assignee}</span>
                            </div>
                          )}

                          {task.date && (
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              <span className={task.date === "Tomorrow" ? "text-orange-500" : ""}>
                                {task.date}
                              </span>
                            </div>
                          )}

                          {task.location && (
                            <div className="flex items-center gap-1">
                              <span>📍</span>
                              <span>{task.location}</span>
                            </div>
                          )}

                          {task.comments > 0 && (
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{task.comments}</span>
                            </div>
                          )}

                          {task.attachments > 0 && (
                            <div className="flex items-center gap-1">
                              <Paperclip className="w-4 h-4" />
                              <span>{task.attachments}</span>
                            </div>
                          )}

                          {task.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant={getTagVariant(tag)}
                              className="text-xs rounded-md"
                            >
                              @{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
} 