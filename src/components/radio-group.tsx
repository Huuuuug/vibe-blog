import { useEffect, useRef, useCallback, useState } from "react";

export interface RadioGroupItem {
  label: string;
  value: string;
}

export interface RadioGroupProps {
  value: string;
  items: RadioGroupItem[];
  onChange?: (value: string) => void;
}

export function RadioGroup(props: RadioGroupProps) {
  const { value, items, onChange } = props;

  const radioContainerRef = useRef<HTMLDivElement>(null);
  const innerButtonRef = useRef<HTMLDivElement>(null);

  const [currentRadioItemOptions, setCurrentRadioItemOptions] = useState({
    width: 0,
    height: 0,
    left: 0,
  });

  const updateSliderPosition = useCallback(
    (val: string) => {
      const idx = items.findIndex((item) => item.value === val);
      if (idx === -1 || !radioContainerRef.current) return;

      const itemDom = radioContainerRef.current.children[idx] as HTMLElement;
      if (!itemDom) return;

      let itemLeft = itemDom.offsetLeft;
      if (idx === 0) itemLeft = 3;
      else if (idx === items.length - 1) itemLeft -= 3;

      setCurrentRadioItemOptions({
        width: itemDom.clientWidth,
        height: itemDom.clientHeight - 4,
        left: itemLeft,
      });
    },
    [items],
  );

  const onRadioItemClick = (val: string) => {
    updateSliderPosition(val);
    if (onChange) onChange(val);
  };

  useEffect(() => {
    updateSliderPosition(value);
  }, [value, items, updateSliderPosition]);

  const selectRadioItemAnimation = useCallback(() => {
    if (!value || !innerButtonRef.current) return;

    const jello = [
      "scale3d(1, 1, 1)",
      "scale3d(1.25, 0.75, 1)",
      "scale3d(0.75, 1.25, 1)",
      "scale3d(1.15, 0.85, 1)",
      "scale3d(0.95, 1.05, 1)",
      "scale3d(1.05, 0.95, 1)",
      "scale3d(1, 1, 1)",
    ];
    const opacity = [1, 1];

    innerButtonRef.current.animate(
      { transform: jello, opacity },
      { duration: 900, fill: "forwards" },
    );
  }, [value]);

  useEffect(() => {
    selectRadioItemAnimation();
  }, [value, selectRadioItemAnimation]);

  return (
    <div
      ref={radioContainerRef}
      className="relative flex items-center justify-center overflow-hidden rounded-3xl border-2 border-[var(--border-strong)] bg-[var(--card)] text-[color:var(--foreground)]/72"
    >
      {items.map((item) => (
        <div
          key={item.value}
          onClick={() => onRadioItemClick(item.value)}
          className="flex cursor-pointer items-center justify-center px-6 py-1.5 transition-colors duration-150 hover:text-foreground"
        >
          {item.label}
        </div>
      ))}

      <div
        style={{
          width: currentRadioItemOptions.width,
          height: currentRadioItemOptions.height,
          transform: `translate(${currentRadioItemOptions.left}px, 0)`,
        }}
        className="pointer-events-none absolute left-0 top-0.75 mix-blend-difference duration-300 ease-in-out"
      >
        <div
          ref={innerButtonRef}
          className="h-full w-full rounded-[50px] bg-foreground"
        ></div>
      </div>
    </div>
  );
}
