import React, { createContext, useState, useContext, ReactNode } from "react";

type ImageContextType = {
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  setImageIsSent:React.Dispatch<React.SetStateAction<boolean>>;
  setImageIsSubmited:React.Dispatch<React.SetStateAction<boolean>>;
  imageIsSent: boolean;
  imageIsSubmited: boolean;
};

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const useImage = (): ImageContextType => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImage must be used within an ImageProvider");
  }
  return context;
};

export const ImageProvider = ({ children }: { children: ReactNode }) => {
  const [image, setImage] = useState<string>("");
  const [ imageIsSent, setImageIsSent ] = useState<boolean>(false);
  const [imageIsSubmited, setImageIsSubmited] = useState<boolean>(false);
  return (
    <ImageContext.Provider value={{ image, setImage, imageIsSent, setImageIsSent, imageIsSubmited, setImageIsSubmited }}>
      {children}
    </ImageContext.Provider>
  );
}