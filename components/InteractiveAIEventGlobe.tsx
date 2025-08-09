'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, MapPin, Users, Globe2, Filter, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

// City coordinates mapping
const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
  'São Paulo': { lat: -23.5505, lng: -46.6333 },
  'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
  'Brasília': { lat: -15.7801, lng: -47.9292 },
  'Porto Alegre': { lat: -30.0346, lng: -51.2177 },
  'Curitiba': { lat: -25.4284, lng: -49.2733 },
  'Belo Horizonte': { lat: -19.9167, lng: -43.9345 },
  'Salvador': { lat: -12.9714, lng: -38.5014 },
  'Fortaleza': { lat: -3.7327, lng: -38.5270 },
  'Recife': { lat: -8.0476, lng: -34.8770 },
  'Manaus': { lat: -3.1190, lng: -60.0217 },
  'Campinas': { lat: -22.9099, lng: -47.0626 },
  'Florianópolis': { lat: -27.5954, lng: -48.5480 },
  'Goiânia': { lat: -16.6869, lng: -49.2648 },
  'Vitória': { lat: -20.2976, lng: -40.2958 },
  'Campo Grande': { lat: -20.4697, lng: -54.6201 },
  'Natal': { lat: -5.7945, lng: -35.2110 },
  'Blumenau': { lat: -26.9194, lng: -49.0661 },
  'Passo Fundo': { lat: -28.2628, lng: -52.4091 },
  'São José dos Campos': { lat: -23.2237, lng: -45.9009 },
  'Caxias do Sul': { lat: -29.1681, lng: -51.1794 },
  'Online': { lat: -15.7801, lng: -47.9292 }, // Default to Brasília for online events
};

interface EventData {
  event_name: string;
  event_type: string;
  date: {
    start: string;
    end: string;
  };
  location: {
    city: string;
    state: string;
    country: string;
    venue: string;
  };
  format: string;
  description: string;
  focus_areas: string[];
  tags: string[];
  image?: string;
}

interface EventMarkerProps {
  event: EventData;
  position: THREE.Vector3;
  onClick: () => void;
  isSelected: boolean;
}

function EventMarker({ event, position, onClick, isSelected }: EventMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      const scale = isSelected ? 1.5 : hovered ? 1.3 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  const color = {
    'conference': '#3B82F6',
    'summit': '#10B981',
    'workshop': '#F59E0B',
    'bootcamp': '#8B5CF6',
    'course': '#EF4444',
    'webinar': '#EC4899',
    'hackathon': '#14B8A6',
  }[event.event_type] || '#6B7280';

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.8 : hovered ? 0.5 : 0.3}
        />
      </mesh>
      {hovered && (
        <Html position={[0, 0.05, 0]} center>
          <div className="bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
            {event.event_name}
          </div>
        </Html>
      )}
    </group>
  );
}

function Earth({ events, selectedEvent, onEventClick }: { 
  events: EventData[], 
  selectedEvent: EventData | null, 
  onEventClick: (event: EventData) => void 
}) {
  const earthRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (earthRef.current && !selectedEvent) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  const latLngToVector3 = (lat: number, lng: number, radius: number = 1): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    return new THREE.Vector3(x, y, z);
  };

  return (
    <group>
      <Sphere ref={earthRef} args={[1, 64, 64]}>
        <meshStandardMaterial
          color="#1e40af"
          roughness={0.8}
          metalness={0.2}
        />
      </Sphere>
      
      {/* Add continent outlines */}
      <Sphere args={[1.01, 64, 64]}>
        <meshStandardMaterial
          color="#22c55e"
          roughness={0.9}
          metalness={0.1}
          transparent
          opacity={0.3}
        />
      </Sphere>

      {/* Event markers */}
      {events.map((event, index) => {
        const coords = cityCoordinates[event.location.city] || cityCoordinates['Online'];
        const position = latLngToVector3(coords.lat, coords.lng, 1.02);
        
        return (
          <EventMarker
            key={index}
            event={event}
            position={position}
            onClick={() => onEventClick(event)}
            isSelected={selectedEvent?.event_name === event.event_name}
          />
        );
      })}
    </group>
  );
}

