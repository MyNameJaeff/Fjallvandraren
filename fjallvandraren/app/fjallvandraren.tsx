"use client";

/* eslint-disable @next/next/no-img-element */

import type { HTMLAttributes } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Maximize2,
  Mountain,
  Ruler,
  Search,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type OutingImage = {
  url: string;
  alt?: string | null;
  caption?: string | null;
};

type Outing = {
  key: string;
  title: string;
  date?: string | null;
  description?: string | null;
  distance?: string | null;
  elevationGain?: string | null;
  duration?: string | null;
  images: OutingImage[];
};

type SanityTrip = {
  id: string;
  name: string;
  region: string;
  tagline?: string | null;
  difficulty: string;
  days?: number | null;
  distance?: string | null;
  elevation?: string | null;
  season?: string | null;
  description?: string | null;
  highlights: string[];
  image?: string | null;
  outings: Outing[];
};

const DIFFICULTY_META = {
  Lätt: {
    label: "Lätt",
    className: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
  },
  Medel: {
    label: "Medel",
    className: "bg-amber-500/15 text-amber-200 border-amber-500/30",
  },
  Svår: {
    label: "Svår",
    className: "bg-orange-500/15 text-orange-200 border-orange-500/30",
  },
  Expert: {
    label: "Expert",
    className: "bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-500/30",
  },
} as const;

type DifficultyKey = keyof typeof DIFFICULTY_META;

