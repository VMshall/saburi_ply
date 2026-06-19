import type { ComponentType } from "react";
import {
  Armchair,
  Award,
  BicepsFlexed,
  Bug,
  Circle,
  Clock5,
  Club,
  Droplets,
  Dumbbell,
  Flame,
  Gem,
  Grid2x2,
  IndianRupee,
  Leaf,
  PaintBucket,
  Recycle,
  Scale,
  Shield,
  ShieldPlus,
  Sprout,
  TreePine,
} from "lucide-react";
import { FaBacteria } from "react-icons/fa";
import {
  GiThrustBend,
  GiLifeBar,
  GiDuration,
  GiUnbalanced,
  GiScrew,
  GiPineTree,
  GiChemicalDrop,
  GiTripleScratches,
  GiCrackedDisc,
  GiLaserSparks,
} from "react-icons/gi";
import { GrMultiple } from "react-icons/gr";
import { PiPottedPlant } from "react-icons/pi";
import { IoLeafOutline, IoColorPaletteOutline } from "react-icons/io5";
import { TbTexture, TbBaselineDensitySmall } from "react-icons/tb";

/**
 * Serializable iconKey → icon component map (§3, data/types.ts KNOWN_ICON_KEYS).
 * Pure presentational + no hooks, so it renders in BOTH server components (gradePills) and
 * inside client islands. Used to SSR badge icons into islands as props, keeping the heavy
 * react-icons modules out of client bundles.
 *
 * Resilience requirement (P3): an unknown/new key must NEVER crash — it degrades to a neutral
 * fallback icon. Source components were verified present (the legacy pages imported them).
 */
type IconComponent = ComponentType<{ className?: string }>;

const ICONS: Record<string, IconComponent> = {
  armchair: Armchair,
  award: Award,
  bacteria: FaBacteria,
  "baseline-density-small": TbBaselineDensitySmall,
  bend: GiThrustBend,
  "biceps-flexed": BicepsFlexed,
  bug: Bug,
  "chemical-drop": GiChemicalDrop,
  "clock-5": Clock5,
  club: Club,
  "color-palette-outline": IoColorPaletteOutline,
  "cracked-disc": GiCrackedDisc,
  droplets: Droplets,
  dumbbell: Dumbbell,
  duration: GiDuration,
  flame: Flame,
  gem: Gem,
  "gr-multiple": GrMultiple,
  "grid-2x2": Grid2x2,
  "laser-sparks": GiLaserSparks,
  leaf: Leaf,
  "leaf-outline": IoLeafOutline,
  lifebar: GiLifeBar,
  "paint-bucket": PaintBucket,
  "pi-potted-plant": PiPottedPlant,
  "pine-tree": GiPineTree,
  recycle: Recycle,
  rupee: IndianRupee,
  scale: Scale,
  screw: GiScrew,
  shield: Shield,
  "shield-plus": ShieldPlus,
  sprout: Sprout,
  texture: TbTexture,
  "tree-pine": TreePine,
  "triple-scratches": GiTripleScratches,
  unbalanced: GiUnbalanced,
};

/** Neutral fallback for an unmapped/unknown key (never crashes the page). */
const Fallback: IconComponent = Circle;

export function Icon({ iconKey, className }: { iconKey?: string; className?: string }) {
  const Cmp = (iconKey ? ICONS[iconKey] : undefined) ?? Fallback;
  return <Cmp className={className} />;
}
