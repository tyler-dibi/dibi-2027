import { useState } from "react";

import Box from "carbon-react/lib/components/box";
import { Checkbox, CheckboxGroup } from "carbon-react/lib/components/checkbox";
import { OptionTile, OptionTileGroup } from "carbon-react/lib/components/option-tile";
import { RadioButton, RadioButtonGroup } from "carbon-react/lib/components/radio-button";
import { FilterableSelect, MultiSelect, Option, Select } from "carbon-react/lib/components/select";
import Switch from "carbon-react/lib/components/switch";
import { TileSelect, TileSelectGroup } from "carbon-react/lib/components/tile-select";

import type { CatalogEntry } from "../types";

const countries = ["United Kingdom", "Ireland", "France", "Germany", "Spain", "United States", "Canada"];

export const selection: CatalogEntry[] = [
  {
    name: "Checkbox",
    folder: "checkbox",
    exports: ["Checkbox", "CheckboxGroup"],
    category: "Selection",
    description: "Select one or more options. Use CheckboxGroup for a labelled set.",
    Preview: function CheckboxPreview() {
      const [checked, setChecked] = useState<Record<string, boolean>>({ email: true, sms: false, post: false });
      return (
        <CheckboxGroup legend="Contact preferences">
          {Object.keys(checked).map((k) => (
            <Checkbox
              key={k}
              id={`cb-${k}`}
              name={k}
              label={k === "sms" ? "SMS" : k[0].toUpperCase() + k.slice(1)}
              checked={checked[k]}
              onChange={(e) => setChecked({ ...checked, [k]: e.target.checked })}
            />
          ))}
        </CheckboxGroup>
      );
    },
  },
  {
    name: "RadioButton",
    folder: "radio-button",
    exports: ["RadioButton", "RadioButtonGroup"],
    category: "Selection",
    description: "Choose exactly one option from a set. Always wrap in RadioButtonGroup.",
    Preview: function RadioPreview() {
      const [value, setValue] = useState("monthly");
      return (
        <RadioButtonGroup name="catalog-billing" legend="Billing frequency" value={value} onChange={(e) => setValue(e.target.value)}>
          <RadioButton id="rb-monthly" value="monthly" label="Monthly" />
          <RadioButton id="rb-quarterly" value="quarterly" label="Quarterly" />
          <RadioButton id="rb-annually" value="annually" label="Annually" />
        </RadioButtonGroup>
      );
    },
  },
  {
    name: "Switch",
    folder: "switch",
    category: "Selection",
    description: "Toggle a setting on or off with immediate effect.",
    Preview: function SwitchPreview() {
      const [checked, setChecked] = useState(true);
      return (
        <Switch
          label="Email notifications"
          labelInline
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      );
    },
  },
  {
    name: "Select",
    folder: "select",
    exports: ["Select", "Option", "OptionRow", "OptionGroupHeader"],
    category: "Selection",
    description: "Dropdown for choosing one option from a list.",
    Preview: function SelectPreview() {
      const [value, setValue] = useState("United Kingdom");
      return (
        <Box width="300px">
          <Select label="Country" value={value} onChange={(e) => setValue(e.target.value)}>
            {countries.map((c) => (
              <Option key={c} text={c} value={c} />
            ))}
          </Select>
        </Box>
      );
    },
  },
  {
    name: "FilterableSelect",
    folder: "select",
    exports: ["FilterableSelect", "Option"],
    category: "Selection",
    description: "Dropdown with type-to-filter, for longer lists.",
    Preview: function FilterableSelectPreview() {
      const [value, setValue] = useState("");
      return (
        <Box width="300px">
          <FilterableSelect label="Country" value={value} onChange={(e) => setValue(e.target.value)}>
            {countries.map((c) => (
              <Option key={c} text={c} value={c} />
            ))}
          </FilterableSelect>
        </Box>
      );
    },
  },
  {
    name: "MultiSelect",
    folder: "select",
    exports: ["MultiSelect", "Option"],
    category: "Selection",
    description: "Dropdown for choosing several options, shown as pills.",
    Preview: function MultiSelectPreview() {
      const [value, setValue] = useState<string[]>(["France", "Spain"]);
      return (
        <Box width="320px">
          <MultiSelect label="Markets" value={value} onChange={(e) => setValue(e.target.value as unknown as string[])}>
            {countries.map((c) => (
              <Option key={c} text={c} value={c} />
            ))}
          </MultiSelect>
        </Box>
      );
    },
  },
  {
    name: "TileSelect",
    folder: "tile-select",
    exports: ["TileSelect", "TileSelectGroup"],
    category: "Selection",
    description: "Large selectable tiles with title, subtitle and description.",
    Preview: function TileSelectPreview() {
      const [value, setValue] = useState<string | null>("standard");
      return (
        <Box width="100%">
          <TileSelectGroup
            name="catalog-plan"
            legend="Choose a plan"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          >
            <TileSelect value="standard" id="ts-standard" title="Standard" subtitle="£12 / month" description="For sole traders" />
            <TileSelect value="plus" id="ts-plus" title="Plus" subtitle="£26 / month" description="For growing teams" />
          </TileSelectGroup>
        </Box>
      );
    },
  },
  {
    name: "OptionTile",
    folder: "option-tile",
    exports: ["OptionTile", "OptionTileGroup"],
    category: "Selection",
    description: "Compact tiles for single, multiple or custom-answer choices.",
    Preview: function OptionTilePreview() {
      const [a, setA] = useState(true);
      const [b, setB] = useState(false);
      return (
        <Box width="100%">
          <OptionTileGroup selectionType="multiple" legend="What do you need help with?" aria-label="Help topics">
            <OptionTile variant="multiple" label="Invoicing" checked={a} onChange={setA} />
            <OptionTile variant="multiple" label="Payroll" checked={b} onChange={setB} />
          </OptionTileGroup>
        </Box>
      );
    },
  },
];
