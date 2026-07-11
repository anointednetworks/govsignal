import { useEffect, useRef } from 'react';

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          io.disconnect();
        }
      },
      { rootMargin: '-40px', threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}
