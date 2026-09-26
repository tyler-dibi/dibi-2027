import { useState, type ReactNode } from "react";

import Button from "carbon-react/lib/components/button/__next__";

type Props = {
  label: string;
  children: (open: boolean, close: () => void) => ReactNode;
};

/** Renders a trigger button for components that render in an overlay (dialogs, sidebars, toasts). */
export default function OverlayDemo({ label, children }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variantType="secondary" onClick={() => setOpen(true)}>
        {label}
      </Button>
      {children(open, () => setOpen(false))}
    </>
  );
}
