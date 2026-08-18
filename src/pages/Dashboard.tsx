import { useUser, useClerk } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useBids } from '../hooks/useBids'

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()
  const { bids, loading, total } = useBids({ limit: 50 })

  useEffect(() => {
    if (isLoaded && !isSignedIn) navigate('/')
  }, [isLoaded, isSignedIn, navigate])

  if (!isLoaded || !isSignedIn) return null

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
        >
          Sign out
        </button>
      </nav>

      {/* Content */}
      <div style={{ paddingTop: 80, maxWidth: 1100, margin: '0 auto', padding: '80px 24px 60px' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text)', marginBottom: 6 }}>
            Active Opportunities
          </h1>
          <p style={{ color: 'var(--dim)', fontSize: '.85rem' }}>
            {loading ? 'Loading…' : `${total?.toLocaleString() ?? '—'} active bids · sorted by deadline`}
          </p>
        </div>

        {loading && (
          <div style={{ color: 'var(--dim)', fontSize: '.9rem', padding: '60px 0', textAlign: 'center' }}>
            Loading bids…
          </div>
        )}

        {!loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 180px 120px 100px',
              gap: 12, padding: '8px 16px',
              fontSize: '.68rem', color: 'var(--dim)', letterSpacing: '.08em', textTransform: 'uppercase',
              borderBottom: '1px solid var(--border)',
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
              const urgent = daysLeft !== null && daysLeft <= 14

              return (
                <div key={bid.id} style={{
                  display: 'grid', gridTemplateColumns: '60px 1fr 180px 120px 100px',
                  gap: 12, padding: '12px 16px', alignItems: 'center',
                  borderBottom: '1px solid rgba(255,255,255,.04)',
                  transition: 'background .15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(177,59,255,.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{
                    background: 'rgba(177,59,255,.12)', border: '1px solid rgba(177,59,255,.2)',
                    color: 'rgba(177,59,255,.85)', borderRadius: 6, padding: '2px 0',
                    fontSize: '.65rem', fontWeight: 700, textAlign: 'center',
                    fontFamily: 'ui-monospace, monospace',
                  }}>
                    {bid.state_code ?? 'US'}
                  </span>

                  <a href={bid.sam_url ?? '#'} target="_blank" rel="noopener noreferrer" style={{
                    color: 'var(--text)', textDecoration: 'none', fontSize: '.84rem', fontWeight: 500,
                    lineHeight: 1.4,
                  }}>
                    {bid.title}
                  </a>

                  <span style={{ color: 'var(--muted)', fontSize: '.78rem', lineHeight: 1.35 }}>
                    {bid.agency ?? '—'}
                  </span>

                  <span style={{ color: 'var(--dim)', fontSize: '.75rem' }}>
                    {bid.category ?? '—'}
                  </span>

                  <span style={{ fontSize: '.78rem', color: urgent ? '#fca5a5' : 'var(--muted)', fontWeight: urgent ? 600 : 400 }}>
                    {due}
                    {daysLeft !== null && (
                      <span style={{ display: 'block', fontSize: '.65rem', color: urgent ? '#f87171' : 'var(--dim)' }}>
                        {daysLeft}d left
                      </span>
                    )}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
