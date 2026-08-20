import { useUser, useClerk, useAuth } from '@clerk/clerk-react'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useBids, type Bid } from '../hooks/useBids'

const API_URL = import.meta.env.VITE_API_URL ?? ''

const US_STATES = [
  ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],
  ['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['FL','Florida'],['GA','Georgia'],
  ['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],
  ['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],
  ['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],['MO','Missouri'],
  ['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],['NJ','New Jersey'],
  ['NM','New Mexico'],['NY','New York'],['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],
  ['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],
  ['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],
  ['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming'],
]

function useCategories() {
  const { getToken } = useAuth()
  const [categories, setCategories] = useState<{ category: string; count: string }[]>([])

  useEffect(() => {
    if (!API_URL) return
    async function load() {
      try {
        const token = await getToken()
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await fetch(`${API_URL}/categories`, { headers })
        if (!res.ok) return
        const data = await res.json()
        setCategories(data)
      } catch { /* non-fatal */ }
    }
    load()
  }, [getToken])

  return categories
}

function useDebounce(value: string, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

function useBidDetail(id: number | null) {
  const { getToken } = useAuth()
  const [detail, setDetail] = useState<Bid | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id || !API_URL) return
    let cancelled = false
    setLoading(true)
    setDetail(null)
    async function load() {
      try {
        const token = await getToken()
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await fetch(`${API_URL}/bids/${id}`, { headers })
        if (!res.ok || cancelled) return
        const data = await res.json()
        if (!cancelled) setDetail(data)
      } catch { /* non-fatal */ }
      finally { if (!cancelled) setLoading(false) }
    }
    load()
    return () => { cancelled = true }
  }, [id, getToken])

  return { detail, loading }
}

const PAGE = 50

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()

  const [search, setSearch]         = useState('')
  const [state, setState]           = useState('')
  const [category, setCategory]     = useState('')
  const [offset, setOffset]         = useState(0)
  const [filterBarH, setFilterBarH] = useState(120)
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null)
  const filterBarRef = useRef<HTMLDivElement>(null)

  const debouncedSearch = useDebounce(search)
  const categories = useCategories()
  const { detail, loading: detailLoading } = useBidDetail(selectedBid?.id ?? null)

  // Reset pagination when filters change
  const prevFilters = useRef({ debouncedSearch, state, category })
  useEffect(() => {
    const p = prevFilters.current
    if (p.debouncedSearch !== debouncedSearch || p.state !== state || p.category !== category) {
      setOffset(0)
      prevFilters.current = { debouncedSearch, state, category }
    }
  }, [debouncedSearch, state, category])

  useEffect(() => {
    const el = filterBarRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setFilterBarH(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Close panel on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedBid(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const { bids, loading, error, total } = useBids({
    search: debouncedSearch || undefined,
    state:  state || undefined,
    category: category || undefined,
    limit:  PAGE,
    offset,
  })

  const hasFilters = !!(search || state || category)

  const clearFilters = useCallback(() => {
    setSearch(''); setState(''); setCategory(''); setOffset(0)
  }, [])

  useEffect(() => {
    if (isLoaded && !isSignedIn) navigate('/')
  }, [isLoaded, isSignedIn, navigate])

  if (!isLoaded || !isSignedIn) return null

  const canLoadMore = total !== null && offset + PAGE < total
  const showing = Math.min(offset + PAGE, total ?? 0)

  // The full bid to display in panel (detail once loaded, else fall back to list data)
  const panelBid = detail ?? selectedBid

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Inter, sans-serif' }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10,6,23,.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)', height: 56,
        display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginRight: 'auto' }}>
          <div style={{
            width: 26, height: 26, borderRadius: 7,
            background: 'linear-gradient(135deg, var(--purple), var(--pink))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '.7rem', fontWeight: 800, color: '#fff',
          }}>GS</div>
          <span style={{ fontWeight: 700, fontSize: '.95rem', color: 'var(--text)' }}>GovSignal</span>
        </Link>
        <span style={{ fontSize: '.82rem', color: 'var(--dim)' }}>
          {user.firstName ?? user.emailAddresses[0]?.emailAddress}
        </span>
        <button
          onClick={() => signOut(() => navigate('/'))}
          style={{
            background: 'rgba(177,59,255,.1)', border: '1px solid rgba(177,59,255,.25)',
            color: 'var(--purple)', borderRadius: 8, padding: '6px 14px',
            fontSize: '.8rem', fontWeight: 600, cursor: 'pointer',
          }}
        >Sign out</button>
      </nav>

      <div style={{ paddingTop: 56 }}>

        {/* Header + filters */}
        <div ref={filterBarRef} style={{
          borderBottom: '1px solid var(--border)',
          background: 'rgba(14,10,31,.7)', backdropFilter: 'blur(12px)',
          position: 'sticky', top: 56, zIndex: 90,
          padding: '16px 24px',
        }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text)', margin: 0 }}>
                Active Opportunities
              </h1>
              {!loading && !error && (
                <span style={{ fontSize: '.8rem', color: 'var(--dim)' }}>
                  {total !== null ? `${total.toLocaleString()} bids` : '—'}
                  {hasFilters && total !== null && ` matching filters`}
                </span>
              )}
            </div>

            {/* Filter row */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>

              {/* Search */}
              <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: 340 }}>
                <span style={{
                  position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--dim)', fontSize: '.85rem', pointerEvents: 'none',
                }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search title or agency…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,.05)', border: '1px solid var(--border)',
                    borderRadius: 8, padding: '7px 10px 7px 30px',
                    color: 'var(--text)', fontSize: '.82rem', outline: 'none',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(177,59,255,.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              </div>

              {/* State */}
              <select
                value={state}
                onChange={e => setState(e.target.value)}
                style={{
                  background: state ? 'rgba(177,59,255,.15)' : 'rgba(255,255,255,.05)',
                  border: `1px solid ${state ? 'rgba(177,59,255,.4)' : 'var(--border)'}`,
                  borderRadius: 8, padding: '7px 10px',
                  color: state ? 'var(--purple)' : 'var(--muted)', fontSize: '.82rem',
                  cursor: 'pointer', outline: 'none', minWidth: 130,
                }}
              >
                <option value="">All states</option>
                {US_STATES.map(([code, name]) => (
                  <option key={code} value={code}>{code} — {name}</option>
                ))}
              </select>

              {/* Category */}
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{
                  background: category ? 'rgba(177,59,255,.15)' : 'rgba(255,255,255,.05)',
                  border: `1px solid ${category ? 'rgba(177,59,255,.4)' : 'var(--border)'}`,
                  borderRadius: 8, padding: '7px 10px',
                  color: category ? 'var(--purple)' : 'var(--muted)', fontSize: '.82rem',
                  cursor: 'pointer', outline: 'none', minWidth: 150,
                }}
              >
                <option value="">All categories</option>
                {categories.map(c => (
                  <option key={c.category} value={c.category}>{c.category} ({c.count})</option>
                ))}
              </select>

              {/* Clear */}
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  style={{
                    background: 'transparent', border: '1px solid var(--border)',
                    borderRadius: 8, padding: '7px 12px',
                    color: 'var(--dim)', fontSize: '.78rem', cursor: 'pointer',
                  }}
                >Clear filters ✕</button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 60px' }}>

          {/* Error state */}
          {error && !loading && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>⚠️</div>
              <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Couldn't load bids</div>
              <div style={{ color: 'var(--muted)', fontSize: '.85rem', marginBottom: 24 }}>{error}</div>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: 'rgba(177,59,255,.15)', border: '1px solid rgba(177,59,255,.3)',
                  color: 'var(--purple)', borderRadius: 8, padding: '8px 20px',
                  fontSize: '.85rem', fontWeight: 600, cursor: 'pointer',
                }}
              >Try again</button>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div style={{ paddingTop: 24 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '60px 1fr 180px 120px 100px',
                  gap: 12, padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,.04)',
                  opacity: 1 - i * 0.1,
                }}>
                  <div style={{ height: 22, borderRadius: 6, background: 'rgba(255,255,255,.07)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  <div style={{ height: 22, borderRadius: 6, background: 'rgba(255,255,255,.07)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  <div style={{ height: 22, borderRadius: 6, background: 'rgba(255,255,255,.05)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  <div style={{ height: 22, borderRadius: 6, background: 'rgba(255,255,255,.05)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  <div style={{ height: 22, borderRadius: 6, background: 'rgba(255,255,255,.05)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && bids.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>📭</div>
              <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 8, fontSize: '1.1rem' }}>
                {hasFilters ? 'No bids match your filters' : 'No active bids right now'}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '.85rem', maxWidth: 340, margin: '0 auto 24px' }}>
                {hasFilters
                  ? 'Try removing a filter or broadening your search.'
                  : 'Our daily fetch runs every morning at 5 AM UTC. Check back tomorrow.'}
              </div>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  style={{
                    background: 'rgba(177,59,255,.15)', border: '1px solid rgba(177,59,255,.3)',
                    color: 'var(--purple)', borderRadius: 8, padding: '8px 20px',
                    fontSize: '.85rem', fontWeight: 600, cursor: 'pointer',
                  }}
                >Clear all filters</button>
              )}
            </div>
          )}

          {/* Table */}
          {!loading && !error && bids.length > 0 && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, paddingTop: 8 }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: '60px 1fr 180px 120px 100px',
                  gap: 12, padding: '8px 16px',
                  fontSize: '.68rem', color: 'var(--dim)', letterSpacing: '.08em', textTransform: 'uppercase',
                  borderBottom: '1px solid var(--border)',
                  position: 'sticky', top: 56 + filterBarH, zIndex: 80,
                  background: 'var(--bg)',
                }}>
                  <span>State</span>
                  <span>Title</span>
                  <span>Agency</span>
                  <span>Category</span>
                  <span>Due</span>
                </div>

                {bids.map(bid => {
                  const deadline = bid.response_deadline ? new Date(bid.response_deadline) : null
                  const daysLeft = deadline ? Math.ceil((deadline.getTime() - Date.now()) / 86_400_000) : null
                  const due = deadline ? deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'
                  const urgent = daysLeft !== null && daysLeft <= 7
                  const soon   = daysLeft !== null && daysLeft <= 14 && !urgent
                  const isSelected = selectedBid?.id === bid.id

                  return (
                    <div key={bid.id}
                      onClick={() => setSelectedBid(isSelected ? null : bid)}
                      style={{
                        display: 'grid', gridTemplateColumns: '60px 1fr 180px 120px 100px',
                        gap: 12, padding: '12px 16px', alignItems: 'center',
                        borderBottom: '1px solid rgba(255,255,255,.04)',
                        transition: 'background .15s',
                        cursor: 'pointer',
                        background: isSelected ? 'rgba(177,59,255,.08)' : 'transparent',
                        borderLeft: isSelected ? '2px solid rgba(177,59,255,.6)' : '2px solid transparent',
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(177,59,255,.04)' }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
                    >
                      <span style={{
                        background: 'rgba(177,59,255,.12)', border: '1px solid rgba(177,59,255,.2)',
                        color: 'rgba(177,59,255,.85)', borderRadius: 6, padding: '2px 0',
                        fontSize: '.65rem', fontWeight: 700, textAlign: 'center',
                        fontFamily: 'ui-monospace, monospace',
                      }}>{bid.state_code ?? 'US'}</span>

                      <span style={{
                        color: isSelected ? 'var(--purple)' : 'var(--text)',
                        fontSize: '.84rem', fontWeight: 500, lineHeight: 1.4,
                      }}>{bid.title}</span>

                      <span style={{ color: 'var(--muted)', fontSize: '.78rem', lineHeight: 1.35 }}>
                        {bid.agency ?? '—'}
                      </span>

                      <span style={{ color: 'var(--dim)', fontSize: '.75rem' }}>
                        {bid.category ?? '—'}
                      </span>

                      <div>
                        <div style={{ fontSize: '.78rem', color: urgent ? '#f87171' : soon ? '#fbbf24' : 'var(--muted)', fontWeight: urgent || soon ? 600 : 400 }}>
                          {due}
                        </div>
                        {daysLeft !== null && (
                          <div style={{ fontSize: '.65rem', color: urgent ? '#ef4444' : soon ? '#f59e0b' : 'var(--dim)' }}>
                            {daysLeft <= 0 ? 'Closed' : `${daysLeft}d left`}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, flexWrap: 'wrap', gap: 12 }}>
                <span style={{ fontSize: '.8rem', color: 'var(--dim)' }}>
                  Showing {offset + 1}–{showing} of {total?.toLocaleString()} bids
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {offset > 0 && (
                    <button
                      onClick={() => setOffset(o => Math.max(0, o - PAGE))}
                      style={{
                        background: 'rgba(255,255,255,.05)', border: '1px solid var(--border)',
                        color: 'var(--muted)', borderRadius: 8, padding: '7px 16px',
                        fontSize: '.82rem', cursor: 'pointer',
                      }}
                    >← Previous</button>
                  )}
                  {canLoadMore && (
                    <button
                      onClick={() => setOffset(o => o + PAGE)}
                      style={{
                        background: 'rgba(177,59,255,.15)', border: '1px solid rgba(177,59,255,.3)',
                        color: 'var(--purple)', borderRadius: 8, padding: '7px 16px',
                        fontSize: '.82rem', fontWeight: 600, cursor: 'pointer',
                      }}
                    >Next 50 →</button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {selectedBid && (
        <div
          onClick={() => setSelectedBid(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 190,
            background: 'rgba(0,0,0,.45)',
            animation: 'fadeIn .2s ease',
          }}
        />
      )}

      {/* Detail panel */}
      {selectedBid && (
        <BidDetailPanel
          bid={panelBid ?? selectedBid}
          detailLoading={detailLoading}
          onClose={() => setSelectedBid(null)}
        />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: .6; }
          50% { opacity: .3; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        select option { background: #1a1030; color: #e2d9f3; }
      `}</style>
    </div>
  )
}

function BidDetailPanel({ bid, detailLoading, onClose }: {
  bid: Bid
  detailLoading: boolean
  onClose: () => void
}) {
  const deadline = bid.response_deadline ? new Date(bid.response_deadline) : null
  const daysLeft = deadline ? Math.ceil((deadline.getTime() - Date.now()) / 86_400_000) : null
  const due = deadline
    ? deadline.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'TBD'
  const posted = bid.posted_date
    ? new Date(bid.posted_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null
  const urgent = daysLeft !== null && daysLeft <= 7
  const soon   = daysLeft !== null && daysLeft <= 14 && !urgent

  const META: { label: string; value: string | null }[] = [
    { label: 'Deadline',   value: due + (daysLeft != null && daysLeft > 0 ? ` · ${daysLeft}d left` : '') },
    { label: 'Posted',     value: posted },
    { label: 'State',      value: bid.state_code },
    { label: 'NAICS',      value: bid.naics_code },
    { label: 'Set-Aside',  value: bid.set_aside },
    { label: 'Notice Type',value: bid.notice_type },
    { label: 'Category',   value: bid.category },
  ].filter(m => m.value)

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 200,
      width: 'min(480px, 100vw)',
      background: 'rgba(14,10,31,.98)', backdropFilter: 'blur(24px)',
      borderLeft: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      animation: 'slideIn .25s cubic-bezier(.4,0,.2,1)',
    }}>

      {/* Panel header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {bid.category && (
            <span style={{
              background: 'rgba(177,59,255,.15)', border: '1px solid rgba(177,59,255,.3)',
              color: 'rgba(177,59,255,.9)', borderRadius: 6, padding: '2px 8px',
              fontSize: '.65rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase',
            }}>{bid.category}</span>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Close panel"
          style={{
            background: 'rgba(255,255,255,.07)', border: '1px solid var(--border)',
            borderRadius: 8, width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--muted)', fontSize: '1rem',
            flexShrink: 0,
          }}
        >✕</button>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>

        {/* Title */}
        <h2 style={{
          fontSize: 'clamp(15px, 2vw, 18px)', fontWeight: 700, color: 'var(--text)',
          lineHeight: 1.4, marginBottom: 16, letterSpacing: '-0.02em',
        }}>{bid.title}</h2>

        {/* Agency */}
        {bid.agency && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: '.9rem', fontWeight: 600, color: 'var(--muted)' }}>{bid.agency}</div>
            {bid.sub_agency && (
              <div style={{ fontSize: '.8rem', color: 'var(--dim)', marginTop: 2 }}>{bid.sub_agency}</div>
            )}
          </div>
        )}

        {/* Deadline badge */}
        {daysLeft !== null && daysLeft > 0 && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: urgent ? 'rgba(239,68,68,.1)' : soon ? 'rgba(245,158,11,.1)' : 'rgba(177,59,255,.1)',
            border: `1px solid ${urgent ? 'rgba(239,68,68,.25)' : soon ? 'rgba(245,158,11,.25)' : 'rgba(177,59,255,.2)'}`,
            color: urgent ? '#f87171' : soon ? '#fcd34d' : 'var(--muted)',
            borderRadius: 8, padding: '6px 12px', fontSize: '.78rem', fontWeight: 600,
            marginBottom: 20,
          }}>
            <span>{urgent ? '🔴' : soon ? '🟡' : '📅'}</span>
            <span>Closes {due} · {daysLeft}d left</span>
          </div>
        )}

        {/* Meta grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
          marginBottom: 24,
        }}>
          {META.map(m => (
            <div key={m.label} style={{
              background: 'rgba(255,255,255,.04)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '10px 12px',
            }}>
              <div style={{ fontSize: '.6rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: '.8rem', color: 'var(--muted)', wordBreak: 'break-word' }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        {detailLoading && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <div style={{ height: 14, borderRadius: 6, background: 'rgba(255,255,255,.06)', animation: 'pulse 1.5s ease-in-out infinite', marginBottom: 8 }} />
            <div style={{ height: 14, borderRadius: 6, background: 'rgba(255,255,255,.06)', animation: 'pulse 1.5s ease-in-out infinite', width: '80%', marginBottom: 8 }} />
            <div style={{ height: 14, borderRadius: 6, background: 'rgba(255,255,255,.06)', animation: 'pulse 1.5s ease-in-out infinite', width: '60%' }} />
          </div>
        )}

        {!detailLoading && bid.description && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 12 }}>Description</div>
            <p style={{
              fontSize: '.82rem', color: 'var(--muted)', lineHeight: 1.7,
              whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              maxHeight: 320, overflowY: 'auto',
            }}>{bid.description}</p>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--border)',
        flexShrink: 0,
        display: 'flex', gap: 10,
      }}>
        <a
          href={bid.sam_url ?? `https://sam.gov/opp/${bid.sam_id}/view`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1, textAlign: 'center', textDecoration: 'none',
            background: 'linear-gradient(135deg, rgba(177,59,255,.2), rgba(255,45,146,.15))',
            border: '1px solid rgba(177,59,255,.4)',
            color: 'var(--purple)', borderRadius: 10, padding: '11px 20px',
            fontSize: '.85rem', fontWeight: 700, letterSpacing: '.02em',
            transition: 'opacity .15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '.8')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          View on SAM.gov →
        </a>
      </div>
    </div>
  )
}
