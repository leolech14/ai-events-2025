"use client";

import React, { useState, useEffect, useRef, memo, useLayoutEffect, useMemo } from 'react';
import { Search, MapPin, Calendar, Heart, Filter, SlidersHorizontal, Clock, Star, Users, ArrowUpDown, Navigation, Loader2, Globe, Building2, Tag } from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DisplayCards from "@/components/ui/display-cards";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

type UseMediaQueryOptions = {
  defaultValue?: boolean
  initializeWithValue?: boolean
}

const IS_SERVER = typeof window === "undefined"

export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {}
): boolean {
  const getMatches = (query: string): boolean => {
    if (IS_SERVER) {
      return defaultValue
    }
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query)
    }
    return defaultValue
  })

  const handleChange = () => {
    setMatches(getMatches(query))
  }

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query)
    handleChange()

    matchMedia.addEventListener("change", handleChange)

    return () => {
      matchMedia.removeEventListener("change", handleChange)
    }
  }, [query])

  return matches
}

interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  endDate?: string;
  location: string;
  image: string;
  description: string;
  likes: number;
  attendees: number;
  isWeekend: boolean;
  duration: number;
  coordinates: { lat: number; lng: number };
  organizer: string;
  price?: string;
  tags: string[];
  format?: string;
  venue?: string;
  state?: string;
}

// JSON file names for all AI events
const eventFiles = [
  'adapta_summit_2025.json',
  'agtech_meeting_2025.json',
  'ai_summit_bix_2025.json',
  'ai_summit_brasil_sp_2025.json',
  'ai_workshop_march.json',
  'bate_papo_ia_futuro_trabalho_2025.json',
  'big_data_brazil_experience_2025.json',
  'biotech_agro_health_2025.json',
  'bootcamp_ia_negocios_2025.json',
  'cbta_2025.json',
  'cidia_2025.json',
  'conecta_industria_2025.json',
  'conexao_mulher_ia_2025.json',
  'conferences.json',
  'curso_aplicacao_ia_trabalho_2025.json',
  'curso_ia_generativa_encantado_2025.json',
  'curso_ia_generativa_ensino_2025.json',
  'curso_ia_teoria_pratica_2025.json',
  'data_science_summit_2025.json',
  'deep_learning_course.json',
  'encontro_ia_politica_2025.json',
  'eramia_rs_2025.json',
  'expoinovacao_2025.json',
  'futurecom_2025.json',
  'genai_summit.json',
  'hackathon_innova_saude_2025.json',
  'health_meeting_brasil_2025.json',
  'ia_conference_brasil_2025.json',
  'ia_summit_blumenau_2025.json',
  'ia_summit_upf_2025.json',
  'icbdai_porto_alegre_2025.json',
  'icbdai_sao_paulo_2025.json',
  'icml_2025.json',
  'imersao_ia_pratica_negocios_2025.json',
  'innovation_week_sjc_2025.json',
  'inovar_sc_2025.json',
  'live_sbagro_ia_2025.json',
  'mercopar_2025.json',
  'neurips_2025.json',
  'r_day_2025.json',
  'rio_preto_tech_summit_2025.json',
  'rpa_ai_congress_curitiba_2025.json',
  'sao_paulo_tech_week_2025.json',
  'semana_caldeira_2025.json',
  'semana_de_dados_2025.json',
  'seminario_automacao_isa_2025.json',
  'seminario_pesquisa_ia_generativa_2025.json',
  'simposio_simplas_2025.json',
  'smart_energy_2025.json',
  'south_stat_meeting_2025.json',
  'startup_investment_summit_2025.json',
  'startup_summit_2025.json',
  'super_bots_experience_2025.json',
  'tdc_sao_paulo_2025.json',
  'techstars_weekend_ai_curitiba_2025.json',
  'urban_tech_forum_2025.json',
  'workshop_fig_ladm_3d_2025.json',
  'workshop_rh_okrs_ia_2025.json'
];

