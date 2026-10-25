import { WaveformIcon, BroadcastIcon, TriangleIcon, MagnifyingGlassIcon, BookOpenIcon } from '@phosphor-icons/react';
import type { MissionId } from './model';
export { MicrophoneIcon, StopIcon, PlayIcon, PauseIcon, ArrowClockwiseIcon, DownloadSimpleIcon, TrashIcon, FloppyDiskIcon, StarIcon, LightbulbIcon, SparkleIcon, UsersThreeIcon, CheckCircleIcon, InfoIcon, ArrowRightIcon, CaretRightIcon, SpeakerHighIcon, UserCircleIcon, XIcon } from '@phosphor-icons/react';
export function MissionIcon({mission,size=24}:{mission:MissionId|'notebook';size?:number}) {const Icon={vibration:WaveformIcon,travel:BroadcastIcon,echo:TriangleIcon,detective:MagnifyingGlassIcon,notebook:BookOpenIcon}[mission];return <Icon size={size} weight="regular" aria-hidden/>;}