function diffMeta(difficulty: string | null | undefined) {
  const key = (difficulty ?? "Medel") as DifficultyKey;
  return DIFFICULTY_META[key] ?? DIFFICULTY_META.Medel;
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function clamp(i: number, len: number) {
  if (len <= 0) return 0;
  return ((i % len) + len) % len;
}

function DiffBadge({ difficulty }: { difficulty: string }) {
  const m = diffMeta(difficulty);
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide ${m.className}`}
      aria-label={`Svårighetsgrad: ${difficulty}`}
    >
      {m.label}
    </span>
  );
}

function StatPill({
  value,
  label,
  icon: Icon,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  value?: string | null;
  label: string;
  icon?: LucideIcon;
}) {
  if (!value) return null;
  return (
    <div
      {...rest}
      className={`flex min-w-28 flex-col items-start gap-1.5 rounded-(--radius) border border-(--border) bg-(--surface-elevated) px-4 py-3 ${rest.className ?? ""}`}
    >
      {Icon && <Icon className="h-4 w-4 text-(--accent)" aria-hidden="true" />}
      <span className="font-julius text-lg font-medium leading-none">
        {value}
      </span>
      <span className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-(--muted)">
        {label}
      </span>
    </div>
  );
}

function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: OutingImage[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const img = images[idx];

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIdx((i) => clamp(i - 1, images.length));
      if (e.key === "ArrowRight") setIdx((i) => clamp(i + 1, images.length));
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [images.length, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Bild i helskärm"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 px-4 py-8 animate-lightbox-fade-in motion-reduce:animate-none"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button
        type="button"
        className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur transition hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
        onClick={onClose}
        aria-label="Stäng helskärm"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="absolute left-3 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur transition hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
            onClick={() => setIdx((i) => clamp(i - 1, images.length))}
            aria-label="Föregående bild"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur transition hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
            onClick={() => setIdx((i) => clamp(i + 1, images.length))}
            aria-label="Nästa bild"
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>
        </>
      )}

      <div className="flex min-h-0 w-full max-w-6xl flex-1 items-center justify-center py-10">
        <img
          src={img.url}
          alt={img.alt || "Foto från vandringen"}
          className="max-h-full max-w-full rounded-md object-contain"
        />
      </div>

      {(img.caption || images.length > 1) && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-linear-to-t from-black/70 to-transparent px-6 pb-6 pt-10 animate-caption-slide-up motion-reduce:animate-none">
          {img.caption ? (
            <p className="pointer-events-auto max-w-[70ch] text-sm leading-relaxed text-white/90">
              {img.caption}
            </p>
          ) : (
            <span />
          )}
          {images.length > 1 && (
            <span className="pointer-events-auto whitespace-nowrap text-xs tabular-nums text-white/60">
              {idx + 1} / {images.length}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function OutingGallery({ images }: { images: OutingImage[] }) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images.length) return null;

  const img = images[current];

  return (
    <div className="mt-4">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-(--radius) border border-(--border) bg-(--surface)">
        <img
          src={img.url}
          alt={img.alt || "Foto från utflykten"}
          className="h-full w-full object-cover"
          loading="lazy"
        />

        <button
          type="button"
          className="absolute bottom-3 right-3 z-10 grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-black/40 text-white backdrop-blur transition hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
          onClick={() => setLightboxOpen(true)}
          aria-label="Visa bild i helskärm"
        >
          <Maximize2 className="h-4 w-4" aria-hidden="true" />
        </button>

        {images.length > 1 && (
          <>
            <button
              type="button"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur transition hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
              onClick={() => setCurrent((i) => clamp(i - 1, images.length))}
              aria-label="Föregående bild"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur transition hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
              onClick={() => setCurrent((i) => clamp(i + 1, images.length))}
              aria-label="Nästa bild"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {img.caption && (
        <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-(--foreground)/80">
          {img.caption}
        </p>
      )}

      {images.length > 1 && (
        <div
          className="mt-3 flex flex-wrap justify-center gap-2"
          role="tablist"
          aria-label="Bild-navigation"
        >
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`Gå till bild ${i + 1}`}
              className={`h-2 w-2 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) ${
                i === current
                  ? "bg-(--accent)"
                  : "bg-white/15 hover:bg-white/30"
              }`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      )}

      {lightboxOpen && (
        <Lightbox
          images={images}
          startIndex={current}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}

function OutingCard({
  outing,
  defaultOpen,
}: {
  outing: Outing;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);

  return (
    <article
      className={`overflow-hidden rounded-(--radius) border bg-(--surface) transition ${
        open ? "border-(--border) ring-1 ring-(--accent)" : "border-(--border)"
      }`}
    >
      <button
        type="button"
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-(--surface-elevated) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <span className="block truncate font-julius text-lg font-medium leading-snug">
            {outing.title}
          </span>
          {outing.date && (
            <span className="mt-1 block text-xs tracking-wide text-(--muted)">
              {formatDate(outing.date)}
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-5 w-5 flex-none text-(--muted) transition motion-reduce:transition-none ${
            open ? "rotate-180" : "rotate-0"
          }`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="border-t border-(--border) bg-(--surface-elevated) px-5 pb-6">
          {(outing.distance || outing.elevationGain || outing.duration) && (
            <div className="flex flex-wrap gap-2 pt-4">
              {outing.distance && (
                <div className="flex items-center gap-2 rounded-(--radius) border border-(--border) bg-(--surface) px-3 py-2">
                  <Ruler
                    className="h-4 w-4 text-(--accent)"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium">{outing.distance}</span>
                  <span className="text-xs tracking-wide text-(--muted)">
                    Sträcka
                  </span>
                </div>
              )}
              {outing.elevationGain && (
                <div className="flex items-center gap-2 rounded-(--radius) border border-(--border) bg-(--surface) px-3 py-2">
                  <ArrowUpRight
                    className="h-4 w-4 text-(--accent)"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium">
                    {outing.elevationGain}
                  </span>
                  <span className="text-xs tracking-wide text-(--muted)">
                    Höjdmeter
                  </span>
                </div>
              )}
              {outing.duration && (
                <div className="flex items-center gap-2 rounded-(--radius) border border-(--border) bg-(--surface) px-3 py-2">
                  <Clock
                    className="h-4 w-4 text-(--accent)"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium">{outing.duration}</span>
                  <span className="text-xs tracking-wide text-(--muted)">
                    Tid
                  </span>
                </div>
              )}
            </div>
          )}

          {outing.description && (
            <p className="mt-4 max-w-[70ch] text-sm leading-relaxed text-(--foreground)/80">
              {outing.description}
            </p>
          )}

          {outing.images.length > 0 && (
            <div className="my-6 border-t border-(--border)" />
          )}

          {outing.images.length > 0 && <OutingGallery images={outing.images} />}
        </div>
      )}
    </article>
  );
}

