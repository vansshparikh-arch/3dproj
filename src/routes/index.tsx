import { createFileRoute, Link } from '@tanstack/react-router'
import { LayoutPanelLeft, MousePointer2 } from 'lucide-react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-20 flex flex-col items-center text-center">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-4 py-2 text-sm font-bold text-[var(--palm)]">
          <LayoutPanelLeft className="h-4 w-4" />
          <span>V1.0 LIVE</span>
        </div>

        <h1 className="display-title mb-6 max-w-3xl text-5xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] sm:text-7xl">
          Stall Designer <span className="text-[var(--lagoon-deep)]">Pro</span>
        </h1>
        
        <p className="mb-10 max-w-2xl text-lg text-[var(--sea-ink-soft)] sm:text-xl leading-relaxed">
          Design your perfect vendor stall in minutes. Professional 2D layout planning 
          with drag-and-drop mechanics, snap-to-grid, and real-time visualization.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/editor"
            onClick={() => {
              localStorage.removeItem('stall-config')
              localStorage.removeItem('stall-elements')
            }}
            className="flex items-center gap-2 rounded-full border border-transparent bg-[var(--sea-ink)] px-8 py-4 text-lg font-bold text-white no-underline transition hover:-translate-y-1 hover:bg-[var(--palm)] shadow-lg"
          >
            <MousePointer2 className="h-5 w-5" />
            Start Designing
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[var(--line)] bg-white/50 px-8 py-4 text-lg font-semibold text-[var(--sea-ink)] no-underline transition hover:-translate-y-1 hover:bg-white"
          >
            View Demo
          </a>
        </div>
      </section>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {[
          {
            title: 'Precision Grid',
            desc: 'Powerful snapping and alignment tools for perfect stall placement.',
            icon: '📏'
          },
          {
            title: 'Asset Library',
            desc: 'Pre-built stall components, tables, and signage templates.',
            icon: '📦'
          },
          {
            title: 'Export Ready',
            desc: 'Generate high-quality layouts ready for vendor applications.',
            icon: '📄'
          }
        ].map((feature, index) => (
          <article
            key={feature.title}
            className="island-shell feature-card rise-in rounded-2xl p-6 flex flex-col items-center text-center"
            style={{ animationDelay: `${index * 100 + 100}ms` }}
          >
            <span className="text-4xl mb-4">{feature.icon}</span>
            <h2 className="mb-3 text-xl font-bold text-[var(--sea-ink)]">
              {feature.title}
            </h2>
            <p className="m-0 text-sm text-[var(--sea-ink-soft)] leading-relaxed">{feature.desc}</p>
          </article>
        ))}
      </div>
    </main>
  )
}
