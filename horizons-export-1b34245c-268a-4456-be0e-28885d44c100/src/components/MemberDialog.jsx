import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const MemberDialog = ({ isOpen, setIsOpen, member, onSave }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (member) {
      setName(member.name || '');
    } else {
      setName('');
    }
  }, [member, isOpen]);

  const handleSave = () => {
    onSave({ ...member, name });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{member ? 'Edit Member' : 'Add New Member'}</DialogTitle>
          <DialogDescription>
            {member ? "Update the member's name below." : "Enter the new member's name below."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!name.trim()}>Save Member</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MemberDialog;