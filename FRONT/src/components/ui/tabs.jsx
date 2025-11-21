import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from '@/lib/utils'

function Tabs({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props} />
  );
}

function TabsList({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-12 w-full items-center justify-center",
        className
      )}
      {...props} />
  );
}

function TabsTrigger({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex flex-1 items-center justify-center px-4 py-3 text-sm font-medium text-muted-foreground whitespace-nowrap transition-all duration-200",
        "hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:text-primary",
        "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:transition-all after:duration-200",
        "after:scale-x-0 data-[state=active]:after:scale-x-100",
        className
      )}
      {...props} />
  );
}

function TabsContent({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none pt-6", className)}
      {...props} />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
