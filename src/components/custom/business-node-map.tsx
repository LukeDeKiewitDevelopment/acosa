import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
} from "@/components/ui/map";
import { MapPin } from "lucide-react";

export type BusinessNodeMapItem = {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
};

type BusinessNodeMapProps = {
  nodes: BusinessNodeMapItem[];
};

export const BusinessNodeMap = ({ nodes }: BusinessNodeMapProps) => {
  return (
    <div className="h-112 w-full overflow-hidden rounded-2xl border border-border">
      <Map
        theme="light"
        center={[28.1, -25.95]}
        zoom={8.8}
        maxZoom={14}
        minZoom={7}
      >
        <MapControls position="top-right" showCompass showFullscreen />
        {nodes.map((node) => (
          <MapMarker
            key={node.id}
            longitude={node.longitude}
            latitude={node.latitude}
          >
            <MarkerContent className="text-primary">
              <div className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110">
                <MapPin className="size-4" aria-hidden="true" />
              </div>
              <MarkerLabel className="font-semibold">{node.name}</MarkerLabel>
            </MarkerContent>
            <MarkerPopup closeButton>
              <div className="flex min-w-44 flex-col gap-2">
                <p className="text-primary font-semibold">{node.name}</p>
                <a
                  href={`/business-nodes/gauteng/${node.id}`}
                  className="text-primary inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4"
                >
                  View accommodation
                </a>
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>
    </div>
  );
};
