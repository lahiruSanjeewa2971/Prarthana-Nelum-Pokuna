'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useBookingStats } from '@/hooks/useBookings';

interface BookingFiltersProps {
  activeStatus: 'all' | 'PENDING' | 'ACCEPTED' | 'REJECTED';
  onStatusChange: (status: 'all' | 'PENDING' | 'ACCEPTED' | 'REJECTED') => void;
}

export function BookingFilters({ activeStatus, onStatusChange }: BookingFiltersProps) {
  const { data: stats } = useBookingStats();

  const filters = [
    { 
      label: 'All', 
      value: 'all' as const, 
      count: stats?.total ?? 0 
    },
    { 
      label: 'Pending', 
      value: 'PENDING' as const, 
      count: stats?.pending ?? 0 
    },
    { 
      label: 'Accepted', 
      value: 'ACCEPTED' as const, 
      count: stats?.accepted ?? 0 
    },
    { 
      label: 'Rejected', 
      value: 'REJECTED' as const, 
      count: stats?.rejected ?? 0 
    },
  ];

  const activeFilter = filters.find(f => f.value === activeStatus);

  return (
    <>
      {/* Mobile Dropdown */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                {activeFilter?.label}
                <span className="text-xs text-muted-foreground">
                  ({activeFilter?.count})
                </span>
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            {filters.map((filter) => (
              <DropdownMenuItem
                key={filter.value}
                onClick={() => onStatusChange(filter.value)}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>{filter.label}</span>
                <span className="text-xs text-muted-foreground">
                  ({filter.count})
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:block">
        <Tabs value={activeStatus} onValueChange={(value: string) => onStatusChange(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            {filters.map((filter) => (
              <TabsTrigger 
                key={filter.value} 
                value={filter.value}
                className="flex items-center gap-2"
              >
                <span>{filter.label}</span>
                <span className="text-xs text-muted-foreground">
                  ({filter.count})
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </>
  );
}