// Brazilian cities coordinates for missing data
const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
  'São Paulo': { lat: -23.5505, lng: -46.6333 },
  'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
  'Belo Horizonte': { lat: -19.9191, lng: -43.9387 },
  'Porto Alegre': { lat: -30.0346, lng: -51.2177 },
  'Florianópolis': { lat: -27.5954, lng: -48.5480 },
  'Curitiba': { lat: -25.4284, lng: -49.2733 },
  'Brasília': { lat: -15.7975, lng: -47.8919 },
  'Salvador': { lat: -12.9714, lng: -38.5014 },
  'Fortaleza': { lat: -3.7327, lng: -38.5270 },
  'Recife': { lat: -8.0476, lng: -34.8770 },
  'Campinas': { lat: -22.9099, lng: -47.0626 },
  'São José dos Campos': { lat: -23.2237, lng: -45.9009 },
  'Blumenau': { lat: -26.9194, lng: -49.0661 },
  'Passo Fundo': { lat: -28.2628, lng: -52.4083 },
  'Encantado': { lat: -29.2362, lng: -51.8696 },
  'Caxias do Sul': { lat: -29.1681, lng: -51.1794 },
  'São Leopoldo': { lat: -29.7604, lng: -51.1474 },
  'São José do Rio Preto': { lat: -20.8198, lng: -49.3766 },
  'Online': { lat: -15.7975, lng: -47.8919 },
};

// Function to generate gradient background based on event type
const generateEventImage = (type: string, index: number): string => {
  const images = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=200&fit=crop',
  ];
  
  return images[index % images.length];
};

// Function to parse dates
const parseDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  
  if (dateStr.includes('-')) {
    return new Date(dateStr);
  }
  
  const months: { [key: string]: number } = {
    'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3,
    'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7,
    'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
  };
  
  const parts = dateStr.toLowerCase().split(' de ');
  if (parts.length === 3) {
    const day = parseInt(parts[0]);
    const month = months[parts[1]];
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  }
  
  return new Date(dateStr);
};

