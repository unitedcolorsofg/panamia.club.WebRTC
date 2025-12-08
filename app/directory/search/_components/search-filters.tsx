'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, MapPin, Layers } from 'lucide-react';
import { countyList, profileCategoryList } from '@/lib/lists';

interface SearchFiltersProps {
  selectedLocations: string[];
  selectedCategories: string[];
  onApplyFilters: (locations: string[], categories: string[]) => void;
}

export function SearchFilters({
  selectedLocations,
  selectedCategories,
  onApplyFilters,
}: SearchFiltersProps) {
  const [open, setOpen] = useState(false);
  const [tempLocations, setTempLocations] =
    useState<string[]>(selectedLocations);
  const [tempCategories, setTempCategories] =
    useState<string[]>(selectedCategories);

  // Update temp state when props change
  useEffect(() => {
    setTempLocations(selectedLocations);
    setTempCategories(selectedCategories);
  }, [selectedLocations, selectedCategories]);

  const handleLocationToggle = (value: string) => {
    setTempLocations((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleCategoryToggle = (value: string) => {
    setTempCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleApply = () => {
    onApplyFilters(tempLocations, tempCategories);
    setOpen(false);
  };

  const handleReset = () => {
    setTempLocations([]);
    setTempCategories([]);
  };

  const activeFilterCount =
    selectedLocations.length + selectedCategories.length;

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className="gap-2">
        <Filter className="h-4 w-4" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="ml-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
            {activeFilterCount}
          </span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Filter Search Results</DialogTitle>
            <DialogDescription>
              Select locations and categories to narrow your search
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4 md:grid-cols-2">
            {/* Location Filters */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <Label className="text-base font-semibold">Location</Label>
              </div>
              <div className="space-y-2">
                {countyList.map((county) => (
                  <div key={county.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`loc-${county.value}`}
                      checked={tempLocations.includes(county.value)}
                      onCheckedChange={() => handleLocationToggle(county.value)}
                    />
                    <Label
                      htmlFor={`loc-${county.value}`}
                      className="cursor-pointer text-sm font-normal"
                    >
                      {county.desc}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Filters */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <Label className="text-base font-semibold">Category</Label>
              </div>
              <div className="space-y-2">
                {profileCategoryList.map((category) => (
                  <div key={category.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`cat-${category.value}`}
                      checked={tempCategories.includes(category.value)}
                      onCheckedChange={() =>
                        handleCategoryToggle(category.value)
                      }
                    />
                    <Label
                      htmlFor={`cat-${category.value}`}
                      className="cursor-pointer text-sm font-normal"
                    >
                      {category.desc}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleApply}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
