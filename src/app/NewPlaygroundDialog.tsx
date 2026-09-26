import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "carbon-react/lib/components/button/__next__";
import Dialog from "carbon-react/lib/components/dialog";
import Form from "carbon-react/lib/components/form";
import Message from "carbon-react/lib/components/message";
import Textbox from "carbon-react/lib/components/textbox";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function NewPlaygroundDialog({ open, onClose }: Props) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    setTitle("");
    setError(null);
    onClose();
  };

  const create = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/__api/playgrounds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { slug } = (await res.json()) as { slug: string };
      close();
      navigate(`/playground/${slug}`);
    } catch (e) {
      setError(
        `Couldn't create the playground (${String(e)}). You can also run: npm run new-playground -- "${title || "My playground"}"`,
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onCancel={close} title="New playground" subtitle="Creates a new file in src/playgrounds/" size="small">
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          void create();
        }}
        leftSideButtons={
          <Button variantType="tertiary" onClick={close}>
            Cancel
          </Button>
        }
        saveButton={
          <Button variantType="primary" type="submit" disabled={saving}>
            {saving ? "Creating…" : "Create playground"}
          </Button>
        }
      >
        {error && (
          <Message variant="error" mb={2}>
            {error}
          </Message>
        )}
        <Textbox
          label="Playground name"
          inputHint="For example: Invoice approval flow"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          required
        />
      </Form>
    </Dialog>
  );
}
