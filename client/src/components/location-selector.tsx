import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";

interface LocationSelectorProps {
  locations: { id: string; name: string; city?: string }[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function LocationSelector({ locations, selectedId, onSelect }: LocationSelectorProps) {
  return (
    <Select value={selectedId || "all"} onValueChange={onSelect}>
      <SelectTrigger className="w-[200px]" data-testid="select-location">
        <MapPin className="h-4 w-4 mr-2 text-primary" />
        <SelectValue placeholder="All Locations" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Locations</SelectItem>
        {locations.map((location) => (
          <SelectItem key={location.id} value={location.id}>
            {location.name}
            {location.city && <span className="text-muted-foreground ml-1">({location.city})</span>}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