// Function to format date in Brazilian format
const formatDateBR = (date: Date): string => {
  const months = [
    'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
    'jul', 'ago', 'set', 'out', 'nov', 'dez'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} de ${month}. de ${year}`;
};

// Function to calculate duration
const calculateDuration = (startDate: string, endDate?: string): number => {
  if (!endDate) return 1;
  
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays + 1;
};

// Function to check if event is on weekend
const isWeekendEvent = (date: string): boolean => {
  const eventDate = parseDate(date);
  const dayOfWeek = eventDate.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

// Function to load events from JSON files
const loadEvents = async (): Promise<Event[]> => {
  const allEvents: Event[] = [];
  const cutoffDate = new Date('2025-08-08');
  
  for (let i = 0; i < eventFiles.length; i++) {
    const fileName = eventFiles[i];
    
    if (fileName === 'event_template.json') continue;
    
    try {
      const response = await fetch(`/events/${fileName}`);
      if (!response.ok) continue;
      
      const data = await response.json();
      
      if (fileName === 'conferences.json' && data.ai_conferences_2025) {
        for (const conf of data.ai_conferences_2025) {
          const startDate = parseDate(conf.dates?.start || conf.date);
          
          if (startDate > cutoffDate) {
            const city = conf.location?.city || 'Online';
            const country = conf.location?.country || 'Brazil';
            const location = country === 'Brazil' ? city : `${city}, ${country}`;
            
            const event: Event = {
              id: `conf-${allEvents.length + 1}`,
              title: conf.name || conf.event_name || 'AI Conference',
              type: conf.event_type || 'conference',
              date: formatDateBR(startDate),
              endDate: conf.dates?.end ? formatDateBR(parseDate(conf.dates.end)) : undefined,
              location: location,
              image: generateEventImage('conference', allEvents.length),
              description: conf.description || '',
              likes: Math.floor(Math.random() * 500) + 100,
              attendees: conf.expected_attendees || Math.floor(Math.random() * 1000) + 200,
              isWeekend: isWeekendEvent(conf.dates?.start || conf.date),
              duration: calculateDuration(conf.dates?.start || conf.date, conf.dates?.end),
              coordinates: cityCoordinates[city] || cityCoordinates['Online'],
              organizer: conf.organizers?.[0] || 'AI Community',
              price: conf.ticket_price_range?.regular || conf.registration?.price?.regular ? 
                `R$ ${conf.registration?.price?.regular || '500'}` : 'Gratuito',
              tags: conf.topics || conf.focus_areas || ['AI', 'Conference'],
              format: 'presential',
              venue: conf.location?.venue || '',
              state: ''
            };
            
            allEvents.push(event);
          }
        }
      } else {
        const startDate = parseDate(data.date?.start || data.date || '');
        
        if (startDate > cutoffDate) {
          const city = data.location?.city || 'Online';
          const state = data.location?.state || '';
          const location = state ? `${city}, ${state}` : city;
          
          const event: Event = {
            id: `event-${allEvents.length + 1}`,
            title: data.event_name || data.name || fileName.replace('.json', '').replace(/_/g, ' '),
            type: data.event_type || data.type || 'evento',
            date: formatDateBR(startDate),
            endDate: data.date?.end ? formatDateBR(parseDate(data.date.end)) : undefined,
            location: location,
            image: generateEventImage(data.event_type || 'event', allEvents.length),
            description: data.description || '',
            likes: Math.floor(Math.random() * 500) + 100,
            attendees: data.registration?.capacity || Math.floor(Math.random() * 1000) + 200,
            isWeekend: isWeekendEvent(data.date?.start || data.date || ''),
            duration: calculateDuration(data.date?.start || data.date || '', data.date?.end),
            coordinates: cityCoordinates[city] || cityCoordinates['Online'],
            organizer: data.organizers?.[0] || 'AI Brasil',
            price: data.registration?.price?.regular ? 
              `R$ ${data.registration.price.regular}` : 'Gratuito',
            tags: data.tags || data.focus_areas || ['AI'],
            format: data.format || 'presential',
            venue: data.location?.venue || '',
            state: data.location?.state || ''
          };
          
          allEvents.push(event);
        }
      }
    } catch (error) {
      console.error(`Error loading ${fileName}:`, error);
    }
  }
  
  allEvents.sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return dateA.getTime() - dateB.getTime();
  });
  
  return allEvents;
};

const BGPattern = ({ variant = 'dots', className = '' }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 opacity-20",
        className
      )}
      style={{
        backgroundImage: variant === 'dots' 
          ? 'radial-gradient(#fbbf24 1px, transparent 1px)'
          : 'linear-gradient(45deg, #fbbf24 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}
    />
  );
};

const duration = 0.15
const transition = { duration, ease: [0.32, 0.72, 0, 1] }
const transitionOverlay = { duration: 0.5, ease: [0.32, 0.72, 0, 1] }

const EventCarousel = memo((
  {
    handleClick,
    controls,
    events,
    isCarouselActive,
  }: {
    handleClick: (event: Event, index: number) => void
    controls: any
    events: Event[]
    isCarouselActive: boolean
  }
) => {
  const isScreenSizeSm = useMediaQuery("(max-width: 640px)")
  const isScreenSizeMd = useMediaQuery("(max-width: 1024px)")
  const isScreenSizeLg = useMediaQuery("(max-width: 1440px)")
  
  // Get viewport width safely
  const [viewportWidth, setViewportWidth] = useState(1400)
  useEffect(() => {
    setViewportWidth(window.innerWidth)
    const handleResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Optimized cylinder width for good visibility
  const cylinderWidth = isScreenSizeSm ? 1600 : 
                        isScreenSizeMd ? 2000 : 
                        isScreenSizeLg ? 2400 : 2800
  
  const faceCount = events.length
  // Dynamic card width based on number of cards
  const faceWidth = Math.min((cylinderWidth / faceCount) * 1.1, 240) // Slightly overlap, max 240px
  // Larger radius to push cards further away
  const radius = (cylinderWidth / (2 * Math.PI)) * 1.3
  const rotation = useMotionValue(0)
  const transform = useTransform(
    rotation,
    (value) => `rotate3d(0, 1, 0, ${value}deg)`
  )

  return (
    <div
      className="flex h-full items-center justify-center"
      style={{
        perspective: isScreenSizeSm ? "700px" : isScreenSizeMd ? "900px" : "1100px",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      <motion.div
        drag={isCarouselActive ? "x" : false}
        className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
        style={{
          transform,
          rotateY: rotation,
          width: cylinderWidth,
          transformStyle: "preserve-3d",
          translateX: 0,
        }}
        onDrag={(_, info) =>
          isCarouselActive &&
          rotation.set(rotation.get() + info.offset.x * 0.05)
        }
        onDragEnd={(_, info) =>
          isCarouselActive &&
          controls.start({
            rotateY: rotation.get() + info.velocity.x * 0.05,
            transition: {
              type: "spring",
              stiffness: 60,
              damping: 20,
              mass: 0.2,
            },
          })
        }
        animate={controls}
      >
        {events.map((event, i) => (
          <motion.div
            key={`event-${event.id}-${i}`}
            className="absolute flex origin-center items-center justify-center rounded-xl p-0.5"
            style={{
              width: `${faceWidth}px`,
              height: isScreenSizeSm ? '160px' : isScreenSizeMd ? '170px' : '180px', // Even shorter cards!
              transform: `rotateY(${
                i * (360 / faceCount)
              }deg) translateZ(${radius}px)`,
            }}
            onClick={() => handleClick(event, i)}
          >
            <motion.div
              layoutId={`event-card-${event.id}`}
              className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-gray-900/95 to-black/95 border border-gray-700 hover:border-yellow-500/70 transition-all duration-300 shadow-2xl"
              initial={{ filter: "blur(4px)" }}
              animate={{ filter: "blur(0px)" }}
              transition={transition}
            >
              <div className="relative h-[40%]">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <Badge 
                  variant="secondary" 
                  className="absolute top-1 left-1 bg-yellow-500/90 text-black font-semibold text-[9px] px-1.5 py-0.5"
                >
                  {event.type}
                </Badge>
              </div>
              <div className="p-1.5 h-[60%] flex flex-col justify-between bg-gradient-to-b from-transparent to-black/50">
                <h3 className="text-white font-bold text-xs md:text-sm line-clamp-2 mb-1">
                  {event.title}
                </h3>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-gray-300">
                    <Calendar className="h-2 md:h-2.5 w-2 md:w-2.5 text-yellow-400" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-gray-300">
                    <MapPin className="h-2 md:h-2.5 w-2 md:w-2.5 text-yellow-400" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
})

EventCarousel.displayName = 'EventCarousel';

const EventCard = ({ event, onLike, onViewDetails }: { 
  event: Event; 
  onLike: (id: string) => void; 
  onViewDetails: (event: Event) => void;
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(event.id);
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden bg-black/80 border-gray-800 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer backdrop-blur-sm",
        isHovered && "transform scale-[1.02] shadow-2xl shadow-yellow-500/20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(event)}
    >
      <div className="relative h-32 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <Badge 
          variant="secondary" 
          className="absolute top-2 left-2 bg-yellow-500/90 text-black font-medium"
        >
          {event.type}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "absolute top-2 right-2 p-1 h-8 w-8 rounded-full transition-all duration-200",
            isLiked ? "text-red-500 bg-red-500/20" : "text-gray-400 hover:text-red-500 bg-black/50"
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
        >
          <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
        </Button>
      </div>
      
      <div className="p-4 space-y-2">
        <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-yellow-400 transition-colors">
          {event.title}
        </h3>
        
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            <span>{event.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{event.attendees}</span>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Card>
  );
};

const EventDetails = ({ event, onClose, isDialog = false }: { event: Event; onClose: () => void; isDialog?: boolean }) => {
  const content = (
    <>
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-yellow-400 text-xl font-bold">{event.title}</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="space-y-6">
        <div className="relative h-48 rounded-lg overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className="absolute top-3 right-3 bg-yellow-500/90 text-black font-medium">
            {event.type}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-yellow-400" />
              <span className="text-gray-300">Data:</span>
              <span>{event.date} {event.endDate && `- ${event.endDate}`}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-yellow-400" />
              <span className="text-gray-300">Local:</span>
              <span>{event.location}</span>
            </div>
            {event.venue && (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-yellow-400" />
                <span className="text-gray-300">Venue:</span>
                <span>{event.venue}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-400" />
              <span className="text-gray-300">Duração:</span>
              <span>{event.duration} {event.duration === 1 ? 'dia' : 'dias'}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            {event.format && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-yellow-400" />
                <span className="text-gray-300">Formato:</span>
                <span className="capitalize">{event.format}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-yellow-400" />
              <span className="text-gray-300">Participantes:</span>
              <span>{event.attendees.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-yellow-400" />
              <span className="text-gray-300">Curtidas:</span>
              <span>{event.likes}</span>
            </div>
            {event.price && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-gray-300">Investimento:</span>
                <span className="font-semibold">{event.price}</span>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="text-yellow-400 font-semibold mb-2">Descrição</h4>
          <p className="text-gray-300 text-sm leading-relaxed">{event.description}</p>
        </div>
        
        <div>
          <h4 className="text-yellow-400 font-semibold mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="border-yellow-500/50 text-yellow-400">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
            Ver Página do Evento
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            <Heart className="h-4 w-4 mr-2" />
            Curtir
          </Button>
        </div>
      </div>
    </>
  );

  if (isDialog) {
    return (
      <DialogContent className="max-w-2xl bg-black/95 border-gray-800 text-white">
        {content}
      </DialogContent>
    );
  }

  return (
    <div className="max-w-2xl w-full bg-black/95 border border-gray-800 text-white rounded-lg p-6">
      {content}
    </div>
  );
};

const ThreeDEventCarousel = ({ events }: { events: Event[] }) => {
  const [activeEvent, setActiveEvent] = useState<Event | null>(null)
  const [isCarouselActive, setIsCarouselActive] = useState(true)
  const controls = useAnimation()

  const handleClick = (event: Event, index: number) => {
    setActiveEvent(event)
    setIsCarouselActive(false)
    controls.stop()
  }

  const handleClose = () => {
    setActiveEvent(null)
    setIsCarouselActive(true)
  }

  // Take optimal number of events for good display
  const carouselEvents = events.slice(0, 16);

  return (
    <motion.div layout className="relative">
      <AnimatePresence mode="sync">
        {activeEvent && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            layoutId={`event-container-${activeEvent.id}`}
            layout="position"
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 m-5 md:m-36 lg:mx-[10rem] rounded-3xl backdrop-blur-sm"
            style={{ willChange: "opacity" }}
            transition={transitionOverlay}
          >
            <EventDetails event={activeEvent} onClose={handleClose} />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative w-full mx-auto">
        <div className="relative h-[320px] md:h-[340px] lg:h-[360px] w-full overflow-visible py-8 flex items-center justify-center">
          <EventCarousel
            handleClick={handleClick}
            controls={controls}
            events={carouselEvents}
            isCarouselActive={isCarouselActive}
          />
        </div>
      </div>
    </motion.div>
  )
}

const FinallyGoldEventShowcase = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'calendar'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'proximity' | 'likes'>('date');
  const [filters, setFilters] = useState({
    location: '',
    eventType: '',
    timeframe: '',
    duration: [1, 30],
    showAll: true
  });
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // Load events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const loadedEvents = await loadEvents();
        setEvents(loadedEvents);
        setFilteredEvents(loadedEvents);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLocation = !filters.location || event.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesType = !filters.eventType || event.type === filters.eventType;
      const matchesDuration = event.duration >= filters.duration[0] && event.duration <= filters.duration[1];
      
      return matchesSearch && matchesLocation && matchesType && matchesDuration;
    });

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'likes':
          return b.likes - a.likes;
        case 'proximity':
          return a.location.localeCompare(b.location);
        case 'date':
        default:
          return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });

    setFilteredEvents(filtered);
  }, [events, searchQuery, filters, sortBy]);

  const handleLike = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, likes: event.likes + 1 }
        : event
    ));
  };

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
  };

  const eventTypes = [...new Set(events.map(e => e.type))];
  const locations = [...new Set(events.map(e => e.location))];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Polished Black Background with subtle gradients */}
      <div className="fixed inset-0 z-0 bg-black">
        {/* Subtle radial gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950" />
        
        {/* Gold accent gradients - very subtle */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-yellow-900/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-amber-900/5 via-transparent to-transparent" />
        
        {/* Polished surface effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900/20 to-black" />
        
        {/* Noise texture for premium feel */}
        <div className="absolute inset-0 opacity-[0.015]" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>
      
      <div className="fixed inset-0 z-0">
        <BGPattern variant="dots" className="opacity-[0.02]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">F</span>
              </div>
              <h1 className="text-2xl font-bold text-yellow-400">finally.gold</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />
              ) : (
                <>
                  <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    {filteredEvents.length} Eventos
                  </Badge>
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    <MapPin className="h-3 w-3 mr-1" />
                    {locations.length} Cidades
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 space-y-4 max-w-7xl">
          {/* Main Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar eventos, locais ou tipos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900/80 border-gray-600 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-yellow-400/20"
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="border-gray-600 text-white bg-gray-900/80 hover:bg-gray-800 hover:border-yellow-400 hover:text-yellow-400 transition-all duration-200 whitespace-nowrap h-10 px-4"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              
              <div className="flex items-center bg-gray-900/80 border border-gray-600 rounded-lg h-10">
                <div className="flex">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 px-3 mx-1 rounded-md transition-all duration-200",
                      viewMode === 'grid' ? "bg-yellow-400 text-black" : "text-white hover:text-yellow-400 hover:bg-gray-800"
                    )}
                    onClick={() => setViewMode('grid')}
                  >
                    <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 px-3 mx-1 rounded-md transition-all duration-200",
                      viewMode === 'map' ? "bg-yellow-400 text-black" : "text-white hover:text-yellow-400 hover:bg-gray-800"
                    )}
                    onClick={() => setViewMode('map')}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 px-3 mx-1 rounded-md transition-all duration-200",
                      viewMode === 'calendar' ? "bg-yellow-400 text-black" : "text-white hover:text-yellow-400 hover:bg-gray-800"
                    )}
                    onClick={() => setViewMode('calendar')}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sort Selection */}
          <div className="flex justify-end">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-900/80 border-gray-600 text-white">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-600 text-white">
                <SelectItem value="date" className="text-white hover:bg-gray-800 focus:bg-gray-800">Ordenar por Data</SelectItem>
                <SelectItem value="proximity" className="text-white hover:bg-gray-800 focus:bg-gray-800">Ordenar por Proximidade</SelectItem>
                <SelectItem value="likes" className="text-white hover:bg-gray-800 focus:bg-gray-800">Mais Curtidos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Filters */}
          {showAdvancedSearch && (
            <Card className="p-4 bg-gray-900/80 border-gray-600">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-gray-200 mb-2 block font-medium">Por Local</label>
                  <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                    <SelectTrigger className="bg-gray-800/80 border-gray-600 text-white hover:border-gray-500">
                      <SelectValue placeholder="Todos os locais" className="text-white" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="" className="text-white hover:bg-gray-700 focus:bg-gray-700">Todos os locais</SelectItem>
                      {locations.map(location => (
                        <SelectItem key={location} value={location} className="text-white hover:bg-gray-700 focus:bg-gray-700">{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-200 mb-2 block font-medium">Tipo de Evento</label>
                  <Select value={filters.eventType} onValueChange={(value) => setFilters(prev => ({ ...prev, eventType: value }))}>
                    <SelectTrigger className="bg-gray-800/80 border-gray-600 text-white hover:border-gray-500">
                      <SelectValue placeholder="Todos os tipos" className="text-white" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="" className="text-white hover:bg-gray-700 focus:bg-gray-700">Todos os tipos</SelectItem>
                      {eventTypes.map(type => (
                        <SelectItem key={type} value={type} className="text-white hover:bg-gray-700 focus:bg-gray-700">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-200 mb-2 block font-medium">Período</label>
                  <Select value={filters.timeframe} onValueChange={(value) => setFilters(prev => ({ ...prev, timeframe: value }))}>
                    <SelectTrigger className="bg-gray-800/80 border-gray-600 text-white hover:border-gray-500">
                      <SelectValue placeholder="Qualquer período" className="text-white" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="" className="text-white hover:bg-gray-700 focus:bg-gray-700">Qualquer período</SelectItem>
                      <SelectItem value="weekday" className="text-white hover:bg-gray-700 focus:bg-gray-700">Dias de semana</SelectItem>
                      <SelectItem value="weekend" className="text-white hover:bg-gray-700 focus:bg-gray-700">Fins de semana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-200 mb-2 block font-medium">Duração (dias)</label>
                  <Slider
                    value={filters.duration}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, duration: value }))}
                    max={30}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-300 mt-1">
                    <span>{filters.duration[0]} dia{filters.duration[0] > 1 ? 's' : ''}</span>
                    <span>{filters.duration[1]} dia{filters.duration[1] > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-yellow-400 mb-4" />
            <p className="text-gray-400 text-lg">Carregando eventos de IA...</p>
            <p className="text-gray-500 text-sm mt-2">Buscando {eventFiles.length} fontes de dados</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' && (
              <div className="space-y-8">
                {/* 3D Carousel Section */}
                {filteredEvents.length > 0 && (
                  <div className="mb-12 mt-[180px]">
                    <ThreeDEventCarousel events={filteredEvents} />
                  </div>
                )}
                
                {/* Featured Events Display Cards */}
                {filteredEvents.length >= 3 && (
                  <div className="mb-12">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-yellow-400 mb-2">Eventos em Destaque</h3>
                      <p className="text-gray-300">Os mais aguardados da comunidade</p>
                    </div>
                    <DisplayCards cards={[
                      {
                        icon: <Star className="size-4 text-yellow-300" />,
                        title: "Destaque",
                        description: filteredEvents[0]?.title || "Evento Principal",
                        date: filteredEvents[0]?.date || "Em breve",
                        iconClassName: "text-yellow-500",
                        titleClassName: "text-yellow-500",
                      },
                      {
                        icon: <Users className="size-4 text-yellow-300" />,
                        title: "Popular",
                        description: filteredEvents[1]?.title || "Muito Participado",
                        date: filteredEvents[1]?.date || "Esta semana",
                        iconClassName: "text-yellow-500",
                        titleClassName: "text-yellow-500",
                      },
                      {
                        icon: <Calendar className="size-4 text-yellow-300" />,
                        title: "Novo",
                        description: filteredEvents[2]?.title || "Recém Adicionado",
                        date: filteredEvents[2]?.date || "Hoje",
                        iconClassName: "text-yellow-500",
                        titleClassName: "text-yellow-500",
                      },
                    ]} />
                  </div>
                )}
                
                {/* Grid View */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">Todos os Eventos</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {filteredEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onLike={handleLike}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'map' && (
              <Card className="h-96 bg-gray-900/50 border-gray-700 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <MapPin className="h-12 w-12 mx-auto mb-4" />
                  <p>Vista do mapa em desenvolvimento</p>
                </div>
              </Card>
            )}

            {viewMode === 'calendar' && (
              <Card className="h-96 bg-gray-900/50 border-gray-700 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Calendar className="h-12 w-12 mx-auto mb-4" />
                  <p>Vista do calendário em desenvolvimento</p>
                </div>
              </Card>
            )}

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto mb-4" />
                  <p>Nenhum evento encontrado</p>
                  <p className="text-sm">Tente ajustar seus filtros de busca</p>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        {selectedEvent && (
          <EventDetails 
            event={selectedEvent} 
            onClose={() => setSelectedEvent(null)}
            isDialog={true}
          />
        )}
      </Dialog>
    </div>
  );
};

export default FinallyGoldEventShowcase;