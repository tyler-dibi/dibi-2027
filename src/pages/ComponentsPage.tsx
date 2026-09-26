import { useMemo, useState } from "react";

import Box from "carbon-react/lib/components/box";
import Message from "carbon-react/lib/components/message";
import Search from "carbon-react/lib/components/search";
import { Option, Select } from "carbon-react/lib/components/select";
import Switch from "carbon-react/lib/components/switch";
import Typography from "carbon-react/lib/components/typography";

import { catalog, catalogKey } from "../catalog/catalog";
import ComponentCard from "../catalog/ComponentCard";
import { CATEGORIES } from "../catalog/types";

const ALL = "all";

export default function ComponentsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL);
  const [showDeprecated, setShowDeprecated] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter(
      (c) =>
        (showDeprecated || !c.deprecated) &&
        (category === ALL || c.category === category) &&
        (!q ||
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.exports?.some((e) => e.toLowerCase().includes(q))),
    );
  }, [query, category, showDeprecated]);

  return (
    <Box p={4} maxWidth="1600px" mx="auto">
      <Typography variant="h1" mb={1}>
        Components
      </Typography>
      <Typography mb={3}>
        Every component in Carbon by Sage, running live. Copy a component's name and paste it into your prompt, for
        example: "Use <strong>FlatTable</strong> to show a list of invoices".
      </Typography>

      <Box display="flex" gap={3} alignItems="flex-end" flexWrap="wrap" mb={4}>
        <Box width="360px">
          <Search
            aria-label="Search components"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Box>
        <Box width="260px">
          <Select label="Category" labelInline value={category} onChange={(e) => setCategory(e.target.value)}>
            <Option text="All categories" value={ALL} />
            {CATEGORIES.map((c) => (
              <Option key={c} text={c} value={c} />
            ))}
          </Select>
        </Box>
        <Switch
          label="Show deprecated"
          labelInline
          checked={showDeprecated}
          onChange={(e) => setShowDeprecated(e.target.checked)}
        />
        <Typography m={0} variant="small">
          {results.length} of {catalog.length} components
        </Typography>
      </Box>

      {results.length === 0 ? (
        <Message variant="info">No components match "{query}".</Message>
      ) : (
        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(320px, 1fr))" gap={3}>
          {results.map((entry) => (
            <ComponentCard key={catalogKey(entry)} entry={entry} />
          ))}
        </Box>
      )}
    </Box>
  );
}
