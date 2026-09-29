"use client";

import {
  useEffect,
  useMemo,
  useState,
  useEffectEvent,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import {
  Lightbulb,
  DoorOpen,
  Thermometer,
  Waves,
  Blinds,
  Shield,
  Zap,
  Music,
  Sun,
  Film,
  Fan,
  Flame,
  Bath,
  Wine,
  BatteryCharging,
  Armchair,
  BedDouble,
  UtensilsCrossed,
  Briefcase,
  Dumbbell,
  BookOpen,
  LayoutGrid,
  Menu,
  X,
  ChevronLeft,
  Tv,
  Wind,
  Droplets,
  Lock,
  Lamp,
  MonitorPlay,
  User,
  AppWindow,
  Cloud,
  Droplet,
  Heater,
  Palette,
  Home,
  LightbulbOff,
  Moon,
  Sunrise,
  Sparkles,
  CloudSun,
  CloudRain,
  CloudFog,
  Bell,
  Car,
  Eye,
  History,
  Star,
  Monitor,
  type LucideIcon,
} from "lucide-react";

type RibbonId = "favorites" | "central" | "rooms" | "categories";
type ClimateRunState = "heating" | "cooling" | "holding" | "off";

type ClimateMode = "heat" | "cool" | "auto" | "off";
type FanSpeed = "off" | "auto" | 1 | 2 | 3;
type FancoilMode = "cool" | "heat" | "fan";
type GlobalMode = "calor" | "frio";

type RoomId =
  | "inicio"
  | "hall"
  | "living"
  | "dining"
  | "kitchen"
  | "library"
  | "master"
  | "guest1"
  | "guest2"
  | "office"
  | "cinema"
  | "gym"
  | "wine"
  | "pool"
  | "energy"
  | "security"
  | "access"
  | "history"
  | "catLights"
  | "catBlinds"
  | "catAudio"
  | "catClimate"
  | "catPresence";

type ClimateKey = Exclude<
  RoomId,
  | "inicio"
  | "pool"
  | "energy"
  | "security"
  | "access"
  | "history"
  | "catLights"
  | "catBlinds"
  | "catAudio"
  | "catClimate"
  | "catPresence"
>;

type BlindLock = "none" | "wind" | "frost";

type DevState = {
  on: boolean;
  value: number;
  color?: string;
  kelvin?: number;
  autoSun?: boolean;
  lock?: BlindLock;
};

type LightMood = "off" | "relax" | "read" | "bright";

type WeatherState = {
  temp: number;
  condition: "sunny" | "cloudy" | "wind" | "rain";
  wind: number;
  humidity: number;
};

type HistoryItem = {
  id: string;
  at: string;
  text: string;
};

type AccessState = {
  garageLeft: boolean;
  garageRight: boolean;
  gate: boolean;
  doorbell: boolean;
};

type ZoneClimate = {
  current: number;
  target: number;
  mode: ClimateMode;
  fan: FanSpeed;
  humidity: number;
  floor: boolean;
  fancoil: boolean;
  fancoilMode: FancoilMode;
};

type DevKind = "light" | "blind" | "audio" | "switch" | "sensor";
type LightVariant = "rgb" | "ww" | "dim";

type DevDef = {
  id: string;
  kind: DevKind;
  icon: LucideIcon;
  label: string;
  variant?: LightVariant;
  unit?: string;
};

type RoomDef = {
  id: RoomId;
  icon: LucideIcon;
  kind: "inicio" | "zone" | "special";
  climate?: ClimateKey;
  color?: string;
};

const RGB_PRESETS = [
  "#ff4d4d",
  "#ff8c42",
  "#ffd166",
  "#06d6a0",
  "#4cc9f0",
  "#9b5de5",
  "#f8f9fa",
] as const;

const KELVIN_PRESETS = [2200, 2700, 3000, 4000, 5000, 6500] as const;

const d = (
  id: string,
  kind: DevKind,
  icon: LucideIcon,
  label: string,
  extra?: Partial<Pick<DevDef, "variant" | "unit">>
): DevDef => ({ id, kind, icon, label, ...extra });

const ROOM_DEVICES: Record<ClimateKey, DevDef[]> = {
  hall: [
    d("main", "light", Lightbulb, "mainLight", { variant: "ww" }),
    d("accent", "light", Palette, "rgbStrip", { variant: "rgb" }),
    d("blinds", "blind", Blinds, "blinds"),
    d("door", "switch", Lock, "doorLock"),
    d("window", "switch", AppWindow, "window"),
    d("presence", "sensor", User, "presence"),
    d("aq", "sensor", Cloud, "airQuality", { unit: "ppm" }),
  ],
  living: [
    d("main", "light", Lightbulb, "ambientLight", { variant: "ww" }),
    d("accent", "light", Palette, "rgbStrip", { variant: "rgb" }),
    d("blinds", "blind", Blinds, "blinds"),
    d("audio", "audio", Music, "audio"),
    d("tv", "switch", Tv, "tv"),
    d("fireplace", "switch", Flame, "fireplace"),
    d("window", "switch", AppWindow, "window"),
    d("presence", "sensor", User, "presence"),
    d("aq", "sensor", Cloud, "airQuality", { unit: "ppm" }),
  ],
  dining: [
    d("pendant", "light", Lightbulb, "pendantLight", { variant: "rgb" }),
    d("ambient", "light", Lamp, "ambientLight", { variant: "ww" }),
    d("blinds", "blind", Blinds, "blinds"),
    d("audio", "audio", Music, "audio"),
    d("window", "switch", AppWindow, "window"),
    d("aq", "sensor", Cloud, "airQuality", { unit: "ppm" }),
  ],
  kitchen: [
    d("main", "light", Lightbulb, "mainLight", { variant: "ww" }),
    d("under", "light", Palette, "underCabinet", { variant: "rgb" }),
    d("blinds", "blind", Blinds, "blinds"),
    d("extractor", "switch", Wind, "extractor"),
    d("leak", "switch", Droplet, "leakSensor"),
    d("presence", "sensor", User, "presence"),
    d("window", "switch", AppWindow, "window"),
    d("aq", "sensor", Cloud, "airQuality", { unit: "ppm" }),
  ],
  library: [
    d("main", "light", Lightbulb, "mainLight", { variant: "ww" }),
    d("reading", "light", Lamp, "readingLamp", { variant: "ww" }),
    d("accent", "light", Palette, "rgbStrip", { variant: "rgb" }),
    d("blinds", "blind", Blinds, "blinds"),
    d("audio", "audio", Music, "audio"),
    d("aq", "sensor", Cloud, "airQuality", { unit: "ppm" }),
  ],
  master: [
    d("main", "light", Lightbulb, "ambientLight", { variant: "rgb" }),
    d("bedside", "light", Lamp, "bedside", { variant: "ww" }),
    d("blinds", "blind", Blinds, "blinds"),
    d("blackout", "blind", Blinds, "blackout"),
    d("audio", "audio", Music, "audio"),
    d("tv", "switch", Tv, "tv"),
    d("bedheat", "switch", Heater, "bedHeat"),
    d("window", "switch", AppWindow, "window"),
    d("aq", "sensor", Cloud, "airQuality", { unit: "ppm" }),
  ],
  guest1: [
    d("main", "light", Lightbulb, "mainLight", { variant: "ww" }),
    d("bedside", "light", Lamp, "bedside", { variant: "ww" }),
    d("accent", "light", Palette, "rgbStrip", { variant: "rgb" }),
    d("blinds", "blind", Blinds, "blinds"),
    d("window", "switch", AppWindow, "window"),
    d("aq", "sensor", Cloud, "airQuality", { unit: "ppm" }),
  ],
  guest2: [
    d("main", "light", Lightbulb, "mainLight", { variant: "ww" }),
    d("bedside", "light", Lamp, "bedside", { variant: "ww" }),
    d("accent", "light", Palette, "rgbStrip", { variant: "rgb" }),
    d("blinds", "blind", Blinds, "blinds"),
    d("window", "switch", AppWindow, "window"),
    d("aq", "sensor", Cloud, "airQuality", { unit: "ppm" }),
  ],
  office: [
    d("main", "light", Lightbulb, "mainLight", { variant: "ww" }),
    d("desk", "light", Lamp, "deskLamp", { variant: "ww" }),
    d("accent", "light", Palette, "rgbStrip", { variant: "rgb" }),
    d("blinds", "blind", Blinds, "blinds"),
    d("presence", "sensor", User, "presence"),
    d("aq", "sensor", Cloud, "airQuality", { unit: "ppm" }),
  ],
  cinema: [
    d("main", "light", Lightbulb, "ambientLight", { variant: "dim" }),
    d("cove", "light", Palette, "coveLight", { variant: "rgb" }),
    d("blinds", "blind", Blinds, "blinds"),
    d("blackout", "blind", Blinds, "blackout"),
    d("projector", "switch", MonitorPlay, "projector"),
    d("audio", "audio", Music, "audio"),
    d("aq", "sensor", Cloud, "airQuality", { unit: "ppm" }),
  ],
  gym: [
    d("main", "light", Lightbulb, "mainLight", { variant: "ww" }),
    d("accent", "light", Palette, "rgbStrip", { variant: "rgb" }),
    d("blinds", "blind", Blinds, "blinds"),
    d("audio", "audio", Music, "audio"),
    d("vent", "switch", Wind, "ventilation"),
    d("aq", "sensor", Cloud, "airQuality", { unit: "ppm" }),
  ],
  wine: [
    d("main", "light", Lightbulb, "softLight", { variant: "ww" }),
    d("accent", "light", Palette, "rgbStrip", { variant: "rgb" }),
    d("blinds", "blind", Blinds, "blinds"),
    d("dehumidifier", "switch", Droplets, "dehumidifier"),
    d("leak", "switch", Droplet, "leakSensor"),
    d("aq", "sensor", Cloud, "airQuality", { unit: "ppm" }),
  ],
};

const ZONE_ROOMS: RoomDef[] = [
  { id: "hall", icon: DoorOpen, kind: "zone", climate: "hall", color: "#4fd18b" },
  { id: "living", icon: Armchair, kind: "zone", climate: "living", color: "#f7f8fa" },
  { id: "dining", icon: UtensilsCrossed, kind: "zone", climate: "dining", color: "#e8a05a" },
  { id: "kitchen", icon: Flame, kind: "zone", climate: "kitchen", color: "#e8664a" },
  { id: "library", icon: BookOpen, kind: "zone", climate: "library", color: "#5eb4ff" },
  { id: "master", icon: BedDouble, kind: "zone", climate: "master", color: "#f7f8fa" },
  { id: "guest1", icon: BedDouble, kind: "zone", climate: "guest1", color: "#5eb4ff" },
  { id: "guest2", icon: BedDouble, kind: "zone", climate: "guest2", color: "#5eb4ff" },
  { id: "office", icon: Briefcase, kind: "zone", climate: "office", color: "#4fd18b" },
  { id: "cinema", icon: Film, kind: "zone", climate: "cinema", color: "#e8a05a" },
  { id: "gym", icon: Dumbbell, kind: "zone", climate: "gym", color: "#5eb4ff" },
  { id: "wine", icon: Wine, kind: "zone", climate: "wine", color: "#c084fc" },
];

const SPECIAL_ROOMS: RoomDef[] = [
  { id: "pool", icon: Waves, kind: "special" },
  { id: "energy", icon: Zap, kind: "special" },
  { id: "security", icon: Shield, kind: "special" },
  { id: "access", icon: Lock, kind: "special" },
  { id: "history", icon: History, kind: "special" },
  { id: "catLights", icon: Lightbulb, kind: "special" },
  { id: "catBlinds", icon: Blinds, kind: "special" },
  { id: "catAudio", icon: Music, kind: "special" },
  { id: "catClimate", icon: Thermometer, kind: "special" },
  { id: "catPresence", icon: Eye, kind: "special" },
];

const NAV_ROOMS = [...ZONE_ROOMS, ...SPECIAL_ROOMS];

type FloorId =
  | "ground"
  | "upper"
  | "basement"
  | "wellness"
  | "systems"
  | "categories";

const FLOORS: { id: FloorId; rooms: RoomId[] }[] = [
  {
    id: "ground",
    rooms: ["hall", "living", "dining", "kitchen", "library"],
  },
  {
    id: "upper",
    rooms: ["master", "guest1", "guest2", "office"],
  },
  {
    id: "basement",
    rooms: ["cinema", "gym", "wine"],
  },
  {
    id: "wellness",
    rooms: ["pool"],
  },
  {
    id: "systems",
    rooms: ["energy", "security", "access", "history"],
  },
  {
    id: "categories",
    rooms: ["catLights", "catBlinds", "catAudio", "catClimate", "catPresence"],
  },
];

/** Filas del panel central: solo zonas con clima */
const FLOOR_ROWS = FLOORS.filter((f) =>
  f.rooms.every((id) => ZONE_ROOMS.some((r) => r.id === id))
);

const CLIMATE_KEYS = ZONE_ROOMS.map((r) => r.climate!) as ClimateKey[];

const roomById = (id: RoomId) => NAV_ROOMS.find((r) => r.id === id)!;

const ROOM_BACKGROUNDS: Record<RoomId, string> = {
  inicio: "/demo/bg/demo-bg-home.jpg",
  hall: "/demo/bg/demo-bg-hall.jpg",
  living: "/demo/bg/demo-bg-living.jpg",
  dining: "/demo/bg/demo-bg-living.jpg",
  kitchen: "/demo/bg/demo-bg-kitchen.jpg",
  library: "/demo/bg/demo-bg-office.jpg",
  master: "/demo/bg/demo-bg-bedroom.jpg",
  guest1: "/demo/bg/demo-bg-bedroom.jpg",
  guest2: "/demo/bg/demo-bg-bedroom.jpg",
  office: "/demo/bg/demo-bg-office.jpg",
  cinema: "/demo/bg/demo-bg-cinema.jpg",
  gym: "/demo/bg/demo-bg-hall.jpg",
  wine: "/demo/bg/demo-bg-wine.jpg",
  pool: "/demo/bg/demo-bg-pool.jpg",
  energy: "/demo/bg/demo-bg-home.jpg",
  security: "/demo/bg/demo-bg-hall.jpg",
  access: "/demo/bg/demo-bg-hall.jpg",
  history: "/demo/bg/demo-bg-home.jpg",
  catLights: "/demo/bg/demo-bg-home.jpg",
  catBlinds: "/demo/bg/demo-bg-living.jpg",
  catAudio: "/demo/bg/demo-bg-living.jpg",
  catClimate: "/demo/bg/demo-bg-home.jpg",
  catPresence: "/demo/bg/demo-bg-hall.jpg",
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function climateRunState(c: ZoneClimate): ClimateRunState {
  if (c.mode === "off" || (!c.floor && !c.fancoil)) return "off";
  const delta = c.target - c.current;
  if (Math.abs(delta) < 0.25) return "holding";
  if (c.mode === "heat" || (c.mode === "auto" && c.fancoilMode === "heat")) {
    return delta > 0 ? "heating" : "holding";
  }
  if (c.mode === "cool" || (c.mode === "auto" && c.fancoilMode === "cool")) {
    return delta < 0 ? "cooling" : "holding";
  }
  if (delta > 0.25) return "heating";
  if (delta < -0.25) return "cooling";
  return "holding";
}

function algorithmMinutes(c: ZoneClimate) {
  return Math.max(5, Math.min(42, Math.round(Math.abs(c.target - c.current) * 18 + 8)));
}

const DEFAULT_PINS: ClimateKey[] = ["living", "master", "kitchen", "office"];
const AMBIENT_IDLE_MS = 75_000;

function defaultFancoilMode(mode: ClimateMode): FancoilMode {
  if (mode === "heat") return "heat";
  return "cool";
}

function z(
  current: number,
  target: number,
  mode: ClimateMode,
  fan: FanSpeed,
  humidity = 48,
  floor = mode !== "off",
  fancoil = mode !== "off" && fan !== "off",
  fancoilMode = defaultFancoilMode(mode)
): ZoneClimate {
  return { current, target, mode, fan, humidity, floor, fancoil, fancoilMode };
}

const defaultClimates = (): Record<ClimateKey, ZoneClimate> => ({
  hall: z(21.8, 21.5, "auto", "auto", 46),
  living: z(22.6, 22.0, "auto", 2, 45),
  dining: z(22.1, 21.5, "heat", "auto", 47),
  kitchen: z(23.4, 22.0, "cool", 1, 50),
  library: z(21.5, 21.0, "auto", "off", 44, true, false),
  master: z(21.2, 20.5, "heat", "auto", 43),
  guest1: z(21.0, 21.0, "off", "off", 48, false, false),
  guest2: z(20.8, 21.0, "off", "off", 49, false, false),
  office: z(23.1, 22.5, "cool", 2, 42),
  cinema: z(21.8, 21.0, "cool", 1, 46),
  gym: z(19.4, 18.5, "cool", 3, 52, false, true),
  wine: z(14.2, 13.5, "cool", "auto", 65, false, false),
});

const DEVICE_DEFAULTS: Partial<
  Record<ClimateKey, Partial<Record<string, Partial<DevState>>>>
> = {
  hall: {
    main: { on: true, value: 55, kelvin: 3000 },
    accent: { on: true, value: 40, color: "#4cc9f0" },
    blinds: { on: true, value: 20 },
    door: { on: true, value: 100 },
    window: { on: true, value: 0 },
    presence: { on: false, value: 0 },
    aq: { on: true, value: 510 },
  },
  living: {
    main: { on: true, value: 68, kelvin: 2700 },
    accent: { on: true, value: 45, color: "#ff8c42" },
    blinds: { on: true, value: 25 },
    audio: { on: true, value: 28 },
    tv: { on: false, value: 0 },
    fireplace: { on: false, value: 0 },
    window: { on: true, value: 0 },
    presence: { on: true, value: 0 },
    aq: { on: true, value: 620 },
  },
  dining: {
    pendant: { on: true, value: 55, color: "#ffd166" },
    ambient: { on: true, value: 35, kelvin: 2700 },
    blinds: { on: true, value: 40 },
    audio: { on: false, value: 25 },
    window: { on: true, value: 0 },
    aq: { on: true, value: 580 },
  },
  kitchen: {
    main: { on: true, value: 80, kelvin: 4000 },
    under: { on: true, value: 55, color: "#4cc9f0" },
    blinds: { on: true, value: 30 },
    extractor: { on: false, value: 0 },
    leak: { on: false, value: 0 },
    presence: { on: true, value: 0 },
    window: { on: true, value: 0 },
    aq: { on: true, value: 710 },
  },
  library: {
    main: { on: false, value: 50, kelvin: 3000 },
    reading: { on: true, value: 55, kelvin: 2700 },
    accent: { on: true, value: 30, color: "#9b5de5" },
    blinds: { on: true, value: 35 },
    audio: { on: false, value: 20 },
    aq: { on: true, value: 540 },
  },
  master: {
    main: { on: false, value: 35, color: "#9b5de5" },
    bedside: { on: false, value: 20, kelvin: 2200 },
    blinds: { on: true, value: 85 },
    blackout: { on: true, value: 90 },
    audio: { on: false, value: 20 },
    tv: { on: false, value: 0 },
    bedheat: { on: false, value: 0 },
    window: { on: true, value: 0 },
    aq: { on: true, value: 560 },
  },
  guest1: {
    main: { on: false, value: 45, kelvin: 3000 },
    bedside: { on: false, value: 20, kelvin: 2200 },
    accent: { on: false, value: 30, color: "#4cc9f0" },
    blinds: { on: true, value: 70 },
    window: { on: true, value: 0 },
    aq: { on: true, value: 530 },
  },
  guest2: {
    main: { on: false, value: 45, kelvin: 3000 },
    bedside: { on: false, value: 20, kelvin: 2200 },
    accent: { on: false, value: 30, color: "#06d6a0" },
    blinds: { on: true, value: 70 },
    window: { on: true, value: 0 },
    aq: { on: true, value: 525 },
  },
  office: {
    main: { on: true, value: 70, kelvin: 4000 },
    desk: { on: true, value: 55, kelvin: 4000 },
    accent: { on: true, value: 25, color: "#4cc9f0" },
    blinds: { on: true, value: 15 },
    presence: { on: true, value: 0 },
    aq: { on: true, value: 780 },
  },
  cinema: {
    main: { on: false, value: 12 },
    cove: { on: true, value: 18, color: "#9b5de5" },
    blinds: { on: true, value: 100 },
    blackout: { on: true, value: 100 },
    projector: { on: false, value: 0 },
    audio: { on: false, value: 55 },
    aq: { on: true, value: 640 },
  },
  gym: {
    main: { on: false, value: 75, kelvin: 5000 },
    accent: { on: true, value: 40, color: "#06d6a0" },
    blinds: { on: true, value: 45 },
    audio: { on: false, value: 50 },
    vent: { on: true, value: 0 },
    aq: { on: true, value: 900 },
  },
  wine: {
    main: { on: true, value: 22, kelvin: 2200 },
    accent: { on: true, value: 18, color: "#9b5de5" },
    blinds: { on: true, value: 100 },
    dehumidifier: { on: true, value: 0 },
    leak: { on: false, value: 0 },
    aq: { on: true, value: 480 },
  },
};

function kelvinToHex(k: number): string {
  const t = clamp((k - 2200) / (6500 - 2200), 0, 1);
  const r = Math.round(255 - t * 30);
  const g = Math.round(176 + t * 55);
  const b = Math.round(90 + t * 155);
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

function lightGlow(dev: DevDef, state: DevState): string {
  if (dev.variant === "rgb") return state.color ?? "#4cc9f0";
  if (dev.variant === "ww") return kelvinToHex(state.kelvin ?? 3000);
  return "#ffe6b0";
}

function defaultDevices(): Record<ClimateKey, Record<string, DevState>> {
  return Object.fromEntries(
    CLIMATE_KEYS.map((key) => {
      const defs = ROOM_DEVICES[key];
      const overrides = DEVICE_DEFAULTS[key] ?? {};
      const channels = Object.fromEntries(
        defs.map((dev) => {
          const o = overrides[dev.id] ?? {};
          if (dev.kind === "blind") {
            return [
              dev.id,
              {
                on: true,
                value: o.value ?? 50,
                autoSun: o.autoSun ?? true,
                lock: o.lock ?? "none",
              },
            ];
          }
          if (dev.kind === "audio") {
            return [
              dev.id,
              { on: o.on ?? false, value: o.value ?? 40 },
            ];
          }
          if (dev.kind === "light") {
            return [
              dev.id,
              {
                on: o.on ?? false,
                value: o.value ?? 50,
                color:
                  o.color ??
                  (dev.variant === "rgb" ? "#4cc9f0" : undefined),
                kelvin:
                  o.kelvin ??
                  (dev.variant === "ww" ? 3000 : undefined),
              },
            ];
          }
          if (dev.kind === "sensor") {
            if (dev.id === "presence") {
              return [
                dev.id,
                { on: o.on ?? false, value: o.on ? 1 : 0 },
              ];
            }
            return [
              dev.id,
              { on: true, value: o.value ?? 600 },
            ];
          }
          return [
            dev.id,
            { on: o.on ?? false, value: o.value ?? 0 },
          ];
        })
      );
      return [key, channels];
    })
  ) as Record<ClimateKey, Record<string, DevState>>;
}

function roomLightsOn(devices: Record<string, DevState>, key: ClimateKey) {
  return ROOM_DEVICES[key].some(
    (dev) => dev.kind === "light" && devices[dev.id]?.on
  );
}

type SceneId =
  | "lightsOff"
  | "lightsOn"
  | "morning"
  | "night"
  | "cinema"
  | "relax";

const SCENES: { id: SceneId; icon: LucideIcon }[] = [
  { id: "lightsOff", icon: LightbulbOff },
  { id: "lightsOn", icon: Lightbulb },
  { id: "morning", icon: Sunrise },
  { id: "night", icon: Moon },
  { id: "cinema", icon: Film },
  { id: "relax", icon: Sparkles },
];

const LIGHT_MOODS: LightMood[] = ["off", "relax", "read", "bright"];

function applyLightMoodToRoom(
  roomState: Record<string, DevState>,
  key: ClimateKey,
  mood: LightMood
): Record<string, DevState> {
  const next = { ...roomState };
  for (const def of ROOM_DEVICES[key]) {
    if (def.kind !== "light") continue;
    const cur = next[def.id] ?? { on: false, value: 0 };
    if (mood === "off") {
      next[def.id] = { ...cur, on: false, value: 0 };
      continue;
    }
    if (mood === "relax") {
      next[def.id] = {
        ...cur,
        on: true,
        value: def.variant === "rgb" ? 30 : 28,
        kelvin: 2200,
        color: cur.color ?? "#ff8c42",
      };
      continue;
    }
    if (mood === "read") {
      const focus = ["reading", "bedside", "desk", "main", "pendant"].includes(
        def.id
      );
      next[def.id] = {
        ...cur,
        on: focus,
        value: focus ? (def.id === "main" ? 55 : 70) : 0,
        kelvin: 3000,
      };
      continue;
    }
    // bright
    next[def.id] = {
      ...cur,
      on: true,
      value: def.variant === "rgb" ? 55 : 88,
      kelvin: 4000,
    };
  }
  return next;
}

function pushHistory(
  prev: HistoryItem[],
  text: string,
  clock: string
): HistoryItem[] {
  return [
    {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      at: clock || "—:—",
      text,
    },
    ...prev,
  ].slice(0, 40);
}

function mapAllDevices(
  prev: Record<ClimateKey, Record<string, DevState>>,
  fn: (ctx: {
    key: ClimateKey;
    def: DevDef;
    state: DevState;
  }) => DevState,
  opts?: { respectPresence?: boolean }
) {
  const next = { ...prev };
  for (const key of CLIMATE_KEYS) {
    if (opts?.respectPresence && prev[key]?.presence?.on) continue;
    const roomState = { ...next[key] };
    for (const def of ROOM_DEVICES[key]) {
      const cur = roomState[def.id];
      if (!cur) continue;
      roomState[def.id] = fn({ key, def, state: cur });
    }
    next[key] = roomState;
  }
  return next;
}

function applySceneDevices(
  prev: Record<ClimateKey, Record<string, DevState>>,
  scene: SceneId
) {
  const map = (
    fn: (ctx: {
      key: ClimateKey;
      def: DevDef;
      state: DevState;
    }) => DevState
  ) => mapAllDevices(prev, fn, { respectPresence: true });

  switch (scene) {
    case "lightsOff":
      return map(({ def, state }) =>
        def.kind === "light" ? { ...state, on: false, value: 0 } : state
      );
    case "lightsOn":
      return map(({ def, state }) => {
        if (def.kind !== "light") return state;
        const value =
          def.variant === "rgb" ? 42 : def.variant === "dim" ? 35 : 58;
        return {
          ...state,
          on: true,
          value,
          kelvin: state.kelvin ?? 3000,
        };
      });
    case "morning":
      return map(({ def, state }) => {
        if (def.kind === "light") {
          return {
            ...state,
            on: true,
            value: def.variant === "rgb" ? 28 : 48,
            kelvin: 2700,
            color: state.color ?? "#ffb347",
          };
        }
        if (def.kind === "blind") {
          return { ...state, on: true, value: 0 };
        }
        if (def.kind === "audio" || def.id === "tv" || def.id === "projector") {
          return { ...state, on: false };
        }
        return state;
      });
    case "night":
      return map(({ def, state }) => {
        if (def.kind === "light") {
          // Mesitas suaves en dormitorios; resto off
          if (def.id === "bedside") {
            return { ...state, on: true, value: 18, kelvin: 2200 };
          }
          return { ...state, on: false, value: 0 };
        }
        if (def.kind === "blind") {
          return { ...state, on: true, value: 100 };
        }
        if (
          def.kind === "audio" ||
          ["tv", "projector", "fireplace", "extractor"].includes(def.id)
        ) {
          return { ...state, on: false };
        }
        return state;
      });
    case "cinema":
      return map(({ key, def, state }) => {
        if (key === "cinema") {
          if (def.id === "cove") {
            return {
              ...state,
              on: true,
              value: 22,
              color: "#6c63ff",
            };
          }
          if (def.id === "main") {
            return { ...state, on: false, value: 0 };
          }
          if (def.id === "blackout") {
            return { ...state, on: true, value: 100 };
          }
          if (def.id === "projector" || def.id === "audio") {
            return {
              ...state,
              on: true,
              value: def.id === "audio" ? 35 : state.value,
            };
          }
          return state;
        }
        if (def.kind === "light") {
          return { ...state, on: false, value: 0 };
        }
        if (def.kind === "audio" || def.id === "tv") {
          return { ...state, on: false };
        }
        return state;
      });
    case "relax":
      return map(({ key, def, state }) => {
        if (key === "living" || key === "dining" || key === "library") {
          if (def.kind === "light") {
            return {
              ...state,
              on: true,
              value: def.variant === "rgb" ? 35 : 40,
              kelvin: 2200,
              color: state.color ?? "#ff8c42",
            };
          }
          if (def.kind === "blind") {
            return { ...state, on: true, value: 55 };
          }
          if (def.kind === "audio" && key === "living") {
            return { ...state, on: true, value: 22 };
          }
          if (def.id === "fireplace" && key === "living") {
            return { ...state, on: true };
          }
          return state;
        }
        if (def.kind === "light") {
          return { ...state, on: false, value: 0 };
        }
        if (def.kind === "audio" || def.id === "tv" || def.id === "projector") {
          return { ...state, on: false };
        }
        return state;
      });
    default:
      return prev;
  }
}

export function DemoDashboard() {
  const t = useTranslations("demo");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [room, setRoom] = useState<RoomId>("inicio");
  const [clock, setClock] = useState("");
  const [globalMode, setGlobalMode] = useState<GlobalMode>("calor");
  const [climates, setClimates] = useState(defaultClimates);
  const [devices, setDevices] = useState(defaultDevices);
  const [pool, setPool] = useState({
    heating: true,
    current: 28.4,
    target: 29,
    filter: true,
    jets: false,
  });
  const [spa, setSpa] = useState({ on: true, current: 36.2, target: 37 });
  const [power, setPower] = useState(4.2);
  const [solar, setSolar] = useState(3.1);
  const [battery, setBattery] = useState(72);
  const [armed, setArmed] = useState(false);
  const [away, setAway] = useState(false);
  const [ev, setEv] = useState({ charging: true, pct: 64 });
  const [bgPrimary, setBgPrimary] = useState(ROOM_BACKGROUNDS.inicio);
  const [bgSecondary, setBgSecondary] = useState(ROOM_BACKGROUNDS.inicio);
  const [bgShowPrimary, setBgShowPrimary] = useState(true);
  const [activeScene, setActiveScene] = useState<SceneId | null>(null);
  const [weather, setWeather] = useState<WeatherState>({
    temp: 17.4,
    condition: "sunny",
    wind: 14,
    humidity: 52,
  });
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: "h0", at: "21:40", text: "Sistema listo · demo" },
    { id: "h1", at: "21:38", text: "Modo Invierno activo" },
    { id: "h2", at: "21:35", text: "Salón · presencia detectada" },
    { id: "h3", at: "21:22", text: "Persianas · sombreado auto" },
    { id: "h4", at: "20:58", text: "Cocina · luces encendidas" },
    { id: "h5", at: "20:41", text: "Oficina · fancoil refrigeración" },
    { id: "h6", at: "19:15", text: "Escena Ambiente" },
    { id: "h7", at: "18:02", text: "Cargador VE · 64%" },
  ]);
  const [access, setAccess] = useState<AccessState>({
    garageLeft: false,
    garageRight: false,
    gate: false,
    doorbell: false,
  });
  const [audioSync, setAudioSync] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [roomMood, setRoomMood] = useState<Partial<Record<ClimateKey, LightMood>>>(
    {}
  );
  const [pinned, setPinned] = useState<ClimateKey[]>(DEFAULT_PINS);
  const [ribbon, setRibbon] = useState<RibbonId>("central");
  const [ambientMode, setAmbientMode] = useState(false);
  const [ambientDate, setAmbientDate] = useState("");

  const leakAlert = useMemo(
    () =>
      CLIMATE_KEYS.some((k) =>
        ROOM_DEVICES[k].some(
          (d) => d.id === "leak" && devices[k][d.id]?.on
        )
      ),
    [devices]
  );
  const showAlert = (leakAlert || (armed && away)) && !alertDismissed;

  useEffect(() => {
    if (leakAlert) setAlertDismissed(false);
  }, [leakAlert]);

  const occupiedCount = useMemo(
    () => CLIMATE_KEYS.filter((k) => devices[k]?.presence?.on).length,
    [devices]
  );

  const activeZones = useMemo(
    () =>
      CLIMATE_KEYS.filter((k) => {
        const c = climates[k];
        if (k === "wine") return c.mode !== "off";
        return c.floor || c.fancoil;
      }).length,
    [climates]
  );

  const log = (text: string) => {
    setHistory((prev) => pushHistory(prev, text, clock));
  };

  const onTick = useEffectEvent(() => {
    const now = new Date();
    const nextClock = now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setClock((prev) => (prev === nextClock ? prev : nextClock));

    // Energía: deriva lenta y estable (sin ruido cada tick)
    setSolar((v) => {
      const hour = now.getHours() + now.getMinutes() / 60;
      const daylight = Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI));
      const target = Number((daylight * 5.8).toFixed(1));
      const next = Number((v + (target - v) * 0.08).toFixed(1));
      return next === v ? v : next;
    });
    setBattery((v) => {
      const next = Number(
        clamp(v + (ev.charging ? -0.02 : solar > 2 ? 0.04 : -0.01), 15, 100).toFixed(0)
      );
      return next === v ? v : next;
    });
    setEv((e) => {
      if (!e.charging) return e;
      const pct = Number(clamp(e.pct + 0.08, 0, 100).toFixed(0));
      return pct === e.pct ? e : { ...e, pct };
    });

    let load = 0.6;
    for (const k of CLIMATE_KEYS) {
      const c = climates[k];
      if (k === "wine") {
        if (c.mode !== "off") load += 0.8;
        continue;
      }
      if (c.floor) load += 0.45;
      if (c.fancoil && c.fan !== "off") {
        const speed = c.fan === "auto" ? 2 : c.fan;
        const base = c.fancoilMode === "fan" ? 0.12 : 0.35;
        load += base + speed * 0.18;
      }
    }
    if (pool.heating) load += 2.2;
    if (spa.on) load += 1.4;
    if (ev.charging) load += 6.5;
    setPower((prev) => {
      const next = Number(clamp(load, 0.5, 16).toFixed(1));
      return next === prev ? prev : next;
    });

    setClimates((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const k of CLIMATE_KEYS) {
        const c = next[k];
        const floorActive = k !== "wine" && c.floor;
        const coilActive =
          k !== "wine" &&
          c.fancoil &&
          c.fan !== "off" &&
          c.fancoilMode !== "fan";
        const emittersOn =
          k === "wine" ? c.mode !== "off" : floorActive || coilActive;
        if (!emittersOn) continue;
        const delta = c.target - c.current;
        // Solo mueve cuando hay diferencia apreciable; sin jitter
        if (Math.abs(delta) < 0.05) continue;
        // Fancoil en calor/frío respeta su modo; el suelo sigue la consigna
        let step = delta * 0.06;
        if (coilActive && !floorActive) {
          if (c.fancoilMode === "heat" && delta < 0) continue;
          if (c.fancoilMode === "cool" && delta > 0) continue;
        }
        const current = Number(
          clamp(c.current + step, 10, 32).toFixed(1)
        );
        if (current === c.current) continue;
        next[k] = { ...c, current };
        changed = true;
      }
      return changed ? next : prev;
    });

    setPool((p) => {
      const delta = p.heating ? (p.target - p.current) * 0.04 : -0.015;
      if (Math.abs(delta) < 0.02 && p.heating) return p;
      const current = Number(clamp(p.current + delta, 18, 34).toFixed(1));
      return current === p.current ? p : { ...p, current };
    });
    setSpa((s) => {
      const delta = s.on ? (s.target - s.current) * 0.05 : -0.03;
      if (Math.abs(delta) < 0.02 && s.on) return s;
      const current = Number(clamp(s.current + delta, 28, 42).toFixed(1));
      return current === s.current ? s : { ...s, current };
    });

    // CO2 / calidad de aire: deriva muy suave
    setDevices((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const key of CLIMATE_KEYS) {
        const aq = next[key]?.aq;
        if (!aq) continue;
        const occupied = next[key].presence?.on ?? false;
        const target = occupied ? 850 : 520;
        const value = Math.round(aq.value + (target - aq.value) * 0.06);
        if (value === aq.value) continue;
        next[key] = { ...next[key], aq: { ...aq, value } };
        changed = true;
      }
      // Sombreado auto + bloqueo viento según meteo
      const windy = weather.condition === "wind" || weather.wind >= 45;
      for (const key of CLIMATE_KEYS) {
        const roomState = { ...next[key] };
        let roomChanged = false;
        for (const def of ROOM_DEVICES[key]) {
          if (def.kind !== "blind") continue;
          const cur = roomState[def.id];
          if (!cur) continue;
          if (windy && cur.lock !== "wind") {
            roomState[def.id] = {
              ...cur,
              lock: "wind",
              value: 100,
              autoSun: false,
            };
            roomChanged = true;
          } else if (!windy && cur.lock === "wind") {
            roomState[def.id] = { ...cur, lock: "none" };
            roomChanged = true;
          } else if (
            !windy &&
            cur.autoSun &&
            weather.condition === "sunny" &&
            weather.temp >= 24
          ) {
            const shade = clamp(40 + Math.round((weather.temp - 24) * 4), 40, 80);
            if (Math.abs(cur.value - shade) >= 8) {
              roomState[def.id] = { ...cur, value: shade };
              roomChanged = true;
            }
          }
        }
        if (roomChanged) {
          next[key] = roomState;
          changed = true;
        }
      }
      return changed ? next : prev;
    });

    setWeather((w) => {
      const hour = now.getHours();
      let condition: WeatherState["condition"] = "sunny";
      if (hour >= 20 || hour < 7) condition = "cloudy";
      if (w.wind > 36) condition = "wind";
      if (hour % 11 === 0) condition = "rain";
      const tempTarget =
        12 + Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI)) * 14;
      const temp = Number((w.temp + (tempTarget - w.temp) * 0.1).toFixed(1));
      const wind = Number(
        clamp(w.wind + (hour >= 14 && hour <= 17 ? 0.25 : -0.35), 8, 42).toFixed(0)
      );
      const humidity = Number(
        clamp(w.humidity + (condition === "rain" ? 0.4 : -0.15), 35, 85).toFixed(0)
      );
      if (
        temp === w.temp &&
        condition === w.condition &&
        wind === w.wind &&
        humidity === w.humidity
      ) {
        return w;
      }
      return { temp, condition, wind, humidity };
    });

    if (access.doorbell) {
      setAccess((a) => (a.doorbell ? { ...a, doorbell: false } : a));
    }
  });

  useEffect(() => {
    onTick();
    const id = setInterval(onTick, 4000);
    return () => clearInterval(id);
    // onTick (useEffectEvent) no debe ir en deps: si no, cada setState
    // recrea el efecto y provoca un bucle de actualizaciones.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = (id: RoomId) => {
    setAmbientMode(false);
    setRoom(id);
    if (id === "inicio") {
      setRibbon("central");
    } else if (
      id === "catLights" ||
      id === "catBlinds" ||
      id === "catAudio" ||
      id === "catClimate" ||
      id === "catPresence"
    ) {
      setRibbon("categories");
    } else if (ZONE_ROOMS.some((r) => r.id === id)) {
      setRibbon("rooms");
    } else {
      setRibbon("central");
    }
    if (typeof window !== "undefined" && window.innerWidth < 900) {
      setSidebarOpen(false);
    }
  };

  const togglePin = (key: ClimateKey) => {
    setPinned((prev) => {
      if (prev.includes(key)) {
        const next = prev.filter((k) => k !== key);
        log(`${t(`rooms.${key}`)} · ${t("pins.removed")}`);
        return next.length ? next : prev;
      }
      if (prev.length >= 8) return prev;
      log(`${t(`rooms.${key}`)} · ${t("pins.added")}`);
      return [...prev, key];
    });
  };

  const toggleRoomLights = (key: ClimateKey) => {
    setAway(false);
    setActiveScene(null);
    setDevices((prev) => {
      const defs = ROOM_DEVICES[key].filter((d) => d.kind === "light");
      const anyOn = defs.some((d) => prev[key][d.id]?.on);
      const roomState = { ...prev[key] };
      for (const d of defs) {
        const cur = roomState[d.id];
        if (!cur) continue;
        roomState[d.id] = {
          ...cur,
          on: !anyOn,
          value: !anyOn ? cur.value || 55 : 0,
        };
      }
      log(
        `${t(`rooms.${key}`)} · ${
          anyOn ? t("favorites.lightsOff") : t("favorites.lightsOn")
        }`
      );
      return { ...prev, [key]: roomState };
    });
  };

  const nudgeSetpoint = (key: ClimateKey, delta: number) => {
    setAway(false);
    setClimates((prev) => {
      const c = prev[key];
      const wine = key === "wine";
      const min = wine ? 10 : 16;
      const max = wine ? 18 : 30;
      const target = clamp(Number((c.target + delta).toFixed(1)), min, max);
      log(`${t(`rooms.${key}`)} · ${t("boadilla.setpoint")} ${target.toFixed(1)}°`);
      return { ...prev, [key]: { ...c, target } };
    });
  };

  const selectRibbon = (id: RibbonId) => {
    setAmbientMode(false);
    setRibbon(id);
    if (id === "favorites" || id === "central" || id === "rooms") {
      setRoom("inicio");
      if (id === "rooms") setSidebarOpen(true);
    } else if (id === "categories") {
      setRoom("catLights");
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (ambientMode) return;
    let timer = window.setTimeout(() => setAmbientMode(true), AMBIENT_IDLE_MS);
    const bump = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setAmbientMode(true), AMBIENT_IDLE_MS);
    };
    const root = document.querySelector(".boadilla-demo-root");
    root?.addEventListener("pointerdown", bump);
    window.addEventListener("keydown", bump);
    return () => {
      window.clearTimeout(timer);
      root?.removeEventListener("pointerdown", bump);
      window.removeEventListener("keydown", bump);
    };
  }, [ambientMode]);

  useEffect(() => {
    if (!ambientMode) return;
    const fmt = () => {
      const now = new Date();
      setAmbientDate(
        now.toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })
      );
    };
    fmt();
    const id = window.setInterval(fmt, 60_000);
    return () => window.clearInterval(id);
  }, [ambientMode]);

  useEffect(() => {
    const next = ROOM_BACKGROUNDS[room];
    if (bgShowPrimary) {
      if (next === bgPrimary) return;
      setBgSecondary(next);
      setBgShowPrimary(false);
    } else {
      if (next === bgSecondary) return;
      setBgPrimary(next);
      setBgShowPrimary(true);
    }
  }, [room]); // eslint-disable-line react-hooks/exhaustive-deps

  const setGlobal = (mode: GlobalMode) => {
    setGlobalMode(mode);
    setAway(false);
    setClimates((prev) => {
      const next = { ...prev };
      for (const k of CLIMATE_KEYS) {
        if (k === "wine") {
          next.wine = {
            ...next.wine,
            mode: "cool",
          };
          continue;
        }
        next[k] = {
          ...next[k],
          mode: mode === "calor" ? "heat" : "cool",
          fancoilMode:
            next[k].fancoilMode === "fan"
              ? "fan"
              : mode === "calor"
                ? "heat"
                : "cool",
        };
      }
      return next;
    });
  };

  const applyAway = () => {
    if (away) {
      setAway(false);
      setArmed(false);
      return;
    }
    setAway(true);
    setArmed(true);
    setActiveScene(null);
    setDevices((prev) => {
      const next = { ...prev };
      for (const key of CLIMATE_KEYS) {
        const defs = ROOM_DEVICES[key];
        const roomState = { ...next[key] };
        for (const dev of defs) {
          const cur = roomState[dev.id];
          if (!cur) continue;
          if (dev.kind === "light") {
            roomState[dev.id] = { ...cur, on: false, value: 0 };
          } else if (dev.kind === "blind") {
            roomState[dev.id] = { ...cur, on: true, value: 100 };
          } else if (dev.kind === "audio") {
            roomState[dev.id] = { ...cur, on: false };
          } else if (
            dev.kind === "switch" &&
            ["tv", "projector", "fireplace", "extractor", "bedheat"].includes(
              dev.id
            )
          ) {
            roomState[dev.id] = { ...cur, on: false };
          } else if (dev.id === "door" || dev.id === "window") {
            roomState[dev.id] = { ...cur, on: true };
          } else if (dev.id === "presence") {
            roomState[dev.id] = { ...cur, on: false };
          }
        }
        next[key] = roomState;
      }
      return next;
    });
    go("inicio");
  };

  const runScene = (scene: SceneId) => {
    setAway(false);
    setActiveScene(scene);
    setDevices((prev) => applySceneDevices(prev, scene));
    log(t(`scenes.${scene}`));
    if (scene === "cinema") {
      setRoom("cinema");
      if (typeof window !== "undefined" && window.innerWidth < 900) {
        setSidebarOpen(false);
      }
    }
  };

  const currentDef =
    room === "inicio"
      ? null
      : NAV_ROOMS.find((r) => r.id === room) ?? null;

  return (
    <div className="boadilla-demo-root" data-room={room}>
      <div className="boadilla-demo__bg" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={`boadilla-demo__photo ${bgShowPrimary ? "is-active" : ""}`}
          src={bgPrimary}
          alt=""
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={`boadilla-demo__photo ${bgShowPrimary ? "" : "is-active"}`}
          src={bgSecondary}
          alt=""
        />
        <div className="boadilla-demo__scrim" />
      </div>

      <div
        className={`boadilla-demo ${sidebarOpen ? "is-sidebar-open" : ""}`}
      >
      <aside className="boadilla-sidebar">
        <div className="boadilla-sidebar__head">
          <button
            type="button"
            className="boadilla-icon-btn"
            aria-label="Cerrar"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <nav className="boadilla-nav">
          <button
            type="button"
            className={`boadilla-nav__link ${room === "inicio" ? "is-active" : ""}`}
            onClick={() => go("inicio")}
          >
            {t("boadilla.central")}
          </button>
          {FLOORS.map((floor) => (
            <div key={floor.id} className="boadilla-nav__group">
              <p className="boadilla-nav__label">{t(`floors.${floor.id}`)}</p>
              {floor.rooms.map((id) => {
                const r = roomById(id);
                return (
                  <button
                    key={id}
                    type="button"
                    className={`boadilla-nav__link ${room === id ? "is-active" : ""}`}
                    onClick={() => go(id)}
                  >
                    {t(`rooms.${r.id}`)}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="boadilla-conn is-ok">
          <span className="boadilla-conn__dot" />
          {t("boadilla.demoLive")}
        </div>
      </aside>

      <div className="boadilla-shell">
        {sidebarOpen && (
          <button
            type="button"
            className="boadilla-backdrop"
            aria-label="Cerrar menú"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <header className="boadilla-topbar">
          <button
            type="button"
            className="boadilla-icon-btn boadilla-menu-btn"
            aria-label="Menú"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <Menu size={18} />
          </button>
          <time className="boadilla-clock">{clock || "—:—"}</time>
          <div className="boadilla-mode">
            <button
              type="button"
              className={`boadilla-mode__btn ${globalMode === "calor" && !away ? "is-heat" : ""}`}
              onClick={() => setGlobal("calor")}
            >
              {t("boadilla.winter")}
            </button>
            <button
              type="button"
              className={`boadilla-mode__btn ${globalMode === "frio" && !away ? "is-cool" : ""}`}
              onClick={() => setGlobal("frio")}
            >
              {t("boadilla.summer")}
            </button>
            <button
              type="button"
              className={`boadilla-mode__btn boadilla-mode__btn--away ${away ? "is-away" : ""}`}
              onClick={applyAway}
            >
              <Home size={13} strokeWidth={1.8} />
              {t("boadilla.away")}
            </button>
            <button
              type="button"
              className="boadilla-mode__btn boadilla-mode__btn--ambient"
              onClick={() => setAmbientMode(true)}
              aria-label={t("ambient.open")}
            >
              <Monitor size={13} strokeWidth={1.8} />
              {t("ambient.short")}
            </button>
          </div>
        </header>

        {showAlert && (
          <div className={`boadilla-alert ${leakAlert ? "is-danger" : "is-warn"}`}>
            <span>
              {leakAlert
                ? t("alerts.leak")
                : t("alerts.awayArmed")}
            </span>
            <button type="button" onClick={() => setAlertDismissed(true)}>
              {t("close")}
            </button>
          </div>
        )}

        <section className="boadilla-hero">
          {room !== "inicio" && (
            <button
              type="button"
              className="boadilla-back"
              onClick={() => go("inicio")}
            >
              <ChevronLeft size={16} /> {t("boadilla.central")}
            </button>
          )}
          <h2 className="boadilla-hero__title">
            {room === "inicio"
              ? away
                ? t("boadilla.awayTitle")
                : t("boadilla.welcome")
              : t(`rooms.${room}`)}
          </h2>
          <p className="boadilla-hero__sub">
            {room === "inicio"
              ? away
                ? t("boadilla.awaySub")
                : t("boadilla.central")
              : t(
                  `floors.${
                    FLOORS.find((f) => f.rooms.includes(room))?.id ?? "systems"
                  }`
                )}
          </p>
        </section>

        <main className="boadilla-main">
          {room === "inicio" && (
            <HomeView
              t={t}
              climates={climates}
              devices={devices}
              globalMode={globalMode}
              activeZones={activeZones}
              power={power}
              solar={solar}
              battery={battery}
              armed={armed}
              poolTemp={pool.current}
              activeScene={activeScene}
              weather={weather}
              history={history}
              occupiedCount={occupiedCount}
              away={away}
              ribbon={ribbon}
              pinned={pinned}
              onTogglePin={togglePin}
              onToggleLights={toggleRoomLights}
              onNudgeSetpoint={nudgeSetpoint}
              onScene={runScene}
              onGoto={go}
              onCentral={(action) => {
                if (action === "lights") {
                  setAway(false);
                  const anyOn = CLIMATE_KEYS.some((k) =>
                    ROOM_DEVICES[k].some(
                      (d) => d.kind === "light" && devices[k][d.id]?.on
                    )
                  );
                  if (anyOn) {
                    runScene("lightsOff");
                  } else {
                    runScene("lightsOn");
                  }
                  return;
                }
                if (action === "blinds") {
                  setAway(false);
                  setActiveScene(null);
                  setDevices((prev) => {
                    let openish = 0;
                    let total = 0;
                    for (const key of CLIMATE_KEYS) {
                      for (const def of ROOM_DEVICES[key]) {
                        if (def.kind !== "blind") continue;
                        const cur = prev[key][def.id];
                        if (!cur || (cur.lock && cur.lock !== "none")) continue;
                        total += 1;
                        if (cur.value < 50) openish += 1;
                      }
                    }
                    const closeAll = openish >= total / 2;
                    const value = closeAll ? 100 : 0;
                    log(
                      closeAll
                        ? t("favorites.blindsClose")
                        : t("favorites.blindsOpen")
                    );
                    return mapAllDevices(prev, ({ def, state }) => {
                      if (def.kind !== "blind") return state;
                      if (state.lock && state.lock !== "none") return state;
                      return { ...state, on: true, value, autoSun: false };
                    });
                  });
                  return;
                }
                if (action === "alarm") {
                  setArmed((v) => {
                    log(v ? t("security.disarmed") : t("security.armed"));
                    return !v;
                  });
                  return;
                }
                if (action === "away") {
                  applyAway();
                  log(t("boadilla.away"));
                  return;
                }
                if (action === "energy") {
                  go("energy");
                  return;
                }
                if (action === "access") {
                  go("access");
                }
              }}
            />
          )}

          {currentDef?.kind === "zone" && currentDef.climate && (
            <ZoneView
              t={t}
              def={currentDef}
              climate={climates[currentDef.climate]}
              mood={roomMood[currentDef.climate] ?? null}
              onMood={(mood) => {
                const key = currentDef.climate!;
                setRoomMood((prev) => ({ ...prev, [key]: mood }));
                setAway(false);
                setActiveScene(null);
                setDevices((prev) => ({
                  ...prev,
                  [key]: applyLightMoodToRoom(prev[key], key, mood),
                }));
                log(`${t(`rooms.${key}`)} · ${t(`moods.${mood}`)}`);
              }}
              onClimate={(c) =>
                setClimates((prev) => ({
                  ...prev,
                  [currentDef.climate!]: c,
                }))
              }
              roomDevices={devices[currentDef.climate]}
              onDevice={(id, next) => {
                setAway(false);
                setActiveScene(null);
                setDevices((prev) => ({
                  ...prev,
                  [currentDef.climate!]: {
                    ...prev[currentDef.climate!],
                    [id]: next,
                  },
                }));
              }}
            />
          )}

          {room === "pool" && (
            <PoolSpecial
              t={t}
              pool={pool}
              setPool={setPool}
              spa={spa}
              setSpa={setSpa}
            />
          )}
          {room === "energy" && (
            <EnergySpecial
              t={t}
              power={power}
              solar={solar}
              battery={battery}
              ev={ev}
              setEv={setEv}
              climates={climates}
            />
          )}
          {room === "security" && (
            <SecuritySpecial t={t} armed={armed} setArmed={setArmed} />
          )}
          {room === "access" && (
            <AccessSpecial
              t={t}
              access={access}
              setAccess={setAccess}
              hallDoor={devices.hall.door}
              onDoor={(next) =>
                setDevices((prev) => ({
                  ...prev,
                  hall: { ...prev.hall, door: next },
                }))
              }
              onLog={log}
            />
          )}
          {room === "history" && <HistoryView t={t} history={history} />}
          {room === "catLights" && (
            <CategoryLights
              t={t}
              devices={devices}
              onGoto={go}
              onToggleRoom={(key) => {
                setDevices((prev) => {
                  const defs = ROOM_DEVICES[key].filter((d) => d.kind === "light");
                  const anyOn = defs.some((d) => prev[key][d.id]?.on);
                  const roomState = { ...prev[key] };
                  for (const d of defs) {
                    const cur = roomState[d.id];
                    if (!cur) continue;
                    roomState[d.id] = {
                      ...cur,
                      on: !anyOn,
                      value: !anyOn ? cur.value || 55 : 0,
                    };
                  }
                  return { ...prev, [key]: roomState };
                });
              }}
            />
          )}
          {room === "catBlinds" && (
            <CategoryBlinds
              t={t}
              devices={devices}
              weather={weather}
              onGoto={go}
              onSetAll={(value) => {
                setDevices((prev) =>
                  mapAllDevices(prev, ({ def, state }) =>
                    def.kind === "blind"
                      ? {
                          ...state,
                          on: true,
                          value,
                          autoSun: false,
                          lock: state.lock === "wind" ? "wind" : "none",
                        }
                      : state
                  )
                );
                log(`${t("controls.blinds")} · ${value}%`);
              }}
              onPatch={(key, id, next) => {
                setDevices((prev) => ({
                  ...prev,
                  [key]: { ...prev[key], [id]: next },
                }));
              }}
            />
          )}
          {room === "catAudio" && (
            <CategoryAudio
              t={t}
              devices={devices}
              sync={audioSync}
              onGoto={go}
              onSync={(on) => {
                setAudioSync(on);
                if (on) {
                  setDevices((prev) => {
                    const vol = prev.living.audio?.value || 30;
                    return mapAllDevices(prev, ({ def, state }) =>
                      def.kind === "audio"
                        ? { ...state, on: true, value: vol }
                        : state
                    );
                  });
                  log(t("audioCat.synced"));
                }
              }}
              onToggle={(key) => {
                setDevices((prev) => {
                  const cur = prev[key].audio;
                  if (!cur) return prev;
                  return {
                    ...prev,
                    [key]: {
                      ...prev[key],
                      audio: { ...cur, on: !cur.on },
                    },
                  };
                });
              }}
            />
          )}
          {room === "catClimate" && (
            <CategoryClimate
              t={t}
              climates={climates}
              onGoto={go}
            />
          )}
          {room === "catPresence" && (
            <CategoryPresence t={t} devices={devices} onGoto={go} />
          )}
        </main>

        <p className="boadilla-disclaimer">{t("disclaimer")}</p>

        <nav className="boadilla-ribbon" aria-label={t("ribbon.label")}>
          {(
            [
              ["favorites", Star, "ribbon.favorites"],
              ["central", LayoutGrid, "ribbon.central"],
              ["rooms", Home, "ribbon.rooms"],
              ["categories", AppWindow, "ribbon.categories"],
            ] as const
          ).map(([id, Icon, labelKey]) => (
            <button
              key={id}
              type="button"
              className={`boadilla-ribbon__btn ${ribbon === id ? "is-active" : ""}`}
              onClick={() => selectRibbon(id)}
            >
              <Icon size={16} strokeWidth={1.7} />
              <span>{t(labelKey)}</span>
            </button>
          ))}
        </nav>
      </div>
      </div>

      {ambientMode && (
        <div
          className="boadilla-ambient"
          role="dialog"
          aria-modal="true"
          aria-label={t("ambient.title")}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="boadilla-ambient__top">
            <button
              type="button"
              className="boadilla-ambient__exit"
              onPointerDown={(e) => {
                e.stopPropagation();
                setAmbientMode(false);
              }}
              onClick={(e) => {
                e.stopPropagation();
                setAmbientMode(false);
              }}
            >
              {t("ambient.exit")}
            </button>
            <p className="boadilla-ambient__badge">{t("ambient.title")}</p>
          </div>
          <div className="boadilla-ambient__clock">
            <time>{clock || "—:—"}</time>
            <p>{ambientDate}</p>
          </div>
          <button
            type="button"
            className="boadilla-ambient__weather"
            onClick={() => {
              setAmbientMode(false);
              go("catBlinds");
            }}
          >
            <CloudSun size={22} />
            <div>
              <strong>
                {weather.temp.toFixed(1)}° · {t(`weather.${weather.condition}`)}
              </strong>
              <span>
                {t("weather.wind")} {weather.wind} km/h · {t("boadilla.humidity")}{" "}
                {weather.humidity}%
              </span>
            </div>
          </button>
          <div className="boadilla-ambient__favs">
            {pinned.map((key) => {
              const c = climates[key];
              const run = climateRunState(c);
              const lightsOn = roomLightsOn(devices[key], key);
              return (
                <button
                  key={key}
                  type="button"
                  className={`boadilla-ambient__tile ${lightsOn ? "has-lights" : ""}`}
                  onClick={() => {
                    setAmbientMode(false);
                    go(key);
                  }}
                >
                  <span className="boadilla-ambient__tile-name">
                    {t(`rooms.${key}`)}
                  </span>
                  <strong>{c.current.toFixed(1)}°</strong>
                  <span className={`boadilla-algo is-${run}`}>
                    {t(`algorithm.${run}`)}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="boadilla-ambient__status">
            <span>
              {t("energy.title")} · {power.toFixed(1)} kW
            </span>
            <span>
              {armed ? t("security.armed") : t("security.disarmed")}
            </span>
            <span>
              {occupiedCount} {t("presenceCentral.rooms")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ——— views ——— */

type TFunc = ReturnType<typeof useTranslations<"demo">>;

function HomeView({
  t,
  climates,
  devices,
  globalMode,
  activeZones,
  power,
  solar,
  battery,
  armed,
  poolTemp,
  activeScene,
  weather,
  history,
  occupiedCount,
  onScene,
  onGoto,
  onCentral,
  away,
  ribbon,
  pinned,
  onTogglePin,
  onToggleLights,
  onNudgeSetpoint,
}: {
  t: TFunc;
  climates: Record<ClimateKey, ZoneClimate>;
  devices: Record<ClimateKey, Record<string, DevState>>;
  globalMode: GlobalMode;
  activeZones: number;
  power: number;
  solar: number;
  battery: number;
  armed: boolean;
  poolTemp: number;
  activeScene: SceneId | null;
  weather: WeatherState;
  history: HistoryItem[];
  occupiedCount: number;
  away: boolean;
  ribbon: RibbonId;
  pinned: ClimateKey[];
  onTogglePin: (key: ClimateKey) => void;
  onToggleLights: (key: ClimateKey) => void;
  onNudgeSetpoint: (key: ClimateKey, delta: number) => void;
  onScene: (id: SceneId) => void;
  onGoto: (id: RoomId) => void;
  onCentral: (
    action: "lights" | "blinds" | "alarm" | "away" | "energy" | "access"
  ) => void;
}) {
  const WeatherIcon =
    weather.condition === "rain"
      ? CloudRain
      : weather.condition === "wind"
        ? Wind
        : weather.condition === "cloudy"
          ? CloudFog
          : CloudSun;

  const anyLightOn = CLIMATE_KEYS.some((k) =>
    ROOM_DEVICES[k].some((d) => d.kind === "light" && devices[k][d.id]?.on)
  );
  const blindsOpenish = (() => {
    let open = 0;
    let total = 0;
    for (const k of CLIMATE_KEYS) {
      for (const d of ROOM_DEVICES[k]) {
        if (d.kind !== "blind") continue;
        const cur = devices[k][d.id];
        if (!cur) continue;
        total += 1;
        if (cur.value < 50) open += 1;
      }
    }
    return total > 0 && open >= total / 2;
  })();

  const showCentral = ribbon === "central" || ribbon === "favorites";
  const showFloors = ribbon === "central" || ribbon === "rooms";
  const showPins = ribbon === "favorites" || ribbon === "central";

  return (
    <div className="boadilla-home">
      <div className="boadilla-home__floors">
        {showPins && (
          <>
            <h3 className="boadilla-section-title">
              <Star size={16} /> {t("pins.title")}
            </h3>
            <div className="boadilla-pins">
              {pinned.map((key) => {
                const def = ZONE_ROOMS.find((r) => r.climate === key)!;
                const c = climates[key];
                const run = climateRunState(c);
                const lightsOn = roomLightsOn(devices[key], key);
                const Icon = def.icon;
                return (
                  <div
                    key={key}
                    className={`boadilla-pin ${lightsOn ? "has-lights" : ""}`}
                  >
                    <button
                      type="button"
                      className="boadilla-pin__main"
                      onClick={() => onGoto(key)}
                    >
                      <Icon size={16} style={{ color: def.color }} />
                      <span>{t(`rooms.${key}`)}</span>
                      <strong>{c.current.toFixed(1)}°</strong>
                      <em className={`boadilla-algo is-${run}`}>
                        {t(`algorithm.${run}`)}
                      </em>
                    </button>
                    <div className="boadilla-pin__actions">
                      <button
                        type="button"
                        aria-label={t("pins.toggleLights")}
                        className={lightsOn ? "is-on" : ""}
                        onClick={() => onToggleLights(key)}
                      >
                        <Lightbulb size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label={t("pins.cooler")}
                        onClick={() => onNudgeSetpoint(key, -0.5)}
                      >
                        −
                      </button>
                      <button
                        type="button"
                        aria-label={t("pins.warmer")}
                        onClick={() => onNudgeSetpoint(key, 0.5)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        aria-label={t("pins.remove")}
                        className="is-star"
                        onClick={() => onTogglePin(key)}
                      >
                        <Star size={14} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {showCentral && (
          <>
            <h3 className="boadilla-section-title">
              <Home size={16} /> {t("favorites.title")}
            </h3>
            <div className="boadilla-favs">
              <button
                type="button"
                className={`boadilla-fav ${anyLightOn ? "is-on" : ""}`}
                onClick={() => onCentral("lights")}
              >
                <LightbulbOff size={16} />
                <span>
                  {anyLightOn
                    ? t("favorites.lightsOff")
                    : t("favorites.lightsOn")}
                </span>
              </button>
              <button
                type="button"
                className={`boadilla-fav ${blindsOpenish ? "is-on" : ""}`}
                onClick={() => onCentral("blinds")}
              >
                <Blinds size={16} />
                <span>
                  {blindsOpenish
                    ? t("favorites.blindsClose")
                    : t("favorites.blindsOpen")}
                </span>
              </button>
              <button
                type="button"
                className={`boadilla-fav ${armed ? "is-danger" : ""}`}
                onClick={() => onCentral("alarm")}
              >
                <Shield size={16} />
                <span>
                  {armed ? t("security.armed") : t("favorites.alarm")}
                </span>
              </button>
              <button
                type="button"
                className={`boadilla-fav ${away ? "is-danger" : ""}`}
                onClick={() => onCentral("away")}
              >
                <Home size={16} />
                <span>{t("boadilla.away")}</span>
              </button>
              <button
                type="button"
                className="boadilla-fav"
                onClick={() => onCentral("energy")}
              >
                <Zap size={16} />
                <span>{t("energy.title")}</span>
              </button>
              <button
                type="button"
                className="boadilla-fav"
                onClick={() => onCentral("access")}
              >
                <Lock size={16} />
                <span>{t("favorites.access")}</span>
              </button>
            </div>
          </>
        )}

        {showFloors && (
          <>
            <h3 className="boadilla-section-title">
              <LayoutGrid size={16} /> {t("boadilla.floors")}
            </h3>
            {FLOOR_ROWS.map((floor) => (
              <div key={floor.id} className="boadilla-floor-block">
                <p className="boadilla-floor-label">{t(`floors.${floor.id}`)}</p>
                <div
                  className="boadilla-floor-row"
                  style={{ ["--cols" as string]: floor.rooms.length }}
                >
                  {floor.rooms.map((id) => {
                    const def = ZONE_ROOMS.find((r) => r.id === id)!;
                    const c = climates[def.climate!];
                    const run = climateRunState(c);
                    const active =
                      def.climate === "wine"
                        ? c.mode !== "off"
                        : c.floor || c.fancoil;
                    const Icon = def.icon;
                    const roomDevs = devices[def.climate!];
                    const lightsOn = roomLightsOn(roomDevs, def.climate!);
                    const occupied = roomDevs.presence?.on;
                    const isPinned = pinned.includes(def.climate!);
                    return (
                      <div
                        key={id}
                        className={`boadilla-floor-card ${active ? "is-active" : ""} ${
                          lightsOn ? "has-lights" : ""
                        } ${occupied ? "has-presence" : ""}`}
                      >
                        <button
                          type="button"
                          className="boadilla-floor-card__hit"
                          onClick={() => onGoto(id)}
                        >
                          <div className="boadilla-floor-card__head">
                            <Icon
                              size={18}
                              style={{ color: def.color }}
                              strokeWidth={1.5}
                            />
                            <span>{t(`rooms.${id}`).toUpperCase()}</span>
                          </div>
                          <div className="boadilla-floor-card__rc">
                            <div>
                              <span className="lbl">{t("boadilla.real")}</span>
                              <span className="val">{c.current.toFixed(1)}°</span>
                            </div>
                            <div>
                              <span className="lbl">{t("boadilla.setpoint")}</span>
                              <span className="val val--set">
                                {c.target.toFixed(1)}°
                              </span>
                            </div>
                          </div>
                          <p
                            className={`boadilla-floor-card__meta ${
                              active ? "is-on" : ""
                            }`}
                          >
                            <span className={`boadilla-algo is-${run}`}>
                              {t(`algorithm.${run}`)}
                            </span>
                            {" · "}
                            {occupied
                              ? t("overview.occupied")
                              : lightsOn
                                ? t("boadilla.lightsOn")
                                : t("boadilla.lightsOff")}
                          </p>
                        </button>
                        <div className="boadilla-floor-card__quick">
                          <button
                            type="button"
                            className={lightsOn ? "is-on" : ""}
                            aria-label={t("pins.toggleLights")}
                            onClick={() => onToggleLights(def.climate!)}
                          >
                            <Lightbulb size={13} />
                          </button>
                          <button
                            type="button"
                            aria-label={t("pins.cooler")}
                            onClick={() => onNudgeSetpoint(def.climate!, -0.5)}
                          >
                            −
                          </button>
                          <button
                            type="button"
                            aria-label={t("pins.warmer")}
                            onClick={() => onNudgeSetpoint(def.climate!, 0.5)}
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className={`is-star ${isPinned ? "is-on" : ""}`}
                            aria-label={
                              isPinned ? t("pins.remove") : t("pins.add")
                            }
                            onClick={() => onTogglePin(def.climate!)}
                          >
                            <Star
                              size={13}
                              fill={isPinned ? "currentColor" : "none"}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}

        {showCentral && (
          <div className="boadilla-scenes-panel">
            <h3 className="boadilla-scenes-panel__title">
              <Sparkles size={14} strokeWidth={1.6} />
              <span>{t("scenesTitle")}</span>
            </h3>
            <div className="boadilla-scenes">
              {SCENES.map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={`boadilla-scene ${activeScene === id ? "is-active" : ""}`}
                  onClick={() => onScene(id)}
                >
                  <Icon size={16} strokeWidth={1.6} />
                  <span>{t(`scenes.${id}`)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="boadilla-home__side">
        <button
          type="button"
          className="boadilla-weather"
          onClick={() => onGoto("catBlinds")}
        >
          <WeatherIcon size={22} className="text-accent" />
          <div>
            <strong>
              {weather.temp.toFixed(1)}°
              <span> · {t(`weather.${weather.condition}`)}</span>
            </strong>
            <p>
              {t("weather.wind")} {weather.wind} km/h · {t("boadilla.humidity")}{" "}
              {weather.humidity}%
            </p>
          </div>
        </button>

        <button
          type="button"
          className="boadilla-energy-card"
          onClick={() => onGoto("catPresence")}
        >
          <div className="boadilla-energy-card__row">
            <Eye size={18} className="text-ok" />
            <span>{t("presenceCentral.title")}</span>
          </div>
          <div className="boadilla-energy-card__value">
            {occupiedCount}
            <span className="unit">{t("presenceCentral.rooms")}</span>
          </div>
        </button>

        <h3 className="boadilla-section-title">
          <Flame size={16} /> {t("boadilla.global")}
        </h3>
        <button
          type="button"
          className="boadilla-energy-card"
          onClick={() => onGoto("energy")}
        >
          <div className="boadilla-energy-card__row">
            <Flame
              size={18}
              className={globalMode === "calor" ? "text-heat" : "text-cool"}
            />
            <span>
              {t("boadilla.mode")} ·{" "}
              {globalMode === "calor"
                ? t("boadilla.winter")
                : t("boadilla.summer")}
            </span>
          </div>
          <div className="boadilla-energy-card__value">
            {activeZones}
            <span className="unit">
              / {CLIMATE_KEYS.length} {t("boadilla.zonesActive")}
            </span>
          </div>
        </button>
        <button
          type="button"
          className="boadilla-energy-card"
          onClick={() => onGoto("energy")}
        >
          <div className="boadilla-energy-card__row">
            <Zap size={18} className="text-accent" />
            <span>{t("energy.title")}</span>
          </div>
          <div className="boadilla-energy-card__value">
            {power.toFixed(1)}
            <span className="unit">kW</span>
          </div>
          <div className="boadilla-energy-mini" aria-hidden>
            <span className="is-solar">{t("solar")}</span>
            <i />
            <span className="is-home">{t("power")}</span>
            <i />
            <span className="is-battery">{t("battery")}</span>
          </div>
          <p className="boadilla-energy-card__sub">
            {t("solar")} {solar.toFixed(1)} kW · {t("battery")}{" "}
            {battery.toFixed(0)}%
          </p>
        </button>
        <button
          type="button"
          className="boadilla-energy-card"
          onClick={() => onGoto("security")}
        >
          <div className="boadilla-energy-card__row">
            <Shield
              size={18}
              className={armed ? "text-heat" : "text-ok"}
            />
            <span>{t("security.title")}</span>
          </div>
          <div className="boadilla-energy-card__value" style={{ fontSize: "1.25rem" }}>
            {armed ? t("security.armed") : t("security.disarmed")}
          </div>
        </button>
        <button
          type="button"
          className="boadilla-energy-card"
          onClick={() => onGoto("pool")}
        >
          <div className="boadilla-energy-card__row">
            <Waves size={18} className="text-cool" />
            <span>{t("pool.title")}</span>
          </div>
          <div className="boadilla-energy-card__value">
            {poolTemp.toFixed(1)}°
          </div>
        </button>

        <div className="boadilla-history">
          <h3 className="boadilla-section-title">
            <History size={16} /> {t("history.title")}
          </h3>
          <ul>
            {history.slice(0, 3).map((h) => (
              <li key={h.id}>
                <time>{h.at}</time>
                <span>{h.text}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="boadilla-history__more"
            onClick={() => onGoto("history")}
          >
            {t("history.more")}
          </button>
        </div>
      </div>
    </div>
  );
}

function ZoneView({
  t,
  def,
  climate,
  onClimate,
  mood,
  onMood,
  roomDevices,
  onDevice,
}: {
  t: TFunc;
  def: RoomDef;
  climate: ZoneClimate;
  onClimate: (c: ZoneClimate) => void;
  mood: LightMood | null;
  onMood: (m: LightMood) => void;
  roomDevices: Record<string, DevState>;
  onDevice: (id: string, next: DevState) => void;
}) {
  const wine = def.id === "wine";
  const min = wine ? 10 : 16;
  const max = wine ? 18 : 30;
  const fans: FanSpeed[] = ["off", "auto", 1, 2, 3];
  const fancoilModes: FancoilMode[] = ["cool", "heat", "fan"];
  const floorOn = climate.floor;
  const fanOn = climate.fancoil && climate.fan !== "off";
  const extras = ROOM_DEVICES[def.climate!];
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const aq = roomDevices.aq;
  const run = climateRunState(climate);
  const algoMins = algorithmMinutes(climate);

  const toggleFloor = () =>
    onClimate({ ...climate, floor: !climate.floor });

  const toggleFancoil = () => {
    const nextOn = !climate.fancoil;
    onClimate({
      ...climate,
      fancoil: nextOn,
      fan: nextOn
        ? climate.fan === "off"
          ? "auto"
          : climate.fan
        : "off",
    });
  };

  const setFan = (f: FanSpeed) => {
    onClimate({
      ...climate,
      fan: f,
      fancoil: f !== "off",
    });
  };

  const setFancoilMode = (fancoilMode: FancoilMode) => {
    onClimate({
      ...climate,
      fancoil: true,
      fancoilMode,
      fan: climate.fan === "off" ? "auto" : climate.fan,
    });
  };

  return (
    <div className="boadilla-zone">
      <article className="boadilla-thermo">
        <div
          className={`boadilla-thermo__temp ${
            climate.mode === "heat"
              ? "is-heat"
              : climate.mode === "cool"
                ? "is-cool"
                : ""
          }`}
        >
          {climate.current.toFixed(1)}
          <span className="unit">°</span>
        </div>
        <p className="boadilla-thermo__hum">
          {t("boadilla.humidity")} {climate.humidity.toFixed(0)} %
          {aq ? ` · CO₂ ${aq.value} ppm` : ""}
        </p>
        <div className={`boadilla-algo-card is-${run}`}>
          <span className={`boadilla-algo is-${run}`}>{t(`algorithm.${run}`)}</span>
          <p>
            {run === "off"
              ? t("algorithm.offHint")
              : run === "holding"
                ? t("algorithm.holdingHint")
                : t("algorithm.nextAdjust", { minutes: algoMins })}
          </p>
          {run !== "off" && (
            <small>
              {t("algorithm.savings", {
                kwh: (Math.abs(climate.target - climate.current) * 0.18 + 0.12).toFixed(2),
              })}
            </small>
          )}
        </div>
        <div className="boadilla-thermo__controls">
          <button
            type="button"
            onClick={() =>
              onClimate({
                ...climate,
                target: clamp(Number((climate.target - 0.5).toFixed(1)), min, max),
              })
            }
          >
            −
          </button>
          <span>{climate.target.toFixed(1)}°</span>
          <button
            type="button"
            onClick={() =>
              onClimate({
                ...climate,
                target: clamp(Number((climate.target + 0.5).toFixed(1)), min, max),
              })
            }
          >
            +
          </button>
        </div>
        <p className="boadilla-thermo__label">{t("boadilla.setpoint")}</p>

        <div className="boadilla-moods">
          <p className="boadilla-thermo__label" style={{ marginTop: 0 }}>
            {t("moods.title")}
          </p>
          <div className="boadilla-moods__grid">
            {LIGHT_MOODS.map((m) => (
              <button
                key={m}
                type="button"
                className={mood === m ? "is-active" : ""}
                onClick={() => onMood(m)}
              >
                {t(`moods.${m}`)}
              </button>
            ))}
          </div>
        </div>

        {!wine && (
          <div className="boadilla-thermo__emitters">
            <button
              type="button"
              className="boadilla-thermo__emitter"
              aria-pressed={floorOn}
              onClick={toggleFloor}
            >
              <span className="boadilla-thermo__emitter-label">
                {t("thermostat.floor")}
              </span>
              <span
                className={`boadilla-toggle ${floorOn ? "is-on" : ""}`}
                aria-hidden
              >
                <span />
              </span>
            </button>
            <button
              type="button"
              className="boadilla-thermo__emitter"
              aria-pressed={climate.fancoil}
              onClick={toggleFancoil}
            >
              <span className="boadilla-thermo__emitter-label">
                {t("thermostat.fancoil")}
              </span>
              <span
                className={`boadilla-toggle ${climate.fancoil ? "is-on" : ""}`}
                aria-hidden
              >
                <span />
              </span>
            </button>
          </div>
        )}

        {!wine && (
          <div
            className={`boadilla-thermo__fan ${
              climate.fancoil ? "" : "is-disabled"
            }`}
          >
            <div className="boadilla-thermo__fan-head">
              <span>{t("thermostat.fancoilMode")}</span>
            </div>
            <div className="boadilla-thermo__modes boadilla-thermo__modes--fancoil">
              {fancoilModes.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`${climate.fancoilMode === m ? "is-active" : ""} ${
                    m === "heat" ? "is-heat" : m === "cool" ? "is-cool" : ""
                  }`}
                  onClick={() => setFancoilMode(m)}
                >
                  {t(`thermostat.fancoilModes.${m}`)}
                </button>
              ))}
            </div>
            <div className="boadilla-thermo__fan-head">
              <span>{t("thermostat.fanSpeed")}</span>
              <Fan
                size={14}
                className={fanOn ? "is-spin" : ""}
                strokeWidth={1.5}
              />
            </div>
            <div className="boadilla-thermo__fan-grid">
              {fans.map((f) => (
                <button
                  key={String(f)}
                  type="button"
                  className={climate.fan === f ? "is-active" : ""}
                  onClick={() => setFan(f)}
                >
                  {f === "off"
                    ? t("thermostat.fan.off")
                    : f === "auto"
                      ? t("thermostat.fan.auto")
                      : f}
                </button>
              ))}
            </div>
          </div>
        )}
      </article>

      <div className="boadilla-devices-wrap">
        <div className="boadilla-devices">
          {extras.map((dev) => {
            const state = roomDevices[dev.id] ?? { on: false, value: 0 };
            const title = t(`devices.${dev.label}`);
            const expanded = expandedId === dev.id;
            const toggleExpand = () =>
              setExpandedId((id) => (id === dev.id ? null : dev.id));

            if (dev.kind === "light") {
              const glow = lightGlow(dev, state);
              return (
                <DeviceCard
                  key={dev.id}
                  icon={dev.icon}
                  title={title}
                  status={
                    state.on
                      ? dev.variant === "ww"
                        ? `${state.value}% · ${state.kelvin ?? 3000}K`
                        : `${state.value}%`
                      : t("off")
                  }
                  active={state.on}
                  className={state.on ? "is-light" : ""}
                  expandable={state.on}
                  expanded={expanded}
                  onToggleExpand={toggleExpand}
                  toggle={
                    <Toggle
                      on={state.on}
                      onChange={(on) => {
                        if (!on && expandedId === dev.id) setExpandedId(null);
                        onDevice(dev.id, {
                          ...state,
                          on,
                          value: on && state.value < 8 ? 55 : state.value,
                        });
                      }}
                    />
                  }
                />
              );
            }

            if (dev.kind === "blind") {
              const locked = state.lock && state.lock !== "none";
              const blindLabel = locked
                ? t(`blinds.lock.${state.lock}`)
                : state.value <= 5
                  ? `${t("devices.blindOpen")}${state.autoSun ? ` · ${t("blinds.autoSun")}` : ""}`
                  : state.value >= 95
                    ? `${t("devices.blindClosed")}${state.autoSun ? ` · ${t("blinds.autoSun")}` : ""}`
                    : `${state.value}%${state.autoSun ? ` · ${t("blinds.autoSun")}` : ""}`;
              const toggleBlind = () => {
                if (locked) {
                  setExpandedId(dev.id);
                  return;
                }
                const next = state.value > 50 ? 0 : 100;
                onDevice(dev.id, {
                  ...state,
                  on: true,
                  value: next,
                  autoSun: false,
                });
              };
              return (
                <DeviceCard
                  key={dev.id}
                  icon={dev.icon}
                  title={title}
                  status={blindLabel}
                  active={state.value < 90}
                  expandable
                  expanded={expanded}
                  onToggleExpand={toggleExpand}
                  toggle={
                    <button
                      type="button"
                      className={`boadilla-blind-meter ${locked ? "is-locked" : ""}`}
                      aria-label={blindLabel}
                      onClick={toggleBlind}
                    >
                      <span style={{ height: `${100 - state.value}%` }} />
                    </button>
                  }
                />
              );
            }

            if (dev.kind === "audio") {
              return (
                <DeviceCard
                  key={dev.id}
                  icon={dev.icon}
                  title={title}
                  status={state.on ? `${state.value}%` : t("off")}
                  active={state.on}
                  className={state.on ? "is-audio" : ""}
                  expandable={state.on}
                  expanded={expanded}
                  onToggleExpand={toggleExpand}
                  toggle={
                    <Toggle
                      on={state.on}
                      onChange={(on) => {
                        if (!on && expandedId === dev.id) setExpandedId(null);
                        onDevice(dev.id, { ...state, on });
                      }}
                    />
                  }
                />
              );
            }

            if (dev.kind === "sensor") {
              if (dev.id === "presence") {
                return (
                  <DeviceCard
                    key={dev.id}
                    icon={dev.icon}
                    title={title}
                    status={
                      state.on ? t("overview.occupied") : t("overview.empty")
                    }
                    active={state.on}
                    className={state.on ? "is-presence is-on" : "is-sensor"}
                    toggle={
                      <span
                        className={`boadilla-sensor-pill ${
                          state.on ? "is-ok" : ""
                        }`}
                      >
                        {state.on
                          ? t("overview.occupied")
                          : t("overview.empty")}
                      </span>
                    }
                  />
                );
              }
              const alert = state.value > 1000;
              return (
                <DeviceCard
                  key={dev.id}
                  icon={dev.icon}
                  title={title}
                  status={`${state.value} ${dev.unit ?? ""}`.trim()}
                  active={!alert}
                  className={alert ? "is-alert" : "is-sensor"}
                  toggle={
                    <span
                      className={`boadilla-sensor-pill ${
                        alert ? "is-alert" : "is-ok"
                      }`}
                    >
                      {alert ? t("devices.aqHigh") : t("devices.aqOk")}
                    </span>
                  }
                />
              );
            }

            const switchStatus =
              dev.id === "door"
                ? state.on
                  ? t("devices.locked")
                  : t("devices.unlocked")
                : dev.id === "window"
                  ? state.on
                    ? t("devices.windowClosed")
                    : t("devices.windowOpen")
                  : dev.id === "leak"
                    ? state.on
                      ? t("devices.leakAlert")
                      : t("devices.leakOk")
                    : state.on
                      ? t("on")
                      : t("off");

            const specialClass =
              dev.id === "fireplace" && state.on
                ? "is-fire"
                : dev.id === "leak" && state.on
                  ? "is-alert"
                  : "";

            return (
              <DeviceCard
                key={dev.id}
                icon={dev.icon}
                title={title}
                status={switchStatus}
                active={dev.id === "leak" ? !state.on : state.on}
                className={specialClass}
                toggle={
                  <Toggle
                    on={state.on}
                    onChange={(on) => onDevice(dev.id, { ...state, on })}
                  />
                }
              />
            );
          })}
        </div>

        {expandedId && (() => {
          const dev = extras.find((d) => d.id === expandedId);
          if (!dev) return null;
          const state = roomDevices[dev.id] ?? { on: false, value: 0 };
          const title = t(`devices.${dev.label}`);

          if (dev.kind === "light" && state.on) {
            const glow = lightGlow(dev, state);
            return (
              <div className="boadilla-device-tray">
                <div className="boadilla-device-tray__head">
                  <strong>{title}</strong>
                  <button type="button" onClick={() => setExpandedId(null)}>
                    {t("close")}
                  </button>
                </div>
                <div className="boadilla-device__detail">
                  <label className="boadilla-field boadilla-field--full">
                    <span>{t("devices.brightness")}</span>
                    <input
                      type="range"
                      min={1}
                      max={100}
                      value={state.value}
                      aria-label={t("devices.brightness")}
                      onChange={(e) =>
                        onDevice(dev.id, {
                          ...state,
                          value: Number(e.target.value),
                        })
                      }
                      className="boadilla-range boadilla-range--wide"
                      style={{
                        background: `linear-gradient(90deg, ${glow}55, ${glow})`,
                      }}
                    />
                  </label>
                  {dev.variant === "rgb" && (
                    <div className="boadilla-rgb">
                      {RGB_PRESETS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          className={`boadilla-rgb__swatch ${
                            state.color === c ? "is-active" : ""
                          }`}
                          style={{ background: c }}
                          aria-label={c}
                          onClick={() =>
                            onDevice(dev.id, { ...state, color: c })
                          }
                        />
                      ))}
                      <label className="boadilla-rgb__picker">
                        <input
                          type="color"
                          value={state.color ?? "#4cc9f0"}
                          onChange={(e) =>
                            onDevice(dev.id, {
                              ...state,
                              color: e.target.value,
                            })
                          }
                        />
                      </label>
                    </div>
                  )}
                  {dev.variant === "ww" && (
                    <div className="boadilla-kelvin">
                      <label className="boadilla-field boadilla-field--full">
                        <span>{t("devices.colorTemp")}</span>
                        <input
                          type="range"
                          min={2200}
                          max={6500}
                          step={100}
                          value={state.kelvin ?? 3000}
                          aria-label={t("devices.colorTemp")}
                          onChange={(e) =>
                            onDevice(dev.id, {
                              ...state,
                              kelvin: Number(e.target.value),
                            })
                          }
                          className="boadilla-range boadilla-range--wide boadilla-range--kelvin"
                        />
                      </label>
                      <div className="boadilla-kelvin__presets">
                        {KELVIN_PRESETS.map((k) => (
                          <button
                            key={k}
                            type="button"
                            className={state.kelvin === k ? "is-active" : ""}
                            style={{ background: kelvinToHex(k) }}
                            onClick={() =>
                              onDevice(dev.id, { ...state, kelvin: k })
                            }
                          >
                            {k === 2200
                              ? t("devices.warm")
                              : k === 6500
                                ? t("devices.cool")
                                : `${Math.round(k / 100) / 10}k`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          if (dev.kind === "blind") {
            const setBlind = (value: number) =>
              onDevice(dev.id, {
                ...state,
                on: true,
                value: clamp(value, 0, 100),
                autoSun: false,
              });
            const locked = state.lock && state.lock !== "none";
            const positionLabel =
              state.value <= 5
                ? t("devices.blindOpen")
                : state.value >= 95
                  ? t("devices.blindClosed")
                  : `${state.value}%`;
            return (
              <div className="boadilla-device-tray">
                <div className="boadilla-device-tray__head">
                  <strong>{title}</strong>
                  <button type="button" onClick={() => setExpandedId(null)}>
                    {t("close")}
                  </button>
                </div>
                {locked && (
                  <p className="boadilla-blind-lock">
                    {t(`blinds.lock.${state.lock}`)}
                  </p>
                )}
                <div className="boadilla-device__detail">
                  <div className="boadilla-blind-status">
                    <span>{t("blinds.position")}</span>
                    <strong>{positionLabel}</strong>
                  </div>
                  <div className="boadilla-blind-actions">
                    <button
                      type="button"
                      className="boadilla-blind-actions__main"
                      disabled={!!locked}
                      onClick={() => setBlind(0)}
                    >
                      {t("devices.blindOpen")}
                    </button>
                    <button
                      type="button"
                      className="boadilla-blind-actions__step"
                      aria-label={t("devices.blindUp")}
                      disabled={!!locked}
                      onClick={() => setBlind(state.value - 10)}
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className="boadilla-blind-actions__step"
                      aria-label={t("devices.blindDown")}
                      disabled={!!locked}
                      onClick={() => setBlind(state.value + 10)}
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      className="boadilla-blind-actions__main"
                      disabled={!!locked}
                      onClick={() => setBlind(100)}
                    >
                      {t("devices.blindClosed")}
                    </button>
                  </div>
                  <div className="boadilla-blind-presets">
                    {[0, 25, 50, 75, 100].map((v) => (
                      <button
                        key={v}
                        type="button"
                        className={
                          Math.abs(state.value - v) < 3 ? "is-active" : ""
                        }
                        disabled={!!locked}
                        onClick={() => setBlind(v)}
                      >
                        {v === 0
                          ? t("devices.blindOpen")
                          : v === 100
                            ? t("devices.blindClosed")
                            : `${v}%`}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={`boadilla-auto-sun ${state.autoSun ? "is-on" : ""}`}
                    disabled={!!locked}
                    onClick={() =>
                      onDevice(dev.id, {
                        ...state,
                        autoSun: !state.autoSun,
                      })
                    }
                  >
                    <Sun size={14} />
                    {state.autoSun
                      ? t("blinds.autoSunOn")
                      : t("blinds.autoSunOff")}
                  </button>
                </div>
              </div>
            );
          }

          if (dev.kind === "audio" && state.on) {
            return (
              <div className="boadilla-device-tray">
                <div className="boadilla-device-tray__head">
                  <strong>{title}</strong>
                  <button type="button" onClick={() => setExpandedId(null)}>
                    {t("close")}
                  </button>
                </div>
                <div className="boadilla-device__detail">
                  <div className="boadilla-eq" aria-hidden>
                    <i /><i /><i /><i /><i />
                  </div>
                  <label className="boadilla-field boadilla-field--full">
                    <span>{t("controls.audio")}</span>
                    <input
                      type="range"
                      min={1}
                      max={100}
                      value={state.value}
                      onChange={(e) =>
                        onDevice(dev.id, {
                          ...state,
                          value: Number(e.target.value),
                        })
                      }
                      className="boadilla-range boadilla-range--wide"
                    />
                  </label>
                </div>
              </div>
            );
          }

          return null;
        })()}
      </div>
    </div>
  );
}

function DeviceCard({
  icon: Icon,
  title,
  status,
  active,
  toggle,
  className = "",
  expandable = false,
  expanded = false,
  onToggleExpand,
}: {
  icon: LucideIcon;
  title: string;
  status: string;
  active?: boolean;
  toggle?: ReactNode;
  className?: string;
  expandable?: boolean;
  expanded?: boolean;
  onToggleExpand?: () => void;
}) {
  return (
    <div
      className={`boadilla-device ${active ? "is-on" : ""} ${
        expanded ? "is-selected" : ""
      } ${className}`.trim()}
    >
      <div className="boadilla-device__main">
        <div className="boadilla-device__icon">
          <Icon size={28} strokeWidth={1.4} />
        </div>
        <div className="boadilla-device__toggle">{toggle}</div>
        <button
          type="button"
          className="boadilla-device__info"
          onClick={() => expandable && onToggleExpand?.()}
          aria-expanded={expandable ? expanded : undefined}
        >
          <h3>{title}</h3>
          <p>{status}</p>
        </button>
        {expandable ? (
          <button
            type="button"
            className="boadilla-device__more"
            aria-label={expanded ? "Cerrar" : "Ajustar"}
            onClick={() => onToggleExpand?.()}
          >
            <ChevronLeft
              size={16}
              style={{
                transform: expanded ? "rotate(-90deg)" : "rotate(-270deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </button>
        ) : (
          <span className="boadilla-device__more is-spacer" aria-hidden />
        )}
      </div>
    </div>
  );
}

function Toggle({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className={`boadilla-toggle ${on ? "is-on" : ""}`}
      onClick={() => onChange(!on)}
    >
      <span />
    </button>
  );
}

function PoolSpecial({
  t,
  pool,
  setPool,
  spa,
  setSpa,
}: {
  t: TFunc;
  pool: {
    heating: boolean;
    current: number;
    target: number;
    filter: boolean;
    jets: boolean;
  };
  setPool: Dispatch<SetStateAction<typeof pool>>;
  spa: { on: boolean; current: number; target: number };
  setSpa: Dispatch<SetStateAction<typeof spa>>;
}) {
  return (
    <div className="boadilla-zone">
      <article className="boadilla-thermo">
        <div className="boadilla-thermo__temp is-cool">
          {pool.current.toFixed(1)}
          <span className="unit">°</span>
        </div>
        <p className="boadilla-thermo__hum">{t("pool.title")}</p>
        <div className="boadilla-thermo__controls">
          <button
            type="button"
            onClick={() =>
              setPool((p) => ({
                ...p,
                target: clamp(p.target - 0.5, 22, 34),
              }))
            }
          >
            −
          </button>
          <span>{pool.target.toFixed(1)}°</span>
          <button
            type="button"
            onClick={() =>
              setPool((p) => ({
                ...p,
                target: clamp(p.target + 0.5, 22, 34),
              }))
            }
          >
            +
          </button>
        </div>
        <p className="boadilla-thermo__label">{t("boadilla.setpoint")}</p>
        <div className="boadilla-thermo__chips">
          {(
            [
              ["heating", pool.heating],
              ["filter", pool.filter],
              ["jets", pool.jets],
            ] as const
          ).map(([k, on]) => (
            <button
              key={k}
              type="button"
              className={on ? "is-cool" : ""}
              onClick={() => setPool((p) => ({ ...p, [k]: !p[k] }))}
            >
              {t(`pool.${k}`)}
            </button>
          ))}
        </div>
      </article>
      <div className="boadilla-devices">
        <DeviceCard
          icon={Bath}
          title={t("spa.title")}
          status={`${spa.current.toFixed(1)}°`}
          active={spa.on}
          toggle={
            <Toggle on={spa.on} onChange={(on) => setSpa((s) => ({ ...s, on }))} />
          }
        />
      </div>
    </div>
  );
}

function EnergySpecial({
  t,
  power,
  solar,
  battery,
  ev,
  setEv,
  climates,
}: {
  t: TFunc;
  power: number;
  solar: number;
  battery: number;
  ev: { charging: boolean; pct: number };
  setEv: Dispatch<SetStateAction<{ charging: boolean; pct: number }>>;
  climates: Record<ClimateKey, ZoneClimate>;
}) {
  const grid = Number((solar - power).toFixed(1));
  return (
    <div className="boadilla-special">
      <div className="boadilla-energy-flow is-diagram" aria-hidden>
        <p className="boadilla-energy-flow__title">{t("energy.live")}</p>
        <div className="boadilla-energy-flow__hub">
          <div className="boadilla-energy-flow__node is-solar">
            <Sun size={18} />
            <strong>{solar.toFixed(1)} kW</strong>
            <span>{t("solar")}</span>
          </div>
          <div
            className={`boadilla-energy-flow__pipe is-animated ${
              solar > 0.2 ? "is-active" : ""
            }`}
          />
          <div className="boadilla-energy-flow__node is-home">
            <Home size={18} />
            <strong>{power.toFixed(1)} kW</strong>
            <span>{t("power")}</span>
          </div>
          <div
            className={`boadilla-energy-flow__pipe is-animated ${
              battery > 0 ? "is-active" : ""
            }`}
          />
          <div className="boadilla-energy-flow__node is-battery">
            <BatteryCharging size={18} />
            <strong>{battery.toFixed(0)}%</strong>
            <span>{t("battery")}</span>
          </div>
          <div
            className={`boadilla-energy-flow__pipe is-animated ${
              Math.abs(grid) > 0.1 ? "is-active" : ""
            }`}
          />
          <div
            className={`boadilla-energy-flow__node ${
              grid >= 0 ? "is-export" : "is-import"
            }`}
          >
            <Zap size={18} />
            <strong>{Math.abs(grid).toFixed(1)} kW</strong>
            <span>
              {grid >= 0 ? t("energy.exporting") : t("energy.importing")}
            </span>
          </div>
        </div>
        <p className="boadilla-energy-flow__caption">{t("energy.flowHint")}</p>
      </div>
      <div className="boadilla-special__grid">
        <div className="boadilla-energy-card">
          <div className="boadilla-energy-card__row">
            <Zap size={18} />
            <span>{t("power")}</span>
          </div>
          <div className="boadilla-energy-card__value">
            {power.toFixed(2)}
            <span className="unit">kW</span>
          </div>
        </div>
        <div className="boadilla-energy-card">
          <div className="boadilla-energy-card__row">
            <Sun size={18} />
            <span>{t("solar")}</span>
          </div>
          <div className="boadilla-energy-card__value">
            {solar.toFixed(2)}
            <span className="unit">kW</span>
          </div>
        </div>
        <div className="boadilla-energy-card">
          <div className="boadilla-energy-card__row">
            <BatteryCharging size={18} />
            <span>{t("battery")}</span>
          </div>
          <div className="boadilla-energy-card__value">
            {battery.toFixed(0)}
            <span className="unit">%</span>
          </div>
        </div>
        <div className="boadilla-energy-card">
          <div className="boadilla-energy-card__row">
            <span>{t("ev.title")}</span>
            <Toggle
              on={ev.charging}
              onChange={(charging) => setEv((e) => ({ ...e, charging }))}
            />
          </div>
          <div className="boadilla-energy-card__value">
            {ev.pct.toFixed(0)}
            <span className="unit">%</span>
          </div>
        </div>
      </div>
      <div className="boadilla-energy-card" style={{ marginTop: "0.75rem" }}>
        <p className="boadilla-section-title" style={{ marginBottom: "0.75rem" }}>
          {t("energy.climates")}
        </p>
        <div className="boadilla-climate-list">
          {CLIMATE_KEYS.map((k) => (
            <div key={k}>
              <span>{t(`rooms.${k}`)}</span>
              <strong>
                {climates[k].current.toFixed(1)}° · {climates[k].mode}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SecuritySpecial({
  t,
  armed,
  setArmed,
}: {
  t: TFunc;
  armed: boolean;
  setArmed: (v: boolean) => void;
}) {
  return (
    <div className="boadilla-zone">
      <article className="boadilla-thermo">
        <Shield
          size={48}
          className={armed ? "text-heat" : "text-ok"}
          strokeWidth={1.25}
        />
        <p className="boadilla-thermo__hum" style={{ marginTop: "1rem" }}>
          {t("security.title")}
        </p>
        <div
          className="boadilla-energy-card__value"
          style={{ fontSize: "1.8rem", margin: "0.5rem 0 1rem" }}
        >
          {armed ? t("security.armed") : t("security.disarmed")}
        </div>
        <Toggle on={armed} onChange={setArmed} />
      </article>
    </div>
  );
}

function AccessSpecial({
  t,
  access,
  setAccess,
  hallDoor,
  onDoor,
  onLog,
}: {
  t: TFunc;
  access: AccessState;
  setAccess: Dispatch<SetStateAction<AccessState>>;
  hallDoor: DevState;
  onDoor: (next: DevState) => void;
  onLog: (text: string) => void;
}) {
  return (
    <div className="boadilla-special">
      <div className={`boadilla-doorbell ${access.doorbell ? "is-ringing" : ""}`}>
        <Bell size={22} />
        <div>
          <strong>{t("access.doorbell")}</strong>
          <p>{access.doorbell ? t("access.ringing") : t("access.idle")}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setAccess((a) => ({ ...a, doorbell: true }));
            onLog(t("access.ringLog"));
          }}
        >
          {t("access.simulate")}
        </button>
      </div>
      <div className="boadilla-devices">
        <DeviceCard
          icon={Lock}
          title={t("devices.doorLock")}
          status={hallDoor.on ? t("devices.locked") : t("devices.unlocked")}
          active={hallDoor.on}
          toggle={
            <Toggle
              on={hallDoor.on}
              onChange={(on) => {
                onDoor({ ...hallDoor, on });
                onLog(on ? t("devices.locked") : t("devices.unlocked"));
              }}
            />
          }
        />
        <DeviceCard
          icon={Car}
          title={t("garage.left")}
          status={access.garageLeft ? t("access.open") : t("access.closed")}
          active={access.garageLeft}
          toggle={
            <Toggle
              on={access.garageLeft}
              onChange={(garageLeft) => {
                setAccess((a) => ({ ...a, garageLeft }));
                onLog(t("garage.left"));
              }}
            />
          }
        />
        <DeviceCard
          icon={Car}
          title={t("garage.right")}
          status={access.garageRight ? t("access.open") : t("access.closed")}
          active={access.garageRight}
          toggle={
            <Toggle
              on={access.garageRight}
              onChange={(garageRight) => {
                setAccess((a) => ({ ...a, garageRight }));
                onLog(t("garage.right"));
              }}
            />
          }
        />
        <DeviceCard
          icon={DoorOpen}
          title={t("access.gate")}
          status={access.gate ? t("access.open") : t("access.closed")}
          active={access.gate}
          toggle={
            <Toggle
              on={access.gate}
              onChange={(gate) => {
                setAccess((a) => ({ ...a, gate }));
                onLog(t("access.gate"));
              }}
            />
          }
        />
      </div>
    </div>
  );
}

function CategoryLights({
  t,
  devices,
  onGoto,
  onToggleRoom,
}: {
  t: TFunc;
  devices: Record<ClimateKey, Record<string, DevState>>;
  onGoto: (id: RoomId) => void;
  onToggleRoom: (key: ClimateKey) => void;
}) {
  return (
    <div className="boadilla-cat">
      <p className="boadilla-cat__lead">{t("categories.lightsLead")}</p>
      <div className="boadilla-devices">
        {CLIMATE_KEYS.map((key) => {
          const defs = ROOM_DEVICES[key].filter((d) => d.kind === "light");
          if (!defs.length) return null;
          const onCount = defs.filter((d) => devices[key][d.id]?.on).length;
          return (
            <DeviceCard
              key={key}
              icon={Lightbulb}
              title={t(`rooms.${key}`)}
              status={`${onCount}/${defs.length} ${t("on")}`}
              active={onCount > 0}
              className={onCount > 0 ? "is-light is-on" : ""}
              toggle={
                <Toggle on={onCount > 0} onChange={() => onToggleRoom(key)} />
              }
              expandable
              onToggleExpand={() => onGoto(key)}
            />
          );
        })}
      </div>
    </div>
  );
}

function CategoryBlinds({
  t,
  devices,
  weather,
  onGoto,
  onSetAll,
  onPatch,
}: {
  t: TFunc;
  devices: Record<ClimateKey, Record<string, DevState>>;
  weather: WeatherState;
  onGoto: (id: RoomId) => void;
  onSetAll: (value: number) => void;
  onPatch: (key: ClimateKey, id: string, next: DevState) => void;
}) {
  return (
    <div className="boadilla-cat">
      <p className="boadilla-cat__lead">
        {t("categories.blindsLead")} · {t(`weather.${weather.condition}`)} ·{" "}
        {weather.wind} km/h
      </p>
      <div className="boadilla-cat__actions">
        <button type="button" onClick={() => onSetAll(0)}>
          {t("devices.blindOpen")}
        </button>
        <button type="button" onClick={() => onSetAll(50)}>
          50%
        </button>
        <button type="button" onClick={() => onSetAll(100)}>
          {t("devices.blindClosed")}
        </button>
      </div>
      <div className="boadilla-devices">
        {CLIMATE_KEYS.flatMap((key) =>
          ROOM_DEVICES[key]
            .filter((d) => d.kind === "blind")
            .map((d) => {
              const state = devices[key][d.id];
              if (!state) return null;
              const locked = state.lock && state.lock !== "none";
              return (
                <DeviceCard
                  key={`${key}-${d.id}`}
                  icon={Blinds}
                  title={`${t(`rooms.${key}`)} · ${t(`devices.${d.label}`)}`}
                  status={
                    locked
                      ? t(`blinds.lock.${state.lock}`)
                      : state.autoSun
                        ? `${state.value}% · ${t("blinds.autoSun")}`
                        : `${state.value}%`
                  }
                  active={state.value < 100}
                  toggle={
                    <Toggle
                      on={state.value < 80}
                      onChange={() => {
                        if (locked) return;
                        onPatch(key, d.id, {
                          ...state,
                          value: state.value < 80 ? 100 : 0,
                          autoSun: false,
                        });
                      }}
                    />
                  }
                  expandable
                  onToggleExpand={() => onGoto(key)}
                />
              );
            })
        )}
      </div>
    </div>
  );
}

function CategoryAudio({
  t,
  devices,
  sync,
  onGoto,
  onSync,
  onToggle,
}: {
  t: TFunc;
  devices: Record<ClimateKey, Record<string, DevState>>;
  sync: boolean;
  onGoto: (id: RoomId) => void;
  onSync: (on: boolean) => void;
  onToggle: (key: ClimateKey) => void;
}) {
  return (
    <div className="boadilla-cat">
      <p className="boadilla-cat__lead">{t("categories.audioLead")}</p>
      <div className="boadilla-cat__actions">
        <button
          type="button"
          className={sync ? "is-active" : ""}
          onClick={() => onSync(!sync)}
        >
          {t("audioCat.sync")}
        </button>
      </div>
      <div className="boadilla-devices">
        {CLIMATE_KEYS.map((key) => {
          const audio = devices[key].audio;
          if (!audio) return null;
          return (
            <DeviceCard
              key={key}
              icon={Music}
              title={t(`rooms.${key}`)}
              status={audio.on ? `${audio.value}%` : t("off")}
              active={audio.on}
              className={audio.on ? "is-audio" : ""}
              toggle={<Toggle on={audio.on} onChange={() => onToggle(key)} />}
              expandable
              onToggleExpand={() => onGoto(key)}
            />
          );
        })}
      </div>
    </div>
  );
}

function CategoryClimate({
  t,
  climates,
  onGoto,
}: {
  t: TFunc;
  climates: Record<ClimateKey, ZoneClimate>;
  onGoto: (id: RoomId) => void;
}) {
  return (
    <div className="boadilla-cat">
      <p className="boadilla-cat__lead">{t("categories.climateLead")}</p>
      <div className="boadilla-devices">
        {CLIMATE_KEYS.map((key) => {
          const c = climates[key];
          const active =
            key === "wine" ? c.mode !== "off" : c.floor || c.fancoil;
          return (
            <button
              key={key}
              type="button"
              className={`boadilla-floor-card ${active ? "is-active" : ""}`}
              onClick={() => onGoto(key)}
            >
              <div className="boadilla-floor-card__head">
                <Thermometer size={18} strokeWidth={1.5} />
                <span>{t(`rooms.${key}`).toUpperCase()}</span>
              </div>
              <div className="boadilla-floor-card__rc">
                <div>
                  <span className="lbl">{t("boadilla.real")}</span>
                  <span className="val">{c.current.toFixed(1)}°</span>
                </div>
                <div>
                  <span className="lbl">{t("boadilla.setpoint")}</span>
                  <span className="val val--set">{c.target.toFixed(1)}°</span>
                </div>
              </div>
              <p className={`boadilla-floor-card__meta ${active ? "is-on" : ""}`}>
                {c.floor ? t("thermostat.floor") : ""}
                {c.floor && c.fancoil ? " · " : ""}
                {c.fancoil
                  ? t(`thermostat.fancoilModes.${c.fancoilMode}`)
                  : ""}
                {!c.floor && !c.fancoil ? t("off") : ""}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CategoryPresence({
  t,
  devices,
  onGoto,
}: {
  t: TFunc;
  devices: Record<ClimateKey, Record<string, DevState>>;
  onGoto: (id: RoomId) => void;
}) {
  const rooms = CLIMATE_KEYS.filter((k) => devices[k].presence);
  return (
    <div className="boadilla-cat">
      <p className="boadilla-cat__lead">{t("presenceCentral.lead")}</p>
      <div className="boadilla-presence-grid">
        {rooms.map((key) => {
          const on = !!devices[key].presence?.on;
          return (
            <button
              key={key}
              type="button"
              className={`boadilla-presence-chip ${on ? "is-on" : ""}`}
              onClick={() => onGoto(key)}
            >
              <User size={16} />
              <span>{t(`rooms.${key}`)}</span>
              <strong>
                {on ? t("overview.occupied") : t("overview.empty")}
              </strong>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HistoryView({
  t,
  history,
}: {
  t: TFunc;
  history: HistoryItem[];
}) {
  return (
    <div className="boadilla-history-page">
      <p className="boadilla-cat__lead">{t("history.lead")}</p>
      {history.length === 0 ? (
        <p className="boadilla-history-page__empty">{t("history.empty")}</p>
      ) : (
        <ol className="boadilla-history-page__list">
          {history.map((h) => (
            <li key={h.id}>
              <time>{h.at}</time>
              <span>{h.text}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
