import { Box, Button, IconButton } from '@mui/material';
import { useState, forwardRef } from 'react';
import { IoClose } from "react-icons/io5";
import { useImage } from '../../context/ImageContext';
type ImagePickerProps = {
  handleSend: () => void;
  setOpenImagePicker: React.Dispatch<React.SetStateAction<boolean>>;
};

const ImagePicker = forwardRef<HTMLInputElement, ImagePickerProps>((props, ref) => {
  const { handleSend, setOpenImagePicker } = props;
  const { image, setImage } = useImage();
  const imageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "rgb(17, 29, 38)",
        height: { xs: "60%", md: "50%" },
        width: { xs: "90%", md: "50%" },
        borderRadius: 5,
        boxShadow: "0 0 20px rgba(0,0,0,0.5)",
        p: 3,
        gap: 2,
      }}
    >
      {/* Close button at top-left of the popup */}
      <IconButton
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: "white",
        }}
        onClick={() => { 
          setOpenImagePicker(false)  
        }}
      >
        <IoClose />
      </IconButton>

      {/* Hidden file input */}
      <input
        ref={ref}
        type="file"
        onChange={imageHandler}
        style={{ display: "none" }}
      />

      {/* Custom trigger button */}
      <Button
        onClick={() => (ref as React.RefObject<HTMLInputElement>)?.current?.click()}
        sx={{
          bgcolor: "rgb(100, 48, 38)",
          color: "white",
          borderRadius: 2,
          px: 4,
          py: 1,
          fontWeight: 700,
          ':hover': {
            bgcolor: "rgb(185, 28, 28)",
          }
        }}
      >
        Pick Image
      </Button>

      {/* Image preview */}
      <Box
        sx={{
          bgcolor: "transparent",
          border: "1px solid rgba(255,255,255,0.2)",
          height: "150px",
          width: "150px",
          opacity: 0.8,
          borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          my: "20px",
        }}
      >
        {image ? (
          <img
            src={image}
            alt="Selected"
            style={{ height: "100%", width: "100%", objectFit: "cover" }}
          />
        ) : (
          <Box sx={{ color: "white", fontSize: "14px" }}>
            No image selected
          </Box>
        )}
      </Box>

      <Button
        onClick={handleSend}
        sx={{
          bgcolor: "rgb(100, 48, 38)",
          color: "white",
          borderRadius: 2,
          px: 4,
          py: 1,
          fontWeight: 700,
          ':hover': {
            bgcolor: "rgb(185, 28, 28)",
          }
        }}
      >
        Send
      </Button>
    </Box>
  );
});

export default ImagePicker;