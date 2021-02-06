import { useCallback, useEffect, useMemo } from "react";
import { useSpring, config, SpringValue } from "@react-spring/core";
import { useGesture } from "react-use-gesture";
import clamp from "lodash/clamp";

/**
 * Based on useYScroll
 * https://codesandbox.io/embed/r3f-train-l900i
 * @author drcmda
 */
export function useYScroll(
  bounds: [number, number],
  domTarget: EventTarget | undefined
): SpringValue<number> {
  const [{ y }, set] = useSpring(() => ({ y: 0, config: config.slow }));
  const onMove = useCallback(
    ({ xy: [, cy], previous: [, py], memo = y.get() }) => {
      const newY = clamp(memo + cy - py, ...bounds);
      set({ y: newY });
      return newY;
    },
    [bounds, y, set]
  );
  const gestureConfig = useMemo(() => ({ domTarget }), [domTarget]);
  const bind = useGesture({ onWheel: onMove, onDrag: onMove }, gestureConfig);
  useEffect(() => {
    bind();
  }, [bind]);
  return y;
}
