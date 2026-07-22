import React from 'react';
import { Input } from '@/components/ui/Input';

export interface PhysicalDimensionsInputProps {
  lengthCm: string;
  widthCm: string;
  heightCm: string;
  weightKg: string;
  onChangeLength: (val: string) => void;
  onChangeWidth: (val: string) => void;
  onChangeHeight: (val: string) => void;
  onChangeWeight: (val: string) => void;
}

export function PhysicalDimensionsInput({
  lengthCm,
  widthCm,
  heightCm,
  weightKg,
  onChangeLength,
  onChangeWidth,
  onChangeHeight,
  onChangeWeight,
}: PhysicalDimensionsInputProps) {
  return (
    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400">
        Physical Dimensions (Optional)
      </label>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Input
          label="Length (cm)"
          type="number"
          value={lengthCm}
          onChange={(e) => onChangeLength(e.target.value)}
          placeholder="L"
        />
        <Input
          label="Width (cm)"
          type="number"
          value={widthCm}
          onChange={(e) => onChangeWidth(e.target.value)}
          placeholder="W"
        />
        <Input
          label="Height (cm)"
          type="number"
          value={heightCm}
          onChange={(e) => onChangeHeight(e.target.value)}
          placeholder="H"
        />
        <Input
          label="Weight (kg)"
          type="number"
          value={weightKg}
          onChange={(e) => onChangeWeight(e.target.value)}
          placeholder="kg"
        />
      </div>
    </div>
  );
}
