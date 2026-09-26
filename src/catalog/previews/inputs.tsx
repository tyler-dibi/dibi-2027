import { useState } from "react";

import AdvancedColorPicker from "carbon-react/lib/components/advanced-color-picker";
import Box from "carbon-react/lib/components/box";
import Button from "carbon-react/lib/components/button/__next__";
import DateInput from "carbon-react/lib/components/date";
import DateRange from "carbon-react/lib/components/date-range";
import Decimal from "carbon-react/lib/components/decimal";
import Fieldset from "carbon-react/lib/components/fieldset";
import FileInput from "carbon-react/lib/components/file-input";
import Form from "carbon-react/lib/components/form";
import NumeralDate from "carbon-react/lib/components/numeral-date";
import Password from "carbon-react/lib/components/password";
import Search from "carbon-react/lib/components/search";
import { SimpleColor, SimpleColorPicker } from "carbon-react/lib/components/simple-color-picker";
import TextEditor from "carbon-react/lib/components/text-editor";
import Textarea from "carbon-react/lib/components/textarea";
import Textbox from "carbon-react/lib/components/textbox";
import { Time, type TimeValue } from "carbon-react/lib/components/time";

import type { CatalogEntry } from "../types";

export const inputs: CatalogEntry[] = [
  {
    name: "Textbox",
    folder: "textbox",
    category: "Inputs",
    description: "Single-line text input with label, hint and validation.",
    Preview: function TextboxPreview() {
      const [value, setValue] = useState("Jane Smith");
      return (
        <Box width="320px">
          <Textbox label="Full name" inputHint="As it appears on your ID" value={value} onChange={(e) => setValue(e.target.value)} />
        </Box>
      );
    },
  },
  {
    name: "Textarea",
    folder: "textarea",
    category: "Inputs",
    description: "Multi-line text input, with optional character limit.",
    Preview: function TextareaPreview() {
      const [value, setValue] = useState("");
      return (
        <Box width="320px">
          <Textarea label="Notes" characterLimit={200} rows={3} value={value} onChange={(e) => setValue(e.target.value)} />
        </Box>
      );
    },
  },
  {
    name: "Decimal",
    folder: "decimal",
    category: "Inputs",
    description: "Formatted decimal input, ideal for currency amounts.",
    Preview: function DecimalPreview() {
      const [value, setValue] = useState("1250.00");
      return (
        <Box width="240px">
          <Decimal label="Amount (£)" value={value} onChange={(e) => setValue(e.target.value.rawValue)} />
        </Box>
      );
    },
  },
  {
    name: "Password",
    folder: "password",
    category: "Inputs",
    description: "Password input with show/hide toggle.",
    Preview: function PasswordPreview() {
      const [value, setValue] = useState("supersecret");
      return (
        <Box width="320px">
          <Password label="Password" value={value} onChange={(e) => setValue(e.target.value)} />
        </Box>
      );
    },
  },
  {
    name: "DateInput",
    folder: "date",
    category: "Inputs",
    description: "Date field with a calendar picker. Default export of carbon-react/lib/components/date.",
    Preview: function DatePreview() {
      const [value, setValue] = useState("26/09/2026");
      return (
        <DateInput label="Due date" name="due" value={value} onChange={(e) => setValue(e.target.value.formattedValue)} />
      );
    },
  },
  {
    name: "DateRange",
    folder: "date-range",
    category: "Inputs",
    description: "A pair of linked date inputs for start and end dates.",
    Preview: function DateRangePreview() {
      const [value, setValue] = useState(["01/09/2026", "30/09/2026"]);
      return (
        <DateRange
          startLabel="From"
          endLabel="To"
          value={value}
          onChange={(e) => setValue([e.target.value[0].formattedValue, e.target.value[1].formattedValue])}
        />
      );
    },
  },
  {
    name: "NumeralDate",
    folder: "numeral-date",
    category: "Inputs",
    description: "Date entered as separate day, month and year fields (e.g. date of birth).",
    Preview: function NumeralDatePreview() {
      const [value, setValue] = useState({ dd: "14", mm: "02", yyyy: "1990" });
      return (
        <NumeralDate
          legend="Date of birth"
          value={value}
          onChange={(e) => setValue(e.target.value as typeof value)}
          dateFormat={["dd", "mm", "yyyy"]}
        />
      );
    },
  },
  {
    name: "Time",
    folder: "time",
    exports: ["Time"],
    category: "Inputs",
    description: "Hours and minutes input with optional AM/PM toggle.",
    Preview: function TimePreview() {
      const [value, setValue] = useState<TimeValue>({ hours: "09", minutes: "30" });
      return <Time legend="Start time" value={value} onChange={(e) => setValue(e.target.value)} />;
    },
  },
  {
    name: "Search",
    folder: "search",
    category: "Inputs",
    description: "Search input with a clear button.",
    Preview: function SearchPreview() {
      const [value, setValue] = useState("");
      return (
        <Box width="340px">
          <Search
            aria-label="Search customers"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Box>
      );
    },
  },
  {
    name: "TextEditor",
    folder: "text-editor",
    category: "Inputs",
    description: "Rich text editor with a formatting toolbar.",
    Preview: () => (
      <Box width="100%">
        <TextEditor labelText="Message" namespace="catalog-text-editor" rows={3} />
      </Box>
    ),
  },
  {
    name: "FileInput",
    folder: "file-input",
    category: "Inputs",
    description: "Drag-and-drop or browse file upload.",
    Preview: () => <FileInput label="Upload receipt" onChange={() => {}} />,
  },
  {
    name: "Fieldset",
    folder: "fieldset",
    category: "Layout",
    description: "Groups related form fields under a legend.",
    Preview: () => (
      <Box width="340px">
        <Fieldset legend="Billing address">
          <Textbox label="Address line 1" value="1 Sage Street" onChange={() => {}} />
          <Textbox label="Postcode" value="NE1 1AA" onChange={() => {}} />
        </Fieldset>
      </Box>
    ),
  },
  {
    name: "Form",
    folder: "form",
    exports: ["Form", "RequiredFieldsIndicator"],
    category: "Layout",
    description: "Form layout with consistent field spacing and a footer for actions.",
    Preview: () => (
      <Box width="100%">
        <Form
          onSubmit={(e) => e.preventDefault()}
          leftSideButtons={<Button variantType="tertiary">Cancel</Button>}
          saveButton={
            <Button variantType="primary" type="submit">
              Save
            </Button>
          }
        >
          <Textbox label="Company name" value="Acme Ltd" onChange={() => {}} />
        </Form>
      </Box>
    ),
  },
  {
    name: "AdvancedColorPicker",
    folder: "advanced-color-picker",
    category: "Inputs",
    description: "Colour swatch that opens a full palette picker.",
    Preview: function AdvancedColorPickerPreview() {
      const [open, setOpen] = useState(false);
      const [color, setColor] = useState("#00A376");
      return (
        <AdvancedColorPicker
          name="catalog-advanced-color"
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          onBlur={() => {}}
          onChange={(e) => setColor(e.target.value)}
          selectedColor={color}
          availableColors={[
            { value: "#00A376", label: "green" },
            { value: "#0073C1", label: "blue" },
            { value: "#8F49FE", label: "purple" },
            { value: "#E96400", label: "orange" },
            { value: "#CD384B", label: "red" },
            { value: "#335B70", label: "slate" },
          ]}
        />
      );
    },
  },
  {
    name: "SimpleColorPicker",
    folder: "simple-color-picker",
    exports: ["SimpleColorPicker", "SimpleColor"],
    category: "Selection",
    description: "A small set of colour swatches to choose from.",
    Preview: function SimpleColorPickerPreview() {
      const [value, setValue] = useState("#00A376");
      return (
        <SimpleColorPicker
          name="catalog-simple-color"
          legend="Tag colour"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          {["#00A376", "#0073C1", "#8F49FE", "#E96400", "#CD384B"].map((c) => (
            <SimpleColor value={c} key={c} aria-label={c} />
          ))}
        </SimpleColorPicker>
      );
    },
  },
];
