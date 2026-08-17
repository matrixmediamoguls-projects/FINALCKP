import { useEffect, useRef } from 'react';

/**
 * Every Hermetic Hall module pins a fixed action bar to the bottom of the
 * viewport. Its height is not knowable ahead of time — it depends on the
 * viewport, on how the meters wrap, and on whether the drift notice is showing
 * — so a hard-coded padding-bottom on the shell always ends up either wasteful
 * or, on narrow screens, too small to clear the bar. The bottom of the page
 * then sits underneath it and cannot be reached.
 *
 * This measures the bar and publishes its height as --ru-foot-h on the module
 * root, which recUniSystem.css uses to reserve exactly the space required.
 *
 * Usage:
 *   const [rootRef, footRef] = useFooterOffset();
 *   <div className="rux" ref={rootRef}> … <div className="rux-foot" ref={footRef}>
 */
export default function useFooterOffset() {
  const rootRef = useRef(null);
  const footRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const foot = footRef.current;
    if (!root || !foot) return undefined;

    const apply = () => {
      const h = Math.ceil(foot.getBoundingClientRect().height);
      if (h > 0) root.style.setProperty('--ru-foot-h', `${h}px`);
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(foot);
    window.addEventListener('resize', apply);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', apply);
    };
  }, []);

  return [rootRef, footRef];
}
