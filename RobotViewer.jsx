import { useEffect, useRef, useState } from 'react';
import { Euler, Quaternion, Vector3 } from 'three';
import framing from './robot-framing.json';

export default function RobotViewer() {
  const viewer = useRef(null);
  const sequence = useRef(null);
  const stage = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const element = viewer.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let active = true;
    let drag = null;
    let spinAxis = null;
    let fadedOut = false;
    let spinFrame = 0;
    let lastSpinTime = 0;
    let lastFitRadius = 0;
    let lastFitFov = 0;
    const orientation = new Quaternion();
    const stepRotation = new Quaternion();
    const angles = new Euler(0, 0, 0, 'YXZ');
    const canSpin = () => active && element.loaded && spinAxis && !drag &&
      !fadedOut && !document.hidden && !reducedMotion.matches;
    const spin = (time) => {
      spinFrame = 0;
      if (!canSpin()) return;
      const seconds = Math.min((time - lastSpinTime) / 1000, 0.05);
      lastSpinTime = time;
      stepRotation.setFromAxisAngle(spinAxis, seconds * Math.PI / 30);
      orientation.premultiply(stepRotation).normalize();
      angles.setFromQuaternion(orientation, 'YXZ');
      element.setAttribute('orientation', `${angles.z.toFixed(8)}rad ${angles.x.toFixed(8)}rad ${angles.y.toFixed(8)}rad`);
      spinFrame = requestAnimationFrame(spin);
    };
    const syncSpin = () => {
      if (canSpin()) {
        if (!spinFrame) {
          lastSpinTime = performance.now();
          spinFrame = requestAnimationFrame(spin);
        }
      } else {
        cancelAnimationFrame(spinFrame);
        spinFrame = 0;
      }
    };
    const pointerDown = (event) => {
      if (!event.isPrimary || event.button !== 0 || !element.loaded) return;
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, distance: 0, direction: null };
      syncSpin();
    };
    const pointerMove = (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      // Recover if the browser released capture outside the element/window.
      if (event.pointerType === 'mouse' && event.buttons === 0) {
        pointerEnd(event);
        return;
      }
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      const distance = Math.hypot(dx, dy);
      if (distance >= 1) {
        drag.distance += distance;
        if (drag.distance > 4) drag.direction = { x: dx / distance, y: dy / distance };
        drag.x = event.clientX;
        drag.y = event.clientY;
      }
    };
    const pointerEnd = (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      if (event.type !== 'pointercancel' && drag.direction) {
        const { theta } = element.getCameraOrbit();
        // Match native orbit gestures: horizontal about up, vertical about
        // camera-right. Quaternion rotation allows full tumbles without poles.
        spinAxis = new Vector3(
          drag.direction.y * Math.cos(theta),
          drag.direction.x,
          -drag.direction.y * Math.sin(theta),
        ).normalize();
      }
      drag = null;
      syncSpin();
    };
    const cancelDrag = () => { drag = null; syncSpin(); };
    const update = () => {
      frame = 0;
      const rect = sequence.current.getBoundingClientRect();
      const travel = Math.max(1, sequence.current.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / travel));
      const explosion = Math.min(1, progress / 0.75);
      if (element.loaded) {
        const amount = reducedMotion.matches ? 0 : Math.min(0.9999, explosion);
        element.currentTime = amount * element.duration;
        const viewport = element.getBoundingClientRect();
        if (viewport.width > 0 && viewport.height > 0) {
          const sample = amount * (framing.radii_m.length - 1);
          const index = Math.min(Math.floor(sample), framing.radii_m.length - 2);
          const fraction = sample - index;
          const radius = framing.radii_m[index] * (1 - fraction) + framing.radii_m[index + 1] * fraction;
          lastFitFov = element.getFieldOfView();
          const verticalHalfFov = lastFitFov * Math.PI / 360;
          const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * viewport.width / viewport.height);
          const distance = radius * 1.1 / Math.sin(Math.min(verticalHalfFov, horizontalHalfFov));
          if (Math.abs(distance - lastFitRadius) > 0.0001) {
            const { theta, phi } = element.getCameraOrbit();
            element.cameraOrbit = `${theta}rad ${phi}rad ${distance}m`;
            // Keep framing in step with the animation, even on fast scrolls.
            element.jumpCameraToGoal();
            lastFitRadius = distance;
          }
        }
      }
      const fade = Math.max(0, Math.min(1, (progress - 0.72) / 0.2));
      fadedOut = fade === 1;
      syncSpin();
      stage.current.style.setProperty('--robot-opacity', reducedMotion.matches ? 1 : 1 - fade);
      stage.current.firstElementChild.style.visibility = !reducedMotion.matches && fade === 1 ? 'hidden' : 'visible';
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const cameraChanged = () => {
      // model-viewer may finish adapting its field of view after window resize.
      if (element.getFieldOfView() !== lastFitFov) schedule();
    };
    const updateMotionPreference = () => {
      // Native camera damping keeps the last drag moving briefly before settling.
      element.setAttribute('interpolation-decay', reducedMotion.matches ? '0' : '160');
      syncSpin();
      schedule();
    };
    const loaded = () => {
      if (!active) return;
      for (const material of element.model.materials) {
        material.pbrMetallicRoughness.setBaseColorFactor([0.6, 0.6, 0.6, 1]);
        material.pbrMetallicRoughness.setMetallicFactor(0);
        material.pbrMetallicRoughness.setRoughnessFactor(0.85);
      }
      element.pause();
      setStatus('ready');
      schedule();
    };
    const failed = () => { if (active) setStatus('error'); };
    element.addEventListener('load', loaded);
    element.addEventListener('error', failed);
    element.addEventListener('camera-change', cameraChanged);
    element.addEventListener('pointerdown', pointerDown, true);
    element.addEventListener('lostpointercapture', pointerEnd, true);
    window.addEventListener('pointermove', pointerMove, { passive: true, capture: true });
    window.addEventListener('pointerup', pointerEnd, true);
    window.addEventListener('pointercancel', pointerEnd, true);
    window.addEventListener('blur', cancelDrag);
    document.addEventListener('visibilitychange', syncSpin);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reducedMotion.addEventListener('change', updateMotionPreference);
    import('@google/model-viewer').catch(failed);
    if (element.loaded) loaded();
    updateMotionPreference();
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(spinFrame);
      element.removeEventListener('load', loaded);
      element.removeEventListener('error', failed);
      element.removeEventListener('camera-change', cameraChanged);
      element.removeEventListener('pointerdown', pointerDown, true);
      element.removeEventListener('lostpointercapture', pointerEnd, true);
      window.removeEventListener('pointermove', pointerMove, true);
      window.removeEventListener('pointerup', pointerEnd, true);
      window.removeEventListener('pointercancel', pointerEnd, true);
      window.removeEventListener('blur', cancelDrag);
      document.removeEventListener('visibilitychange', syncSpin);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reducedMotion.removeEventListener('change', updateMotionPreference);
    };
  }, []);

  return (
    <div className="robot-scroll-sequence" ref={sequence}>
      <div className="robot-scroll-stage" ref={stage}>
        <div className="robot-scroll-content">
          <h1 className="sr-only">RoboKnights 112 competition robot</h1>
          <model-viewer
            ref={viewer}
            src="/models/robot-scroll.glb?v=original-colors-all-parts"
            alt="Interactive RoboKnights drive base. Scroll down to progressively separate the components, or drag horizontally to rotate."
            camera-controls disable-zoom disable-pan
            loading="eager" reveal="auto" touch-action="pan-y"
            animation-name="Explode" animation-crossfade-duration="0"
            camera-orbit="35deg 65deg 115%"
            camera-target="0m 0m 0m"
            min-camera-orbit="auto 10deg 35%" max-camera-orbit="auto 170deg 100m"
            shadow-intensity="0" exposure="0.45" interaction-prompt="none"
          />
          <p className="sr-only" role="status">{status === 'loading' ? 'Loading robot' : status === 'error' ? 'The robot could not load. Please refresh to try again.' : 'Robot ready. Scroll to separate the components.'}</p>
        </div>
      </div>
    </div>
  );
}
