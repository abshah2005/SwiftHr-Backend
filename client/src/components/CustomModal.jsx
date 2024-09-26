import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link } from "react-router-dom";

const CustomModal = ({ open, onClose, onStatusClick, onVisitClick }) => {
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: "400px" },
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "12px",
    height: { xs: "auto", sm: "230px" }, 
    textAlign: "center",
  };


  return (
    
    <Modal open={open} onClose={onClose} aria-labelledby="success-modal">
      <Box sx={modalStyle}>
        <CheckCircleIcon
          sx={{
            position: "absolute",
            top: "-30px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 60,
            color: " #09B2A0",

          }}
        />
        <Typography
          id="success-modal"
          variant="h5"
          component="h2"
          sx={{ fontWeight: "bold", mb: 1, color: "#00cec9" }}
        >
         <p className="text-custom-teal font-archivo font-medium tracking-wide">Congratulations!</p> 
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>  
            <p className="font-archivo font-medium text-black">Your Application has been submitted Successfully </p>
          

        </Typography>
        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap" sx={{ mt: 5}}>
          <Link to="/check">
          <Button className= "text-white font-archivo font-medium hover:bg-teal-600  "
            variant="contained"
            sx={{
                backgroundColor: "#09B2A0",


              width: { xs: "100%", sm: "auto" },
              mb: { xs: 1, sm: 0 },
            }}
            onClick={onStatusClick}
          >
            View  Status
          </Button>
          </Link>
          <Button className= " font-archivo font-medium "
            variant="outlined"
            sx={{
                color:"black",
                backgroundColor:"white",
              borderColor: "#2d3436",
              
              width: { xs: "100%", sm: "auto" },
              '&:hover': {
                backgroundColor: "#09B2A0", // Background color on hover
                color: "white", // Text color on hover
                borderColor: "#09B2A0", // Match border color on hover
              },
            }}
            onClick={onVisitClick}
          >
            Visit our Site
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomModal;
