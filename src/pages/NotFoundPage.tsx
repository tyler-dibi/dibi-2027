import { useNavigate } from "react-router-dom";

import Box from "carbon-react/lib/components/box";
import Button from "carbon-react/lib/components/button/__next__";
import Typography from "carbon-react/lib/components/typography";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Box p={6}>
      <Typography variant="h1">Page not found</Typography>
      <Typography mb={3}>That page doesn't exist in this playground.</Typography>
      <Button variantType="primary" onClick={() => navigate("/")}>
        Go home
      </Button>
    </Box>
  );
}
