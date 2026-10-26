import { useEffect, useRef } from 'react';

export default function ScrollContent({ children }) {
  const container = useRef(null);

  useEffect(() => {
    const root = container.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Keep the footer fully visible: it cannot scroll high enough to finish a reveal.
    const candidates = [...root.querySelectorAll('.nav, section > .shell')];
    // Reveal each content block independently, without nesting transforms.
    const blocks = candidates.flatMap((shell) =>
      shell.classList.contains('shell') && shell.classList.length === 1
        ? [...shell.children]
        : [shell],
    );
    let frame = 0;
    const offsets = new Map();
    const update = () => {
      frame = 0;
      const height = window.innerHeight;
      const positions = blocks.map((block) => block.getBoundingClientRect().top - (offsets.get(block) || 0));
      blocks.forEach((block, index) => {
        const progress = reducedMotion.matches || block.contains(document.activeElement)
          ? 1
          : Math.max(0, Math.min(1, (height * 0.96 - positions[index]) / (height * 0.3)));
        const offset = (1 - progress) * 48;
        offsets.set(block, offset);
        block.style.setProperty('--reveal-opacity', progress);
        block.style.setProperty('--reveal-offset', `${offset}px`);
        block.classList.add('scroll-reveal-block');
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    root.addEventListener('focusin', schedule);
    reducedMotion.addEventListener('change', schedule);
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(root);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      root.removeEventListener('focusin', schedule);
      reducedMotion.removeEventListener('change', schedule);
      resizeObserver.disconnect();
      blocks.forEach((block) => {
        block.classList.remove('scroll-reveal-block');
        block.style.removeProperty('--reveal-opacity');
        block.style.removeProperty('--reveal-offset');
      });
    };
  }, []);

  return <div className="post-robot-content" ref={container}>{children}</div>;
}
