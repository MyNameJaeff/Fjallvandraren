"use client";

import React, { useState, useMemo, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";
import tripsData from "@/app/data/trips.json";
import SelectedTrip from "@/app/components/SelectedTrip";
import type { Trip, TripsData } from "@/app/types/trip";

const list: Trip[] = (tripsData as TripsData).Trips;

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [tripIsSelected, setTripIsSelected] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const selectedTripRef = useRef<HTMLDivElement>(null);

  const filteredTrips = useMemo(() => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (trip) =>
        trip.location.toLowerCase().includes(q) ||
        trip.shortDescription.toLowerCase().includes(q) ||
        trip.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleTripClick = (trip: Trip) => {
    setSelectedTrip(trip);
    setTripIsSelected(true);
    setIsFocused(false);
    setSearchQuery("");
  };

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 180);
  };

  const scrollToSelectedTrip = () => {
    selectedTripRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Hero Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/Ljungdalen_2021/Resized_20210630_192236.jpg"
            alt="Mountain landscape – Swedish fells"
            className="w-full h-full object-cover object-[center_35%] transition-transform duration-600 ease-out group-hover:scale-105"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[rgba(13,18,15,0.25)] via-[rgba(13,18,15,0.55)] to-[rgba(13,18,15,0.88)]"
            aria-hidden
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 py-10 max-w-[560px]">
          <h1
            className="font-julius text-[clamp(2.5rem,8vw,4rem)] font-normal tracking-[0.15em] text-white mb-2 indent-[0.15em]"
            style={{
              textShadow: "0 2px 20px rgba(0, 0, 0, 0.5), 0 0 1px rgba(0, 0, 0, 0.3)",
            }}
          >
            Fjällvandraren
          </h1>
          <p
            className="text-[clamp(0.95rem,2.5vw,1.1rem)] text-white/90 mb-10 tracking-[0.04em]"
            style={{ textShadow: "0 1px 8px rgba(0, 0, 0, 0.3)" }}
          >
            Discover hiking trips in the Swedish mountains
          </p>

          {/* Search Box */}
          <div className="relative w-full max-w-[420px] mx-auto">
            <div
              className={`flex items-center gap-3 bg-white/98 rounded-xl px-[1.15rem] py-[0.85rem] shadow-[0_8px_32px_rgba(0,0,0,0.4)] border-2 transition-all duration-250 ${isFocused
                  ? "border-[rgb(61,107,74)] shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_4px_rgba(61,107,74,0.15)] rounded-b-none"
                  : "border-transparent"
                }`}
            >
              <Search className="w-5 h-5 text-[#6b7b6e] flex-shrink-0" />
              <input
                type="text"
                className="flex-1 min-w-0 border-none bg-transparent text-base text-[#1a1a1a] outline-none placeholder:text-[#6b7b6e]"
                placeholder="Search trips by location or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                aria-expanded={isFocused}
                aria-haspopup="listbox"
                aria-controls="trip-listbox"
                id="trip-search"
              />
            </div>

            {/* Dropdown */}
            {isFocused && (
              <ul
                id="trip-listbox"
                className="absolute top-full left-0 right-0 z-10 list-none bg-white/98 border-2 border-t-0 border-[rgb(61,107,74)] rounded-b-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-h-[280px] overflow-y-auto"
                role="listbox"
                onMouseDown={(e) => e.preventDefault()}
              >
                {filteredTrips.length === 0 ? (
                  <li className="px-[1.15rem] py-5 text-[#6b7b6e] text-[0.95rem]">
                    No trips match your search
                  </li>
                ) : (
                  filteredTrips.map((trip) => (
                    <li
                      key={trip.id}
                      role="option"
                      className="flex items-center justify-between gap-3 px-[1.15rem] py-[0.9rem] cursor-pointer transition-all duration-150 border-b border-black/[0.06] last:border-b-0 hover:bg-[rgba(61,107,74,0.15)] focus-visible:bg-[rgba(61,107,74,0.15)] focus-visible:outline-none"
                      onClick={() => handleTripClick(trip)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleTripClick(trip);
                        }
                      }}
                      tabIndex={0}
                    >
                      <span className="font-medium text-[#1a1a1a]">{trip.location}</span>
                      <span className="text-[0.85rem] text-[#6b7b6e]">{trip.date}</span>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        {tripIsSelected && (
          <button
            type="button"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 w-[52px] h-[52px] rounded-full border-2 border-white/50 bg-[rgba(13,18,15,0.4)] backdrop-blur-[8px] text-white cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-[rgba(61,107,74,0.5)] hover:border-white/85 hover:scale-110 animate-slide-up-appear"
            onClick={scrollToSelectedTrip}
            aria-label="Scroll to selected trip"
          >
            <ChevronDown className="w-6 h-6 animate-scroll-bounce" />
          </button>
        )}
      </main>

      {/* Selected Trip Section */}
      <section
        id="selected-trip"
        className="relative min-h-screen bg-gradient-to-b from-[rgb(21,28,23)] to-[rgb(13,18,15)] flex flex-col items-center px-6 pt-12 pb-0"
        ref={selectedTripRef}
        aria-label="Selected trip"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.07)] to-transparent opacity-80" />

        <SelectedTrip key={selectedTrip?.id ?? "empty"} trip={selectedTrip} />

        <div className="mt-auto w-full leading-[0] pt-8" aria-hidden>
          <img src="/Grass.png" className="w-full object-cover block" alt="" />
        </div>
      </section>
    </>
  );
}