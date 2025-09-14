import { ReactNode, createContext, useState } from "react";
import Loader from "./Loader";

interface LoaderContextProps {
  showLoader: () => void;
  hideLoader: () => void;
}

interface LoaderContextProviderProps {
  children: ReactNode;
}

export const LoaderContext = createContext<LoaderContextProps | undefined>(undefined);

export const LoaderProvider = ({ children }: LoaderContextProviderProps) => {

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const contextValue: LoaderContextProps = {
    showLoader: () => {
      setIsVisible(true);
    },
    hideLoader: () => {
      setIsVisible(false);
    },
  }

  return (
    <LoaderContext.Provider value={contextValue}>
      {isVisible && <Loader />}
      {children}
    </LoaderContext.Provider>
  );
}
