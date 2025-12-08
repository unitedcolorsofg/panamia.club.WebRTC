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
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, MapPin, Layers, GraduationCap } from 'lucide-react';
import { countyList, profileCategoryList } from '@/lib/lists';

interface SearchFiltersProps {
  selectedLocations: string[];
  selectedCategories: string[];
  mentorsOnly: boolean;
  expertise: string;
  languages: string;
  freeOnly: boolean;
  onApplyFilters: (filters: {
    locations: string[];
    categories: string[];
    mentorsOnly: boolean;
    expertise: string;
    languages: string;
    freeOnly: boolean;
  }) => void;
}

export function SearchFilters({
  selectedLocations,
  selectedCategories,
  mentorsOnly,
  expertise,
  languages,
  freeOnly,
  onApplyFilters,
}: SearchFiltersProps) {
  const [open, setOpen] = useState(false);
  const [tempLocations, setTempLocations] =
    useState<string[]>(selectedLocations);
  const [tempCategories, setTempCategories] =
    useState<string[]>(selectedCategories);
  const [tempMentorsOnly, setTempMentorsOnly] = useState(mentorsOnly);
  const [tempExpertise, setTempExpertise] = useState(expertise);
  const [tempLanguages, setTempLanguages] = useState(languages);
  const [tempFreeOnly, setTempFreeOnly] = useState(freeOnly);

  // Update temp state when props change
  useEffect(() => {
    setTempLocations(selectedLocations);
    setTempCategories(selectedCategories);
    setTempMentorsOnly(mentorsOnly);
    setTempExpertise(expertise);
    setTempLanguages(languages);
    setTempFreeOnly(freeOnly);
  }, [
    selectedLocations,
    selectedCategories,
    mentorsOnly,
    expertise,
    languages,
    freeOnly,
  ]);

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
    onApplyFilters({
      locations: tempLocations,
      categories: tempCategories,
      mentorsOnly: tempMentorsOnly,
      expertise: tempExpertise,
      languages: tempLanguages,
      freeOnly: tempFreeOnly,
    });
    setOpen(false);
  };

  const handleReset = () => {
    setTempLocations([]);
    setTempCategories([]);
    setTempMentorsOnly(false);
    setTempExpertise('');
    setTempLanguages('');
    setTempFreeOnly(false);
  };

  const activeFilterCount =
    selectedLocations.length +
    selectedCategories.length +
    (mentorsOnly ? 1 : 0) +
    (expertise ? 1 : 0) +
    (languages ? 1 : 0) +
    (freeOnly ? 1 : 0);

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
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Filter Search Results</DialogTitle>
            <DialogDescription>
              Select locations, categories, and mentor options to narrow your
              search
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Mentoring Filters */}
            <div className="space-y-4 rounded-lg border bg-blue-50 p-4 dark:bg-blue-950">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <Label className="text-base font-semibold">Mentoring</Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="mentors-only"
                  checked={tempMentorsOnly}
                  onCheckedChange={(checked) =>
                    setTempMentorsOnly(checked as boolean)
                  }
                />
                <Label
                  htmlFor="mentors-only"
                  className="cursor-pointer text-sm font-normal"
                >
                  Show mentors only
                </Label>
              </div>

              {tempMentorsOnly && (
                <div className="ml-6 space-y-3 border-l-2 border-blue-200 pl-4">
                  <div className="space-y-2">
                    <Label htmlFor="expertise" className="text-sm">
                      Filter by expertise
                    </Label>
                    <Input
                      id="expertise"
                      placeholder="e.g., Marketing, Design..."
                      value={tempExpertise}
                      onChange={(e) => setTempExpertise(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="languages" className="text-sm">
                      Filter by languages
                    </Label>
                    <Input
                      id="languages"
                      placeholder="e.g., English, Spanish..."
                      value={tempLanguages}
                      onChange={(e) => setTempLanguages(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="free-only"
                      checked={tempFreeOnly}
                      onCheckedChange={(checked) =>
                        setTempFreeOnly(checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="free-only"
                      className="cursor-pointer text-sm font-normal"
                    >
                      Free mentoring only
                    </Label>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t"></div>

            <div className="grid gap-6 md:grid-cols-2">
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
                        onCheckedChange={() =>
                          handleLocationToggle(county.value)
                        }
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
                    <div
                      key={category.value}
                      className="flex items-center gap-2"
                    >
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
