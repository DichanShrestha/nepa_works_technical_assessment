'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import AnalyticsCards from '@/components/AnalyticsCards';
import EventFilters from '@/components/EventFilters';
import EventTable from '@/components/EventTable';
import Pagination from '@/components/Pagination';
import { fetchEvents, fetchAnalytics } from '@/lib/api';
import { AppEvent, AnalyticsData } from '@/types/event';

export default function DashboardPage() {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Filter state
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async (isPoll = false) => {
      if (!isPoll) setIsLoading(true);
      try {
        const [eventsData, analyticsData] = await Promise.all([
          fetchEvents(
            currentPage, 
            limit, 
            filterType, 
            searchQuery, 
            startDate ? new Date(startDate).toISOString() : undefined, 
            endDate ? new Date(new Date(endDate).setHours(23, 59, 59, 999)).toISOString() : undefined
          ),
          fetchAnalytics()
        ]);
        
        if (isMounted) {
          setEvents(eventsData.events || []);
          setTotalPages(eventsData.pagination?.totalPages || 1);
          setAnalytics(analyticsData);
          setIsInitialLoad(false);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        if (isMounted && !isPoll) {
          setIsLoading(false);
        }
      }
    };

    loadData();
    const intervalId = setInterval(() => loadData(true), 5000);
    
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [currentPage, filterType, searchQuery, startDate, endDate]);

  const handleFilterChange = useCallback((type: string) => {
    setFilterType(type);
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleStartDateChange = useCallback((date: string) => {
    setStartDate(date);
    setCurrentPage(1);
  }, []);

  const handleEndDateChange = useCallback((date: string) => {
    setEndDate(date);
    setCurrentPage(1);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader />
        
        <AnalyticsCards data={analytics} isLoading={isLoading && isInitialLoad} />
        
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          </div>
          
          <EventFilters 
            currentFilter={filterType} 
            onFilterChange={handleFilterChange}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            startDate={startDate}
            onStartDateChange={handleStartDateChange}
            endDate={endDate}
            onEndDateChange={handleEndDateChange}
          />
          
          <EventTable events={events} isLoading={isLoading && isInitialLoad} />
          
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>
      </main>
    </div>
  );
}
