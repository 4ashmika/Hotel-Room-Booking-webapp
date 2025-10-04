

import React, { useState, useEffect } from 'react';
import { Room, Bed } from '../types';
import { ErrorBanner } from './ErrorBanner';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';

interface RoomFormProps {
  onSave: (room: Room) => Promise<void>;
  onCancel: () => void;
  initialRoom?: Room | null;
}

const emptyRoom: Room = {
  id: '',
  name: '',
  pricePerNight: 0,
  capacity: 1,
  description: '',
  images: [''],
  amenities: [''],
  beds: [{ type: 'Single', count: 1 }],
};

export const RoomForm: React.FC<RoomFormProps> = ({ onSave, onCancel, initialRoom }) => {
  const [room, setRoom] = useState<Room>(initialRoom || emptyRoom);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!initialRoom;

  useEffect(() => {
    if (initialRoom) {
      setRoom(initialRoom);
    } else {
      setRoom(emptyRoom);
    }
  }, [initialRoom]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const valueToSet = (name === 'pricePerNight' || name === 'capacity') ? parseInt(value, 10) || 0 : value;
    setRoom(prev => ({ ...prev, [name]: valueToSet }));
  };
  
  const handleListChange = (index: number, value: string, field: 'images' | 'amenities') => {
    const newList = [...room[field]];
    newList[index] = value;
    setRoom(prev => ({ ...prev, [field]: newList }));
  };

  const addListItem = (field: 'images' | 'amenities') => {
    setRoom(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeListItem = (index: number, field: 'images' | 'amenities') => {
    if (room[field].length <= 1) return;
    setRoom(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleBedChange = (index: number, field: 'type' | 'count', value: string) => {
    const newBeds = [...room.beds];
    newBeds[index] = { ...newBeds[index], [field]: field === 'count' ? parseInt(value, 10) || 1 : value };
    setRoom(prev => ({ ...prev, beds: newBeds }));
  };
  
  const addBed = () => {
    setRoom(prev => ({ ...prev, beds: [...prev.beds, { type: 'Single', count: 1 }] }));
  };

  const removeBed = (index: number) => {
    if (room.beds.length <= 1) return;
    setRoom(prev => ({ ...prev, beds: prev.beds.filter((_, i) => i !== index) }));
  };

  const validateForm = () => {
    if (!room.id.trim() || !room.name.trim() || !room.description.trim()) {
      setError('Room ID, Name, and Description cannot be empty.');
      return false;
    }
    if (room.pricePerNight <= 0 || room.capacity <= 0) {
      setError('Price and Capacity must be positive numbers.');
      return false;
    }
    if (room.images.some(img => !img.trim()) || room.amenities.some(am => !am.trim())) {
      setError('Image URLs and Amenities cannot be empty. Please remove any empty fields.');
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    setIsLoading(true);
    await onSave(room);
    setIsLoading(false);
  };
  
  const FormField = ({ label, children }) => (
      <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
          {children}
      </div>
  );

  return (
    <div className="p-6 sm:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{isEditing ? 'Edit Room' : 'Add New Room'}</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Room ID / Number">
                        <input type="text" name="id" value={room.id} onChange={handleChange} disabled={isEditing} placeholder="e.g., 101" className="w-full text-gray-900 bg-gray-50 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-200" />
                    </FormField>
                     <FormField label="Room Name">
                        <input type="text" name="name" value={room.name} onChange={handleChange} placeholder="e.g., Standard Single" className="w-full text-gray-900 bg-gray-50 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </FormField>
                    <FormField label="Price Per Night ($)">
                        <input type="number" name="pricePerNight" value={room.pricePerNight} onChange={handleChange} min="0" className="w-full text-gray-900 bg-gray-50 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </FormField>
                    <FormField label="Capacity (Guests)">
                        <input type="number" name="capacity" value={room.capacity} onChange={handleChange} min="1" className="w-full text-gray-900 bg-gray-50 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </FormField>
                </div>
                <FormField label="Description">
                    <textarea name="description" value={room.description} onChange={handleChange} rows={3} placeholder="A brief description of the room..." className="w-full text-gray-900 bg-gray-50 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </FormField>
                
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Bed Configuration</h3>
                    {room.beds.map((bed, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <input type="text" value={bed.type} onChange={(e) => handleBedChange(index, 'type', e.target.value)} placeholder="e.g., King" className="w-full text-gray-900 bg-gray-50 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                            <input type="number" value={bed.count} onChange={(e) => handleBedChange(index, 'count', e.target.value)} min="1" className="w-24 text-gray-900 bg-gray-50 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                             <button type="button" onClick={() => removeBed(index)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full" aria-label="Remove bed"><TrashIcon className="h-5 w-5"/></button>
                        </div>
                    ))}
                    <button type="button" onClick={addBed} className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"><PlusIcon className="h-4 w-4" /> Add Bed Type</button>
                </div>
                
                <div className="space-y-3">
                     <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Images (URLs)</h3>
                     {room.images.map((img, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <input type="text" value={img} onChange={(e) => handleListChange(index, e.target.value, 'images')} placeholder="https://example.com/image.jpg" className="w-full text-gray-900 bg-gray-50 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                            <button type="button" onClick={() => removeListItem(index, 'images')} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full" aria-label="Remove image"><TrashIcon className="h-5 w-5"/></button>
                        </div>
                     ))}
                     <button type="button" onClick={() => addListItem('images')} className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"><PlusIcon className="h-4 w-4" /> Add Image</button>
                </div>

                <div className="space-y-3">
                     <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Amenities</h3>
                     {room.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <input type="text" value={amenity} onChange={(e) => handleListChange(index, e.target.value, 'amenities')} placeholder="e.g., Free WiFi" className="w-full text-gray-900 bg-gray-50 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                            <button type="button" onClick={() => removeListItem(index, 'amenities')} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full" aria-label="Remove amenity"><TrashIcon className="h-5 w-5"/></button>
                        </div>
                     ))}
                     <button type="button" onClick={() => addListItem('amenities')} className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"><PlusIcon className="h-4 w-4" /> Add Amenity</button>
                </div>
                
                {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}

                <div className="flex items-center gap-4 pt-4 border-t">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="w-full inline-flex justify-center rounded-md border border-gray-300 border-b-4 border-gray-400 active:translate-y-0.5 active:border-b-2 px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all border-b-4 border-blue-800 hover:border-blue-700 active:translate-y-0.5 active:border-b-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? <SpinnerIcon className="h-5 w-5" /> : 'Save Room'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};
