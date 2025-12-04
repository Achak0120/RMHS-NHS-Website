import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DateManagementDialog = ({ isOpen, setIsOpen, date, onSave }) => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');

  useEffect(() => {
    if (date) {
      setEventName(date.event_name || '');
      setEventDate(date.event_date || '');
    } else {
      setEventName('');
      setEventDate('');
    }
  }, [date, isOpen]);

  const handleSave = () => {
    onSave({ ...date, event_name: eventName, event_date: eventDate });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{date ? 'Edit Important Date' : 'Add Important Date'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="event-name" className="text-right">
              Event
            </Label>
            <Input
              id="event-name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="event-date" className="text-right">
              Date
            </Label>
            <Input
              id="event-date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end">
            <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DateManagementDialog;