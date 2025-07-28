import { Box, Typography } from "@mui/material";
import Logo from "./assets/tasky Logo.png"; 

const Header = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      p={2}
      sx={{ borderBottom: "1px solid #ddd" }}
    >
      <img
        src={Logo}
        alt="Tasky Logo"
        style={{ width: 40, height: 40, marginRight: 10 }}
      />
      <Typography variant="h6" fontWeight={600}>
        Tasky
      </Typography>
    </Box>
  );
};

export default Header;