function TripDetail({ trip }: { trip: SanityTrip | null }) {
  if (!trip) {
    return (
      <div
        className="grid place-items-center px-6 py-20 text-center"
        role="status"
      >
        <Mountain
          className="mb-3 h-10 w-10 text-(--muted)"
          aria-hidden="true"
        />
        <p className="font-julius text-2xl font-medium text-(--foreground)/80">
          Välj en resa
        </p>
        <p className="mt-2 text-sm text-(--muted)">
          Klicka på en resa i listan till vänster
        </p>
      </div>
    );
  }

  return (
    <article>
      {trip.image ? (
        <div className="relative flex max-h-[70vh] w-full justify-center overflow-hidden bg-(--surface-elevated)">
          <img
            src={trip.image}
            alt={`${trip.name} — ${trip.region}`}
            className="h-auto w-auto max-w-full max-h-[70vh] object-contain"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-black/10 to-black/70"
            aria-hidden="true"
          />
        </div>
      ) : (
        <div
          className="grid min-h-64 place-items-center bg-(--surface-elevated)"
          aria-hidden="true"
        >
          <Mountain className="h-12 w-12 text-(--muted)" />
        </div>
      )}

      <div className="mx-auto w-full max-w-4xl px-5 pb-14 pt-7 sm:px-10 sm:pt-10 lg:px-12">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.18em] text-(--accent)">
            <MapPin className="h-4 w-4 opacity-80" aria-hidden="true" />
            {trip.region}
          </span>
          <DiffBadge difficulty={trip.difficulty} />
          {trip.season && (
            <span className="ml-auto inline-flex items-center gap-1 text-xs tracking-wide text-(--muted)">
              <Calendar className="h-4 w-4 opacity-80" aria-hidden="true" />
              {trip.season}
            </span>
          )}
        </div>

        <h2 className="mt-3 font-julius text-4xl font-medium leading-tight sm:text-5xl">
          {trip.name}
        </h2>
        {trip.tagline && (
          <p className="mt-2 max-w-[70ch] text-base italic text-(--foreground)/80">
            {trip.tagline}
          </p>
        )}

        {(trip.days || trip.distance || trip.elevation) && (
          <div
            className="mt-6 flex flex-wrap gap-3"
            role="list"
            aria-label="Resestatistik"
          >
            {trip.days ? (
              <StatPill
                role="listitem"
                value={`${trip.days} dagar`}
                label="Längd"
                icon={Calendar}
              />
            ) : null}
            {trip.distance ? (
              <StatPill
                role="listitem"
                value={trip.distance}
                label="Sträcka"
                icon={Ruler}
              />
            ) : null}
            {trip.elevation ? (
              <StatPill
                role="listitem"
                value={trip.elevation}
                label="Högsta punkt"
                icon={Mountain}
              />
            ) : null}
          </div>
        )}

        {trip.description && (
          <p className="mt-7 max-w-[70ch] text-sm leading-relaxed text-(--foreground)/80">
            {trip.description}
          </p>
        )}

        {trip.highlights.length > 0 && (
          <div className="mt-8">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-(--muted)">
              Höjdpunkter
            </p>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Höjdpunkter">
              {trip.highlights.map((h) => (
                <li
                  key={h}
                  className="rounded-full border border-(--border) bg-(--accent-soft) px-3 py-1 text-sm text-(--accent-hover)"
                >
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {trip.outings.length > 0 && (
          <section
            className="mt-10 border-t border-(--border) pt-7"
            aria-labelledby={`outings-heading-${trip.id}`}
          >
            <h3
              id={`outings-heading-${trip.id}`}
              className="flex items-center gap-3 font-julius text-2xl font-medium"
            >
              Utflykter
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-(--accent-soft) px-2 text-xs font-semibold text-(--accent-hover)">
                {trip.outings.length}
              </span>
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              {trip.outings.map((o, i) => (
                <OutingCard key={o.key} outing={o} defaultOpen={i === 0} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

export default function Fjallvandraren() {
  const [trips, setTrips] = useState<SanityTrip[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const detailRef = useRef<HTMLElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/trips")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<unknown>;
      })
      .then((data) => {
        if (!active) return;
        const list = Array.isArray(data) ? (data as SanityTrip[]) : [];
        setTrips(list);
        if (list.length) setSelectedId(list[0].id);
      })
      .catch((e: unknown) => {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Okänt fel");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return trips;
    return trips.filter((t) =>
      [t.name, t.region, t.tagline, t.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [search, trips]);

  const suggestions = useMemo(() => {
    if (!trips.length) return [];
    const q = search.trim().toLowerCase();
    if (!q) return trips;
    return trips.filter((t) =>
      `${t.name} ${t.region}`.toLowerCase().includes(q),
    );
  }, [search, trips]);

  const trip = trips.find((t) => t.id === selectedId) ?? null;

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setMobileDetailOpen(true);

    setTimeout(
      () =>
        detailRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      60,
    );
  }, []);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent | PointerEvent) => {
      const root = searchRef.current;
      if (!root) return;
      if (root.contains(e.target as Node)) return;
      setSearchOpen(false);
    };

    window.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
    };
  }, []);

  return (
    <div className="min-h-dvh bg-(--background) text-(--foreground)">
      <header
        className="relative isolate z-30 flex min-h-[40vh] items-center justify-center overflow-visible border-b border-(--border)"
        role="banner"
      >
        <div
          className="absolute inset-0 -z-10 bg-cover bg-position-[center_30%] brightness-50 saturate-75"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1551632811-561732d1e306?w=1600&q=80&fit=crop&crop=center')",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10 bg-linear-to-b from-black/10 via-black/45 to-black/90"
          aria-hidden="true"
        />

        <div className="px-6 text-center">
          <p
            className="text-xs font-medium uppercase tracking-[0.28em] text-white/60"
            aria-hidden="true"
          >
            Svenska fjällen
          </p>
          <h1 className="mt-2 font-julius text-4xl font-medium uppercase tracking-[0.14em] text-white sm:text-6xl">
            Fjällvandraren
          </h1>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.22em] text-white/60">
            En vandringsdagbok
          </p>

          <div
            className="relative mx-auto mt-8 w-full max-w-full py-2"
            role="search"
            ref={(el) => {
              searchRef.current = el;
            }}
          >
            <label htmlFor="fjv-search" className="sr-only">
              Sök efter resa, region eller nyckelord
            </label>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60 z-10"
              aria-hidden="true"
            />
            <input
              id="fjv-search"
              type="search"
              role="combobox"
              aria-autocomplete="list"
              className="w-full rounded-full border border-white/15 bg-black/25 py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-white/45 backdrop-blur outline-none transition focus:border-(--accent) focus:ring-4 focus:ring-(--accent-soft)"
              placeholder="Sök resa, region eller nyckelord…"
              value={search}
              onChange={(e) => {
                const next = e.target.value;
                setSearch(next);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setSearchOpen(false);
              }}
              autoComplete="off"
              spellCheck={false}
              aria-expanded={searchOpen}
              aria-controls="fjv-search-suggestions"
            />

            {searchOpen && !loading && !error && suggestions.length > 0 && (
              <div
                id="fjv-search-suggestions"
                role="listbox"
                aria-label="Reseförslag"
                className="absolute left-0 right-0 z-50 mt-2 max-h-72 overflow-auto rounded-(--radius) border border-(--border) bg-(--surface) p-1 shadow-xl shadow-black/30"
              >
                {suggestions.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="option"
                    aria-selected={t.id === selectedId}
                    className="flex w-full items-center justify-between gap-3 rounded-(--radius) px-4 py-2 text-left text-sm text-(--foreground) transition hover:bg-(--surface-elevated) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setSearch(t.name);
                      setSearchOpen(false);
                      handleSelect(t.id);
                    }}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium">
                        {t.name}
                      </span>
                      <span className="block truncate text-xs text-(--muted)">
                        {t.region}
                      </span>
                    </span>
                    <DiffBadge difficulty={t.difficulty} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-[280px_1fr]">
        <nav
          className="flex flex-col border-b border-(--border) bg-(--surface) md:sticky md:top-0 md:h-dvh md:border-b-0 md:border-r"
          aria-label="Resor"
        >
          <div className="flex items-center justify-between gap-3 border-b border-(--border) px-5 py-3">
            {loading ? (
              <span className="text-xs tracking-[0.12em] text-(--muted)">
                Laddar…
              </span>
            ) : error ? (
              <span className="text-xs tracking-[0.12em] text-red-300">
                Fel vid hämtning
              </span>
            ) : (
              <span className="text-xs tracking-[0.12em] text-(--muted)">
                {filtered.length} {filtered.length === 1 ? "resa" : "resor"}
              </span>
            )}

            <Link
              href="/studio"
              className="rounded-full border border-(--accent) bg-(--accent-soft) px-3 py-1 text-xs font-semibold text-(--accent-hover) transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
              title="Öppna Sanity Studio för att lägga till eller redigera resor"
            >
              Redigera
            </Link>
          </div>

          <ul className="flex-1 overflow-y-auto py-1" role="list">
            {!loading && !error && filtered.length === 0 && (
              <li className="px-5 py-10 text-center font-julius text-base italic text-(--muted)">
                Inga resor hittades
              </li>
            )}

            {filtered.map((t) => {
              const active = t.id === selectedId;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    className={`flex w-full items-center gap-3 border-l-2 px-5 py-3 text-left transition hover:bg-(--surface-elevated) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) ${
                      active
                        ? "border-l-(--accent) bg-(--accent-soft)"
                        : "border-l-transparent"
                    }`}
                    onClick={() => handleSelect(t.id)}
                    aria-current={active ? "page" : undefined}
                    aria-label={`${t.name}, ${t.region}, svårighetsgrad: ${t.difficulty}`}
                  >
                    {t.image ? (
                      <img
                        src={t.image}
                        alt=""
                        className="h-12 w-12 flex-none rounded-lg border border-(--border) object-cover"
                      />
                    ) : (
                      <div
                        className="grid h-12 w-12 flex-none place-items-center rounded-lg border border-(--border) bg-(--surface-elevated) text-(--muted)"
                        aria-hidden="true"
                      >
                        <Mountain className="h-5 w-5 opacity-60" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <span className="block truncate font-julius text-lg font-medium leading-tight">
                        {t.name}
                      </span>
                      <span className="mt-0.5 block truncate text-xs tracking-wide text-(--muted)">
                        {t.region}
                      </span>
                    </div>

                    <DiffBadge difficulty={t.difficulty} />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <main
          ref={(el) => {
            detailRef.current = el;
          }}
          id="fjv-detail"
          className="bg-(--background) md:overflow-y-auto"
          aria-label="Resans detaljer"
          tabIndex={-1}
        >
          {mobileDetailOpen && (
            <button
              type="button"
              className="flex w-full items-center gap-2 border-b border-(--border) bg-(--surface) px-5 py-3 text-sm font-semibold text-(--accent-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) md:hidden"
              onClick={() => setMobileDetailOpen(false)}
              aria-label="Tillbaka till listan"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Alla resor
            </button>
          )}

          <TripDetail trip={trip} />
        </main>
      </div>
    </div>
  );
}