export default function InteractiveAIEventGlobe() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load events
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventFiles = [
          'ai_summit_brasil_sp_2025.json',
          'big_data_brazil_experience_2025.json',
          'data_science_summit_2025.json',
          'ia_conference_brasil_2025.json',
          'innovation_week_sjc_2025.json',
          'startup_summit_2025.json',
          'workshop_rh_okrs_ia_2025.json',
          'bootcamp_ia_negocios_2025.json',
          'agtech_meeting_2025.json',
          'biotech_agro_health_2025.json',
        ];

        const loadedEvents = await Promise.all(
          eventFiles.map(async (file) => {
            try {
              const response = await fetch(`/events/${file}`);
              if (response.ok) {
                return await response.json();
              }
            } catch (error) {
              console.error(`Error loading ${file}:`, error);
            }
            return null;
          })
        );

        const validEvents = loadedEvents.filter(event => event !== null) as EventData[];
        setEvents(validEvents);
        setFilteredEvents(validEvents);
        setLoading(false);
      } catch (error) {
        console.error('Error loading events:', error);
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Filter events by month and category
  useEffect(() => {
    let filtered = [...events];

    // Filter by month
    filtered = filtered.filter(event => {
      const eventMonth = new Date(event.date.start).getMonth() + 1;
      return eventMonth === currentMonth;
    });

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.event_type === selectedCategory);
    }

    setFilteredEvents(filtered);
  }, [currentMonth, selectedCategory, events]);

  // Auto-play timeline
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentMonth(prev => (prev % 12) + 1);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const categories = ['all', 'conference', 'summit', 'workshop', 'bootcamp', 'course', 'webinar', 'hackathon'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            AI Events Globe 2025
          </h1>
          <p className="text-xl text-blue-200">
            Explore AI events across Brazil in an interactive 3D experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Globe Section */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-blue-500/20 backdrop-blur">
              <CardContent className="p-0">
                <div className="h-[500px] md:h-[600px] relative">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-white">Loading events...</div>
                    </div>
                  ) : (
                    <Suspense fallback={
                      <div className="flex items-center justify-center h-full">
                        <div className="text-white">Loading 3D globe...</div>
                      </div>
                    }>
                      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <pointLight position={[-10, -10, -10]} intensity={0.5} />
                        <Earth 
                          events={filteredEvents} 
                          selectedEvent={selectedEvent}
                          onEventClick={setSelectedEvent}
                        />
                        <OrbitControls 
                          enablePan={false}
                          minDistance={2}
                          maxDistance={5}
                          autoRotate={!selectedEvent}
                          autoRotateSpeed={0.5}
                        />
                      </Canvas>
                    </Suspense>
                  )}
                </div>

                {/* Timeline Controls */}
                <div className="p-4 border-t border-blue-500/20">
                  <div className="flex items-center gap-4 mb-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentMonth(prev => prev === 1 ? 12 : prev - 1)}
                      className="text-white border-blue-500/50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex-1">
                      <div className="text-center text-white mb-2">
                        {monthNames[currentMonth - 1]} 2025
                      </div>
                      <Slider
                        value={[currentMonth]}
                        onValueChange={(value) => setCurrentMonth(value[0])}
                        min={1}
                        max={12}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentMonth(prev => prev === 12 ? 1 : prev + 1)}
                      className="text-white border-blue-500/50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-white border-blue-500/50"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </div>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full bg-slate-700/50 text-white border-blue-500/50">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Event Details Section */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-blue-500/20 backdrop-blur h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe2 className="h-5 w-5" />
                  Event Details
                </CardTitle>
                <CardDescription className="text-blue-200">
                  {filteredEvents.length} events in {monthNames[currentMonth - 1]}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
                {selectedEvent ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {selectedEvent.event_name}
                      </h3>
                      <Badge className="mb-2" variant="secondary">
                        {selectedEvent.event_type}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-blue-200">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(selectedEvent.date.start).toLocaleDateString()} - 
                          {new Date(selectedEvent.date.end).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-200">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedEvent.location.city}, {selectedEvent.location.state}</span>
                      </div>
                      {selectedEvent.location.venue && (
                        <div className="flex items-center gap-2 text-blue-200">
                          <Users className="h-4 w-4" />
                          <span>{selectedEvent.location.venue}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-300 text-sm">
                      {selectedEvent.description}
                    </p>

                    {selectedEvent.focus_areas.length > 0 && (
                      <div>
                        <h4 className="text-white font-semibold mb-2">Focus Areas</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedEvent.focus_areas.map((area, index) => (
                            <Badge key={index} variant="outline" className="text-blue-200 border-blue-500/50">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button 
                      className="w-full"
                      onClick={() => setSelectedEvent(null)}
                    >
                      Clear Selection
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredEvents.map((event, index) => (
                      <Card 
                        key={index}
                        className="bg-slate-700/50 border-blue-500/20 cursor-pointer hover:bg-slate-700/70 transition-colors"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <CardContent className="p-3">
                          <h4 className="text-white font-semibold text-sm mb-1">
                            {event.event_name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-blue-200">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location.city}</span>
                            <Calendar className="h-3 w-3 ml-2" />
                            <span>{new Date(event.date.start).toLocaleDateString()}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {filteredEvents.length === 0 && (
                      <div className="text-center text-gray-400 py-8">
                        No events found for selected filters
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}