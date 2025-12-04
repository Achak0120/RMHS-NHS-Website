
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

const BoardMemberDialog = ({ isOpen, setIsOpen, member, onSave }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    if (member) {
      setName(member.name || '');
      setPosition(member.position || '');
      setPhotoUrl(member.photo_url || '');
    } else {
      setName('');
      setPosition('');
      setPhotoUrl('');
    }
  }, [member, isOpen]);

  const handleSave = () => {
    onSave({ ...member, name, position, photo_url: photoUrl });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{member ? 'Edit Board Member' : 'Add Board Member'}</DialogTitle>
          <DialogDescription>
            {member ? "Update the board member's details below." : "Enter the new board member's details below."}
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
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="position" className="text-right">
              Position
            </Label>
            <Input
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="photoUrl" className="text-right">
              Photo URL
            </Label>
            <Input
              id="photoUrl"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://..."
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!name.trim() || !position.trim()}>Save Member</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BoardMemberDialog;
