import React from 'react';
import { CustomInput } from '@/admin/components/CustomInput';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarIcon, List } from 'lucide-react';
import { usePageStore } from '@/admin/usePageStore';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from '@/components/ui/card';
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from 'date-fns';
import { PageType } from '@/lib/page.types';

interface SidebarProps {
  isVisible: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isVisible }) => {

  const { page, updateMetadata, addSection } = usePageStore();
  console.log("page", page);
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = React.useState(false);
  const [isLastDatePickerOpen, setIsLastDatePickerOpen] = React.useState(false);
  if (!isVisible) return null;

  return (
    <aside className="lg:col-span-4 space-y-6">
      <Link href="/admin" className="text-sm text-blue-500 hover:text-blue-700 mb-4 dark:text-blue-400 flex items-center gap-2"><ArrowLeft /> Back to Admin Page</Link>

      <Card className="p-5 dark:bg-slate-900">
        <h2 className="block text-xs font-black uppercase text-slate-400 tracking-widest">Page Configurations</h2>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2 tracking-tighter dark:text-slate-400">Page Type</label>
          <Select value={page.type} onValueChange={(value) => updateMetadata({ type: value as PageType })}>
            <SelectTrigger className="w-full cursor-pointer dark:bg-slate-800 hover:dark:bg-slate-700">
              <SelectValue placeholder="Select Page Type" />
            </SelectTrigger>
            <SelectContent className=''>
              <SelectItem value="job">JOB</SelectItem>
              <SelectItem value="result">Result</SelectItem>
              <SelectItem value="admission">Admission</SelectItem>
              <SelectItem value="answer-key">Answer Key</SelectItem>
              <SelectItem value="offline-form">Offline Form</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CustomInput
          label="URL Slug"
          value={page.slug}
          onChange={e => updateMetadata({ slug: e.target.value })}
        />
      </Card>


      <Card className="p-5 dark:bg-slate-900">
        <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest">Post Metadata</h2>
        <div className="space-y-4">
          <CustomInput
            label="Title"
            value={page.title}
            onChange={e => updateMetadata({ title: e.target.value })}
          />
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 tracking-tighter dark:text-slate-400">Category</label>
            <Select value={page.category} onValueChange={(value) => updateMetadata({ category: value as string })}>
              <SelectTrigger className="w-full cursor-pointer dark:bg-slate-800 hover:dark:bg-slate-700">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className=''>
                <SelectItem value="railway">Railway</SelectItem>
                <SelectItem value="banking">Banking</SelectItem>
                <SelectItem value="defence">Defence</SelectItem>
                <SelectItem value="administration">Administration</SelectItem>
                <SelectItem value="teaching">Teaching</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 tracking-tighter dark:text-slate-400">Start Date for application</label>
            <Popover open={isStartDatePickerOpen} onOpenChange={setIsStartDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  // data-empty={!date}
                  className="w-full dark:bg-slate-800 hover:dark:bg-slate-700 data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
                >
                  <CalendarIcon />
                  {page?.importantDates?.startDateOfApplication ? format(page.importantDates.startDateOfApplication, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={page?.importantDates?.startDateOfApplication ? new Date(page.importantDates.startDateOfApplication) : undefined} onSelect={(date) => {
                  updateMetadata({ importantDates: { ...page.importantDates, startDateOfApplication: date?.toISOString() } })
                  setIsStartDatePickerOpen(false);
                }} />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 tracking-tighter dark:text-slate-400">Last Date for application</label>
            <Popover open={isLastDatePickerOpen} onOpenChange={setIsLastDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  // data-empty={!date}
                  className="w-full dark:bg-slate-800 hover:dark:bg-slate-700 data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
                >
                  <CalendarIcon />
                  {page?.importantDates?.lastDateOfApplication ? format(page.importantDates.lastDateOfApplication, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={page?.importantDates?.lastDateOfApplication ? new Date(page.importantDates.lastDateOfApplication) : undefined} onSelect={(date) => {
                  updateMetadata({ importantDates: { ...page.importantDates, lastDateOfApplication: date?.toISOString() } })
                  setIsLastDatePickerOpen(false);
                }} />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-tighter dark:text-slate-400">Summary</label>
            <textarea
              className="w-full p-2 border border-slate-300 rounded-lg text-sm min-h-[80px] text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              value={page.description}
              onChange={e => updateMetadata({ description: e.target.value })}
            />
          </div>
        </div>
      </Card>

      <Card className="p-5 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
            <List size={14} /> Structure
          </h2>
          <Button onClick={addSection} size="sm" variant="outline" className="h-6 px-2 text-[9px] font-bold">
            + NEW SECTION
          </Button>
        </div>
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {page.sections.map((sec, idx) => (
            <div key={sec._id} className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded border border-slate-200 group dark:bg-slate-800/50 dark:border-slate-700">
              <span className="truncate flex-1 font-semibold text-slate-600 italic dark:text-slate-300">
                {sec.title || 'Untitled'}
              </span>
              <span className="text-[9px] font-black text-slate-400 bg-white border border-slate-200 px-1 rounded ml-2 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500">
                #{idx + 1}
              </span>
            </div>
          ))}
          {page.sections.length === 0 && (
            <div className="text-center py-6 border border-dashed rounded text-slate-400 text-[10px] font-bold uppercase tracking-widest dark:border-slate-800">
              No Content Sections
            </div>
          )}
        </div>
      </Card>
    </aside>
  );
};